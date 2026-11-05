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
import 'theme/theme.dart';
import 'theme/tokens.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // The fonts are bundled (assets/fonts/, OFL): nothing is fetched, so the app
  // renders the same with no connection.
  GoogleFonts.config.allowRuntimeFetching = false;
  final data = await AppModel.loadData(rootBundle);
  final prefs = await SharedPreferences.getInstance();
  runApp(BrickfordApp(model: AppModel(data, prefs)));
}

/// The phone column: the design is 375x812, so a wide window shows it at most
/// [maxWidth] wide, centred, rather than scaling every measure up 3x.
const maxWidth = 480.0;

class BrickfordApp extends StatelessWidget {
  const BrickfordApp({super.key, required this.model});
  final AppModel model;

  @override
  Widget build(BuildContext context) {
    final mq = MediaQueryData.fromView(View.of(context));
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
              child: ScreenUtilInit(
                designSize: const Size(375, 812),
                minTextAdapt: true,
                builder: (context, _) => MaterialApp(
                  title: 'Brickford',
                  debugShowCheckedModeBanner: false,
                  theme: brickfordTheme(),
                  home: const Shell(),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
