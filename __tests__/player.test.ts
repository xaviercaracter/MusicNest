import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePlayerStore } from '../lib/player';
import { Beat } from '../lib/db';

jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn().mockResolvedValue(undefined),
          pauseAsync: jest.fn().mockResolvedValue(undefined),
          setPositionAsync: jest.fn().mockResolvedValue(undefined),
          unloadAsync: jest.fn().mockResolvedValue(undefined),
          setOnPlaybackStatusUpdate: jest.fn(),
        },
        status: { isLoaded: true },
      }),
    },
  },
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
  beforeEach(() => {
    const { result } = renderHook(() => usePlayerStore());
    act(() => {
      result.current.cleanup();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => usePlayerStore());

    expect(result.current.currentBeat).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.position).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.queue).toEqual([]);
  });

  it('should load a beat', async () => {
    const { result } = renderHook(() => usePlayerStore());

    await act(async () => {
      await result.current.loadBeat(mockBeat);
    });

    await waitFor(() => {
      expect(result.current.currentBeat).toEqual(mockBeat);
      expect(result.current.queue).toEqual([mockBeat]);
    });
  });

  it('should load a beat with queue', async () => {
    const { result } = renderHook(() => usePlayerStore());
    const queue = [mockBeat, { ...mockBeat, id: 'beat-2', title: 'Beat 2' }];

    await act(async () => {
      await result.current.loadBeat(mockBeat, queue);
    });

    await waitFor(() => {
      expect(result.current.queue).toEqual(queue);
      expect(result.current.currentIndex).toBe(0);
    });
  });

  it('should toggle play state', async () => {
    const { result } = renderHook(() => usePlayerStore());

    await act(async () => {
      await result.current.loadBeat(mockBeat);
    });

    await act(async () => {
      await result.current.play();
    });

    await waitFor(() => {
      expect(result.current.isPlaying).toBe(true);
    });

    await act(async () => {
      await result.current.pause();
    });

    await waitFor(() => {
      expect(result.current.isPlaying).toBe(false);
    });
  });

  it('should cleanup on new beat load', async () => {
    const { result } = renderHook(() => usePlayerStore());

    await act(async () => {
      await result.current.loadBeat(mockBeat);
    });

    const firstSound = result.current.sound;

    await act(async () => {
      await result.current.loadBeat({ ...mockBeat, id: 'beat-2' });
    });

    await waitFor(() => {
      expect(result.current.currentBeat?.id).toBe('beat-2');
      expect(result.current.sound).not.toBe(firstSound);
    });
  });
});
