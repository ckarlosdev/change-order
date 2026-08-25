import { Button, Card } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import useModalsStore from "../../stores/useModalsStore";
import type { Task } from "../../types";
import { FaCommentDots } from "react-icons/fa";
import { GiMineTruck } from "react-icons/gi";
import useOrderStore from "../../stores/useOrderStore";

type Props = {
  task?: Task;
};

function EquipmentCard({ task }: Props) {
  const { setShowEquipmentModal: showModal, setSelectedTask } =
    useModalsStore();
  const { orderData } = useOrderStore();

  const isLocked = orderData.orderStatus === "FINALIZED";

  const handleUpdateCard = () => {
    showModal(true);
    setSelectedTask(task?.temporalId!);
  };

  const groupedEquipment = task?.equipments.reduce(
    (acc: Record<string, number>, item) => {
      if (!acc[item.equipmentName]) {
        acc[item.equipmentName] = 0;
      }
      acc[item.equipmentName] += item.quantity;
      return acc;
    },
    {},
  );

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 d-flex align-items-center gap-2">
            <GiMineTruck />
            Equipments
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
          {/* <div className="d-flex align-items-center mb-3 border-bottom pb-2">
            <FaCogs className="text-primary me-2" />
            <span className="fw-bold text-uppercase small text-secondary">
              Equipment Summary
            </span>
          </div> */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {Object.entries(groupedEquipment || {}).length > 0 ? (
              Object.entries(groupedEquipment || {}).map(([name, total]) => (
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

          {task?.equipmentComments != "" && (
            <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
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
                {task?.equipmentComments ||
                  "No comments provided for this shift."}
              </p>
            </div>
          )}

          {/* Indicador de total global (opcional) */}
          {Object.keys(groupedEquipment || {}).length > 0 && (
            <div className="mt-3 pt-2 border-top d-flex justify-content-end">
              <span className="text-muted" style={{ fontSize: "11px" }}>
                Total Units:{" "}
                <strong>
                  {task?.equipments.reduce((sum, e) => sum + e.quantity, 0)}
                </strong>
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default EquipmentCard;
