import { Button, Card } from "react-bootstrap";
import useModalsStore from "../../stores/useModalsStore";
import type { Task } from "../../types";
import { FiEdit3 } from "react-icons/fi";
import { FaCommentDots, FaRulerCombined, FaTruckMoving } from "react-icons/fa";
import { PiShippingContainerFill } from "react-icons/pi";
import useOrderStore from "../../stores/useOrderStore";

type Props = {
  task?: Task;
};

function DumpsterCard({ task }: Props) {
  const { setShowDumpsterModal: showModal, setSelectedTask } = useModalsStore();
  const { orderData } = useOrderStore();

  const isLocked = orderData.orderStatus === "FINALIZED";

  const handleUpdateCard = () => {
    showModal(true);
    setSelectedTask(task?.temporalId!);
  };

  const dumpsters = task?.dumpsters || [];

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 d-flex align-items-center gap-2">
            <PiShippingContainerFill />
            Dumpsters
          </Card.Title>
          <div className="d-flex gap-1 no-print">
            <Button
              variant="outline-primary"
              size="sm"
              className="border-0"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                gap: "8px",
                fontWeight: "bold",
              }}
              title="Update"
              onClick={() => handleUpdateCard()}
              disabled={isLocked}
            >
              <FiEdit3 size={18} className="" />
              Update
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-3">
          {dumpsters.length > 0 ? (
            <div
              className="d-flex flex-column gap-2"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {dumpsters.map((item) => (
                <div
                  key={item.temporalId}
                  className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border"
                >
                  <div className="d-flex align-items-center">
                    {/* Indicador de Cantidad */}
                    <div
                      className="bg-white border rounded px-2 py-1 me-3 shadow-sm text-center"
                      style={{ minWidth: "40px" }}
                    >
                      <span className="fw-bold text-primary">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Información del Dumpster */}
                    <div>
                      <div
                        className="fw-bold text-dark mb-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {item.materialType}
                      </div>
                      <div
                        className="text-muted d-flex align-items-center"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <FaRulerCombined className="me-1" size={10} />
                        Size:{" "}
                        <span className="ms-1 fw-semibold text-primary">
                          {item.dumpsterSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Icono de estado/tipo (opcional) */}
                  <div className="text-muted opacity-25">
                    <FaTruckMoving size={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2 mb-3 text-muted small italic">
              No dumpsters reported.
            </div>
          )}

          {task?.dumpsterComments != "" && (
            <div className="bg-light p-3 rounded-3 border-start border-4 border-primary mt-2">
              <div className="d-flex align-items-center mb-2">
                <FaCommentDots className="text-primary me-2" />
                <span className="fw-bold small text-uppercase">
                  Equipment Notes
                </span>
              </div>
              <p
                className="text-secondary mb-0 small"
                style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}
              >
                {task?.dumpsterComments ||
                  "No comments provided for this shift."}
              </p>
            </div>
          )}

          {dumpsters.length > 0 && (
            <div className="mt-3 pt-2 border-top d-flex justify-content-end">
              <span className="text-muted" style={{ fontSize: "11px" }}>
                Total Units:{" "}
                <strong>
                  {dumpsters?.reduce(
                    (acc, item) => acc + (item.quantity || 0),
                    0,
                  )}
                </strong>
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default DumpsterCard;
