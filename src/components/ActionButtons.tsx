import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import useOrderStore from "../stores/useOrderStore";
import { useContextStore } from "../stores/useContextStore";
import useTaskStore from "../stores/useTaskStore";
import { useFinalize, useSaveOrder } from "../hooks/useOrder";
import { useAuthStore } from "../stores/authStore";
import useModalsStore from "../stores/useModalsStore";
import useJob from "../hooks/useJob";
import { useState } from "react";
import { FinalizeModal } from "./FinalizeModal";

type Props = {
  onPrint: () => void;
};

function ActionButtons({ onPrint }: Props) {
  const { orderData, setFullData } = useOrderStore();
  const jobId = useContextStore((s) => s.jobId);
  const { assignedTasks, setFullData: setTaskData } = useTaskStore();
  const { data: jobData } = useJob(jobId!);

  const { mutate: mutateSave, isPending: isSavingReport } = useSaveOrder();
  const { mutate: mutateFinalize, isPending: isFinalizing } = useFinalize();

  const { user: userAuth } = useAuthStore();
  const { setModalConfig, setShowPopupModal } = useModalsStore();

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  const isAuthorized = userAuth?.roles?.some(
    (role) =>
      role.name === "ROLE_SUPERVISOR" ||
      role.name === "ROLE_SUPERINTENDENT" ||
      role.name === "ROLE_ADMIN",
  );

  const isFinalized = orderData.orderStatus === "FINALIZED";
  const isBusy = isSavingReport || isFinalizing;
  const isActionDisabled = !isAuthorized || isBusy;

  const showModal = (
    title: string,
    body: string,
    variant: "success" | "warning" | "danger",
  ) => {
    setModalConfig({ title, body, variant });
    setShowPopupModal(true);
  };

  const validateBaseData = () => {
    if (!orderData.employeeId) {
      showModal("Action Required", "Foreman field missing.", "warning");
      return false;
    }
    if (!orderData.orderDate) {
      showModal("Action Required", "Order date missing.", "warning");
      return false;
    }
    if (assignedTasks.length < 1) {
      showModal("Action Required", "Order tasks missing.", "warning");
      return false;
    }
    return true;
  };

  const buildPayload = (extraSignatures?: any[]) => {
    const signaturesPayload = extraSignatures || orderData.signatures || [];

    return {
      order: {
        ...orderData,
        jobId,
        tasks: assignedTasks,
        signatures: signaturesPayload,
      },
      job: {
        number: jobData?.number ?? "",
        name: jobData?.name ?? "",
      },
    };
  };

  const handleSaveDraft = (
    callbackOnSuccess?: (savedOrder: any) => void,
    showNotification = true,
  ) => {
    if (!validateBaseData()) return;

    const payload = buildPayload();

    mutateSave(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedOrder = response.data;
          setFullData(savedOrder);
          if (savedOrder.tasks) setTaskData(savedOrder.tasks);

          if (showNotification) {
            showModal("Success!", "Draft saved successfully.", "success");
          }
          if (callbackOnSuccess) callbackOnSuccess(savedOrder);
        },
        onError: (error) => {
          console.error("Error saving order", error);
          showModal("Save Failed", "An error occurred while saving.", "danger");
        },
      },
    );
  };

  const handleOpenFinalizeModal = () => {
    if (!validateBaseData()) return;
    setShowFinalizeModal(true);
  };

  const handleConfirmFinalize = (newSignatures: any[]) => {
    const payload = buildPayload(newSignatures);

    mutateSave(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedOrder = response.data;
          setFullData(savedOrder);

          mutateFinalize(
            {
              orderId: savedOrder.id,
              jobData: {
                number: jobData?.number ?? "not found",
                name: jobData?.name ?? "not found",
              },
            },
            {
              onSuccess: (finalizeRes) => {
                setShowFinalizeModal(false);
                setFullData(finalizeRes.data);
                showModal(
                  "Order Finalized!",
                  "The change order has been finalized successfully.",
                  "success",
                );
              },
              onError: (error) => {
                console.error("Error finalizing", error);
                showModal(
                  "Finalization Failed",
                  "Could not finalize order.",
                  "danger",
                );
              },
            },
          );
        },
        onError: () => {
          showModal(
            "Save Failed",
            "Could not save signatures before finalizing.",
            "danger",
          );
        },
      },
    );
  };

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0 no-print">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="text-start d-none d-md-block">
                <Badge
                  bg={isFinalized ? "success" : "warning"}
                  className="px-3 py-2 text-uppercase"
                >
                  STATUS: {orderData.orderStatus || "DRAFT"}
                </Badge>
              </Col>

              <Col md={8} className="text-end">
                <div className="d-flex justify-content-end gap-2 align-items-center">
                  {!isFinalized ? (
                    <>
                      <Button
                        variant="outline-primary"
                        style={{ width: "140px", fontWeight: "bold" }}
                        onClick={() => handleSaveDraft()}
                        disabled={isActionDisabled}
                      >
                        {isSavingReport ? "Saving..." : "Save Draft"}
                      </Button>

                      <Button
                        variant="success"
                        className="px-4 py-2 fw-bold shadow-sm"
                        onClick={handleOpenFinalizeModal}
                        disabled={isActionDisabled}
                      >
                        Finalize Order
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      className="px-4 py-2 fw-bold d-flex align-items-center no-print"
                      onClick={onPrint}
                    >
                      Download PDF
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <FinalizeModal
        show={showFinalizeModal}
        onHide={() => setShowFinalizeModal(false)}
        onConfirm={handleConfirmFinalize}
        isSubmitting={isBusy}
      />
    </>
  );
}

export default ActionButtons;
