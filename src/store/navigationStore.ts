import { create } from "zustand";

interface NavigationState {
    history: string[];
    addPath: (path: string) => void;
    getPreviousPath: () => string | null;
    clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
    history: ['/dashboard'],
    addPath: (path: string) => {
        set((state) => {
            // Prevent adding duplicate path if it's the same as the last one
            if (state.history[state.history.length - 1] === path) {
                return state; // No change if the path is the same
            }
            return {
                history: [...state.history, path],
            };
        });
    },
    getPreviousPath: () => {
        const history = [...get().history];
        if (history.length > 1) {
            history.pop();
            const previousPath = history[history.length - 1];
            set({ history: history });
            return previousPath;
        }
        return null;
    },
    clearHistory: () => set({ history: [] }),
}))