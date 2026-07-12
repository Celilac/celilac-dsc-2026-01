import 'package:shared_preferences/shared_preferences.dart';

abstract class OnboardingLocalDataSource {
  Future<void> cacheOnboardingCompleted();
  Future<bool> getHasCompletedOnboarding();
}

class OnboardingLocalDataSourceImpl implements OnboardingLocalDataSource {
  static const _onboardingKey = 'CACHED_ONBOARDING_COMPLETED';
  
  @override
  Future<void> cacheOnboardingCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardingKey, true);
  }

  @override
  Future<bool> getHasCompletedOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_onboardingKey) ?? false;
  }
}
