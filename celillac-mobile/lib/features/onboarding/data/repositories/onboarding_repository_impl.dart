import '../../domain/repositories/onboarding_repository.dart';
import '../datasources/onboarding_local_datasource.dart';

class OnboardingRepositoryImpl implements OnboardingRepository {
  final OnboardingLocalDataSource localDataSource;

  OnboardingRepositoryImpl({required this.localDataSource});

  @override
  Future<void> completeOnboarding() async {
    return await localDataSource.cacheOnboardingCompleted();
  }

  @override
  Future<bool> hasCompletedOnboarding() async {
    return await localDataSource.getHasCompletedOnboarding();
  }
}
