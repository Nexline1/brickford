// T-067 step 3 (Flutter): the practice items under a lecture's quiz. The rules (grading, the merge by `at`, the
// payload, Recall), the Practice block (a worked solution hidden until an attempt, a written answer's checklist
// hidden under 80 characters), and Grade with Claude against a STUB client: no request leaves the test, and the
// key is a made-up string the tests hunt for everywhere it must not be.
//
// Parity with app.js on the same inputs is tools/verify-app.js; these pin the behaviour on the Dart side.
import 'dart:convert';

import 'package:app/engine/learn.dart';
import 'package:app/engine/lecture_practice.dart';
import 'package:app/engine/merge.dart';
import 'package:app/engine/quiz.dart';
import 'package:app/main.dart';
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/sync.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'sync_test.dart' show FakeGitHub, fakeToken;

const stubKey = 'sk-ant-test-stub';
const today = '2026-11-12';
final noonish = DateTime.utc(2026, 11, 12, 9, 30, 15, 123);

/// Every request the app makes to Anthropic, answered by [reply].
class FakeClaude {
  FakeClaude(this.reply);
  http.Response Function(http.Request req) reply;
  final requests = <http.Request>[];
  final gh = FakeGitHub();
  http.Client get client => MockClient((req) async {
    if (req.url.host == 'api.anthropic.com') {
      requests.add(req);
      return reply(req);
    }
    // Anything else is the sync: GitHub's fake, on a copy (MockClient hands over a finalized request).
    final copy = http.Request(req.method, req.url)
      ..headers.addAll(req.headers)
      ..bodyBytes = req.bodyBytes;
    return http.Response.fromStream(await gh.client.send(copy));
  });
}

http.Response graded(Map<String, dynamic> g) =>
    http.Response(jsonEncode({'stop_reason': 'end_turn', 'content': [{'type': 'text', 'text': jsonEncode(g)}]}), 200);

Future<AppModel> model({Map<String, dynamic> state = const {}, bool key = true, bool token = false, FakeClaude? claude, bool Function()? offline}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({
    AppModel.storageKey: jsonEncode(state),
    if (key) AI_KEY: stubKey,
    if (token) SyncService.tokenKey: fakeToken,
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => noonish, client: (claude ?? FakeClaude((_) => http.Response('{}', 500))).client, offline: offline);
}

Map<String, dynamic> watched(List<String> ks) => {'lessons': {for (final k in ks) k: {'done': true, 'doneAt': '2026-11-10', 'notes': '', 'checks': []}}};

Finder key(String s) => find.byKey(ValueKey(s));

/// The lecture's page on a 375x812 phone.
Future<void> openLesson(WidgetTester t, AppModel m, String k) async {
  t.view.physicalSize = const Size(375 * 3, 812 * 3);
  t.view.devicePixelRatio = 3;
  addTearDown(t.view.reset);
  await t.pumpWidget(BrickfordApp(model: m));
  await t.pumpAndSettle();
  final p = k.split('.');
  t.state<NavigatorState>(find.byType(Navigator).first).push(MaterialPageRoute<void>(builder: (_) => LessonScreen(cid: p[0], ui: int.parse(p[1]), li: int.parse(p[2]))));
  await t.pumpAndSettle();
}

Future<void> tap(WidgetTester t, Finder f) async {
  await t.ensureVisible(f);
  await t.pumpAndSettle();
  await t.tap(f);
  await t.pumpAndSettle();
}

Future<void> type(WidgetTester t, Finder f, String text) async {
  await t.ensureVisible(f);
  await t.pumpAndSettle();
  await t.enterText(find.descendant(of: f, matching: find.byType(TextField)), text);
  await t.pumpAndSettle();
}

const longAnswer = 'Each neuron takes a weighted sum of the activations before it, adds a bias, and squashes it with a sigmoid.';

void main() {
  test('practice.json is the web DAR.PRACTICE: 158 items under 61 lectures, four types (T-070 CS50P 3-5: was 149 under 58)', () async {
    final m = await model();
    final all = [for (final v in m.data.practice.values) ...(v as List)];
    expect(m.data.practice.length, 61);
    expect(all.length, 158);
    expect({for (final it in all) it['type']}, {'numeric', 'output', 'worked', 'write'});
  });

  test('every numeric item is right at its own answer (and with a decimal comma), and wrong just outside its tolerance', () async {
    final m = await model();
    var n = 0;
    for (final k in m.data.practice.keys) {
      for (final it in m.engine.practiceItems(k).where((it) => it['type'] == 'numeric')) {
        final num want = it['num'], tol = it['tol'] ?? 1e-6;
        expect(gradeAnswer(it, '$want'), isTrue, reason: '$k/${it['id']}');
        expect(gradeAnswer(it, '$want'.replaceFirst('.', ',')), isTrue, reason: '$k/${it['id']} comma');
        expect(gradeAnswer(it, '${want + tol * 3}'), isFalse, reason: '$k/${it['id']} near miss');
        n++;
      }
    }
    expect(n, 98);
  });

  test('a wrong numeric answer is marked missed and comes back in Recall; a right one counts as solved unaided', () async {
    final m = await model(state: watched(['math110.0.0']));
    final items = m.engine.practiceItems('math110.0.0');
    expect(m.practiceAnswer('math110.0.0', items[0], ''), 'Answer first.');
    expect(m.practiceAnswer('math110.0.0', items[0], ' 1 '), isNull);
    expect(m.practiceAnswer('math110.0.0', items[1], '5'), isNull);
    expect(m.engine.practiceOf('math110.0.0', 'p1'), {'answer': '1', 'mark': 'ok', 'ticks': [], 'grade': null, 'at': '2026-11-12T09:30:15.123Z'});
    expect(m.engine.practiceOf('math110.0.0', 'p2')!['mark'], 'missed');
    expect(m.engine.practiceSolvedN('math110.0.0'), 1);
    expect(m.engine.solveGate('math110.0.0'), (solved: 1, need: 1));
    expect(m.engine.review['p:math110.0.0:p2'], {'box': 0, 'due': '2026-11-14', 'last': today, 'lapses': 0});
    expect(m.engine.reviewsDue(), isEmpty, reason: 'due in two days, not today');
    // Two days on, it is due: Recall shows it as "practice 2" with its question.
    final later = AppModel(m.data, m.prefs, today: () => '2026-11-14');
    expect(later.engine.reviewsDue(), ['p:math110.0.0:p2']);
    final r = later.engine.recallData();
    expect(r.due.single.k, 'p:math110.0.0:p2');
    expect(r.due.single.practiceTag, ' · practice 2');
    expect(r.due.single.question, contains(r'$-2\,(3,-1) + (1,5)$'));
  });

  test('a worked item: Partly and Missed go into the review, Got it does not; Again clears the answer', () async {
    final m = await model();
    final it = m.engine.practiceItems('math110.0.0')[2];
    expect(m.practiceAnswer('math110.0.0', it, '(1,-1)'), isNull);
    expect(m.engine.practiceOf('math110.0.0', 'p3')!['mark'], isNull, reason: 'a worked item is self-marked');
    m.practiceMark('math110.0.0', 'p3', 'ok');
    expect(m.engine.review.containsKey('p:math110.0.0:p3'), isFalse);
    m.practiceMark('math110.0.0', 'p3', 'partly');
    expect(m.engine.review.containsKey('p:math110.0.0:p3'), isTrue);
    m.practiceAgain('math110.0.0', 'p3');
    expect(prTried(it, m.engine.practiceOf('math110.0.0', 'p3')), isFalse);
  });

  test('an output item: the printed text spacing aside, or the same number', () {
    expect(outputOk({'out': '[-2, 10, 9]'}, '[-2,10,9]'), isTrue);
    expect(outputOk({'out': '[-2, 10, 9]'}, '[-2, 10, 8]'), isFalse);
    expect(outputOk({'out': '12'}, '12.0'), isTrue);
    expect(outputOk({'out': '12'}, '12,0'), isTrue);
    expect(outputOk({'out': '12'}, '13'), isFalse);
  });

  test('the merge: per item, the newer `at` wins; an item only one side has is kept; nothing is deleted', () async {
    final m = await model(state: {
      'practice': {
        'math110.0.0': {
          'p1': {'answer': 'old', 'at': '2026-11-10T08:00:00.000Z'},
          'p2': {'answer': 'mine newer', 'at': '2026-11-12T08:00:00.000Z'},
          'p3': {'answer': 'only mine', 'at': '2026-11-01T08:00:00.000Z'},
        },
      },
    });
    final n = mergeState(m.engine, {
      'state': {
        'practice': {
          'math110.0.0': {
            'p1': {'answer': 'theirs newer', 'at': '2026-11-11T08:00:00.000Z'},
            'p2': {'answer': 'theirs older', 'at': '2026-11-11T08:00:00.000Z'},
          },
          'math110.0.1': {'p1': {'answer': 'only theirs', 'at': '2026-11-09T08:00:00.000Z'}},
        },
      },
    });
    expect(n, 2);
    expect(m.engine.practiceOf('math110.0.0', 'p1')!['answer'], 'theirs newer');
    expect(m.engine.practiceOf('math110.0.0', 'p2')!['answer'], 'mine newer');
    expect(m.engine.practiceOf('math110.0.0', 'p3')!['answer'], 'only mine');
    expect(m.engine.practiceOf('math110.0.1', 'p1')!['answer'], 'only theirs');
  });

  test('the sync payload carries practice once there are answers, and never the key', () async {
    final m = await model();
    expect((syncPayload(m.engine)['state'] as Map).containsKey('practice'), isFalse, reason: 'no answers yet');
    m.practiceAnswer('math110.0.0', m.engine.practiceItems('math110.0.0')[0], '1');
    final p = syncPayload(m.engine);
    expect((p['state'] as Map)['practice'], m.engine.S['practice']);
    expect(encodePayload(p), isNot(contains(stubKey)));
    await m.flush();
    expect(m.prefs.getString(AppModel.storageKey), isNot(contains(stubKey)), reason: 'the key is not in S');
  });

  test('a push carries practice to the remote file, and no PUT holds the key', () async {
    final claude = FakeClaude((_) => graded({'points': [{'point': 'p', 'verdict': 'met'}], 'correction': 'c'}));
    final m = await model(token: true, claude: claude, state: watched(['ai200.0.0']));
    final it = m.engine.practiceItems('ai200.0.0')[0];
    expect(m.practiceAnswer('ai200.0.0', it, longAnswer), isNull);
    await m.practiceGrade('ai200.0.0', it);
    expect(claude.requests, hasLength(1));
    expect(await m.sync.pushNow(), isTrue);
    expect(claude.gh.puts, isNotEmpty);
    for (final put in claude.gh.puts) {
      expect(utf8.decode(base64.decode(put['content'] as String)), isNot(contains(stubKey)));
      expect(jsonEncode(put), isNot(contains(stubKey)));
    }
    final remote = (claude.gh.file!['state'] as Map)['practice'] as Map;
    expect((remote['ai200.0.0'] as Map)['p1']['answer'], longAnswer);
    expect((remote['ai200.0.0'] as Map)['p1']['grade']['correction'], 'c');
  });

  test("today's practice: the lectures scheduled today with items, then the ones with items due again", () async {
    final m = await model(state: {
      'review': {'p:math110.0.3:p1': {'box': 0, 'due': '2026-11-11', 'last': '2026-11-09', 'lapses': 0}, 'p:math110.0.3:p9': {'box': 0, 'due': '2026-11-11'}},
    });
    final sched = [for (final it in m.engine.realSched(today)) if (m.engine.practiceItems(it.key).isNotEmpty) it.key];
    final rows = m.engine.practiceToday();
    expect([for (final r in rows) r.k], [...sched, if (!sched.contains('math110.0.3')) 'math110.0.3']);
    expect(rows.firstWhere((r) => r.k == 'math110.0.3').due, 1, reason: 'p9 is not an item: never due');
    final d = m.engine.practiceDash()!;
    expect(d.rows.last.sub, endsWith(' · 1 due again'));
  });

  test("this week's answers: the text the web copies", () async {
    final m = await model(state: {
      'practice': {
        'math110.0.0': {
          'p1': {'answer': '1', 'mark': 'ok', 'at': '2026-11-12T08:00:00.000Z'},
          'p3': {'answer': '(1,-1)', 'mark': 'partly', 'at': '2026-11-06T08:00:00.000Z'},
        },
        'math110.0.1': {'p1': {'answer': '-3', 'mark': 'missed', 'at': '2026-11-05T23:59:00.000Z'}},
      },
    });
    final w = m.engine.weekText();
    expect(w.n, 2);
    expect(w.text, startsWith('Brickford practice, 2026-11-06 to 2026-11-12\nPlease review: '));
    expect(w.text, contains('\nMATH 110 · '));
    expect(w.text, contains(r'1. Add $(2,-3)$ and $(-5,4)$. The second component of the sum is:' '\n   My answer: 1 (checked right)\n'));
    expect(w.text, contains('3. Walk'));
    expect(w.text, contains('My answer: (1,-1) (self-marked partly)\n'));
    expect(w.text, isNot(contains('My answer: -3')), reason: 'seven days back is out of the week');
  });

  testWidgets('a worked solution is hidden before an attempt, and shows after one with the three marks', (t) async {
    final m = await model(state: watched(['math110.0.0']));
    await openLesson(t, m, 'math110.0.0');
    expect(key('practice-block'), findsOneWidget);
    expect(key('pr-sol-p3'), findsNothing);
    expect(find.textContaining('Add the first components'), findsNothing);
    await type(t, key('pr-in-p3'), '(1,-1)');
    await tap(t, key('pr-check-p3'));
    expect(key('pr-sol-p3'), findsOneWidget);
    expect(find.textContaining('Add the first components'), findsOneWidget);
    for (final mm in ['ok', 'partly', 'missed']) {
      expect(key('pr-mark-$mm-p3'), findsOneWidget);
      expect(t.getSize(key('pr-mark-$mm-p3')).height, greaterThanOrEqualTo(44));
      expect(t.getSize(key('pr-mark-$mm-p3')).width, greaterThanOrEqualTo(44));
    }
    await tap(t, key('pr-mark-missed-p3'));
    expect(key('pr-marked-p3'), findsOneWidget);
    expect(m.engine.review.containsKey('p:math110.0.0:p3'), isTrue);
  });

  testWidgets('a lecture not yet watched has no Practice block', (t) async {
    final m = await model();
    await openLesson(t, m, 'math110.0.0');
    expect(key('practice-block'), findsNothing);
  });

  testWidgets('a numeric answer: Check grades it; the unaided count moves', (t) async {
    final m = await model(state: watched(['math110.0.0']));
    await openLesson(t, m, 'math110.0.0');
    expect(t.widget<Text>(key('practice-unaided')).data, '0 of 1 problems unaided');
    await type(t, key('pr-in-p1'), '1');
    await tap(t, key('pr-check-p1'));
    expect(key('pr-v-p1'), findsOneWidget);
    expect(find.text('Right'), findsOneWidget);
    expect(t.widget<Text>(key('practice-unaided')).data, '1 of 1 problems unaided');
    expect(find.text('Practice · 1 of 3 solved'), findsOneWidget);
  });

  testWidgets('a written answer: the key points and the model answer stay hidden under 80 characters', (t) async {
    final m = await model(state: watched(['ai200.0.0']));
    await openLesson(t, m, 'ai200.0.0');
    final short = 'Neurons add up weighted inputs and a bias.';
    expect(short.length, lessThan(WRITE_MIN));
    await type(t, key('pr-in-p1'), short);
    expect(t.widget<Text>(key('pr-len-p1')).data, '${short.length} / 80');
    await tap(t, key('pr-check-p1'));
    expect(find.text('At least 80 characters: a real attempt first.'), findsOneWidget);
    expect(key('pr-sol-p1'), findsNothing);
    expect(find.text('KEY POINTS'), findsNothing);
    expect(m.engine.practiceOf('ai200.0.0', 'p1'), isNull);
    await type(t, key('pr-in-p1'), longAnswer);
    await tap(t, key('pr-check-p1'));
    expect(key('pr-sol-p1'), findsOneWidget);
    expect(find.text('KEY POINTS'), findsOneWidget);
    expect(find.text('MODEL ANSWER'), findsOneWidget);
    await tap(t, key('pr-tick-0-p1'));
    expect(m.engine.practiceOf('ai200.0.0', 'p1')!['ticks'], [true]);
  });

  testWidgets('Grade with Claude sends exactly one request: the allowed headers and body keys, the stub key, nothing else', (t) async {
    final claude = FakeClaude((_) => graded({'points': [{'point': 'Weighted sum', 'verdict': 'met'}, {'point': 'Bias', 'verdict': 'odd'}], 'correction': 'Say what the bias does.'}));
    final m = await model(state: watched(['ai200.0.0']), claude: claude);
    await openLesson(t, m, 'ai200.0.0');
    await type(t, key('pr-in-p1'), longAnswer);
    await tap(t, key('pr-check-p1'));
    await tap(t, key('pr-grade-p1'));
    expect(claude.requests, hasLength(1));
    final req = claude.requests.single;
    expect(req.method, 'POST');
    expect(req.url.toString(), 'https://api.anthropic.com/v1/messages');
    expect({for (final e in req.headers.entries) e.key.toLowerCase(): e.value}, {
      'content-type': 'application/json',
      'x-api-key': stubKey,
      'anthropic-version': '2026-10-21',
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
    });
    final b = jsonDecode(req.body) as Map<String, dynamic>;
    expect(b.keys.toSet(), {'model', 'max_tokens', 'system', 'messages', 'output_config', 'fallbacks'});
    expect(b['model'], 'claude-opus-5-5');
    expect(b['fallbacks'], 'default');
    expect(b['max_tokens'], 1024);
    expect(b['output_config'], {'format': {'type': 'json_schema', 'schema': AI_SCHEMA}});
    final msgs = b['messages'] as List;
    expect(msgs, hasLength(1));
    expect(msgs.single['role'], 'user');
    final content = jsonDecode(msgs.single['content'] as String) as Map<String, dynamic>;
    expect(content.keys.toSet(), {'question', 'key_points', 'answer'});
    expect(content['answer'], longAnswer);
    expect(content['key_points'], m.engine.practiceItems('ai200.0.0')[0]['points']);
    expect(req.body, isNot(contains(stubKey)), reason: 'the key is a header, never in the body');
    // The verdicts are shown and stored (an unknown verdict reads as missing), with the correction.
    expect(find.text('Correction: Say what the bias does.'), findsOneWidget);
    final g = m.engine.practiceOf('ai200.0.0', 'p1')!['grade'] as Map;
    expect(g['points'], [{'point': 'Weighted sum', 'verdict': 'met'}, {'point': 'Bias', 'verdict': 'missing'}]);
    expect(find.text('GRADE AGAIN'), findsOneWidget);
  });

  testWidgets('a refusal falls back to self-check in one line, stores nothing, and the marks stay', (t) async {
    final claude = FakeClaude((_) => http.Response(jsonEncode({'stop_reason': 'refusal', 'content': []}), 200));
    final m = await model(state: watched(['ai200.0.0']), claude: claude);
    await openLesson(t, m, 'ai200.0.0');
    await type(t, key('pr-in-p1'), longAnswer);
    await tap(t, key('pr-check-p1'));
    await tap(t, key('pr-grade-p1'));
    expect(claude.requests, hasLength(1));
    expect(t.widget<Text>(key('pr-msg-p1')).data, 'Claude could not grade this (declined): self-check above.');
    expect(m.engine.practiceOf('ai200.0.0', 'p1')!['grade'], isNull);
    expect(key('pr-sol-p1'), findsOneWidget);
    expect(key('pr-mark-ok-p1'), findsOneWidget);
  });

  testWidgets('an API error, no key and offline each fall back the same way; the last two send nothing', (t) async {
    final claude = FakeClaude((_) => http.Response(jsonEncode({'type': 'error', 'error': {'type': 'overloaded_error', 'message': 'Overloaded'}}), 529));
    final m = await model(state: watched(['ai200.0.0']), claude: claude);
    await openLesson(t, m, 'ai200.0.0');
    await type(t, key('pr-in-p1'), longAnswer);
    await tap(t, key('pr-check-p1'));
    await tap(t, key('pr-grade-p1'));
    expect(t.widget<Text>(key('pr-msg-p1')).data, 'Claude could not grade this (Overloaded): self-check above.');
    expect(claude.requests, hasLength(1));
    m.forgetAiKey();
    await t.pumpAndSettle();
    await m.practiceGrade('ai200.0.0', m.engine.practiceItems('ai200.0.0')[0]);
    await t.pumpAndSettle();
    expect(t.widget<Text>(key('pr-msg-p1')).data, noKeySay);
    expect(claude.requests, hasLength(1));
    final off = await model(state: watched(['ai200.0.0']), claude: claude, offline: () => true);
    off.practiceAnswer('ai200.0.0', off.engine.practiceItems('ai200.0.0')[0], longAnswer);
    await off.practiceGrade('ai200.0.0', off.engine.practiceItems('ai200.0.0')[0]);
    expect(off.practiceMsg['ai200.0.0/p1'], offlineSay);
    expect(claude.requests, hasLength(1));
  });

  test('readGrade: a refusal, an HTTP error, a body that is not JSON and a wrong shape each give a reason, never a grade', () {
    expect(readGrade(200, jsonEncode({'stop_reason': 'refusal'})).why, 'declined');
    expect(readGrade(401, jsonEncode({'error': {'message': 'invalid x-api-key'}})).why, 'invalid x-api-key');
    expect(readGrade(500, 'not json').why, 'HTTP 500');
    expect(readGrade(200, jsonEncode({'content': [{'type': 'text', 'text': '{"points": 3}'}]})).why, 'an answer in the wrong shape');
    expect(readGrade(200, jsonEncode({'content': []})).why, 'an answer in the wrong shape');
    expect(gradeFailSay('x' * 100), 'Claude could not grade this (${'x' * 80}): self-check above.');
  });

  testWidgets('the key is saved on the device, never shown back, and never in S', (t) async {
    final m = await model(key: false);
    expect(m.hasAiKey, isFalse);
    expect(m.saveAiKey('  '), 'Paste the key first.');
    expect(m.saveAiKey(stubKey), isNull);
    expect(m.prefs.getString(AI_KEY), stubKey);
    expect(jsonEncode(m.engine.S), isNot(contains(stubKey)));
    expect(encodePayload(syncPayload(m.engine)), isNot(contains(stubKey)));
  });
}
