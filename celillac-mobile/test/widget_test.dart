import 'package:flutter_test/flutter_test.dart';
import 'package:celillac_mobile/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const CeliLacApp());

    // Verify that the onboarding title is present.
    expect(find.text('CeliLac'), findsOneWidget);
    expect(
      find.text('Gestão Inteligente de Pedidos Corporativos'),
      findsOneWidget,
    );
  });
}
