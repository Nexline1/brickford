// The microphone and the clip store on the web: getUserMedia and MediaRecorder,
// and IndexedDB database brickford_audio / store clips, key <date>-<n> - the
// same database and shape as app.js's T-028, so a clip recorded in either app
// is in both lists. Only dart:js_interop (the SDK's own), no package.
import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'recorder.dart';

const _dbName = 'brickford_audio', _storeName = 'clips';

JSObject get _g => globalContext;
JSAny? _prop(JSObject o, String k) => o.getProperty<JSAny?>(k.toJS);
String _str(JSAny? v) => v == null ? '' : (v as JSString).toDart;
int _int(JSAny? v) => v == null ? 0 : (v as JSNumber).toDartDouble.round();

Future<JSAny?> _req(JSObject r) {
  final c = Completer<JSAny?>();
  r.setProperty('onsuccess'.toJS, ((JSAny? _) => c.complete(_prop(r, 'result'))).toJS);
  r.setProperty('onerror'.toJS, ((JSAny? _) => c.completeError(StateError('indexedDB request failed'))).toJS);
  return c.future;
}

/// A database left without its store (another open at version 1 before ours ran)
/// is upgraded once more rather than failing every read.
Future<JSObject> _open([int? version]) async {
  final idb = _g.getProperty<JSObject>('indexedDB'.toJS);
  final r = version == null ? idb.callMethod<JSObject>('open'.toJS, _dbName.toJS) : idb.callMethod<JSObject>('open'.toJS, _dbName.toJS, version.toJS);
  r.setProperty('onupgradeneeded'.toJS, ((JSAny? _) {
    final db = r.getProperty<JSObject>('result'.toJS);
    if (!db.getProperty<JSObject>('objectStoreNames'.toJS).callMethod<JSBoolean>('contains'.toJS, _storeName.toJS).toDart) {
      db.callMethod<JSAny?>('createObjectStore'.toJS, _storeName.toJS);
    }
  }).toJS);
  final db = (await _req(r))! as JSObject;
  if (db.getProperty<JSObject>('objectStoreNames'.toJS).callMethod<JSBoolean>('contains'.toJS, _storeName.toJS).toDart) return db;
  final v = _int(_prop(db, 'version')) + 1;
  db.callMethod<JSAny?>('close'.toJS);
  return _open(v);
}

Future<T> _tx<T>(String mode, Future<T> Function(JSObject store) fn) async {
  final db = await _open();
  try {
    final tx = db.callMethod<JSObject>('transaction'.toJS, _storeName.toJS, mode.toJS);
    final done = Completer<void>();
    void fail(JSAny? _) {
      if (!done.isCompleted) done.completeError(StateError('indexedDB transaction failed'));
    }
    tx.setProperty('oncomplete'.toJS, ((JSAny? _) => done.complete()).toJS);
    tx.setProperty('onerror'.toJS, fail.toJS);
    tx.setProperty('onabort'.toJS, fail.toJS);
    final out = await fn(tx.callMethod<JSObject>('objectStore'.toJS, _storeName.toJS));
    await done.future;
    return out;
  } finally {
    db.callMethod<JSAny?>('close'.toJS);
  }
}

String _ext(String type) => RegExp('ogg').hasMatch(type) ? '.ogg' : RegExp('mp4|aac|m4a').hasMatch(type) ? '.m4a' : RegExp('wav').hasMatch(type) ? '.wav' : '.webm';

class _Mic implements MicSession {
  _Mic(this.stream);
  final JSObject stream;
  JSObject? _mr;
  final _chunks = <JSAny>[];
  final _done = Completer<RecordedAudio>();
  bool _finished = false;

  @override
  Future<RecordedAudio> get finished => _done.future;

  void _tracksStop() {
    final tracks = stream.callMethod<JSArray<JSObject>>('getTracks'.toJS).toDart;
    for (final t in tracks) {
      t.callMethod<JSAny?>('stop'.toJS);
    }
  }

  @override
  void start() {
    try {
      final mr = _g.getProperty<JSFunction>('MediaRecorder'.toJS).callAsConstructor<JSObject>(stream);
      _mr = mr;
      mr.setProperty('ondataavailable'.toJS, ((JSObject e) {
        final d = _prop(e, 'data');
        if (d != null && _int(_prop(d as JSObject, 'size')) > 0) _chunks.add(d);
      }).toJS);
      // A recorder that stops by itself still finishes the clip: onstop fires whether stop() asked for it or the track ended underneath it.
      mr.setProperty('onstop'.toJS, ((JSAny? _) => _finish()).toJS);
      mr.setProperty('onerror'.toJS, ((JSAny? _) {
        if (_str(_prop(mr, 'state')) == 'inactive') {
          _finish();
        } else {
          stop();
        }
      }).toJS);
      mr.callMethod<JSAny?>('start'.toJS);
    } catch (e) {
      _tracksStop();
      rethrow;
    }
  }

  @override
  void stop() {
    final mr = _mr;
    if (mr == null) return _finish();
    if (_str(_prop(mr, 'state')) != 'inactive') {
      try {
        mr.callMethod<JSAny?>('stop'.toJS);
        return;
      } catch (_) {
        /* finish below */
      }
    }
    _finish();
  }

  void _finish() {
    if (_finished) return;
    _finished = true;
    _tracksStop();
    var mime = _mr == null ? '' : _str(_prop(_mr!, 'mimeType'));
    if (mime.isEmpty && _chunks.isNotEmpty) mime = _str(_prop(_chunks.first as JSObject, 'type'));
    if (mime.isEmpty) mime = 'audio/webm';
    final opts = JSObject()..setProperty('type'.toJS, mime.toJS);
    final blob = _g.getProperty<JSFunction>('Blob'.toJS).callAsConstructor<JSObject>(_chunks.toJS, opts);
    _done.complete(RecordedAudio(blob, _int(_prop(blob, 'size')), mime));
  }

  @override
  void release() => _tracksStop();
}

class _Player implements ClipPlayer {
  _Player(String url, this.onChange) {
    _a = _g.getProperty<JSFunction>('Audio'.toJS).callAsConstructor<JSObject>(url.toJS);
    _a.setProperty('preload'.toJS, 'auto'.toJS);
    _a.setProperty('onended'.toJS, ((JSAny? _) {
      playing = false;
      onChange();
    }).toJS);
  }
  late final JSObject _a;
  final void Function() onChange;
  @override
  bool playing = false;

  @override
  Future<void> toggle() async {
    if (_prop(_a, 'paused') == true.toJS) {
      playing = true;
      onChange();
      try {
        await _a.callMethod<JSPromise<JSAny?>>('play'.toJS).toDart;
      } catch (_) {
        playing = false;
        onChange();
      }
    } else {
      _a.callMethod<JSAny?>('pause'.toJS);
      playing = false;
      onChange();
    }
  }

  @override
  void dispose() => _a.callMethod<JSAny?>('pause'.toJS);
}

class _Web implements AudioBackend {
  final _urls = <String>[];

  @override
  bool get storeSupported => _prop(_g, 'indexedDB') != null;

  @override
  bool get micSupported {
    final nav = _prop(_g, 'navigator');
    final md = nav == null ? null : _prop(nav as JSObject, 'mediaDevices');
    return md != null && _prop(md as JSObject, 'getUserMedia') != null && _prop(_g, 'MediaRecorder') != null && storeSupported;
  }

  @override
  Future<MicSession?> openMic() async {
    try {
      final md = _g.getProperty<JSObject>('navigator'.toJS).getProperty<JSObject>('mediaDevices'.toJS);
      final c = JSObject()..setProperty('audio'.toJS, true.toJS);
      final stream = await md.callMethod<JSPromise<JSObject>>('getUserMedia'.toJS, c).toDart;
      return _Mic(stream);
    } catch (_) {
      return null; // refused, or no device answered
    }
  }

  String _url(JSObject blob) {
    final u = _g.getProperty<JSObject>('URL'.toJS).callMethod<JSString>('createObjectURL'.toJS, blob).toDart;
    _urls.add(u);
    return u;
  }

  @override
  void releaseUrls() {
    final u = _g.getProperty<JSObject>('URL'.toJS);
    while (_urls.isNotEmpty) {
      u.callMethod<JSAny?>('revokeObjectURL'.toJS, _urls.removeLast().toJS);
    }
  }

  @override
  Future<List<StoredClip>> list() => _tx<List<StoredClip>>('readonly', (st) async {
    final keysR = st.callMethod<JSObject>('getAllKeys'.toJS), valsR = st.callMethod<JSObject>('getAll'.toJS);
    final keys = (await _req(keysR))! as JSArray<JSAny?>, vals = (await _req(valsR))! as JSArray<JSAny?>;
    releaseUrls();
    final out = <StoredClip>[];
    final kk = keys.toDart, vv = vals.toDart;
    for (var i = 0; i < kk.length && i < vv.length; i++) {
      final v = vv[i] as JSObject, key = _str(kk[i]);
      final blob = _prop(v, 'blob');
      out.add(StoredClip(
        key: key,
        date: _str(_prop(v, 'date')),
        seconds: _int(_prop(v, 'seconds')),
        kind: _str(_prop(v, 'kind')),
        title: _str(_prop(v, 'title')).isEmpty ? 'Recording' : _str(_prop(v, 'title')),
        url: blob == null ? null : _url(blob as JSObject),
        mime: blob == null ? '' : _str(_prop(blob as JSObject, 'type')),
      ));
    }
    int n(StoredClip c) => int.tryParse(c.key.split('-').last) ?? 0;
    out.sort((a, b) => a.date == b.date ? n(b).compareTo(n(a)) : (a.date.compareTo(b.date) < 0 ? 1 : -1));
    return out;
  });

  @override
  Future<String> add({required String date, required int seconds, required String kind, required String title, required RecordedAudio audio}) => _tx<String>('readwrite', (st) async {
    final range = _g.getProperty<JSObject>('IDBKeyRange'.toJS).callMethod<JSObject>('bound'.toJS, '$date-'.toJS, '$date-￿'.toJS);
    final keys = ((await _req(st.callMethod<JSObject>('getAllKeys'.toJS, range)))! as JSArray<JSAny?>).toDart;
    var n = 0;
    for (final k in keys) {
      final x = int.tryParse(_str(k).split('-').last) ?? 0;
      if (x > n) n = x;
    }
    final key = '$date-${n + 1}';
    final clip = JSObject()
      ..setProperty('date'.toJS, date.toJS)
      ..setProperty('seconds'.toJS, seconds.toJS)
      ..setProperty('kind'.toJS, kind.toJS)
      ..setProperty('title'.toJS, title.toJS)
      ..setProperty('blob'.toJS, audio.blob as JSObject);
    await _req(st.callMethod<JSObject>('put'.toJS, clip, key.toJS));
    return key;
  });

  @override
  Future<void> rename(String key, String title) => _tx<void>('readwrite', (st) async {
    final v = await _req(st.callMethod<JSObject>('get'.toJS, key.toJS));
    if (v == null) return;
    final o = _g.getProperty<JSObject>('Object'.toJS).callMethod<JSObject>('assign'.toJS, JSObject(), v, (JSObject()..setProperty('title'.toJS, title.toJS)));
    await _req(st.callMethod<JSObject>('put'.toJS, o, key.toJS));
  });

  @override
  Future<void> delete(String key) => _tx<void>('readwrite', (st) async {
    await _req(st.callMethod<JSObject>('delete'.toJS, key.toJS));
  });

  @override
  ClipPlayer player(StoredClip clip, void Function() onChange) => _Player(clip.url ?? '', onChange);

  @override
  void download(StoredClip clip) {
    final u = clip.url;
    if (u == null) return;
    final a = _g.getProperty<JSObject>('document'.toJS).callMethod<JSObject>('createElement'.toJS, 'a'.toJS);
    a.setProperty('href'.toJS, u.toJS);
    a.setProperty('download'.toJS, '${clip.title.replaceAll(RegExp(r'[\\/:*?"<>|]+'), '-')}${_ext(clip.mime)}'.toJS);
    a.callMethod<JSAny?>('click'.toJS);
  }
}

AudioBackend createAudioBackend() => _Web();
