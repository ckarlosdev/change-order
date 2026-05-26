import {
  Button,
  Col,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import useModalsStore from "../../stores/useModalsStore";
import useTaskStore from "../../stores/useTaskStore";
import { FaTrash } from "react-icons/fa";
import { BsTools } from "react-icons/bs";

type Props = {};

const TOOL_SUGGESTIONS = [
  "Shovel",
  "Broom",
  "Squeegee",
  "Demo Cart",
  "Fan",
  "Negative",
];

function ToolModal({}: Props) {
  const {
    selectedTask,
    showToolModal: showModal,
    setShowToolModal: setShowModal,
  } = useModalsStore();

  const {
    assignedTasks,
    toolData,
    setToolData,
    removeTool,
    addTool,
    updateTask,
  } = useTaskStore();

  const task = assignedTasks.find((t) => t.temporalId === selectedTask);

  const handleAdd = () => {
    if (!toolData.toolName) return;
    addTool(selectedTask, toolData);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="mb-0 d-flex align-items-center gap-2">
            <BsTools />
            Tools
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="bg-light p-3 rounded mb-4 border">
            <Row className="g-2 align-items-end">
              <Col md={7} xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Tool Name
                  </Form.Label>
                  <Form.Control
                    list="equipment-options"
                    placeholder="Search e.g. shovel..."
                    value={toolData.toolName}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    onChange={(e) => setToolData("toolName", e.target.value)}
                  />
                  <datalist id="equipment-options">
                    {TOOL_SUGGESTIONS.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>

              <Col md={3} xs={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Qty
                  </Form.Label>
                  <Form.Control
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    type="number"
                    min="1"
                    value={toolData.quantity}
                    onChange={(e) =>
                      setToolData("quantity", Number(e.target.value))
                    }
                    // onKeyDown={(e) => e.key === "Enter" && handleAdd()} // UX: Agregar con Enter
                  />
                </Form.Group>
              </Col>

              <Col md={2} xs={4}>
                <Button
                  variant="primary"
                  className="w-100 fw-bold"
                  onClick={() => handleAdd()}
                  //   disabled={!currentEquip.equipmentName.trim()}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </div>

          <Row className="mb-2">
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase fw-bold mb-0 small">
                  Tools added{" "}
                  <span className="badge bg-secondary ms-1">
                    {task?.equipments.length}
                  </span>
                </h6>
              </div>

              <div
                className="border rounded-3"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                }}
              >
                {task?.tools.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p className="mb-0 small italic">
                      No equipment selected yet.
                    </p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {task?.tools.map((item) => (
                      <ListGroup.Item
                        key={item.temporalId}
                        className="d-flex justify-content-between align-items-center py-2"
                      >
                        <div>
                          <span className="badge bg-primary-subtle text-primary me-2">
                            {item.quantity}
                          </span>
                          <span className="fw-semibold text-dark">
                            {item.toolName}
                          </span>
                        </div>
                        <Button
                          variant="link"
                          className="text-danger p-0 shadow-none"
                          onClick={() =>
                            removeTool(selectedTask, item.temporalId)
                          }
                        >
                          <FaTrash />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInputTaskDecription"
                label="Comments"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    height: "100px",
                  }}
                  value={task?.toolComments || ""}
                  onChange={(e) =>
                    updateTask(selectedTask, {
                      toolComments: e.target.value,
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
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ToolModal;
