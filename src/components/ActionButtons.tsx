import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import useOrderStore from "../stores/useOrderStore";
import { useContextStore } from "../stores/useContextStore";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useApprove, useFinalize, useSaveOrder } from "../hooks/useOrder";
import { useAuthStore } from "../stores/authStore";
import useModalsStore from "../stores/useModalsStore";
import useJob from "../hooks/useJob";

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
  const { mutate: mutateApprove, isPending: isApproving } = useApprove();

  const { user: userAuth } = useAuthStore();
  const { setModalConfig, setShowPopupModal } = useModalsStore();

  const {
    subcontractorData,
    contractorData,
    subcontractorName,
    contractorName,
  } = useSignatureStore();

  // Roles de usuario
  const isAuthorized = userAuth?.roles?.some(
    (role) =>
      role.name === "ROLE_SUPERVISOR" ||
      role.name === "ROLE_SUPERINTENDENT" ||
      role.name === "ROLE_ADMIN",
  );

  // Derivados de Estado de la Orden
  const isDraft = orderData.orderStatus === "DRAFT";
  const isApproved = orderData.orderStatus === "APPROVED";
  const isFinalized = orderData.orderStatus === "FINALIZED";

  // Deshabilitar botones durante procesos asíncronos o falta de permisos
  const isBusy = isSavingReport || isApproving || isFinalizing;
  const isActionDisabled = !isAuthorized || isBusy;

  const buildCurrentPayload = () => {
    const existingSignatures = orderData.signatures || [];
    let signaturesPayload = [...existingSignatures];

    // SOLO si el usuario firmó algo nuevo en el canvas
    if (subcontractorData) {
      signaturesPayload = signaturesPayload.filter(
        (s: any) =>
          s.signatureRole !== "SUBCONTRACTOR" && s.signatureRole !== "APPROVED",
      );
      signaturesPayload.push({
        signatureRole: "SUBCONTRACTOR",
        signatureData: subcontractorData,
        signatureName: subcontractorName,
      } as any);
    }

    if (contractorData) {
      signaturesPayload = signaturesPayload.filter(
        (s: any) => s.signatureRole !== "CONTRACTOR",
      );
      signaturesPayload.push({
        signatureRole: "CONTRACTOR",
        signatureData: contractorData,
        signatureName: contractorName,
      } as any);
    }

    const orderPayload = {
      ...orderData,
      jobId,
      tasks: assignedTasks,
      signatures: signaturesPayload,
    };

    const jobPayload = {
      number: jobData?.number ?? "",
      name: jobData?.name ?? "",
    };

    return {
      order: orderPayload,
      job: jobPayload,
    };
  };

  const validateData = (targetStatus?: "APPROVED" | "FINALIZED") => {
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

    if (targetStatus === "APPROVED") {
      console.log("APPROVED");

      const savedSubSig = orderData.signatures?.find(
        (s: any) =>
          s.signatureRole === "APPROVED" || s.signatureRole === "SUBCONTRACTOR",
      ) as any;

      // Evalúa múltiples nombres comunes de propiedades para la imagen/datos
      const savedData =
        savedSubSig?.signatureData ||
        savedSubSig?.signatureUrl ||
        savedSubSig?.imageUrl ||
        savedSubSig?.data ||
        savedSubSig?.url;

      // Evalúa múltiples nombres comunes para el nombre impreso
      const savedName =
        savedSubSig?.signatureName ||
        savedSubSig?.printedName ||
        savedSubSig?.name ||
        savedSubSig?.signerName;

      // Si existe el objeto guardado previamente, lo toma como válido automáticamente
      const hasData = Boolean(subcontractorData || savedData || savedSubSig);
      const hasName = Boolean(
        subcontractorName?.trim() || savedName?.trim() || savedSubSig,
      );

      if (!hasData || !hasName) {
        showModal(
          "Subcontractor Signature Required",
          "The scope approval signature and printed name are required to approve the order.",
          "warning",
        );
        return false;
      }
    }

    if (targetStatus === "FINALIZED") {
      console.log("FINALIZED");
      const savedContractorSig = orderData.signatures?.find(
        (s: any) => s.signatureRole === "CONTRACTOR",
      ) as any;

      const savedData =
        savedContractorSig?.signatureData ||
        savedContractorSig?.signatureUrl ||
        savedContractorSig?.imageUrl ||
        savedContractorSig?.data ||
        savedContractorSig?.url;

      const savedName =
        savedContractorSig?.signatureName ||
        savedContractorSig?.printedName ||
        savedContractorSig?.name ||
        savedContractorSig?.signerName;

      const hasData = Boolean(
        contractorData || savedData || savedContractorSig,
      );
      const hasName = Boolean(
        contractorName?.trim() || savedName?.trim() || savedContractorSig,
      );

      if (!hasData || !hasName) {
        showModal(
          "Contractor Signature Required",
          "The contractor signature and printed name are required to finalize the order.",
          "warning",
        );
        return false;
      }
    }

    return true;
  };

  const showModal = (
    title: string,
    body: string,
    variant: "success" | "warning" | "danger",
  ) => {
    setModalConfig({ title, body, variant });
    setShowPopupModal(true);
  };

  const handleSaveDraft = (
    callbackOnSuccess?: (savedOrder: any) => void,
    showNotification = true,
  ) => {
    if (!validateData()) return;

    const payload = buildCurrentPayload();

    mutateSave(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedOrder = response.data;
          // IMPORTANTE: Actualizamos el Store global completo
          setFullData(savedOrder);
          if (savedOrder.tasks) setTaskData(savedOrder.tasks);

          if (showNotification) {
            showModal(
              "Success!",
              "Your draft has been saved successfully.",
              "success",
            );
          }
          if (callbackOnSuccess) {
            callbackOnSuccess(savedOrder);
          }
        },
        onError: (error) => {
          console.error("Error saving order", error);
          showModal(
            "Save Failed",
            "An error occurred while saving. Please try again.",
            "danger",
          );
        },
      },
    );
  };

  const handleApprove = () => {
    if (!validateData("APPROVED")) return;

    // Guardamos firmas/datos actuales antes de aprobar
    handleSaveDraft((savedOrder) => {
      mutateApprove(
        { orderId: savedOrder.id },
        {
          onSuccess: (response) => {
            // Reemplazamos todo el objeto con el resultado devuelto por el backend
            setFullData(response.data);
            showModal(
              "Order Approved!",
              "The change order has been successfully approved.",
              "success",
            );
          },
          onError: (error) => {
            console.error("Error approving order", error);
            showModal(
              "Approval Failed",
              "Could not approve the order. Try again.",
              "danger",
            );
          },
        },
      );
    }, false);
  };

  const handleFinalize = () => {
    if (!validateData("FINALIZED")) return;

    // Guardamos la firma final del contratista antes de cambiar el estado a FINALIZED
    handleSaveDraft((savedOrder) => {
      mutateFinalize(
        {
          orderId: savedOrder.id,
          jobData: {
            number: jobData?.number ?? "not found",
            name: jobData?.name ?? "not found",
          },
        },
        {
          onSuccess: (response) => {
            // AL ACTUALIZAR EL STORE COMPLETO, 'orderStatus' PASA A 'FINALIZED'
            setFullData(response.data);
            showModal(
              "Order Finalized!",
              "The change order has been successfully finalized and closed.",
              "success",
            );
          },
          onError: (error) => {
            console.error("Error finalizing order", error);
            showModal(
              "Finalization Failed",
              "Could not finalize the order.",
              "danger",
            );
          },
        },
      );
    }, false);
  };

  return (
    <Col>
      <Card className="mb-2 shadow-sm border-0 no-print">
        <Card.Body>
          <Row className="align-items-center">
            {/* Estado actual del documento */}
            <Col md={4} className="text-start d-none d-md-block">
              <Badge
                bg={isFinalized ? "success" : isApproved ? "info" : "warning"}
                className="px-3 py-2 text-uppercase"
              >
                STATUS: {orderData.orderStatus || "DRAFT"}
              </Badge>
            </Col>

            <Col md={8} className="text-end">
              <div className="d-flex justify-content-end gap-2 align-items-center">
                {/* ETAPA 1: DRAFT */}
                {isDraft && (
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
                      variant="info"
                      className="px-4 py-2 fw-bold shadow-sm text-white"
                      onClick={handleApprove}
                      disabled={isActionDisabled}
                    >
                      {isApproving ? "Approving..." : "Approve (Subcontractor)"}
                    </Button>
                  </>
                )}

                {/* ETAPA 2: APPROVED */}
                {isApproved && (
                  <>
                    <Button
                      variant="outline-primary"
                      style={{ width: "140px", fontWeight: "bold" }}
                      onClick={() => handleSaveDraft()}
                      disabled={isActionDisabled}
                    >
                      {isSavingReport ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="success"
                      className="px-4 py-2 fw-bold shadow-sm"
                      onClick={handleFinalize}
                      disabled={isActionDisabled}
                    >
                      {isFinalizing ? "Finalizing..." : "Finalize (Contractor)"}
                    </Button>
                  </>
                )}

                {/* ETAPA 3: FINALIZED (Único estado donde solo se muestra PDF) */}
                {isFinalized && (
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
  );
}

export default ActionButtons;
