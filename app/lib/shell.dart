// The four tabs: Home, Market, Community, Profile.
import 'package:flutter/material.dart';

import 'screens/community/community_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/market/market_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'theme/theme.dart';
import 'theme/tokens.dart';

class Shell extends StatefulWidget {
  const Shell({super.key});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  int index = 0;

  static const tabs = [
    (Icons.home_outlined, Icons.home, 'Home'),
    (Icons.storefront_outlined, Icons.storefront, 'Market'),
    (Icons.groups_outlined, Icons.groups, 'Community'),
    (Icons.person_outline, Icons.person, 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: IndexedStack(
        index: index,
        children: const [HomeScreen(), MarketScreen(), CommunityScreen(), ProfileScreen()],
      ),
      bottomNavigationBar: NavigationBar(
        key: const ValueKey('brickford-tabs'),
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        backgroundColor: Tokens.sheet,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        indicatorColor: Tokens.fieldFill,
        labelTextStyle: WidgetStatePropertyAll(body(12, weight: FontWeight.w600)),
        destinations: [
          for (final (icon, selected, label) in tabs)
            NavigationDestination(icon: Icon(icon, color: Tokens.ink2), selectedIcon: Icon(selected, color: Tokens.primary), label: label),
        ],
      ),
    );
  }
}
