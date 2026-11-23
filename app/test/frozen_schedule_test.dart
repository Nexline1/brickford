// T-074: the frozen schedule date and the first-watch timestamp, through the app model
// (loop/specs/T-074-frozen-schedule/spec.md). Parity with app.js is tools/verify-app.js's.
import 'dart:convert';

import 'package:app/engine/merge.dart';
import 'package:app/state/app_model.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  var clock = DateTime.utc(2026, 11, 25, 12);
  var today = '2026-11-25';

  Future<AppModel> model(Map<String, dynamic> state) async {
    GoogleFonts.config.allowRuntimeFetching = false;
    SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
    final data = await AppModel.loadData(rootBundle);
    return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => clock);
  }

  Map<String, dynamic> storedLesson(AppModel m, String k) =>
      ((jsonDecode(m.prefs.getString(AppModel.storageKey)!) as Map)['lessons'] as Map)[k] as Map<String, dynamic>;

  setUp(() {
    clock = DateTime.utc(2026, 11, 25, 12);
    today = '2026-11-25';
  });

  test('mark, unmark, mark: firstDoneAt is the first mark, a full timestamp, byte for byte', () async {
    final m = await model({});
    const k = 'math110.0.0';
    m.toggleDone(k);
    final first = storedLesson(m, k)['firstDoneAt'];
    expect(first, '2026-11-25T12:00:00.000Z');
    clock = DateTime.utc(2026, 11, 25, 15, 30);
    m.toggleDone(k);
    expect(storedLesson(m, k)['done'], isFalse);
    expect(storedLesson(m, k).containsKey('doneAt'), isFalse);
    expect(storedLesson(m, k)['firstDoneAt'], first, reason: 'unmark never writes firstDoneAt');
    clock = DateTime.utc(2026, 11, 26, 8);
    today = '2026-11-26';
    m.toggleDone(k);
    expect(storedLesson(m, k)['firstDoneAt'], first, reason: 'a re-mark keeps the first');
    expect(storedLesson(m, k)['doneAt'], '2026-11-26');
  });

  test('boot freezes the due dates in memory, a legacy watch gains firstDoneAt, and a push keeps both', () async {
    final state = {
      'lessons': {
        'math110.0.0': {'done': true, 'doneAt': '2026-10-20', 'notes': 'kept', 'checks': <dynamic>[]},
      },
      'studyDays': ['2026-10-16'],
    };
    final m = await model(state);
    expect(m.prefs.getString(AppModel.storageKey), jsonEncode(state), reason: 'opening the app writes nothing');
    final l0 = (m.engine.lessons['math110.0.0'] as Map).cast<String, dynamic>();
    expect(l0['firstDoneAt'], '2026-10-20');
    expect(l0['doneAt'], '2026-10-20');
    expect(l0['notes'], 'kept');
    expect(l0['scheduledFor'], '2026-10-16');
    expect(m.sync.owed, isFalse, reason: 'the freeze arms no push');
    final sat = [
      for (final e in m.engine.lessons.values)
        if (e is Map && e['scheduledFor'] != null && DateTime.parse('${e['scheduledFor']}').weekday == DateTime.saturday) e,
    ];
    expect(sat, isEmpty);
    final p = syncPayload(m.engine)['state']['lessons'] as Map;
    expect((p['math110.0.0'] as Map)['scheduledFor'], '2026-10-16');
    expect((p['math110.0.0'] as Map)['firstDoneAt'], '2026-10-20');
  });
}
