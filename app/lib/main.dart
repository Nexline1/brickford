// Brickford, the Flutter app (T-064). platform/ is the live web app; this is
// its port, stage 1: data, engine, Home and the lesson page.
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'shell.dart';
import 'state/app_model.dart';
import 'state/sync.dart';
import 'theme/theme.dart';
import 'theme/tokens.dart';
import 'widgets/crest.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // The fonts are bundled (assets/fonts/, OFL): nothing is fetched, so the app
  // renders the same with no connection.
  GoogleFonts.config.allowRuntimeFetching = false;
  // The crest lockup while the plan is read (the web shell paints the same
  // lockup before the engine is up, so there is no blank frame between).
  runApp(const SplashApp());
  final data = await AppModel.loadData(rootBundle);
  final prefs = await SharedPreferences.getInstance();
  runApp(BrickfordApp(model: AppModel(data, prefs)));
}

/// The phone column: the design is 375x812, so a wide window shows it at most
/// [maxWidth] wide, centred, rather than scaling every measure up 3x.
const maxWidth = 480.0;

/// The splash: the crest, BRICKFORD and SELF-BUILT UNIVERSITY on midnight.
class SplashApp extends StatelessWidget {
  const SplashApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      builder: (context, _) => MaterialApp(
        title: 'Brickford',
        debugShowCheckedModeBanner: false,
        theme: brickfordTheme(),
        home: const Scaffold(
          key: ValueKey('splash'),
          backgroundColor: Tokens.midnight,
          body: Center(child: CrestLockup(height: 132)),
        ),
      ),
    );
  }
}

class BrickfordApp extends StatelessWidget {
  const BrickfordApp({super.key, required this.model});
  final AppModel model;

  @override
  Widget build(BuildContext context) {
    // fromView, not MediaQueryData.fromView(View.of(context)) once: that is read at build time and
    // never hears the view's metrics change, so the keyboard (viewInsets) and rotation stayed stale.
    return MediaQuery.fromView(
      view: View.of(context),
      child: Builder(
        builder: (context) {
          final mq = MediaQuery.of(context);
          final w = math.min(mq.size.width, maxWidth);
          return ColoredBox(
            color: Tokens.midnight,
            child: Center(
              child: SizedBox(
                width: w,
                child: MediaQuery(
                  data: mq.copyWith(size: Size(w, mq.size.height)),
                  child: AppScope(
                    model: model,
                    child: _SyncHooks(
                      sync: model.sync,
                      child: ScreenUtilInit(
                        designSize: const Size(375, 812),
                        minTextAdapt: true,
                        builder: (context, _) =>
                            MaterialApp(title: 'Brickford', debugShowCheckedModeBanner: false, theme: brickfordTheme(), home: const Shell()),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

/// The sync's boot pull and its foreground / background hooks (app.js: boot,
/// visibilitychange, pagehide). The page being read is not touched: the sync
/// reports on its own notifier.
class _SyncHooks extends StatefulWidget {
  const _SyncHooks({required this.sync, required this.child});
  final SyncService sync;
  final Widget child;
  @override
  State<_SyncHooks> createState() => _SyncHooksState();
}

class _SyncHooksState extends State<_SyncHooks> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    widget.sync.boot();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        widget.sync.onVisible();
      case AppLifecycleState.hidden || AppLifecycleState.paused || AppLifecycleState.detached:
        widget.sync.onHidden();
      case AppLifecycleState.inactive:
        break;
    }
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
