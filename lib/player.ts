import { create } from 'zustand';
import { useAudioPlayer } from 'expo-audio';
import { Beat, db } from './db';

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Beat[];
  currentIndex: number;
  audioPlayer: ReturnType<typeof useAudioPlayer> | null;
  playStartTime: number | null;
  hasLoggedPlay: boolean;
}

interface PlayerActions {
  setAudioPlayer: (player: ReturnType<typeof useAudioPlayer>) => void;
  loadBeat: (beat: Beat, queue?: Beat[]) => void;
  play: () => void;
  pause: () => void;
  seekTo: (position: number) => void;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  updatePosition: (position: number) => void;
  updateDuration: (duration: number) => void;
  updateIsPlaying: (isPlaying: boolean) => void;
  cleanup: () => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  currentBeat: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  audioPlayer: null,
  playStartTime: null,
  hasLoggedPlay: false,

  setAudioPlayer: (player) => set({ audioPlayer: player }),

  loadBeat: (beat: Beat, queue: Beat[] = []) => {
    const { audioPlayer } = get();
    if (!audioPlayer) return;

    try {
      audioPlayer.replace(beat.audioUrl);
      
      const queueToUse = queue.length > 0 ? queue : [beat];
      const index = queueToUse.findIndex(b => b.id === beat.id);

      set({
        currentBeat: beat,
        queue: queueToUse,
        currentIndex: index >= 0 ? index : 0,
        position: 0,
        duration: 0,
        hasLoggedPlay: false,
        playStartTime: null,
      });
    } catch (error) {
      console.error('Failed to load beat:', error);
    }
  },

  play: () => {
    const { audioPlayer, playStartTime } = get();
    if (!audioPlayer) return;

    try {
      audioPlayer.play();
      set({ 
        isPlaying: true,
        playStartTime: playStartTime || Date.now(),
      });
    } catch (error) {
      console.error('Failed to play:', error);
    }
  },

  pause: () => {
    const { audioPlayer } = get();
    if (!audioPlayer) return;

    try {
      audioPlayer.pause();
      set({ isPlaying: false });
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  },

  seekTo: (position: number) => {
    const { audioPlayer } = get();
    if (!audioPlayer) return;

    try {
      audioPlayer.seekTo(position / 1000);
      set({ position });
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  },

  next: async () => {
    const { queue, currentIndex, loadBeat, play } = get();
    if (currentIndex < queue.length - 1) {
      loadBeat(queue[currentIndex + 1], queue);
      play();
    }
  },

  previous: async () => {
    const { queue, currentIndex, loadBeat, seekTo, position } = get();
    
    if (position > 3000) {
      seekTo(0);
    } else if (currentIndex > 0) {
      loadBeat(queue[currentIndex - 1], queue);
      get().play();
    }
  },

  updatePosition: (position: number) => {
    const state = get();
    set({ position });

    if (state.isPlaying && !state.hasLoggedPlay && position >= 30000 && state.currentBeat) {
      db.plays.record(state.currentBeat.id).catch(console.error);
      set({ hasLoggedPlay: true });
    }
  },

  updateDuration: (duration: number) => set({ duration }),

  updateIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  cleanup: () => {
    set({
      isPlaying: false,
      position: 0,
      playStartTime: null,
      hasLoggedPlay: false,
    });
  },
}));
