import { Button, Card } from "react-bootstrap";
import useModalsStore from "../../stores/useModalsStore";
import type { Task } from "../../types";
import { FiEdit3 } from "react-icons/fi";
import { FaCommentDots } from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import useOrderStore from "../../stores/useOrderStore";

type Props = {
  task?: Task;
};

function ToolCard({ task }: Props) {
  const { setShowToolModal: showModal, setSelectedTask } = useModalsStore();
  const { orderData } = useOrderStore();

  const isLocked = orderData.orderStatus === "FINALIZED";

  const handleUpdateCard = () => {
    showModal(true);
    setSelectedTask(task?.temporalId!);
  };

  const groupedTool = task?.tools.reduce(
    (acc: Record<string, number>, item) => {
      if (!acc[item.toolName]) {
        acc[item.toolName] = 0;
      }
      acc[item.toolName] += item.quantity;
      return acc;
    },
    {},
  );

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 d-flex align-items-center gap-2">
            <BsTools />
            Tools
          </Card.Title>
          <div className="d-flex gap-1 no-print">
            <Button
              variant="outline-primary"
              size="sm"
              className="border-0"
              style={{
                display: "flex",
                alignItems: "center", // Centra verticalmente icono y texto
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
          <div className="d-flex flex-wrap gap-2 mb-3">
            {Object.entries(groupedTool || {}).length > 0 ? (
              Object.entries(groupedTool || {}).map(([name, total]) => (
                <div
                  key={name}
                  className="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm"
                >
                  <span className="fw-bold text-primary me-2">{total}</span>
                  <span className="text-dark small fw-semibold">{name}</span>
                </div>
              ))
            ) : (
              <span className="text-muted small italic">
                No equipment reported.
              </span>
            )}
          </div>

          {task?.toolComments != "" && (
            <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
              <div className="d-flex align-items-center mb-2">
                <FaCommentDots className="text-primary me-2" />
                <span className="fw-bold small text-uppercase">Tool Notes</span>
              </div>
              <p
                className="text-secondary mb-0 small"
                style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}
              >
                {task?.toolComments || "No comments provided for this shift."}
              </p>
            </div>
          )}

          {Object.keys(groupedTool || {}).length > 0 && (
            <div className="mt-3 pt-2 border-top d-flex justify-content-end">
              <span className="text-muted" style={{ fontSize: "11px" }}>
                Total Units:{" "}
                <strong>
                  {task?.tools.reduce((sum, e) => sum + e.quantity, 0)}
                </strong>
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default ToolCard;
