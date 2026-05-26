import { create } from "zustand";
import type { ChangeOrder } from "../types";
import { persist } from "zustand/middleware";

type OrderStore = {
  orderData: ChangeOrder;
  setChangeOrderData: <K extends keyof ChangeOrder>(
    key: K,
    value: ChangeOrder[K],
  ) => void;
  reset: () => void;
  setFullData: (data: ChangeOrder) => void;
};

const getTodayDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
};

const initialData = {
  id: null,
  jobId: null,
  employeeId: null,
  orderDate: getTodayDate(),
  orderNumber: 0,
  amount: 0,
  orderStatus: "DRAFT",
  tasks: [],
  signatures: [],
};

const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orderData: initialData,

      setChangeOrderData: (key, value) =>
        set((state) => ({
          orderData: {
            ...state.orderData,
            [key]: value,
          },
        })),
      reset: () => set({ orderData: initialData }),
      setFullData: (data) =>
        set(() => ({
          orderData: data,
        })),
    }),
    {
      name: "order-storage",
    },
  ),
);

export default useOrderStore;
