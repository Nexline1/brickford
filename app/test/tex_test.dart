// The lecture summary's KaTeX, read as plain Unicode on the lesson screen.
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('inline math becomes readable text, prose outside it is untouched', () {
    expect(plain(r'From 80 m, $h = 80-5t^{2}$ reaches the ground'), 'From 80 m, h = 80-5t² reaches the ground');
    expect(plain(r'$\Delta y/\Delta x$ is the <b>average</b> rate'), 'Δ y/Δ x is the average rate');
    expect(plain(r'$\tfrac{1}{2}\lambda_{1} \le \sqrt{x+1}$'), '1/2λ₁ ≤ √(x+1)');
    expect(plain(r'$A^{T}A$ &amp; $x_i$'), 'AᵀA & xᵢ');
  });
}
