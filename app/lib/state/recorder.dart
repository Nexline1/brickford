// The recorder (T-064 stage 6b): app.js's T-028, as a controller over a backend.
//
//   - A clip is a Blob in IndexedDB (database brickford_audio, store clips, key
//     <date>-<n>) on the device that made it, the same database the web app
//     writes, so a clip recorded in either app shows in both. It never goes in
//     shared_preferences or the sync payload. What syncs is the rep.
//   - No microphone (no getUserMedia / MediaRecorder / IndexedDB, or a refused
//     prompt) is a state, not an error: the hand form, and no record button.
//   - Every way a recording ends (a press, the 90 s cap, leaving, the recorder
//     stopping on its own) comes through one finish, exactly once.
//   - Transcription is paused (T-046): this only records.
import 'dart:async';

import 'package:flutter/foundation.dart';

import '../engine/practice.dart';

/// A finished recording: the browser's Blob (opaque here) and its size and type.
class RecordedAudio {
  const RecordedAudio(this.blob, this.size, this.mime);
  final Object? blob;
  final int size;
  final String mime;
}

/// One clip as the list shows it.
class StoredClip {
  const StoredClip({required this.key, required this.date, required this.seconds, required this.kind, required this.title, this.url, this.mime = ''});
  final String key, date, kind, title, mime;
  final int seconds;

  /// An object URL to play or download it; null when the clip has no audio.
  final String? url;

  StoredClip withTitle(String t) => StoredClip(key: key, date: date, seconds: seconds, kind: kind, title: t, url: url, mime: mime);
}

/// An open microphone. [finished] completes once, however the recording ended.
abstract class MicSession {
  /// Starts recording; throws if the recorder cannot start (the mic is released first).
  void start();

  /// Asks the recorder to stop; [finished] then completes.
  void stop();
  Future<RecordedAudio> get finished;

  /// Gives the microphone back (a start cancelled while the prompt was open).
  void release();
}

abstract class ClipPlayer {
  bool get playing;
  Future<void> toggle();
  void dispose();
}

/// What the recorder and the clip list need from the platform.
abstract class AudioBackend {
  /// getUserMedia, MediaRecorder and IndexedDB are all there.
  bool get micSupported;

  /// IndexedDB is there (the list can be read).
  bool get storeSupported;

  /// The microphone prompt; null when it was refused or no device answered.
  Future<MicSession?> openMic();
  Future<List<StoredClip>> list();

  /// Stored under `date-n`, n one more than the day's last. Returns the key.
  Future<String> add({required String date, required int seconds, required String kind, required String title, required RecordedAudio audio});
  Future<void> rename(String key, String title);
  Future<void> delete(String key);
  ClipPlayer player(StoredClip clip, void Function() onChange);
  void download(StoredClip clip);

  /// Revokes the object URLs the last list made.
  void releaseUrls();
}

/// The phases the record button shows: idle, the prompt open, recording.
enum RecPhase { idle, starting, recording }

/// A finished recording that was long enough to be a rep.
typedef ClipDone = void Function(String kind, String date, int seconds, String title, bool kept);

class PracticeRecorder extends ChangeNotifier {
  PracticeRecorder(this.backend, {required this.today, required this.onClip, required this.onShort, this.limit = REC_LIMIT, Duration Function()? clock})
    : _clock = clock ?? _wall();

  final AudioBackend backend;
  final String Function() today;
  final ClipDone onClip;
  final VoidCallback onShort;
  final int limit;
  final Duration Function() _clock;

  static Duration Function() _wall() {
    final sw = Stopwatch()..start();
    return () => sw.elapsed;
  }

  RecPhase phase = RecPhase.idle;
  String? kind;

  /// This page load's microphone failed (refused, no device, cannot start).
  bool micMissing = false;

  /// The hand form instead of the recorder.
  bool get hand => micMissing || !backend.micSupported;

  MicSession? _session;
  Timer? _tick;
  Duration _t0 = Duration.zero;
  bool _stopped = false, _disposed = false;
  double _elapsed = 0;
  String _date = '';

  /// Seconds recorded so far (live while recording, capped at [limit]).
  double get seconds => phase == RecPhase.recording && !_stopped ? _secs() : _elapsed;
  double _secs() => (_clock() - _t0).inMilliseconds / 1000;

  /// app.js recMode for [k].
  RecPhase modeOf(String k) => kind != k ? RecPhase.idle : phase;

  Future<void> toggle(String k) => phase != RecPhase.idle ? stop() : start(k);

  Future<void> start(String k) async {
    if (phase != RecPhase.idle) return;
    if (!backend.micSupported) return _gone();
    kind = k;
    phase = RecPhase.starting;
    notifyListeners();
    final pending = Object();
    _pending = pending;
    MicSession? s;
    try {
      s = await backend.openMic();
    } catch (_) {
      s = null;
    }
    if (_pending != pending || _disposed) {
      s?.release(); // cancelled while the prompt was open
      return;
    }
    if (s == null) {
      phase = RecPhase.idle;
      return _gone();
    }
    try {
      s.start();
    } catch (_) {
      s.release();
      phase = RecPhase.idle;
      return _gone();
    }
    _session = s;
    _stopped = false;
    _date = today();
    _t0 = _clock();
    phase = RecPhase.recording;
    _tick = Timer.periodic(const Duration(milliseconds: 200), (_) {
      if (_secs() >= limit) {
        stop();
      } else {
        notifyListeners();
      }
    });
    unawaited(s.finished.then((a) => _finish(s!, a)));
    notifyListeners();
  }

  Object? _pending;

  /// A press, the cap, leaving, a tab: ask the recorder to stop. A start still
  /// waiting on the prompt is cancelled instead.
  Future<void> stop() async {
    final s = _session;
    if (s == null) {
      if (phase == RecPhase.starting) {
        _pending = null;
        phase = RecPhase.idle;
        notifyListeners();
      }
      return;
    }
    if (_stopped) return;
    _mark();
    s.stop();
  }

  void _mark() {
    if (_stopped) return;
    _stopped = true;
    _tick?.cancel();
    final s = _secs();
    _elapsed = s > limit ? limit.toDouble() : s;
  }

  Future<void> _finish(MicSession s, RecordedAudio a) async {
    if (_session != s) return;
    _mark();
    final k = kind ?? 'story';
    _session = null;
    phase = RecPhase.idle;
    notifyListeners();
    // Under a second, or no audio at all, is not a rep: nothing is kept, nothing logged.
    if (!(_elapsed >= REC_MIN) || a.size == 0) {
      onShort();
      return;
    }
    final secs = _elapsed.round() < REC_MIN ? REC_MIN : _elapsed.round();
    final title = '${k == 'humor' ? 'Humour' : 'Story'} · ${recDay(_date)}';
    var kept = true;
    try {
      await backend.add(date: _date, seconds: secs, kind: k, title: title, audio: a);
    } catch (_) {
      kept = false;
    }
    onClip(k, _date, secs, title, kept); // logged even if the page was left: the web logs a recording that ends off-page
    if (!_disposed) notifyListeners();
  }

  void _gone() {
    micMissing = true;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _tick?.cancel();
    _pending = null;
    final s = _session;
    if (s != null && !_stopped) {
      _mark();
      s.stop();
    }
    super.dispose();
  }
}
