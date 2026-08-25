import { Button, Card, Col, Row } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import type { Task } from "../../types";
import {
  FaClock,
  FaCommentDots,
  FaHardHat,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import useModalsStore from "../../stores/useModalsStore";
import useOrderStore from "../../stores/useOrderStore";

type Props = {
  task?: Task;
};

function CrewCard({ task }: Props) {
  const { setShowCrewModal, setSelectedTask } = useModalsStore();
  const { orderData } = useOrderStore();

  const isLocked = orderData.orderStatus === "FINALIZED";

  const handleUpdateCrew = () => {
    setShowCrewModal(true);
    setSelectedTask(task?.temporalId!);
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 d-flex align-items-center gap-2">
            <FaUsers />
            Crew
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
              onClick={() => handleUpdateCrew()}
              disabled={isLocked}
            >
              <FiEdit3 size={18} className="" />
              Update
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4 text-center align-items-center g-0">
            {/* Foreman */}
            <Col className="border-end">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="text-muted fw-bold text-uppercase mb-1"
                  style={{ fontSize: "10px" }}
                >
                  <FaUserTie className="me-1 text-primary" /> Foreman
                </div>
                <h4 className="fw-bold mb-0">{task?.foreman || 0}</h4>
              </div>
            </Col>

            {/* Laborers */}
            <Col className="border-end">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="text-muted fw-bold text-uppercase mb-1"
                  style={{ fontSize: "10px" }}
                >
                  <FaHardHat className="me-1 text-primary" /> Laborers
                </div>
                <h4 className="fw-bold mb-0">{task?.labor || 0}</h4>
              </div>
            </Col>

            {/* Other */}
            <Col className="border-end">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="text-muted fw-bold text-uppercase mb-1"
                  style={{ fontSize: "10px" }}
                >
                  <FaUsers className="me-1 text-primary" /> Other
                </div>
                <h4 className="fw-bold mb-0">{task?.other || 0}</h4>
              </div>
            </Col>

            {/* Total Hours */}
            <Col>
              <div className="d-flex flex-column align-items-center">
                <div
                  className="text-muted fw-bold text-uppercase mb-1"
                  style={{ fontSize: "10px" }}
                >
                  <FaClock className="me-1 text-success" /> Total Hours
                </div>
                <h4 className="fw-bold mb-0 text-success">
                  {task?.totalHours || 0}h
                </h4>
              </div>
            </Col>
          </Row>

          {/* Sección de Comentarios */}
          {task?.comments != "" && (
            <div className="bg-light p-3 rounded-3 border-start border-4 border-primary">
              <div className="d-flex align-items-center mb-2">
                <FaCommentDots className="text-primary me-2" />
                <span className="fw-bold small text-uppercase">Crew Notes</span>
              </div>
              <p
                className="text-secondary mb-0 small"
                style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}
              >
                {task?.comments || "No comments provided for this shift."}
              </p>
            </div>
          )}

          <div className="mt-3 pt-2 border-top d-flex justify-content-end">
            <span className="text-muted" style={{ fontSize: "11px" }}>
              Total Workers:{" "}
              <strong>
                {(task?.foreman || 0) + (task?.labor || 0) + (task?.other || 0)}
              </strong>
            </span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default CrewCard;
