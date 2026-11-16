// T-076: WebHistory keeps one browser history entry per page (see
// lib/state/web_history.dart). These drive it with a fake browser.
import 'package:app/state/web_history.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late List<int> went, reported;
  late WebHistory h;
  late GlobalKey<NavigatorState> nav;

  Future<void> pumpApp(WidgetTester t) async {
    went = [];
    reported = [];
    nav = GlobalKey<NavigatorState>();
    h = WebHistory(enabled: true, repaintFrames: 0, go: went.add, selectMulti: () async {}, report: (d) async => reported.add(d));
    await t.pumpWidget(MaterialApp(navigatorKey: nav, navigatorObservers: [h], home: const Text('shell')));
    h.ready = true;  // what _start does on the web once the engine answers
    await t.pump();
  }

  Future<void> push(WidgetTester t, String name) async {
    nav.currentState!.push(MaterialPageRoute<void>(builder: (_) => Text(name)));
    await t.pumpAndSettle();
  }

  testWidgets('each page pushed gets an entry of its own, at its depth', (t) async {
    await pumpApp(t);
    await push(t, 'week');
    await push(t, 'guide');
    expect(h.depth, 2);
    expect(reported, [1, 2]);
    expect(went, isEmpty);
  });

  testWidgets('a page closed in the app rewinds the browser by one, and its echo is ignored', (t) async {
    await pumpApp(t);
    await push(t, 'week');
    nav.currentState!.pop();
    await t.pumpAndSettle();
    expect(went, [-1]);
    expect(await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0)), isTrue);
    expect(find.text('shell'), findsOneWidget);
    expect(h.depth, 0);
  });

  testWidgets('Back (a swipe) closes pages down to the depth it landed on, without moving the browser again', (t) async {
    await pumpApp(t);
    await push(t, 'library');
    await push(t, 'guide');
    expect(await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 1)), isTrue);
    await t.pumpAndSettle();
    expect(find.text('library'), findsOneWidget);
    expect(h.depth, 1);
    expect(went, isEmpty);
    expect(await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0)), isTrue);
    await t.pumpAndSettle();
    expect(find.text('shell'), findsOneWidget);
    expect(went, isEmpty);
  });

  testWidgets('a page closed by the browser goes at once, with no slide of its own (T-077)', (t) async {
    await pumpApp(t);
    await push(t, 'library');
    await push(t, 'guide');
    await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0));
    await t.pump();  // one frame: no 300 ms transition to wait for
    expect(find.text('guide'), findsNothing);
    expect(find.text('library'), findsNothing);
    expect(find.text('shell'), findsOneWidget);
    // The page underneath is already where it rests, not sliding in from the left.
    final x0 = t.getTopLeft(find.text('shell')).dx;
    await t.pumpAndSettle();
    expect(t.getTopLeft(find.text('shell')).dx, x0);
  });

  testWidgets('a gesture still counted when the browser goes back is cleared: the page landed on answers a tap (T-078)', (t) async {
    // The owner's frozen page after a swipe. Whatever left it (a swipe the app
    // began and Safari took over, whose end the app never heard), a gesture
    // still counted by the navigator makes every page ignore the pointer.
    went = [];
    reported = [];
    nav = GlobalKey<NavigatorState>();
    h = WebHistory(enabled: true, repaintFrames: 0, go: went.add, selectMulti: () async {}, report: (d) async => reported.add(d));
    var taps = 0;
    await t.pumpWidget(MaterialApp(
      navigatorKey: nav,
      navigatorObservers: [h],
      home: Scaffold(body: Center(child: TextButton(onPressed: () => taps++, child: const Text('shell')))),
    ));
    h.ready = true;
    await push(t, 'week');
    nav.currentState!.didStartUserGesture();                  // begun, never ended
    await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0));
    await t.pumpAndSettle(const Duration(milliseconds: 100), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 3));
    expect(nav.currentState!.userGestureInProgress, isFalse);
    await t.tap(find.text('shell'));
    expect(taps, 1, reason: 'the page landed on answers a tap');
  });

  testWidgets('after the browser moves the app draws ten frames over a second, so Safari drops its snapshot (T-078)', (t) async {
    await pumpApp(t);
    final r = WebHistory(enabled: true, go: went.add, selectMulti: () async {}, report: (d) async {});
    await t.pumpWidget(MaterialApp(navigatorKey: GlobalKey<NavigatorState>(), navigatorObservers: [r], home: const Text('shell2')));
    r.ready = true;
    r.navigator!.push(MaterialPageRoute<void>(builder: (_) => const Text('week')));
    await t.pumpAndSettle();
    await r.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0));
    await t.pump(const Duration(milliseconds: 1100));
    expect(r.repainted, 10);
  });

  testWidgets('a sheet over a page closes with it', (t) async {
    await pumpApp(t);
    await push(t, 'week');
    showModalBottomSheet<void>(context: nav.currentContext!, builder: (_) => const Text('sheet'));
    await t.pumpAndSettle();
    expect(h.depth, 1, reason: 'a sheet has no entry');
    await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0));
    await t.pumpAndSettle();
    expect(find.text('sheet'), findsNothing);
    expect(find.text('shell'), findsOneWidget);
  });

  testWidgets('Forward onto a closed page goes back to where the app is', (t) async {
    await pumpApp(t);
    await push(t, 'week');
    nav.currentState!.pop();
    await t.pumpAndSettle();
    await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0));  // the echo
    went.clear();
    expect(await h.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 1)), isTrue);
    await t.pump();
    expect(went, [-1]);
    expect(find.text('shell'), findsOneWidget);
  });

  testWidgets('off the web it does nothing at all', (t) async {
    went = [];
    final off = WebHistory(enabled: false, go: went.add, selectMulti: () async {}, report: (_) async {});
    final key = GlobalKey<NavigatorState>();
    await t.pumpWidget(MaterialApp(navigatorKey: key, navigatorObservers: [off], home: const Text('shell')));
    key.currentState!.push(MaterialPageRoute<void>(builder: (_) => const Text('week')));
    await t.pumpAndSettle();
    expect(off.pages, isEmpty);
    expect(await off.didPushRouteInformation(RouteInformation(uri: Uri.parse('/'), state: 0)), isFalse);
  });
}
