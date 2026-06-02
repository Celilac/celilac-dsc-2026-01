import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  const createMockContext = (userRole?: UserRoleEnum): ExecutionContext => {
    const request = { user: userRole ? { role: userRole } : undefined };
    return {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext(UserRoleEnum.USER);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access if user has a required role', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRoleEnum.ADMIN]);
    const context = createMockContext(UserRoleEnum.ADMIN);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have any of the required roles', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRoleEnum.ADMIN]);
    const context = createMockContext(UserRoleEnum.USER);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should deny access if there is no user in request', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRoleEnum.ADMIN]);
    const context = createMockContext(undefined);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});
