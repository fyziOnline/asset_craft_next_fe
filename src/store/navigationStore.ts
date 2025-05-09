import path from "path";
import { create } from "zustand";

interface NavigationState {
    history: string[];
    addPath: (path: string) => void;
    getPreviousPath: () => string | null;
    clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
    history: [],
    addPath: (path: string) => set((state) => ({
        history: [...state.history, path],
    })),
    getPreviousPath: () => {
        const history = [...get().history];
        if (history.length > 1) {
            history.pop();
            const previousPath = history[history.length - 1];
            set({ history });
            return previousPath;
        }
        return null;
    },
    clearHistory: () => set({ history: [] }),
}))