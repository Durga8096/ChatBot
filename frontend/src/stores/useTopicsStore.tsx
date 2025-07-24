// stores/useTopicsStore.ts
import { create } from 'zustand';

export type Topic = {
  id: number;
  title: string;
  description: string;
  status: 'Not started' | 'In Progress' | 'Completed';
};

type TopicStore = {
  topics: Topic[];
  addTopic: (topic: Topic) => void;
  updateStatus: (id: number, status: Topic['status']) => void;
  deleteTopic: (id: number) => void;
};

export const useTopicsStore = create<TopicStore>((set) => ({
  topics: [],
  addTopic: (topic) => set((state) => ({ topics: [topic, ...state.topics] })),
  updateStatus: (id, status) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
    })),
}));
