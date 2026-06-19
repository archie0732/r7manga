import { describe, expect, test } from 'bun:test';

import { getAdminIdentity, isAdminUser } from './admin';

describe('admin auth helpers', () => {
  test('recognizes local admin role even without email match', () => {
    expect(isAdminUser({
      name: 'yuda',
      email: 'admin@local',
      role: 'admin',
    })).toBe(true);
  });

  test('rejects non-admin users', () => {
    expect(isAdminUser({
      name: 'guest',
      email: 'guest@example.com',
      role: 'user',
    })).toBe(false);
  });

  test('returns configured admin credentials with defaults', () => {
    const identity = getAdminIdentity({});

    expect(identity.username).toBe('yuda');
    expect(identity.password).toBe('yudaHGOD');
    expect(identity.email).toBe('admin@local');
  });
});
