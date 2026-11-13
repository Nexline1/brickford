// Brickford, the Flutter app (T-064). platform/ is the live web app; this is
// its port, stage 1: data, engine, Home and the lesson page.
import 'dart:async';
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
  // T-072: google_fonts loads a face the first time a style asks for it, so the
  // first frame of anything painted before then is in the engine's fallback
  // (Roboto), and reflows a moment later. The splash waits for its two faces,
  // and the app for the faces Home draws, before either is shown.
  await fontsReady(splashFonts);
  // The crest lockup while the plan is read (web/index.html's #boot paints the
  // same lockup before the engine is up and fades out over it).
  final app = Completer<Widget>();
  runApp(BootApp(app: app.future));
  final data = await AppModel.loadData(rootBundle);
  final prefs = await SharedPreferences.getInstance();
  await fontsReady(shellFonts);
  app.complete(BrickfordApp(model: AppModel(data, prefs, saveDelay: const Duration(milliseconds: 400))));
}

/// The faces the splash draws: BRICKFORD and SELF-BUILT UNIVERSITY.
List<TextStyle> splashFonts() => [GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700), GoogleFonts.inter(fontWeight: FontWeight.w600)];

/// The faces Home draws on its first frame (tools/boot-files.js lists the same files).
List<TextStyle> shellFonts() => [
      GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700),
      for (final w in const [FontWeight.w400, FontWeight.w500, FontWeight.w600, FontWeight.w700, FontWeight.w800]) GoogleFonts.inter(fontWeight: w),
    ];

/// Asks google_fonts for [styles] (building a style starts its load) and waits
/// for them. A face that fails or hangs must never hold the app, so this gives
/// up after 8 s and the text falls back as it did before.
Future<void> fontsReady(List<TextStyle> Function() styles) async {
  try {
    styles();
    await GoogleFonts.pendingFonts().timeout(const Duration(seconds: 8));
  } catch (_) {}
}

/// How long the boot screens take to hand over: web/index.html's #boot fades
/// out over the splash in the same time (transition: opacity .25s).
const bootFade = Duration(milliseconds: 250);

/// The splash until [app] is ready, then one [bootFade] cross-fade to it.
class BootApp extends StatefulWidget {
  const BootApp({super.key, required this.app});
  final Future<Widget> app;
  @override
  State<BootApp> createState() => _BootAppState();
}

class _BootAppState extends State<BootApp> {
  Widget? _app;

  @override
  void initState() {
    super.initState();
    widget.app.then((a) {
      if (mounted) setState(() => _app = a);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: bootFade,
      layoutBuilder: (current, previous) => Stack(fit: StackFit.expand, alignment: Alignment.center, children: [...previous, ?current]),
      child: _app ?? const SplashApp(),
    );
  }
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
    // Anything not yet written goes to storage the moment the page is no longer the one in front
    // (inactive too: on an iPhone it is the last notice before the page can be frozen).
    if (state != AppLifecycleState.resumed) widget.sync.m.flush();
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
