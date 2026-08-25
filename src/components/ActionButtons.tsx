import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import useOrderStore from "../stores/useOrderStore";
import { useContextStore } from "../stores/useContextStore";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useApprove, useFinalize, useSaveOrder } from "../hooks/useOrder";
import { useAuthStore } from "../stores/authStore";
import useModalsStore from "../stores/useModalsStore";

type Props = {
  onPrint: () => void;
};

function ActionButtons({ onPrint }: Props) {
  const { orderData, setChangeOrderData, setFullData } = useOrderStore();
  const jobId = useContextStore((s) => s.jobId);
  const { assignedTasks, setFullData: setTaskData } = useTaskStore();
  const { mutate, isPending: isSavingReport } = useSaveOrder();
  const { mutate: mutateFinalize, isPending: isFinalizing } = useFinalize();
  const { mutate: mutateApprove, isPending: isApproving } = useApprove();
  const { user: userAuth } = useAuthStore();
  const { setModalConfig, setShowPopupModal } = useModalsStore();

  const {
    subcontractorData,
    contractorData,
    subcontractorName,
    contractorName,
  } = useSignatureStore();

  const isAuthorized = userAuth?.roles?.some(
    (role) =>
      role.name === "ROLE_SUPERVISOR" ||
      role.name === "ROLE_SUPERINTENDENT" ||
      role.name === "ROLE_ADMIN",
  );

  const isLocked = orderData.orderStatus === "FINALIZED";
  const isDisabled = isLocked || isFinalizing || !isAuthorized || isApproving;

  const isDraft = orderData.orderStatus === "DRAFT";
  const isApproved = orderData.orderStatus === "APPROVED";

  const buildCurrentPayload = () => {
    const signaturesPayload: any[] = [];
    if (subcontractorData) {
      signaturesPayload.push({
        signatureRole: "SUBCONTRACTOR",
        signatureData: subcontractorData,
        signatureName: subcontractorName,
      });
    }
    if (contractorData) {
      signaturesPayload.push({
        signatureRole: "CONTRACTOR",
        signatureData: contractorData,
        signatureName: contractorName,
      });
    }

    return {
      ...orderData,
      jobId: jobId,
      tasks: assignedTasks,
      signatures: signaturesPayload,
    };
  };

  const handleSaveDraft = (
    callbackOnSuccess?: (savedOrder: any) => void,
    showNotification = true,
  ) => {
    if (!validateData()) return;

    const payload = buildCurrentPayload();
    // console.log(payload);

    mutate(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedOrder = response.data;
          setFullData(savedOrder);
          setTaskData(savedOrder.tasks);
          console.log("Change order saved successfully. ");
          if (showNotification) {
            setModalConfig({
              title: "Success!",
              body: "Your draft has been saved successfully.",
              variant: "success",
            });
            setShowPopupModal(true); // Asegúrate de encender el estado para abrir el modal
          }
          if (callbackOnSuccess) {
            callbackOnSuccess(savedOrder);
          }
        },
        onError: (error) => {
          console.log("Error saving order", error);
          setModalConfig({
            title: "Save Failed",
            body: "An error occurred while saving the draft. Please try again.",
            variant: "danger",
          });
          setShowPopupModal(true);
        },
      },
    );
  };

  const validateData = (targetStatus?: "APPROVED" | "FINALIZED") => {
    if (orderData.employeeId === null) {
      setModalConfig({
        title: "Action Required",
        body: "Foreman field missing.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return false;
    }

    if (orderData.orderDate === null) {
      setModalConfig({
        title: "Action Required",
        body: "Order date missing.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return false;
    }

    if (assignedTasks.length < 1) {
      // alert("Order tasks missing");
      setModalConfig({
        title: "Action Required",
        body: "Order tasks missing.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return false;
    }

    if (targetStatus === "APPROVED") {
      if (!subcontractorData || !subcontractorName?.trim()) {
        setModalConfig({
          title: "Subcontractor Signature Required",
          body: "The scope approval signature and printed name are required to approve the order.",
          variant: "warning",
        });
        setShowPopupModal(true);
        return false;
      }
    }

    if (targetStatus === "FINALIZED") {
      if (!contractorData || !contractorName?.trim()) {
        setModalConfig({
          title: "Contractor Signature Required",
          body: "The finalized's signature and printed name are required to finalize the order.",
          variant: "warning",
        });
        setShowPopupModal(true);
        return false;
      }
    }

    return true;
  };

  const handleApprove = () => {
    if (!orderData.id) {
      setModalConfig({
        title: "Action Required",
        body: "Please save the draft before approving.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return;
    }

    // 1. Validamos que el subcontractor haya firmado y puesto su nombre
    if (!validateData("APPROVED")) return;

    // 2. Guardamos la firma primero en la base de datos como DRAFT
    handleSaveDraft((savedOrder) => {
      // 3. Si se guardó con éxito, llamamos al endpoint exclusivo de aprobación
      mutateApprove(
        { orderId: savedOrder.id },
        {
          onSuccess: (response) => {
            const status = response.data.orderStatus; // Recibe "APPROVED" del backend
            setChangeOrderData("orderStatus", status);

            setModalConfig({
              title: "Order Approved!",
              body: "The change order has been successfully approved by the subcontractor.",
              variant: "success",
            });
            setShowPopupModal(true);
          },
          onError: (error) => {
            console.error("Error approving order", error);
            setModalConfig({
              title: "Approval Failed",
              body: "Could not approve the order. Please try again.",
              variant: "danger",
            });
            setShowPopupModal(true);
          },
        },
      );
    }, false); // El "false" evita que salte la notificación de "Borrador guardado" intermedia
  };

  const handleFinalize = () => {
    if (!orderData.id) {
      setModalConfig({
        title: "Action Required",
        body: "Please save the draft before finalizing the order.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return;
    }

    if (!validateData("FINALIZED")) return;

    // if (!subcontractorData && !contractorData) {
    //   setModalConfig({
    //     title: "Signature Required",
    //     body: "At least one signature (Contractor or Subcontractor) is required to finalize the order.",
    //     variant: "warning",
    //   });
    //   setShowPopupModal(true);
    //   return;
    // }

    handleSaveDraft((savedOrder) => {
      mutateFinalize(
        { orderId: savedOrder.id },
        {
          onSuccess: (response) => {
            const status = response.data.orderStatus;
            setChangeOrderData("orderStatus", status);
            console.log("Order finalized successfully!");
            setModalConfig({
              title: "Order Finalized!",
              body: "The change order has been successfully finalized and closed.",
              variant: "success",
            });
            setShowPopupModal(true);
          },
          onError: (error) => {
            console.error("Error finalizing order", error);
            setModalConfig({
              title: "Finalization Failed",
              body: "Could not finalize the order. Please check the information and try again.",
              variant: "danger",
            });
            setShowPopupModal(true);
          },
        },
      );
    }, false);
  };

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0 no-print">
          <Card.Body>
            <Row className="align-items-center">
              {/* Lado izquierdo: Estado del documento (Opcional pero recomendado) */}
              <Col md={4} className="text-start d-none d-md-block">
                <Badge
                  bg={isDisabled ? "success" : "warning"}
                  className="px-3 py-2"
                >
                  STATUS: {orderData.orderStatus}
                </Badge>
              </Col>

              <Col md={8} className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  {/* Flujo 1: Si es DRAFT -> Puede guardar borrador y Aprobar (Subcontractor) */}
                  {isDraft && (
                    <>
                      <Button
                        variant="outline-primary"
                        style={{ width: "150px", fontWeight: "bold" }}
                        onClick={() => handleSaveDraft()}
                        disabled={isSavingReport}
                      >
                        {isSavingReport ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button
                        variant="info"
                        className="px-4 py-2 fw-bold shadow-sm text-white"
                        onClick={handleApprove}
                      >
                        Approve (Subcontractor)
                      </Button>
                    </>
                  )}

                  {/* Flujo 2: Si es APPROVED -> Puede guardar cambios menores y Finalizar (Contractor) */}
                  {isApproved && (
                    <>
                      <Button
                        variant="outline-primary"
                        style={{ width: "150px", fontWeight: "bold" }}
                        onClick={() => handleSaveDraft()}
                        disabled={isSavingReport}
                      >
                        {isSavingReport ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              style={{ marginRight: "10px" }}
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        variant="success"
                        className="px-4 py-2 fw-bold shadow-sm"
                        onClick={handleFinalize}
                      >
                        Finalize (Contractor)
                      </Button>
                    </>
                  )}

                  {/* Flujo 3: Si es FINALIZED -> Solo permite descargar el PDF */}
                  {isLocked && (
                    <Button
                      variant="primary"
                      className="px-4 py-2 fw-bold d-flex align-items-center no-print"
                      onClick={() => onPrint()}
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
    </>
  );
}

export default ActionButtons;
