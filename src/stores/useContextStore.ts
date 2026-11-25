import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppContextState {
  jobId: number | null;
  changeOrderId: number | null;
  isLoaded: boolean;
  setIds: (jobId: number | null, changeOrderId: number | null) => void;
  setIsLoaded: (loaded: boolean) => void;
}

export const useContextStore = create<AppContextState>()(
  persist(
    (set) => ({
      jobId: null,
      changeOrderId: null,
      isLoaded: false,
      setIds: (jobId, changeOrderId) =>
        set(() => ({ jobId, changeOrderId: changeOrderId })),
      setIsLoaded: (loaded) => set(() => ({ isLoaded: loaded })),
    }),
    {
      name: "app-context-store",
      // isLoaded must start false on every page load, so children don't render
      // with the previous session's ids before Home reads the URL.
      partialize: (s) => ({ jobId: s.jobId, changeOrderId: s.changeOrderId }),
    },
  ),
);
