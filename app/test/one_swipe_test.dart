// T-078: on the web the page routes slide like iOS but carry no edge-swipe
// gesture of their own (Safari's swipe is the one that goes back).
import 'package:app/theme/theme.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Future<GlobalKey<NavigatorState>> app(WidgetTester t, PageTransitionsTheme pt) async {
    final nav = GlobalKey<NavigatorState>();
    await t.pumpWidget(MaterialApp(
      navigatorKey: nav,
      theme: ThemeData(platform: TargetPlatform.iOS, pageTransitionsTheme: pt),
      home: const Scaffold(body: Text('shell')),
    ));
    nav.currentState!.push(MaterialPageRoute<void>(builder: (_) => const Scaffold(body: Center(child: Text('page')))));
    await t.pumpAndSettle();
    return nav;
  }

  Future<void> edgeSwipe(WidgetTester t) async {
    final g = await t.startGesture(const Offset(2, 300));
    for (var i = 0; i < 20; i++) {
      await g.moveBy(const Offset(20, 0));
      await t.pump(const Duration(milliseconds: 16));
    }
    await g.up();
    await t.pumpAndSettle();
  }

  testWidgets('control: Flutter\'s own iOS route closes on an edge swipe', (t) async {
    await app(t, const PageTransitionsTheme(builders: {TargetPlatform.iOS: CupertinoPageTransitionsBuilder()}));
    await edgeSwipe(t);
    expect(find.text('page'), findsNothing);
  });

  testWidgets('the web routes ignore it: the browser\'s swipe is the only one', (t) async {
    await app(t, webPageTransitions);
    await edgeSwipe(t);
    expect(find.text('page'), findsOneWidget);
  });

  testWidgets('the web routes still slide: half-way through a push the page is off to the right', (t) async {
    final nav = GlobalKey<NavigatorState>();
    await t.pumpWidget(MaterialApp(navigatorKey: nav, theme: ThemeData(platform: TargetPlatform.iOS, pageTransitionsTheme: webPageTransitions), home: const Scaffold(body: Text('shell'))));
    nav.currentState!.push(MaterialPageRoute<void>(builder: (_) => const Scaffold(body: Center(child: Text('page')))));
    await t.pump();
    await t.pump(const Duration(milliseconds: 150));
    final mid = t.getCenter(find.text('page')).dx;
    await t.pumpAndSettle();
    expect(mid, greaterThan(t.getCenter(find.text('page')).dx + 20));
  });
}
