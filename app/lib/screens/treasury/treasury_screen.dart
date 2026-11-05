// Treasury (V.treasury): the revenue ledger and its add-entry form, the two
// clients the cap allows, the one offer, and the earning offers (DAR.NICHES)
// to lock one niche from. Total BHD is rounded as the web page rounds it;
// every amount is fmtBHD's.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart';
import '../../widgets/sheet_scaffold.dart';

void openTreasury(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TreasuryScreen()));

/// V.treasury's "first five moves" once a niche is locked.
const firstMoves = [
  'List 30 targets from Google Maps + Instagram — name, owner, number',
  'Record a 60-second Arabic demo of the agent answering on YOUR number',
  'Send 10 DMs a day for 3 days (script: Library → Earning Offers)',
  'Close ONE pilot at 50% price with a testimonial + referral clause',
  'Deliver in ≤2 weeks, publish the case study, raise the price',
];

class TreasuryScreen extends StatefulWidget {
  const TreasuryScreen({super.key});
  @override
  State<TreasuryScreen> createState() => _TreasuryScreenState();
}

class _TreasuryScreenState extends State<TreasuryScreen> {
  final _amount = TextEditingController(), _note = TextEditingController();
  final _clName = TextEditingController(), _clProject = TextEditingController(), _clPrice = TextEditingController();
  TextEditingController? _offer;

  @override
  void dispose() {
    for (final c in [_amount, _note, _clName, _clProject, _clPrice, ?_offer]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _addClient(AppModel m) async {
    final price = double.tryParse(_clPrice.text.trim()) ?? 0;
    var ok = m.addClient(_clName.text, _clProject.text, price);
    if (!ok) {
      final yes = await showDialog<bool>(
        context: context,
        builder: (_) => AlertDialog(
          backgroundColor: Colors.white,
          title: Text('Add a third client?', style: body(17, weight: FontWeight.w700)),
          content: Text('The cap is 2 clients. The cap protects the Deep Track. Add anyway?', style: body(14, color: Tokens.ink2, height: 1.4)),
          actions: [
            TextButton(key: const ValueKey('client-cancel'), onPressed: () => Navigator.pop(context, false), child: Text('Cancel', style: body(14, weight: FontWeight.w700))),
            TextButton(key: const ValueKey('client-confirm'), onPressed: () => Navigator.pop(context, true), child: Text('Add', style: body(14, color: Tokens.accent, weight: FontWeight.w700))),
          ],
        ),
      );
      if (yes != true) return;
      ok = m.addClient(_clName.text, _clProject.text, price, force: true);
    }
    if (ok) {
      _clName.clear();
      _clProject.clear();
      _clPrice.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final t = e.treasury;
    final entries = e.ledgerRows();
    final clients = e.clientRows();
    final week = e.weekView();
    _offer ??= TextEditingController(text: '${t['offer'] ?? ''}');
    final niches = m.data.niches;
    final locked = niches.where((n) => n['id'] == t['niche']).firstOrNull;
    final pick = niches.where((n) => n['pick'] == true).firstOrNull ?? (niches.isEmpty ? null : niches.first);

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(e.totalText(), key: const ValueKey('treasury-total'), style: display(46)),
            SizedBox(width: 8.w),
            Text('BHD', style: body(15, color: Tokens.onMidnight2, weight: FontWeight.w700)),
          ],
        ),
        SizedBox(height: 10.h),
        Wrap(
          spacing: 22.w,
          runSpacing: 8.h,
          children: [
            Stat(icon: Icons.date_range_outlined, value: numText(week.earned), semantic: 'BHD this week'),
            Stat(icon: Icons.people_outline, value: '${clients.length} / 2', semantic: 'clients'),
            Stat(icon: Icons.receipt_long_outlined, value: '${entries.length}', semantic: 'entries'),
          ],
        ),
      ],
    );

    Widget nicheCard(Map<String, dynamic> n, {required bool recommended}) => Container(
      key: ValueKey('niche-card-${n['id']}'),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Tokens.cardRadius),
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Colors.white, Tokens.accentWash]),
        border: Border.all(color: Tokens.hairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${n['name']}', style: body(15.5, weight: FontWeight.w800, height: 1.3)),
          SizedBox(height: 4.h),
          Text('${n['pricing']}', style: body(13, color: Tokens.goldInk, weight: FontWeight.w700)),
          SizedBox(height: 8.h),
          Text(recommended ? '${n['market']} — ${n['verdict']}' : '${n['offer']}', style: body(13, color: Tokens.ink2, height: 1.4)),
          if (!recommended) ...[SizedBox(height: 6.h), Text('${n['pain']}', style: body(13, color: Tokens.ink2, height: 1.4))],
          SizedBox(height: 14.h),
          recommended
              ? PillButton(key: const ValueKey('niche-lock'), id: 'niche-lock', label: 'Lock', icon: Icons.lock_outline, onPressed: () => m.lockNiche('${n['id']}'))
              : PillButton(key: const ValueKey('niche-change'), id: 'niche-change', label: 'Change', icon: Icons.swap_horiz, tone: PillTone.quiet, onPressed: () => m.lockNiche('')),
        ],
      ),
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          const SheetLabel(Icons.payments_outlined, 'Payments'),
          BrickfordField(key: const ValueKey('entry-amount'), id: 'entry-amount', icon: Icons.payments_outlined, hint: 'BHD', controller: _amount, keyboardType: const TextInputType.numberWithOptions(decimal: true)),
          SizedBox(height: 10.h),
          BrickfordField(key: const ValueKey('entry-note'), id: 'entry-note', icon: Icons.notes, hint: 'Client / deliverable', controller: _note),
          SizedBox(height: 10.h),
          PillButton(
            key: const ValueKey('entry-add'), id: 'entry-add',
            label: 'Record',
            icon: Icons.add,
            onPressed: () {
              final amount = double.tryParse(_amount.text.trim()) ?? 0;
              if (!m.addEntry(amount, _note.text)) return;
              toast(context, '${fmtBHD(amount)} recorded');
              _amount.clear();
              _note.clear();
            },
          ),
          SizedBox(height: 14.h),
          if (entries.isEmpty)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 10.h),
              child: const Center(child: Icon(Icons.receipt_long_outlined, size: 40, color: Tokens.quiet, semanticLabel: 'no payments yet')),
            ),
          for (var i = 0; i < entries.length; i++)
            ItemBlock(
              key: ValueKey('entry-$i'),
              leading: const LeadTile(icon: Icons.south_west, color: Colors.white, fg: Tokens.done),
              title: entries[i].amount,
              subtitle: entries[i].note.isEmpty ? null : entries[i].note,
              meta: entries[i].date,
            ),
          const SheetLabel(Icons.people_outline, 'Clients'),
          for (var i = 0; i < clients.length; i++)
            ItemBlock(
              key: ValueKey('client-$i'),
              leading: LeadTile(text: clients[i].name.isEmpty ? '?' : clients[i].name.substring(0, 1).toUpperCase()),
              title: clients[i].name,
              subtitle: clients[i].project.isEmpty ? null : clients[i].project,
              meta: clients[i].price,
              below: Align(
                alignment: Alignment.centerRight,
                child: StepButton(key: ValueKey('client-del-$i'), id: 'client-del-$i', icon: Icons.close, tooltip: 'Remove client', onPressed: () => m.removeClient(i)),
              ),
            ),
          BrickfordField(key: const ValueKey('client-name'), id: 'client-name', icon: Icons.person_outline, hint: 'Client', controller: _clName),
          SizedBox(height: 10.h),
          BrickfordField(key: const ValueKey('client-project'), id: 'client-project', icon: Icons.work_outline, hint: 'Scope', controller: _clProject),
          SizedBox(height: 10.h),
          BrickfordField(key: const ValueKey('client-price'), id: 'client-price', icon: Icons.payments_outlined, hint: 'BHD', controller: _clPrice, keyboardType: const TextInputType.numberWithOptions(decimal: true)),
          SizedBox(height: 10.h),
          PillButton(key: const ValueKey('client-add'), id: 'client-add', label: 'Add', icon: Icons.person_add_alt, tone: PillTone.quiet, onPressed: () => _addClient(m)),
          const SheetLabel(Icons.edit_note, 'The one offer'),
          BrickfordField(key: const ValueKey('offer-field'), id: 'offer-field', icon: Icons.sell_outlined, hint: 'Niche, deliverable, days, fixed BHD price', controller: _offer, minLines: 3, maxLines: 6),
          SizedBox(height: 10.h),
          PillButton(
            key: const ValueKey('offer-save'), id: 'offer-save',
            label: 'Save',
            icon: Icons.check,
            tone: PillTone.quiet,
            onPressed: () {
              m.saveOffer(_offer!.text);
              toast(context, 'Offer saved');
            },
          ),
          const SheetLabel(Icons.flag_outlined, 'Earning offers'),
          if (locked != null) ...[
            nicheCard(locked, recommended: false),
            SizedBox(height: 10.h),
            for (var i = 0; i < firstMoves.length; i++)
              ItemBlock(key: ValueKey('move-$i'), leading: LeadTile(text: '${i + 1}', color: Colors.white), title: firstMoves[i]),
          ] else if (pick != null) ...[
            nicheCard(pick, recommended: true),
            SizedBox(height: 10.h),
            for (final n in niches)
              if (n != pick)
                ItemBlock(
                  key: ValueKey('niche-${n['id']}'),
                  leading: const LeadTile(icon: Icons.lock_open_rounded, color: Colors.white),
                  title: '${n['name']}',
                  subtitle: '${n['pricing']}',
                  onTap: () => m.lockNiche('${n['id']}'),
                ),
          ],
        ],
      ),
    );
  }
}
