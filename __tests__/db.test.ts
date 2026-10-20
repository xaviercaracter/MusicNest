import { db } from '../lib/db';

jest.mock('pocketbase', () => {
  return jest.fn().mockImplementation(() => ({
    collection: jest.fn(),
    authStore: {
      isValid: false,
      model: null,
    },
  }));
});

describe('db.auth', () => {
  it('should have authentication methods', () => {
    expect(db.auth.signUp).toBeDefined();
    expect(db.auth.signIn).toBeDefined();
    expect(db.auth.signOut).toBeDefined();
  });

  it('should check authentication state', () => {
    const isAuthenticated = db.auth.isAuthenticated;
    expect(typeof isAuthenticated).toBe('boolean');
  });
});

describe('db.beats', () => {
  it('should have beat methods', () => {
    expect(db.beats.list).toBeDefined();
    expect(db.beats.getById).toBeDefined();
    expect(db.beats.create).toBeDefined();
    expect(db.beats.getUserBeats).toBeDefined();
  });
});

describe('db.comments', () => {
  it('should have comment methods', () => {
    expect(db.comments.list).toBeDefined();
    expect(db.comments.create).toBeDefined();
  });
});
