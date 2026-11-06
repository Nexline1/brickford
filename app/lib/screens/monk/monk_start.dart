// Starting Monk Mode (T-065): platform/js/app.js's Start button, V.monk's
// not-started page and monkStartSheet, in the app's design.
//
// Starting is irreversible and the date syncs, so a tap cannot do it. The
// sheet says what it costs ("21 days. Day 1 is today (<date>). This can't be
// undone or reset."), wants a tick, and then its last button must be PRESSED
// AND HELD for [monkHold]: the pointer, or Space/Enter on a keyboard. The fill
// is the wait; letting go, sliding off the button, losing focus, backgrounding
// the app or closing the sheet puts it back. A tap does nothing.
//
// Until it is started the Monk screen is [MonkStartScreen]: 21 empty days and
// the one Start button, with no day number, score or plan.
import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import 'monk_screen.dart' show mkNice;

/// How long the last button is held (app.js MONK_HOLD).
const monkHold = Duration(milliseconds: 1500);

/// The start sheet (app.js monkStartSheet). Does nothing once Monk is started.
Future<void> openMonkStart(BuildContext context) {
  final m = AppScope.of(context);
  if (m.monkFrom != null) return Future<void>.value();
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    builder: (sheet) => _StartSheet(
      model: m,
      onStarted: () {
        Navigator.of(sheet).pop();
        m.startMonk();
      },
      onCancel: () => Navigator.of(sheet).pop(),
    ),
  );
}

/// The Monk screen until the owner starts it: one clear button over 21 empty days.
class MonkStartScreen extends StatelessWidget {
  const MonkStartScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Tokens.midnight,
    body: SheetScaffold(
      header: Text('Monk Mode', key: const ValueKey('monk-start-head'), style: display(26)),
      onBack: () => Navigator.of(context).pop(),
      children: [
        SheetLabel(Icons.grid_view_rounded, '${Engine.MONK.days} days'),
        const _EmptyMap(),
        SizedBox(height: 18.h),
        PillButton(
          key: const ValueKey('monk-start'),
          id: 'monk-start',
          icon: Icons.self_improvement,
          label: 'Start Monk Mode',
          onPressed: () => openMonkStart(context),
        ),
      ],
    ),
  );
}

/// The 21 days, three weeks of seven, all empty (app.js: 21 `.hc` cells and no dates).
class _EmptyMap extends StatelessWidget {
  const _EmptyMap();

  @override
  Widget build(BuildContext context) {
    final weeks = (Engine.MONK.days / 7).ceil();
    return ExcludeSemantics(
      child: Column(
        key: const ValueKey('monk-start-map'),
        children: [
          for (var c = 0; c < weeks; c++)
            Padding(
              padding: EdgeInsets.only(bottom: 6.h),
              child: Row(
                children: [
                  for (var r = 0; r < 7; r++)
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 3),
                        child: AspectRatio(
                          aspectRatio: 1,
                          child: DecoratedBox(
                            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _StartSheet extends StatefulWidget {
  const _StartSheet({required this.model, required this.onStarted, required this.onCancel});
  final AppModel model;
  final VoidCallback onStarted, onCancel;

  @override
  State<_StartSheet> createState() => _StartSheetState();
}

class _StartSheetState extends State<_StartSheet> {
  bool ack = false;

  @override
  Widget build(BuildContext context) {
    final today = widget.model.today;
    return Padding(
      padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 24.h + MediaQuery.viewInsetsOf(context).bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Start Monk Mode', style: body(17, weight: FontWeight.w800)),
          SizedBox(height: 6.h),
          Text(
            "${Engine.MONK.days} days. Day 1 is today (${mkNice(today)}). This can't be undone or reset.",
            key: const ValueKey('monk-start-lede'),
            style: body(13.5, color: Tokens.ink2, height: 1.4),
          ),
          SizedBox(height: 12.h),
          Semantics(
            identifier: 'monk-start-ack',
            container: true,
            checked: ack,
            label: "I understand it can't be reset",
            onTap: () => setState(() => ack = !ack),
            excludeSemantics: true,
            child: InkWell(
              key: const ValueKey('monk-start-ack'),
              onTap: () => setState(() => ack = !ack),
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 48),
                child: Row(
                  children: [
                    Icon(ack ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded, color: ack ? Tokens.accent : Tokens.quiet),
                    SizedBox(width: 12.w),
                    Expanded(child: Text("I understand it can't be reset", style: body(14.5, weight: FontWeight.w600))),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(height: 14.h),
          Row(
            children: [
              Expanded(
                flex: 2,
                child: PillButton(key: const ValueKey('monk-start-cancel'), label: 'Cancel', tone: PillTone.quiet, onPressed: widget.onCancel),
              ),
              SizedBox(width: 10.w),
              Expanded(
                flex: 3,
                child: MonkHoldButton(key: const ValueKey('monk-start-hold'), enabled: ack, onHeld: widget.onStarted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// A button that is held, not tapped (app.js's `.mk-hold`). [onHeld] fires once, when the fill reaches the
/// end of [monkHold] with the press unbroken. Disabled it does nothing, and a press that is let go, slides
/// off the button, loses focus or is interrupted puts the fill back to nothing.
class MonkHoldButton extends StatefulWidget {
  const MonkHoldButton({super.key, required this.enabled, required this.onHeld, this.duration = monkHold});
  final bool enabled;
  final VoidCallback onHeld;
  final Duration duration;

  @override
  State<MonkHoldButton> createState() => _MonkHoldButtonState();
}

class _MonkHoldButtonState extends State<MonkHoldButton> with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  // The wait is a timer from the press, the fill only shows it (app.js: setTimeout beside the animation), so the
  // decision does not depend on how many frames a slow phone drew.
  late final AnimationController _fill = AnimationController(vsync: this, duration: widget.duration);
  Timer? _timer;
  bool _holding = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    _fill.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(MonkHoldButton old) {
    super.didUpdateWidget(old);
    if (!widget.enabled) _stop();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed) _stop();
  }

  void _begin() {
    if (_holding || !widget.enabled) return;
    _holding = true;
    _fill.forward(from: 0);
    _timer = Timer(widget.duration, () {
      _stop();
      widget.onHeld();
    });
  }

  void _stop() {
    _holding = false;
    _timer?.cancel();
    _timer = null;
    if (_fill.isAnimating || _fill.value != 0) {
      _fill.stop();
      _fill.value = 0;
    }
  }

  bool _inside(PointerEvent e) {
    final box = context.findRenderObject();
    return box is RenderBox && (Offset.zero & box.size).contains(e.localPosition);
  }

  @override
  Widget build(BuildContext context) {
    final on = widget.enabled;
    final label = Text(
      'HOLD TO START',
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: body(13.5, color: on ? Tokens.onPrimary : Tokens.ink2, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
    );
    return Semantics(
      identifier: 'monk-start-hold',
      button: true,
      enabled: on,
      label: 'Hold to start',
      excludeSemantics: true,
      child: Focus(
        canRequestFocus: on,
        onFocusChange: (f) {
          if (!f) _stop();
        },
        onKeyEvent: (node, e) {
          final k = e.logicalKey;
          if (k != LogicalKeyboardKey.space && k != LogicalKeyboardKey.enter) return KeyEventResult.ignored;
          if (e is KeyDownEvent) _begin();
          if (e is KeyUpEvent) _stop();
          return KeyEventResult.handled;
        },
        child: Listener(
          behavior: HitTestBehavior.opaque,
          onPointerDown: (e) {
            if (e.buttons & kPrimaryButton != 0) _begin();
          },
          onPointerMove: (e) {
            if (_holding && !_inside(e)) _stop();
          },
          onPointerUp: (_) => _stop(),
          onPointerCancel: (_) => _stop(),
          child: ClipRRect(
            borderRadius: const BorderRadius.all(Radius.circular(Tokens.radius)),
            child: Container(
              height: 52,
              color: on ? Tokens.primary : Tokens.fieldFill,
              alignment: Alignment.center,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // The sweep is a darker pass over the button, so the white label only gains contrast as it fills.
                  Positioned.fill(
                    child: AnimatedBuilder(
                      animation: _fill,
                      builder: (_, _) => Align(
                        alignment: Alignment.centerLeft,
                        child: FractionallySizedBox(
                          key: const ValueKey('monk-start-fill'),
                          widthFactor: _fill.value,
                          heightFactor: 1,
                          child: const ColoredBox(color: Color(0x4D000000)),
                        ),
                      ),
                    ),
                  ),
                  label,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
