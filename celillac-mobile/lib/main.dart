import 'package:flutter/material.dart';
import 'features/onboarding/data/datasources/onboarding_local_datasource.dart';
import 'features/onboarding/data/repositories/onboarding_repository_impl.dart';
import 'features/onboarding/domain/usecases/complete_onboarding_usecase.dart';
import 'features/onboarding/presentation/controllers/onboarding_controller.dart';
import 'features/onboarding/presentation/pages/onboarding_page.dart';

void main() {
  runApp(const CeliLacApp());
}

class CeliLacApp extends StatelessWidget {
  const CeliLacApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Basic manual dependency injection for the Onboarding module
    final dataSource = OnboardingLocalDataSourceImpl();
    final repository = OnboardingRepositoryImpl(localDataSource: dataSource);
    final completeUseCase = CompleteOnboardingUseCase(repository);
    final controller = OnboardingController(
      completeOnboardingUseCase: completeUseCase,
    );

    return MaterialApp(
      title: 'CeliLac',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF11131C),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFB8C3FF),
          primaryContainer: Color(0xFF2D5BFF),
          secondary: Color(0xFF00EEFC),
          surface: Color(0xFF11131C),
        ),
      ),
      home: OnboardingScreenWrapper(controller: controller),
    );
  }
}

class OnboardingScreenWrapper extends StatelessWidget {
  final OnboardingController controller;

  const OnboardingScreenWrapper({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return OnboardingPage(
      onGetStarted: () async {
        await controller.onGetStarted();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Onboarding completed! Proceeding...'),
            ),
          );
          // Navigate to next screen
        }
      },
      onLogin: () {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Navigating to Login...')),
          );
        }
      },
    );
  }
}
