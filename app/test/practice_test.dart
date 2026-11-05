// T-064 stage 6b: Practice - logging a rep by hand, the recorder's states with a
// fake backend (idle, the prompt open, recording, stopped, denied, no device),
// and the rules ported from app.js's practice layer.
//
// The plan: START_DATE 2026-10-05 (Monday). 2026-11-05 is a Thursday study day,
// Friday 6 Nov is SPEECH_OFF_DOW (story and humour owed), Saturday 7 Nov rests.
import 'dart:async';
import 'dart:convert';

import 'package:app/engine/practice.dart';
import 'package:app/engine/record.dart';
import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/recorder.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A fake microphone and clip store. [grant] decides the prompt's answer.
class FakeAudio implements AudioBackend {
  FakeAudio({this.mic = true, this.grant});
  final bool mic;
  Completer<MicSession?>? grant;
  bool refuse = false;
  final clips = <StoredClip>[];
  int opened = 0;
  FakeMic? last;

  @override
  bool get micSupported => mic;
  @override
  bool get storeSupported => true;
  @override
  Future<MicSession?> openMic() async {
    opened++;
    if (grant != null) return grant!.future;
    if (refuse) return null;
    return last = FakeMic();
  }

  @override
  Future<List<StoredClip>> list() async => [...clips];
  @override
  Future<String> add({required String date, required int seconds, required String kind, required String title, required RecordedAudio audio}) async {
    final n = clips.where((c) => c.date == date).length + 1;
    clips.insert(0, StoredClip(key: '$date-$n', date: date, seconds: seconds, kind: kind, title: title, url: 'blob:$date-$n'));
    return '$date-$n';
  }

  @override
  Future<void> rename(String key, String title) async {
    final i = clips.indexWhere((c) => c.key == key);
    clips[i] = clips[i].withTitle(title);
  }

  @override
  Future<void> delete(String key) async => clips.removeWhere((c) => c.key == key);
  @override
  ClipPlayer player(StoredClip clip, void Function() onChange) => _P(onChange);
  @override
  void download(StoredClip clip) {}
  @override
  void releaseUrls() {}
}

class _P implements ClipPlayer {
  _P(this.cb);
  final void Function() cb;
  @override
  bool playing = false;
  @override
  Future<void> toggle() async {
    playing = !playing;
    cb();
  }

  @override
  void dispose() {}
}

class FakeMic implements MicSession {
  final _done = Completer<RecordedAudio>();
  bool started = false, released = false;
  int size = 4096;
  @override
  void start() => started = true;
  @override
  void stop() => _done.complete(RecordedAudio(Object(), size, 'audio/webm'));
  @override
  Future<RecordedAudio> get finished => _done.future;
  @override
  void release() => released = true;
}

Duration fakeNow = Duration.zero;

Future<AppModel> model({Map<String, dynamic> state = const {}, String today = '2026-11-05', FakeAudio? audio}) async {
  fakeNow = Duration.zero;
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.utc(2026, 11, 5, 9, 30, 15, 123), audio: audio ?? FakeAudio(), recorderClock: () => fakeNow);
}

Finder key(String s) => find.byKey(ValueKey(s));

Future<void> goPractice(WidgetTester t, AppModel m) async {
  tester(t);
  await t.pumpWidget(BrickfordApp(model: m));
  await t.pumpAndSettle();
  await t.tap(find.text('Build'));
  await t.pumpAndSettle();
  await t.tap(key('chip-practice'));
  await t.pumpAndSettle();
}

void tester(WidgetTester t) {
  t.view.physicalSize = const Size(375 * 3, 812 * 3);
  t.view.devicePixelRatio = 3;
  addTearDown(t.view.reset);
}

void main() {
  test('what is owed: the bank daily, the story and humour on the speech-off Friday, nothing on Saturday, the review at four weeks', () async {
    final thu = await model(), fri = await model(today: '2026-11-06'), sat = await model(today: '2026-11-07');
    expect(thu.engine.repsDue().map((d) => d.kind), ['bank']);
    expect(fri.engine.repsDue().map((d) => d.kind), ['bank', 'story', 'humor']);
    expect(sat.engine.repsDue(), isEmpty);
    expect(fri.engine.practiceDefault(), 'story', reason: 'the recorded kinds first');
    final rev = await model(today: '2026-11-06', state: {'reps': {'story': [{'date': '2026-10-08', 'seconds': 40, 'takes': 1, 'from': 'x'}]}});
    expect(rev.engine.repsDue().map((d) => d.kind), contains('review'));
  });

  test('the forms refuse an empty entry and say why; a rep is logged once, sealed into the chain', () async {
    final m = await model(today: '2026-11-06');
    expect(m.logRep('repBank', {'bankWhat': ' '}).msg, startsWith('Write what happened first'));
    expect(m.logRep('repStory', {'repSecs': '0'}).msg, startsWith('How long was it?'));
    expect(m.logRep('repHumor', {'joke0': 'a', 'joke1': 'b'}).msg, 'Five attempts, not 2. Volume is the mechanic.');
    expect(m.logRep('repReview', {'revNotes': ''}).msg, 'A review with no writing is a rewatch.');
    expect(m.engine.ledger, isEmpty);
    final r = m.logRep('repStory', {'repSecs': '120', 'repTakes': '', 'repWhich': 'the napkin one'});
    expect(r.ok, isTrue);
    expect(r.msg, 'Logged — 120s. The cap is 90.');
    expect((m.engine.reps['story'] as List).single, {'date': '2026-11-06', 'seconds': 120, 'takes': 1, 'from': 'the napkin one'});
    expect((m.engine.ledger.single as Map)['type'], 'rep');
    final sat = await model(today: '2026-11-07');
    expect(sat.logRep('repBank', {'bankWhat': 'x'}).msg, 'Saturday is a rest day — nothing owed.');
  });

  test('the week is six dots; a dot is on when the bank was logged that day', () async {
    final m = await model(state: {'reps': {'bank': [{'date': '2026-11-02', 'what': 'a', 'why': ''}, {'date': '2026-11-04', 'what': 'b', 'why': ''}]}});
    final w = m.engine.weekDots()!;
    expect(w.dots.length, 6);
    expect(w.logged, 2);
    expect(w.dots.where((d) => d.on).map((d) => d.iso), ['2026-11-02', '2026-11-04']);
    expect(w.dots.singleWhere((d) => d.now).iso, '2026-11-05');
  });

  testWidgets('logging a rep: the bank form, a refusal then the entry, the dot lights', (t) async {
    final m = await model();
    await goPractice(t, m);
    await t.tap(key('practice-tab-bank'));
    await t.pumpAndSettle();
    await t.tap(key('practice-log-repBank'));
    await t.pumpAndSettle();
    expect(find.text('Write what happened first — an empty entry is not an entry.'), findsOneWidget);
    expect(m.engine.repCount('bank'), 0);
    await t.enterText(find.byType(TextField).first, 'a client asked what an embedding was');
    await t.tap(key('practice-log-repBank'));
    await t.pumpAndSettle();
    expect(m.engine.repCount('bank'), 1);
    expect(find.text('Logged. The bank is the input to every other rep.'), findsOneWidget);
    expect(t.widget<Text>(find.byKey(const ValueKey('practice-week'))).data, '1');
  });

  testWidgets('the recorder states in the page: idle, starting, recording, stopped', (t) async {
    final gate = Completer<MicSession?>();
    final audio = FakeAudio(grant: gate);
    final m = await model(today: '2026-11-06', audio: audio);
    await goPractice(t, m);
    expect(find.text('0:00 / 1:30'), findsOneWidget, reason: 'idle');
    expect(find.text('Nothing recorded yet. Press the red button and talk.'), findsOneWidget);
    await t.tap(key('practice-rec'));
    await t.pump();
    expect(find.text('Starting…'), findsOneWidget, reason: 'the microphone prompt is open');
    final mic = FakeMic();
    gate.complete(mic);
    await t.pump();
    fakeNow = const Duration(milliseconds: 1300);
    await t.pump(const Duration(milliseconds: 1300));
    expect(mic.started, isTrue);
    expect(m.recorder.phase, RecPhase.recording);
    expect(find.text('0:01 / 1:30'), findsOneWidget, reason: 'recording');
    await t.tap(key('practice-rec'));
    await t.pumpAndSettle();
    expect(m.recorder.phase, RecPhase.idle);
    expect(audio.clips.single.seconds, 1);
    expect(audio.clips.single.title, 'Story · Fri 6 Nov');
    expect(find.text('Story · Fri 6 Nov'), findsOneWidget, reason: 'stopped: the clip is listed');
    expect(find.text('Logged, and inside 90s.'), findsOneWidget);
    expect((m.engine.reps['story'] as List).single, containsPair('from', 'Story · Fri 6 Nov'));
    await t.tap(find.byTooltip('Play Story \u00b7 Fri 6 Nov'));
    await t.pump();
    expect(find.byIcon(Icons.pause_rounded), findsOneWidget);
    await t.tap(find.byTooltip('Delete Story · Fri 6 Nov'));
    await t.pumpAndSettle();
    await t.tap(key('clip-delete-ok'));
    await t.pumpAndSettle();
    expect(audio.clips, isEmpty);
    expect(m.engine.repCount('story'), 1, reason: 'the rep stays logged');
  });

  testWidgets('a press under a second keeps nothing and logs nothing', (t) async {
    final audio = FakeAudio();
    final m = await model(today: '2026-11-06', audio: audio);
    await goPractice(t, m);
    await t.tap(key('practice-rec'));
    await t.pump();
    await t.pump();
    await t.tap(key('practice-rec'));
    await t.pumpAndSettle();
    expect(audio.clips, isEmpty);
    expect(m.engine.repCount('story'), 0);
    expect(find.textContaining('Under a second'), findsOneWidget);
  });

  testWidgets('permission denied, and no device: the hand form and no record button', (t) async {
    for (final noDevice in [false, true]) {
      final audio = FakeAudio(mic: !noDevice)..refuse = true;
      final m = await model(today: '2026-11-06', audio: audio);
      await goPractice(t, m);
      if (!noDevice) {
        await t.tap(key('practice-rec'));
        await t.pumpAndSettle();
      }
      expect(key('practice-rec'), findsNothing, reason: noDevice ? 'no device' : 'denied');
      expect(find.text('Microphone not available, so log it by hand'), findsOneWidget);
      expect(key('practice-log-repStory'), findsOneWidget);
      await t.pumpWidget(const SizedBox());
    }
  });

  testWidgets('a recording ends after the page was left: still kept and logged', (t) async {
    final audio = FakeAudio();
    final m = await model(today: '2026-11-06', audio: audio);
    await goPractice(t, m);
    await t.tap(key('practice-rec'));
    await t.pump();
    fakeNow = const Duration(milliseconds: 1200);
    await t.pump(const Duration(milliseconds: 1200));
    await t.tap(find.byIcon(Icons.arrow_back_ios_new));
    await t.pumpAndSettle();
    expect(m.recorder.phase, RecPhase.idle);
    expect(audio.clips.length, 1);
    expect(m.engine.repCount('story'), 1);
  });

  test('a Saturday recording is kept and logs nothing; the clock reads m:ss', () async {
    final m = await model(today: '2026-11-07');
    final r = m.engine.logRecordedRep('story', '2026-11-07', 30, 'Story · Sat 7 Nov', kept: true, ts: '2026-11-07T09:00:00.000Z');
    expect(r.ok, isFalse);
    expect(r.msg, 'Kept on this device. Saturday is a rest day — nothing logged.');
    expect(m.engine.repCount('story'), 0);
    expect([clockLabel(0), clockLabel(59.6), clockLabel(90), clockLabel(3725)], ['0:00', '1:00', '1:30', '1:02:05']);
    expect(recDay('2026-10-20'), 'Tue 20 Oct');
  });
}
