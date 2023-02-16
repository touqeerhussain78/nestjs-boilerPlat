import { GuestGuard } from './guest.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    expect(new GuestGuard()).toBeDefined();
  });
});
