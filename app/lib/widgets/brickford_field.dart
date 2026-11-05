// The blueprint's input (§3): light slate fill, 16px radius, no outline in any
// state, a black45 prefix icon, explicit padding.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';

class BrickfordField extends StatelessWidget {
  const BrickfordField({
    super.key,
    required this.icon,
    this.hint,
    this.controller,
    this.onChanged,
    this.onSubmitted,
    this.autofocus = false,
    this.obscure = false,
  });

  final IconData icon;
  final String? hint;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged, onSubmitted;
  final bool autofocus;

  /// A secret: dots, no suggestions, no autocorrect.
  final bool obscure;

  static const _none = OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(Tokens.radius)), borderSide: BorderSide.none);

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      onSubmitted: onSubmitted,
      autofocus: autofocus,
      obscureText: obscure,
      enableSuggestions: !obscure,
      autocorrect: !obscure,
      style: body(15),
      decoration: InputDecoration(
        filled: true,
        fillColor: Tokens.fieldFill,
        hintText: hint,
        hintStyle: body(15, color: Tokens.ink2),
        prefixIcon: Icon(icon, color: Tokens.quiet),
        contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
        border: _none,
        enabledBorder: _none,
        focusedBorder: _none,
        disabledBorder: _none,
        errorBorder: _none,
        focusedErrorBorder: _none,
      ),
    );
  }
}
