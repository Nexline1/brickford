// Proof (the "Verify a file" half of V.record): the head hash, the record as
// a file anyone can check, the anchors that give the chain a third party's
// timestamp, and the check of a record file. Timestamps inside the app are
// self-reported; an anchor is a head hash published somewhere with its own.
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart' show truthy;
import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart';
import '../../widgets/sheet_scaffold.dart';

void openProof(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ProofScreen()));

class ProofScreen extends StatefulWidget {
  const ProofScreen({super.key});
  @override
  State<ProofScreen> createState() => _ProofScreenState();
}

class _ProofScreenState extends State<ProofScreen> {
  final _where = TextEditingController(), _url = TextEditingController();
  String? result;
  bool resultOk = false;

  @override
  void dispose() {
    _where.dispose();
    _url.dispose();
    super.dispose();
  }

  Future<void> _copy(String text, String what) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (mounted) toast(context, what);
  }

  Future<void> _verifyClipboard() async {
    final d = await Clipboard.getData(Clipboard.kTextPlain);
    final r = verifyRecordText(d?.text ?? '');
    setState(() {
      result = r;
      resultOk = RegExp(r'^\d+ entries verify').hasMatch(r);
    });
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final led = e.ledger;
    final chain = e.verifyChain();
    final head = e.chainHead();

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Proof', key: const ValueKey('proof-title'), style: display(34)),
        SizedBox(height: 8.h),
        Row(
          children: [
            Icon(led.isEmpty ? Icons.shield_outlined : chain.ok ? Icons.verified_user : Icons.gpp_bad, size: 18, color: led.isEmpty ? Tokens.onMidnight2 : chain.ok ? Tokens.doneOnDark : const Color(0xFFFF8A8F)),
            SizedBox(width: 8.w),
            Text(
              led.isEmpty ? '0' : chain.ok ? '${led.length}' : 'broken at ${chain.brokenAt}',
              key: const ValueKey('proof-status'),
              style: body(15, color: Tokens.onMidnight, weight: FontWeight.w700),
            ),
          ],
        ),
      ],
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          if (led.isNotEmpty) ...[
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(14.w),
              decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
              child: SelectableText(head, key: const ValueKey('proof-head'), style: body(12.5, color: Tokens.ink, weight: FontWeight.w600).copyWith(fontFamily: 'monospace', letterSpacing: 0.2)),
            ),
            SizedBox(height: 10.h),
            Row(
              children: [
                Expanded(
                  child: PillButton(key: const ValueKey('proof-copy-head'), id: 'proof-copy-head', label: 'Head', icon: Icons.content_copy, tone: PillTone.quiet, onPressed: () => _copy(head, 'Head hash copied')),
                ),
                SizedBox(width: 10.w),
                Expanded(
                  child: PillButton(
                    key: const ValueKey('proof-copy-record'), id: 'proof-copy-record',
                    label: 'Record',
                    icon: Icons.ios_share,
                    tone: PillTone.quiet,
                    onPressed: () => _copy(const JsonEncoder.withIndent('  ').convert(e.recordBundle(isoStamp(m.now()))), 'Record copied: ${led.length} entries'),
                  ),
                ),
              ],
            ),
          ] else
            const Center(child: Icon(Icons.shield_outlined, size: 48, color: Tokens.quiet, semanticLabel: 'nothing sealed yet')),
          const SheetLabel(Icons.anchor, 'Anchors'),
          for (var i = e.anchors.length - 1; i >= 0; i--)
            ItemBlock(
              key: ValueKey('anchor-$i'),
              leading: const LeadTile(icon: Icons.anchor),
              title: () {
                final a = e.anchors[i] as Map;
                return '${truthy(a['where']) ? a['where'] : (truthy(a['url']) ? a['url'] : '—')}';
              }(),
              subtitle: '${(e.anchors[i] as Map)['date']} · ${e.shortHash('${(e.anchors[i] as Map)['head']}')}',
              below: Align(
                alignment: Alignment.centerRight,
                child: StepButton(key: ValueKey('anchor-del-$i'), id: 'anchor-del-$i', icon: Icons.delete_outline, tooltip: 'Remove anchor', onPressed: () => m.removeAnchor(i)),
              ),
            ),
          BrickfordField(key: const ValueKey('anchor-where'), id: 'anchor-where', icon: Icons.public, hint: 'Where published', controller: _where),
          SizedBox(height: 10.h),
          BrickfordField(key: const ValueKey('anchor-url'), id: 'anchor-url', icon: Icons.link, hint: 'Link', controller: _url, keyboardType: TextInputType.url),
          SizedBox(height: 10.h),
          PillButton(
            key: const ValueKey('anchor-add'), id: 'anchor-add',
            label: 'Anchor head',
            icon: Icons.anchor,
            onPressed: () {
              final err = m.addAnchor(_where.text, _url.text);
              if (err != null) return toast(context, err);
              _where.clear();
              _url.clear();
              toast(context, 'Anchored');
            },
          ),
          const SheetLabel(Icons.fact_check_outlined, 'Verify a record'),
          PillButton(key: const ValueKey('proof-verify'), id: 'proof-verify', label: 'Paste', icon: Icons.content_paste, tone: PillTone.dark, onPressed: _verifyClipboard),
          if (result != null) ...[
            SizedBox(height: 12.h),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(resultOk ? Icons.check_circle : Icons.error, size: 20, color: resultOk ? Tokens.done : Tokens.missed),
                SizedBox(width: 8.w),
                Expanded(
                  child: Text(result!, key: const ValueKey('proof-result'), style: body(14, color: resultOk ? Tokens.done : Tokens.missed, weight: FontWeight.w700, height: 1.35)),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
