// The app's state: the data, the engine over S, and S persisted in
// shared_preferences under the web app's key, in the web app's shape
// (lessons[k] = {done, doneAt, firstDoneAt, quiz, ...}), so the sync stage
// can merge the two with the web app's mergeState rules unchanged.
import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../engine/engine.dart';

class AppModel extends ChangeNotifier {
  /// [today] fixes the clock (tests, screenshots); the default is the device's local date.
  AppModel(this.data, this.prefs, {String Function()? today}) : engine = Engine(data, _load(prefs), today: today);

  static const storageKey = 'darhikmah_v1';

  final BrickfordData data;
  final SharedPreferences prefs;
  final Engine engine;

  static Map<String, dynamic>? _load(SharedPreferences prefs) {
    final raw = prefs.getString(storageKey);
    if (raw == null) return null;
    try {
      final v = jsonDecode(raw);
      return v is Map ? v.cast<String, dynamic>() : null;
    } catch (_) {
      return null;
    }
  }

  static Future<BrickfordData> loadData(AssetBundle bundle) async {
    final text = <String, String>{};
    for (final f in BrickfordData.files) {
      // load + utf8.decode, not loadString: loadString decodes anything over
      // 50 KB on a compute() isolate, which never completes inside a widget
      // test's fake clock (and buys nothing for a one-off read at launch).
      final bytes = await bundle.load('assets/data/$f');
      text[f] = utf8.decode(bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes));
    }
    return BrickfordData.fromText(text);
  }

  Future<void> _save() => prefs.setString(storageKey, jsonEncode(engine.S));

  Map<String, dynamic> lesson(String k) {
    final v = engine.lessons[k];
    return v is Map ? v.cast<String, dynamic>() : const {};
  }

  LessonMark markOf(String k) {
    if (engine.lessonCleared(k)) return LessonMark.cleared;
    if (truthy(lesson(k)['done'])) return LessonMark.watched;
    return LessonMark.none;
  }

  /// Mark watched / unmark (the web app's toggleDone).
  void toggleDone(String k) {
    engine.toggleDone(k);
    _save();
    notifyListeners();
  }

  /// The lesson page records itself as the one to resume, only when it changed
  /// (the web app's rule: a render is a read; this runs once, on open).
  void openedLesson(String cid, int ui, int li, String label) {
    final was = engine.settings['lastLesson'];
    if (was is Map && was['cid'] == cid && was['ui'] == ui && was['li'] == li && was['label'] == label) return;
    engine.settings['lastLesson'] = {'cid': cid, 'ui': ui, 'li': li, 'label': label};
    _save();
  }
}

enum LessonMark { none, watched, cleared }

class AppScope extends InheritedNotifier<AppModel> {
  const AppScope({super.key, required AppModel model, required super.child}) : super(notifier: model);

  static AppModel of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<AppScope>()!.notifier!;
}
