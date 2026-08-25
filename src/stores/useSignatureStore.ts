import { create } from "zustand";

interface SignatureStore {
  subcontractorData: string | null;
  subcontractorName: string;
  contractorData: string | null;
  contractorName: string;
  setSubcontractorData: (data: string | null) => void;
  setContractorData: (data: string | null) => void;
  setSubcontractorName: (data: string) => void;
  setContractorName: (data: string) => void;
  reset: () => void;
}

export const useSignatureStore = create<SignatureStore>((set) => ({
  subcontractorData: null,
  subcontractorName: "",
  contractorData: null,
  contractorName: "",
  setSubcontractorData: (data) => set({ subcontractorData: data }),
  setContractorData: (data) => set({ contractorData: data }),
  setSubcontractorName: (data) => set({ subcontractorName: data }),
  setContractorName: (data) => set({ contractorName: data }),
  reset: () =>
    set({
      subcontractorData: null,
      contractorData: null,
      contractorName: "",
      subcontractorName: "",
    }),
}));
