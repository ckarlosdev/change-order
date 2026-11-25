import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChangeOrder,
  ChangeOrderRequestPayload,
  NextOrderNumberResponse,
} from "../types";
import { api } from "./apiConfig";

const createOrder = async ({
  reportData,
}: {
  reportData: ChangeOrderRequestPayload;
}) => {
  if (reportData.order.id) {
    const updatePayload = {
      employeeId: reportData.order.employeeId,
      orderDate: reportData.order.orderDate,
      orderNumber: reportData.order.orderNumber,
      amount: reportData.order.amount,
      orderStatus: reportData.order.orderStatus,
      tasks: reportData.order.tasks,
      signatures: reportData.order.signatures,
    };

    return api.put(
      `v2/job-management/change-order/${reportData.order.id}`,
      updatePayload,
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
      queryClient.invalidateQueries({ queryKey: ["nextOrderNumber"] });
    },
  });
}

interface JobDataDto {
  // Define las propiedades de JobDataDto según tu backend
  [key: string]: any;
}

interface FinalizeOrderPayload {
  orderId: number;
  jobData: JobDataDto;
}

const finalizeOrder = async ({ orderId, jobData }: FinalizeOrderPayload) => {
  return api.put(`v2/job-management/change-order/${orderId}/finalize`, jobData);
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

const queryNextOrderNumber = async (
  jobId: number,
): Promise<NextOrderNumberResponse> => {
  const { data } = await api.get<NextOrderNumberResponse>(
    `v2/job-management/change-order/next-order-number`,
    { params: { jobId } },
  );
  return data;
};

export function useNextOrderNumber(jobId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["nextOrderNumber", jobId],
    queryFn: () => queryNextOrderNumber(jobId!),
    enabled: enabled && !!jobId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
