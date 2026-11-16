import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'history_go_stub.dart' if (dart.library.js_interop) 'history_go_web.dart';

/// T-076: one browser history entry per page, so a back swipe goes to the
/// page before this one.
///
/// Flutter's plain Navigator keeps the browser on ONE history entry: every
/// page shares it, and the entry behind it was last on screen while the
/// boot splash was showing. On an iPhone the edge swipe is Safari's own
/// history gesture, and it draws the entry it is going back to from a
/// snapshot, so a back swipe from any page slid in the intro screen
/// (owner's screenshot, 16 Nov), never the page before.
///
/// So, once the real app is on screen, the engine is switched to its
/// multi-entry history and every page route gets an entry of its own, pushed
/// while that page is opening (Safari keeps a snapshot of each entry as it
/// is left, which is then the right page). The entry's state is its depth:
/// 0 is the shell, 1 the first page pushed on it, and so on.
///   - A back swipe, the browser's Back, or Forward: the engine reports the
///     depth it landed on as pushRouteInformation; the pages above that depth
///     are removed at once, with no animation of Flutter's own (the browser
///     has already animated it; T-077), and a sheet or dialog over them goes
///     too. Forward to a page
///     that is gone is undone with history.go.
///   - A page closed in the app (its back button, a pop after an action, the
///     iOS edge gesture inside the app): history.go(-n) rewinds the browser
///     by the same number of pages, and the echo it causes is ignored.
/// Sheets and dialogs get no entry of their own; only PageRoutes count.
///
/// [observer] must be added to the binding before any MaterialApp exists:
/// the binding asks its observers in the order they were added, and a
/// WidgetsApp would otherwise answer pushRouteInformation itself by pushing
/// a named route this app does not have.
class WebHistory extends NavigatorObserver with WidgetsBindingObserver {
  WebHistory({this.enabled = kIsWeb, void Function(int delta)? go, Future<void> Function()? selectMulti, Future<void> Function(int depth)? report})
      : _go = go ?? historyGo,
        _selectMulti = selectMulti ?? SystemNavigator.selectMultiEntryHistory,
        _report = report ?? ((d) => SystemNavigator.routeInformationUpdated(uri: Uri.parse('/'), state: d));

  final bool enabled;
  final void Function(int delta) _go;
  final Future<void> Function() _selectMulti;
  final Future<void> Function(int depth) _report;

  /// The page routes on the navigator, bottom first: [0] is the shell.
  final List<Route<dynamic>> pages = [];

  /// The depth the browser's current entry stands for.
  int reported = 0;
  bool ready = false;
  bool _starting = false;
  bool _syncQueued = false;

  /// The depth an in-app rewind will land on: its popstate is ours, not the reader's.
  int? _echo;

  /// Popping because the browser moved: those pops must not move it again.
  bool _browserPop = false;

  int get depth => pages.length - 1;

  void _queueSync() {
    if (_syncQueued) return;
    _syncQueued = true;
    scheduleMicrotask(() {
      _syncQueued = false;
      sync();
    });
  }

  /// Brings the browser's entry to [depth]: one pushed entry per new page,
  /// or one history.go back over the pages closed in the app.
  @visibleForTesting
  void sync() {
    if (!ready || pages.isEmpty) return;
    while (reported < depth) {
      reported++;
      _report(reported);
    }
    if (reported > depth) {
      final n = reported - depth;
      reported = depth;
      _echo = depth;
      _go(-n);
    }
  }

  Future<void> _start() async {
    if (_starting || !enabled) return;
    _starting = true;
    await _selectMulti();
    // The entry the app is on becomes depth 0 (the shell), with the state the
    // engine will hand back when the reader returns to it.
    await SystemNavigator.routeInformationUpdated(uri: Uri.parse('/'), state: 0, replace: true);
    ready = true;
    sync();
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    if (!enabled || route is! PageRoute) return;
    pages.add(route);
    if (pages.length == 1) {
      // The shell's own route: start once it has drawn, so the engine has
      // already set up the single-entry history the Navigator asks for.
      WidgetsBinding.instance.addPostFrameCallback((_) => _start());
      return;
    }
    _queueSync();
  }

  void _gone(Route<dynamic> route) {
    if (!enabled || route is! PageRoute) return;
    if (!pages.remove(route)) return;
    if (_browserPop) {
      reported = depth;
    } else {
      _queueSync();
    }
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) => _gone(route);

  @override
  void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) => _gone(route);

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    if (!enabled) return;
    final i = oldRoute == null ? -1 : pages.indexOf(oldRoute);
    if (i < 0) return;
    if (newRoute is PageRoute) {
      pages[i] = newRoute;
    } else {
      pages.removeAt(i);
      _queueSync();
    }
  }

  @override
  Future<bool> didPushRouteInformation(RouteInformation routeInformation) async {
    if (!enabled || !ready) return false;
    final s = routeInformation.state;
    final to = s is num ? s.toInt() : null;
    if (to == null) return true;                 // not one of ours: nothing to do, and no named route to push
    if (_echo == to) {
      _echo = null;
      return true;
    }
    if (to < depth) {
      final nav = navigator;
      final target = to >= 0 ? pages[to] : null;
      if (nav != null && target != null) {
        _browserPop = true;
        try {
          // T-077: no second animation. The browser has already animated
          // this (an iPhone's swipe slides the page away itself), so a pop
          // here replayed Flutter's own 300 ms slide on top of it, the page
          // before sliding in a second time. A sheet or dialog over the
          // page is popped first; then the pages above [target] are removed,
          // which takes them off at once.
          nav.popUntil((r) => r is PageRoute);
          for (final p in pages.sublist(to + 1).reversed.toList()) {
            nav.removeRoute(p);
          }
        } finally {
          _browserPop = false;
        }
      }
      reported = depth;
    } else if (to > depth) {
      // Forward onto a page that has been closed: back to where the app is.
      reported = to;
      _queueSync();
    }
    return true;
  }
}
