import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModalConfiguration } from "../types";

type ModalsStore = {
  selectedTask: string;
  showCrewModal: boolean;
  showEquipmentModal: boolean;
  showToolModal: boolean;
  showDumpsterModal: boolean;
  showPopupModal: boolean;
  modalConfig: ModalConfiguration;

  setSelectedTask: (tempId: string) => void;
  setShowCrewModal: (show: boolean) => void;
  setShowEquipmentModal: (show: boolean) => void;
  setShowToolModal: (show: boolean) => void;
  setShowDumpsterModal: (show: boolean) => void;
  setShowPopupModal: (show: boolean) => void;
  setModalConfig: (config: ModalConfiguration) => void;
};

const useModalsStore = create<ModalsStore>()(
  persist(
    (set) => ({
      selectedTask: "",
      showCrewModal: false,
      showEquipmentModal: false,
      showToolModal: false,
      showDumpsterModal: false,
      showPopupModal: false,
      modalConfig: { title: "", body: "", variant: "success" },

      setSelectedTask: (tempId) => set({ selectedTask: tempId }),
      setShowCrewModal: (show) => set({ showCrewModal: show }),
      setShowEquipmentModal: (show) => set({ showEquipmentModal: show }),
      setShowToolModal: (show) => set({ showToolModal: show }),
      setShowDumpsterModal: (show) => set({ showDumpsterModal: show }),
      setShowPopupModal: (show) => set({ showPopupModal: show }),
      setModalConfig: (config) => set({ modalConfig: config }),
    }),
    {
      name: "modals-storage",
    },
  ),
);

export default useModalsStore;
