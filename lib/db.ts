import PocketBase from 'pocketbase';

const PB_URL = process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  feedbackCredits: number;
  created: string;
  updated: string;
}

export interface Beat {
  id: string;
  title: string;
  audioUrl: string;
  bpm?: number;
  key?: string;
  tags?: string[];
  userId: string;
  expand?: { userId: User };
  plays: number;
  likes: number;
  comments: number;
  created: string;
  updated: string;
}

export interface Comment {
  id: string;
  content: string;
  beatId: string;
  userId: string;
  expand?: { userId: User };
  created: string;
  updated: string;
}

export interface Like {
  id: string;
  beatId: string;
  userId: string;
  created: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  created: string;
}

export interface Play {
  id: string;
  beatId: string;
  userId?: string;
  created: string;
}

export const db = {
  auth: {
    async signUp(username: string, email: string, password: string): Promise<User> {
      const record = await pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm: password,
        feedbackCredits: 3,
      });
      await pb.collection('users').authWithPassword(email, password);
      return record as User;
    },

    async signIn(email: string, password: string): Promise<User> {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return authData.record as User;
    },

    signOut() {
      pb.authStore.clear();
    },

    get currentUser(): User | null {
      return pb.authStore.model as User | null;
    },

    get isAuthenticated(): boolean {
      return pb.authStore.isValid;
    },
  },

  beats: {
    async list(page = 1, perPage = 20): Promise<Beat[]> {
      const result = await pb.collection('beats').getList(page, perPage, {
        sort: '-created',
        expand: 'userId',
      });
      return result.items as Beat[];
    },

    async getById(id: string): Promise<Beat> {
      const beat = await pb.collection('beats').getOne(id, {
        expand: 'userId',
      });
      return beat as Beat;
    },

    async create(data: {
      title: string;
      audioUrl: string;
      bpm?: number;
      key?: string;
      tags?: string[];
    }): Promise<Beat> {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('Not authenticated');

      const beat = await pb.collection('beats').create({
        ...data,
        userId,
        plays: 0,
        likes: 0,
        comments: 0,
      });
      return beat as Beat;
    },

    async getUserBeats(userId: string, page = 1, perPage = 20): Promise<Beat[]> {
      const result = await pb.collection('beats').getList(page, perPage, {
        filter: `userId = "${userId}"`,
        sort: '-created',
      });
      return result.items as Beat[];
    },
  },

  comments: {
    async list(beatId: string, page = 1, perPage = 50): Promise<Comment[]> {
      const result = await pb.collection('comments').getList(page, perPage, {
        filter: `beatId = "${beatId}"`,
        sort: '-created',
        expand: 'userId',
      });
      return result.items as Comment[];
    },

    async create(beatId: string, content: string): Promise<Comment> {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('Not authenticated');

      const comment = await pb.collection('comments').create({
        beatId,
        userId,
        content,
      });
      return comment as Comment;
    },
  },

  likes: {
    async toggle(beatId: string): Promise<boolean> {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('Not authenticated');

      try {
        const existing = await pb.collection('likes').getFirstListItem(
          `beatId = "${beatId}" && userId = "${userId}"`
        );
        await pb.collection('likes').delete(existing.id);
        return false;
      } catch {
        await pb.collection('likes').create({ beatId, userId });
        return true;
      }
    },

    async check(beatId: string): Promise<boolean> {
      const userId = pb.authStore.model?.id;
      if (!userId) return false;

      try {
        await pb.collection('likes').getFirstListItem(
          `beatId = "${beatId}" && userId = "${userId}"`
        );
        return true;
      } catch {
        return false;
      }
    },
  },

  follows: {
    async toggle(followingId: string): Promise<boolean> {
      const followerId = pb.authStore.model?.id;
      if (!followerId) throw new Error('Not authenticated');

      try {
        const existing = await pb.collection('follows').getFirstListItem(
          `followerId = "${followerId}" && followingId = "${followingId}"`
        );
        await pb.collection('follows').delete(existing.id);
        return false;
      } catch {
        await pb.collection('follows').create({ followerId, followingId });
        return true;
      }
    },

    async check(followingId: string): Promise<boolean> {
      const followerId = pb.authStore.model?.id;
      if (!followerId) return false;

      try {
        await pb.collection('follows').getFirstListItem(
          `followerId = "${followerId}" && followingId = "${followingId}"`
        );
        return true;
      } catch {
        return false;
      }
    },
  },

  plays: {
    async record(beatId: string): Promise<void> {
      const userId = pb.authStore.model?.id;
      await pb.collection('plays').create({
        beatId,
        userId: userId || null,
      });
    },
  },
};
