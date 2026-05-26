import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useModalsStore from "../../stores/useModalsStore";
import useTaskStore from "../../stores/useTaskStore";
import { FaUsers } from "react-icons/fa";

type Props = {};

function CrewModal({}: Props) {
  const { selectedTask, showCrewModal, setShowCrewModal } = useModalsStore();
  const { assignedTasks, updateTask } = useTaskStore();

  const task = assignedTasks.find((t) => t.temporalId === selectedTask);

  return (
    <>
      <Modal
        show={showCrewModal}
        onHide={() => setShowCrewModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="mb-0 d-flex align-items-center gap-2">
            <FaUsers />
            Crew
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInputForeman"
                label="Foreman"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  value={task?.foreman || 0}
                  onChange={(e) =>
                    updateTask(task?.temporalId!, {
                      foreman: Number(e.target.value),
                    })
                  }
                  type="number"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInputLaborers"
                label="Laborers"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  value={task?.labor || 0}
                  onChange={(e) =>
                    updateTask(task?.temporalId!, {
                      labor: Number(e.target.value),
                    })
                  }
                  type="number"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInputOthers"
                label="Others"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  value={task?.other || 0}
                  onChange={(e) =>
                    updateTask(task?.temporalId!, {
                      other: Number(e.target.value),
                    })
                  }
                  type="number"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInputHours"
                label="Total Hours"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  value={task?.totalHours || 0}
                  onChange={(e) =>
                    updateTask(task?.temporalId!, {
                      totalHours: Number(e.target.value),
                    })
                  }
                  type="number"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInputComments"
                label="Comments"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    height: "100px",
                  }}
                  value={task?.comments || ""}
                  onChange={(e) =>
                    updateTask(task?.temporalId!, {
                      comments: e.target.value,
                    })
                  }
                  as="textarea"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            style={{ fontWeight: "bold" }}
            onClick={() => setShowCrewModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CrewModal;
