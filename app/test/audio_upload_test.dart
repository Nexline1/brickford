// T-046 v2 (loop/specs/T-046-transcripts-v2/spec.md): the phone records, the
// laptop transcribes. A clip kept in the Flutter app's recorder is uploaded
// to the private sync repo at audio/<key><ext> (app.js audioPath), with the
// sync token, from the save and from the Practice page being opened; a
// failure is one muted line and is retried on the next open, never in a
// loop. The phone never transcribes: there is no transcription code here.
import 'dart:convert';

import 'package:app/engine/practice.dart';
import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/sync.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'practice_test.dart' show FakeAudio, tester, key;
import 'practice_test.dart' as pt;

const fakeToken = 'github_pat_FAKE0123456789abcdef';
const priv = '/repos/Nexline1/brickford-private';

/// GitHub for one device: the state file (absent), the repo, and audio/ uploads.
class Hub {
  bool fail = false;
  final calls = <String>[];
  final uploads = <http.Request>[];
  http.Client get client => MockClient((req) async {
    calls.add('${req.method} ${req.url.path}');
    if (req.url.path == priv) return http.Response('{"full_name":"Nexline1/brickford-private"}', 200);
    if (req.url.path == '$priv/contents/progress/brickford-state.json') return req.method == 'GET' ? http.Response('{}', 404) : http.Response('{"content":{"sha":"s2"}}', 201);
    if (req.url.path.startsWith('$priv/contents/audio/') && req.method == 'PUT') {
      uploads.add(req);
      return fail ? http.Response('{"message":"Resource not accessible by personal access token"}', 403) : http.Response(jsonEncode({'content': {'sha': 'up${uploads.length}'}}), 201);
    }
    return http.Response('{"message":"Not Found"}', 404);
  });
}

Future<AppModel> model(Hub hub, FakeAudio audio, {bool token = true}) async {
  pt.fakeNow = Duration.zero;
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: '{}', if (token) SyncService.tokenKey: fakeToken});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-06', now: () => DateTime.utc(2026, 11, 6, 9), audio: audio, client: hub.client, recorderClock: () => pt.fakeNow);
}

Future<void> openPractice(WidgetTester t, AppModel m) async {
  tester(t);
  await t.pumpWidget(BrickfordApp(model: m));
  await t.pumpAndSettle();
  await t.tap(find.text('Build'));
  await t.pumpAndSettle();
  await t.tap(key('chip-practice'));
  await t.pumpAndSettle();
}

/// Back to Build, then Practice again: the page opened a second time (the app is not restarted).
Future<void> reopen(WidgetTester t) async {
  await t.tap(find.byIcon(Icons.arrow_back_ios_new));
  await t.pumpAndSettle();
  await t.tap(key('chip-practice'));
  await t.pumpAndSettle();
}

Future<void> recordTwoSeconds(WidgetTester t) async {
  await t.tap(key('practice-rec'));
  await t.pump();
  pt.fakeNow = const Duration(seconds: 2);
  await t.pump(const Duration(seconds: 2));
  await t.tap(key('practice-rec'));
  await t.pumpAndSettle();
}

void main() {
  test('the upload path is app.js audioPath: audio/<key> and the Blob type\'s extension', () {
    expect(audioPath('2026-11-06-1', 'audio/webm;codecs=opus'), 'audio/2026-11-06-1.webm');
    expect(audioPath('2026-11-06-2', 'audio/ogg'), 'audio/2026-11-06-2.ogg');
    expect(audioPath('2026-11-06-3', 'audio/mp4'), 'audio/2026-11-06-3.m4a');
    expect(audioPath('2026-11-06-4', 'audio/wav'), 'audio/2026-11-06-4.wav');
    expect(audioPath('2026-11-06-5', ''), 'audio/2026-11-06-5.webm');
  });

  testWidgets('a kept clip is PUT once to the private repo\'s audio/, with its bytes, and its record gets remote {sha, at}', (t) async {
    final hub = Hub(), audio = FakeAudio(), m = await model(hub, audio);
    await openPractice(t, m);
    await recordTwoSeconds(t);
    expect(audio.clips.length, 1);
    expect(hub.uploads.map((r) => r.url.toString()), ['https://api.github.com$priv/contents/audio/2026-11-06-1.webm']);
    final body = jsonDecode(hub.uploads.single.body) as Map;
    expect(utf8.decode(base64.decode(body['content'] as String)), 'audio of 2026-11-06-1');
    expect(hub.uploads.single.headers['Authorization'], 'Bearer $fakeToken');
    expect(audio.remote['2026-11-06-1'], {'sha': 'up1', 'at': '2026-11-06T09:00:00.000Z'});
    expect(find.byKey(const ValueKey('practice-upfail')), findsNothing);
    expect(hub.calls.where((c) => !c.contains('brickford-private')), isEmpty, reason: 'nothing goes to the public repo');
    await reopen(t);
    expect(hub.uploads.length, 1, reason: 'an uploaded clip is not sent again');
    await t.pump(const Duration(seconds: 5)); // the rep's push
    await t.pumpAndSettle();
  });

  testWidgets('a failed upload: one muted line, the clip kept, no retry by itself, one more try on the next open', (t) async {
    final hub = Hub()..fail = true, audio = FakeAudio(), m = await model(hub, audio);
    await openPractice(t, m);
    await recordTwoSeconds(t);
    expect(hub.uploads.length, 1);
    expect(audio.clips.length, 1);
    expect(audio.remote, isEmpty);
    final line = find.byKey(const ValueKey('practice-upfail'));
    expect(line, findsOneWidget);
    expect((t.widget(line) as Text).data, 'Audio stays on this device until your token can reach brickford-private');
    await t.pump(const Duration(seconds: 10));
    await t.pumpAndSettle();
    expect(hub.uploads.length, 1, reason: 'never in a loop');
    hub.fail = false;
    await reopen(t);
    expect(hub.uploads.length, 2);
    expect(audio.remote.keys, ['2026-11-06-1']);
    expect(find.byKey(const ValueKey('practice-upfail')), findsNothing);
  });

  testWidgets('no token: nothing is tried and nothing is said', (t) async {
    final hub = Hub(), audio = FakeAudio(), m = await model(hub, audio, token: false);
    await openPractice(t, m);
    await recordTwoSeconds(t);
    expect(audio.clips.length, 1);
    expect(hub.calls, isEmpty);
    expect(find.byKey(const ValueKey('practice-upfail')), findsNothing);
  });
}
