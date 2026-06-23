import 'package:flutter/foundation.dart';
import '../../domain/usecases/complete_onboarding_usecase.dart';

class OnboardingController extends ChangeNotifier {
  final CompleteOnboardingUseCase completeOnboardingUseCase;

  OnboardingController({required this.completeOnboardingUseCase});

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<void> onGetStarted() async {
    _isLoading = true;
    notifyListeners();

    await completeOnboardingUseCase();

    _isLoading = false;
    notifyListeners();
  }
}
