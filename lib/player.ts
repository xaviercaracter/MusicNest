import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Beat, db } from './db';

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Beat[];
  currentIndex: number;
  sound: Audio.Sound | null;
  playStartTime: number | null;
  hasLoggedPlay: boolean;
}

interface PlayerActions {
  loadBeat: (beat: Beat, queue?: Beat[]) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  cleanup: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  currentBeat: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  sound: null,
  playStartTime: null,
  hasLoggedPlay: false,

  loadBeat: async (beat: Beat, queue: Beat[] = []) => {
    const { sound: currentSound, cleanup } = get();
    
    await cleanup();

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: beat.audioUrl },
        { shouldPlay: false },
        (status) => {
          if (!status.isLoaded) return;
          
          const state = get();
          set({
            position: status.positionMillis,
            duration: status.durationMillis || 0,
            isPlaying: status.isPlaying,
          });

          if (status.isPlaying && !state.hasLoggedPlay && status.positionMillis >= 30000) {
            db.plays.record(beat.id).catch(console.error);
            set({ hasLoggedPlay: true });
          }

          if (status.didJustFinish) {
            get().next();
          }
        }
      );

      const queueToUse = queue.length > 0 ? queue : [beat];
      const index = queueToUse.findIndex(b => b.id === beat.id);

      set({
        currentBeat: beat,
        sound: newSound,
        queue: queueToUse,
        currentIndex: index >= 0 ? index : 0,
        position: 0,
        duration: 0,
        hasLoggedPlay: false,
      });
    } catch (error) {
      console.error('Failed to load beat:', error);
    }
  },

  play: async () => {
    const { sound, playStartTime } = get();
    if (!sound) return;

    try {
      await sound.playAsync();
      set({ 
        isPlaying: true,
        playStartTime: playStartTime || Date.now(),
      });
    } catch (error) {
      console.error('Failed to play:', error);
    }
  },

  pause: async () => {
    const { sound } = get();
    if (!sound) return;

    try {
      await sound.pauseAsync();
      set({ isPlaying: false });
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  },

  seekTo: async (position: number) => {
    const { sound } = get();
    if (!sound) return;

    try {
      await sound.setPositionAsync(position);
      set({ position });
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  },

  next: async () => {
    const { queue, currentIndex, loadBeat } = get();
    if (currentIndex < queue.length - 1) {
      await loadBeat(queue[currentIndex + 1], queue);
      await get().play();
    }
  },

  previous: async () => {
    const { queue, currentIndex, loadBeat, position } = get();
    
    if (position > 3000) {
      await get().seekTo(0);
    } else if (currentIndex > 0) {
      await loadBeat(queue[currentIndex - 1], queue);
      await get().play();
    }
  },

  cleanup: async () => {
    const { sound } = get();
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Failed to cleanup sound:', error);
      }
    }
    set({
      sound: null,
      isPlaying: false,
      position: 0,
      playStartTime: null,
      hasLoggedPlay: false,
    });
  },
}));
