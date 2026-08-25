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
import { FaTrash } from "react-icons/fa";
import useTaskStore from "../../stores/useTaskStore";
import { GiMineTruck } from "react-icons/gi";

type Props = {};

const EQUIPMENT_SUGGESTIONS = [
  "Backhoe Loader",
  "Boom Lift",
  "Bulldozer",
  "Compactor",
  "Dingo",
  "Excavator",
  "Forklift",
  "Scissor Lift",
  "Skid Loader",
  "Telehandler",
  "Wheel Loader",
];

function EquipmentModal({}: Props) {
  const { selectedTask, showEquipmentModal, setShowEquipmentModal } =
    useModalsStore();

  const {
    assignedTasks,
    equipmentData,
    setEquipmentData,
    removeEquipment,
    addEquipment,
    updateTask,
  } = useTaskStore();

  const task = assignedTasks.find((t) => t.temporalId === selectedTask);

  const handleAdd = () => {
    if (!equipmentData.equipmentName) return;
    addEquipment(selectedTask, equipmentData);
  };

  return (
    <>
      <Modal
        show={showEquipmentModal}
        onHide={() => setShowEquipmentModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="mb-0 d-flex align-items-center gap-2">
            <GiMineTruck /> Equipments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* SECCIÓN 1: FORMULARIO DE ENTRADA */}
          <div className="bg-light p-3 rounded mb-4 border">
            <Row className="g-2 align-items-end">
              <Col md={7} xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Equipment Name
                  </Form.Label>
                  <Form.Control
                    list="equipment-options"
                    placeholder="Search e.g. Skid Loader..."
                    value={equipmentData.equipmentName}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    onChange={(e) =>
                      setEquipmentData("equipmentName", e.target.value)
                    }
                  />
                  <datalist id="equipment-options">
                    {EQUIPMENT_SUGGESTIONS.map((opt) => (
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
                    // value={equipmentData.quantity}
                    value={
                      equipmentData.quantity === 0
                        ? ""
                        : (equipmentData.quantity ?? "")
                    }
                    // onChange={(e) =>
                    //   setEquipmentData("quantity", Number(e.target.value))
                    // }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue === "") {
                        setEquipmentData("quantity", 0);
                        return;
                      }

                      const numValue = Number(inputValue);
                      if (numValue >= 0) {
                        setEquipmentData("quantity", numValue);
                      }
                    }}
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

          {/* SECCIÓN 2: LISTA DE EQUIPOS AGREGADOS */}
          <Row className="mb-2">
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase fw-bold mb-0 small">
                  Equipment added{" "}
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
                {task?.equipments.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p className="mb-0 small italic">
                      No equipment selected yet.
                    </p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {task?.equipments.map((item) => (
                      <ListGroup.Item
                        key={item.temporalId}
                        className="d-flex justify-content-between align-items-center py-2"
                      >
                        <div>
                          <span className="badge bg-primary-subtle text-primary me-2">
                            {item.quantity}
                          </span>
                          <span className="fw-semibold text-dark">
                            {item.equipmentName}
                          </span>
                        </div>
                        <Button
                          variant="link"
                          className="text-danger p-0 shadow-none"
                          onClick={() =>
                            removeEquipment(selectedTask, item.temporalId)
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
                  value={task?.equipmentComments}
                  onChange={(e) =>
                    updateTask(selectedTask, {
                      equipmentComments: e.target.value,
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
            onClick={() => setShowEquipmentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EquipmentModal;
