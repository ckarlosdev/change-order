import { create } from "zustand";
import { persist } from "zustand/middleware";

type ModalsStore = {
  selectedTask: string;
  showCrewModal: boolean;
  showEquipmentModal: boolean;
  showToolModal: boolean;
  showDumpsterModal: boolean;

  setSelectedTask: (tempId: string) => void;
  setShowCrewModal: (show: boolean) => void;
  setShowEquipmentModal: (show: boolean) => void;
  setShowToolModal: (show: boolean) => void;
  setShowDumpsterModal: (show: boolean) => void;
};

const useModalsStore = create<ModalsStore>()(
  persist(
    (set) => ({
      selectedTask: "",
      showCrewModal: false,
      showEquipmentModal: false,
      showToolModal: false,
      showDumpsterModal: false,

      setSelectedTask: (tempId) => set({ selectedTask: tempId }),
      setShowCrewModal: (show) => set({ showCrewModal: show }),
      setShowEquipmentModal: (show) => set({ showEquipmentModal: show }),
      setShowToolModal: (show) => set({ showToolModal: show }),
      setShowDumpsterModal: (show) => set({ showDumpsterModal: show }),
    }),
    {
      name: "modals-storage",
    },
  ),
);

export default useModalsStore;
