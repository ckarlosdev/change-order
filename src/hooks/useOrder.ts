import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangeOrder } from "../types";
import { api } from "./apiConfig";

const createOrder = async ({ reportData }: { reportData: ChangeOrder }) => {
  if (reportData.id) {
    return api.put(
      `v2/job-management/change-order/${reportData.id}`,
      reportData,
    );
  }
  return api.post(`v2/job-management/change-order`, reportData);
};

export function useSaveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    mutationKey: ["saveOrder"],
    onSuccess: (response) => {
      const newId = response.data?.id;
      if (newId) {
        queryClient.invalidateQueries({ queryKey: ["changeOrder", newId] });
      }
    },
  });
}

const finalizeOrder = async ({ orderId }: { orderId: number }) => {
  return api.put(`v2/job-management/change-order/${orderId}/finalize`);
};

export function useFinalize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeOrder,
    mutationKey: ["finalizeOrder"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changeOrder"] });
    },
  });
}

const approveOrder = async ({ orderId }: { orderId: number }) => {
  return api.put(`v2/job-management/change-order/${orderId}/approve`);
};

export function useApprove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveOrder,
    mutationKey: ["approveOrder"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changeOrder"] });
    },
  });
}

const queryGetOrderById = async (orderId: number): Promise<ChangeOrder> => {
  const { data } = await api.get(`v2/job-management/change-order/${orderId}`);
  return data;
};

export function useGetChangeOrder(orderId: number) {
  return useQuery({
    queryKey: ["changeOrder", orderId],
    queryFn: () => queryGetOrderById(orderId),
    enabled: !!orderId,
    retry: false,
  });
}
