import { renderHook, act } from '@testing-library/react-native';
import { usePlayerStore } from '../lib/player';
import { Beat } from '../lib/db';

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    replace: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
    remove: jest.fn(),
  })),
  useAudioPlayerStatus: jest.fn(() => ({
    playing: false,
    currentTime: 0,
    duration: 0,
    didJustFinish: false,
  })),
}));

jest.mock('../lib/db', () => ({
  db: {
    plays: {
      record: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

const mockBeat: Beat = {
  id: 'beat-1',
  title: 'Test Beat',
  audioUrl: 'https://example.com/beat.mp3',
  userId: 'user-1',
  plays: 0,
  likes: 0,
  comments: 0,
  created: '2026-10-20',
  updated: '2026-10-20',
  expand: {
    userId: {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      feedbackCredits: 3,
      created: '2026-10-20',
      updated: '2026-10-20',
    },
  },
};

describe('usePlayerStore', () => {
  const mockAudioPlayer = {
    replace: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    const { result } = renderHook(() => usePlayerStore());
    act(() => {
      result.current.cleanup();
      result.current.setAudioPlayer(mockAudioPlayer as any);
    });
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => usePlayerStore());

    expect(result.current.currentBeat).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.position).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.queue).toEqual([]);
  });

  it('should load a beat', () => {
    const { result } = renderHook(() => usePlayerStore());

    act(() => {
      result.current.setAudioPlayer(mockAudioPlayer as any);
      result.current.loadBeat(mockBeat);
    });

    expect(result.current.currentBeat).toEqual(mockBeat);
    expect(result.current.queue).toEqual([mockBeat]);
    expect(mockAudioPlayer.replace).toHaveBeenCalledWith(mockBeat.audioUrl);
  });

  it('should load a beat with queue', () => {
    const { result } = renderHook(() => usePlayerStore());
    const queue = [mockBeat, { ...mockBeat, id: 'beat-2', title: 'Beat 2' }];

    act(() => {
      result.current.setAudioPlayer(mockAudioPlayer as any);
      result.current.loadBeat(mockBeat, queue);
    });

    expect(result.current.queue).toEqual(queue);
    expect(result.current.currentIndex).toBe(0);
  });

  it('should toggle play state', () => {
    const { result } = renderHook(() => usePlayerStore());

    act(() => {
      result.current.setAudioPlayer(mockAudioPlayer as any);
      result.current.play();
    });

    expect(mockAudioPlayer.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.pause();
    });

    expect(mockAudioPlayer.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('should update position and duration', () => {
    const { result } = renderHook(() => usePlayerStore());

    act(() => {
      result.current.updatePosition(5000);
      result.current.updateDuration(180000);
    });

    expect(result.current.position).toBe(5000);
    expect(result.current.duration).toBe(180000);
  });

  it('should log play after 30 seconds', () => {
    const { result } = renderHook(() => usePlayerStore());
    const mockDb = jest.requireMock('../lib/db');

    act(() => {
      result.current.setAudioPlayer(mockAudioPlayer as any);
      result.current.loadBeat(mockBeat);
      result.current.updateIsPlaying(true);
      result.current.updatePosition(31000);
    });

    expect(mockDb.db.plays.record).toHaveBeenCalledWith(mockBeat.id);
    expect(result.current.hasLoggedPlay).toBe(true);
  });
});
