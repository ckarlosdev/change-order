import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import useOrderStore from "../stores/useOrderStore";
import { useContextStore } from "../stores/useContextStore";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useFinalize, useSaveOrder } from "../hooks/useOrder";
import { useAuthStore } from "../stores/authStore";

type Props = {
  onPrint: () => void;
};

function ActionButtons({ onPrint }: Props) {
  const { orderData, setChangeOrderData, setFullData } = useOrderStore();
  const jobId = useContextStore((s) => s.jobId);
  const { assignedTasks, setFullData: setTaskData } = useTaskStore();
  const { mutate, isPending: isSavingReport } = useSaveOrder();
  const { mutate: mutateFinalize, isPending: isFinalizing } = useFinalize();
  const { user: userAuth } = useAuthStore();

  const { subcontractorData, contractorData } = useSignatureStore();

  const isAuthorized = userAuth?.roles?.some(
    (role) =>
      role.name === "ROLE_SUPERVISOR" ||
      role.name === "ROLE_SUPERINTENDENT" ||
      role.name === "ROLE_ADMIN",
  );

  const isLocked = orderData.orderStatus === "FINALIZED";
  const isDisabled = isLocked || isFinalizing || !isAuthorized;

  const buildCurrentPayload = () => {
    const signaturesPayload: any[] = [];
    if (subcontractorData) {
      signaturesPayload.push({
        signatureRole: "SUBCONTRACTOR",
        signatureData: subcontractorData,
      });
    }
    if (contractorData) {
      signaturesPayload.push({
        signatureRole: "CONTRACTOR",
        signatureData: contractorData,
      });
    }

    return {
      ...orderData,
      jobId: jobId,
      tasks: assignedTasks,
      signatures: signaturesPayload,
    };
  };

  const handleSaveDraft = (callbackOnSuccess?: (savedOrder: any) => void) => {
    const payload = buildCurrentPayload();
    console.log(payload);

    mutate(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedOrder = response.data;
          setFullData(savedOrder);
          setTaskData(savedOrder.tasks);
          console.log("Change order saved successfully. ");
          if (callbackOnSuccess) {
            callbackOnSuccess(savedOrder);
          }
        },
        onError: (error) => {
          console.log("Error saving order", error);
        },
      },
    );
  };

  const handleFinalize = () => {
    if (!orderData.id) {
      alert("Please save the draft before finalizing the order.");
      return;
    }

    if (!subcontractorData && !contractorData) {
      alert(
        "At least one signature (contractor or subcontractor) is required to proceed.",
      );
      return;
    }
    console.log("Auto-saving before finalizing...");

    handleSaveDraft((savedOrder) => {
      mutateFinalize(
        { orderId: savedOrder.id },
        {
          onSuccess: (response) => {
            const status = response.data.orderStatus;
            setChangeOrderData("orderStatus", status);
            console.log("Order finalized successfully!");
          },
          onError: (error) => {
            console.error("Error finalizing order", error);
          },
        },
      );
    });
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
                  STATUS: {isDisabled ? "FINALIZED" : "DRAFT"}
                </Badge>
              </Col>

              {/* Lado derecho: Acciones dinámicas */}
              <Col md={8} className="text-end">
                {!isDisabled ? (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      style={{ width: "150px", fontWeight: "bold" }}
                      onClick={() => handleSaveDraft()}
                      disabled={
                        isSavingReport
                        // || !isAuthorized
                      }
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
                        "Save Draft"
                      )}
                    </Button>

                    <Button
                      variant="success"
                      className="px-4 py-2 fw-bold shadow-sm"
                      onClick={handleFinalize}
                    >
                      Finalize
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="primary"
                      className="px-4 py-2 fw-bold d-flex align-items-center no-print"
                      onClick={() => onPrint()}
                    >
                      Download PDF
                    </Button>

                    {/* <Button
                      className="fw-bold"
                      variant="outline-danger"
                      size="sm"
                      //   onClick={voidReport}
                    >
                      Void
                    </Button> */}
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ActionButtons;
