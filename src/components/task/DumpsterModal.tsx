import {
  Button,
  Col,
  FloatingLabel,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import useModalsStore from "../../stores/useModalsStore";
import useTaskStore from "../../stores/useTaskStore";
import { FaPlus, FaRecycle, FaRulerCombined, FaTrash } from "react-icons/fa";
import { PiShippingContainerFill, PiShippingContainerLight } from "react-icons/pi";

type Props = {};

const MATERIAL_SUGGESTIONS = ["Concrete", "C&D", "Metal", "Aluminum", "Other"];

const SIZE_SUGGESTIONS = [
  "40",
  "30",
  "35",
  "20",
  "12",
  "Semi",
  "Gondola",
  "Quad",
];

function DumpsterModal({}: Props) {
  const {
    selectedTask,
    showDumpsterModal: showModal,
    setShowDumpsterModal: setShowModal,
  } = useModalsStore();

  const {
    assignedTasks,
    dumpsterData,
    setDumpsterData,
    removeDumpster,
    addDumpster,
    updateTask,
  } = useTaskStore();

  const task = assignedTasks.find((t) => t.temporalId === selectedTask);

  const handleAdd = () => {
    console.log("adding");
    if (!dumpsterData.materialType) return;
    if (!dumpsterData.dumpsterSize) return;
    console.log(dumpsterData);
    console.log(task?.dumpsters);

    addDumpster(selectedTask, dumpsterData);
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
            <PiShippingContainerFill /> Dumpsters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          {/* SECCIÓN 1: FORMULARIO DE ENTRADA */}
          <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border border-primary-subtle">
            {/* <div className="d-flex align-items-center mb-3 text-primary">
              <PiShippingContainerLight className="me-2" />
              <h6 className="mb-0 fw-bold text-uppercase small">
                Add New Dumpster
              </h6>
            </div> */}

            <Row className="g-3 align-items-end">
              {/* Campo de Material */}
              <Col md={5} xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary d-flex align-items-center">
                    <FaRecycle className="me-1" /> Material Type
                  </Form.Label>
                  <Form.Control
                    list="dumpster-material"
                    placeholder="e.g. Concrete, Trash..."
                    className="border-secondary-subtle"
                    value={dumpsterData.materialType}
                    onChange={(e) =>
                      setDumpsterData("materialType", e.target.value)
                    }
                  />
                  <datalist id="dumpster-material">
                    {MATERIAL_SUGGESTIONS.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>

              {/* Campo de Tamaño */}
              <Col md={4} xs={7}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary d-flex align-items-center">
                    <FaRulerCombined className="me-1" /> Size / Yards
                  </Form.Label>
                  <Form.Control
                    list="dumpster-size"
                    placeholder="e.g. 20 Yards"
                    className="border-secondary-subtle"
                    value={dumpsterData.dumpsterSize}
                    onChange={(e) =>
                      setDumpsterData("dumpsterSize", e.target.value)
                    }
                  />
                  <datalist id="dumpster-size">
                    {SIZE_SUGGESTIONS.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>

              {/* Campo de Cantidad */}
              {/* Qty */}
              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">
                    Qty
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    className="text-center fw-bold border-secondary-subtle"
                    placeholder="0"
                    value={dumpsterData.quantity}
                    onChange={(e) =>
                      setDumpsterData("quantity", Number(e.target.value))
                    }
                  />
                </Form.Group>
              </Col>

              {/* BOTÓN DE ACCIÓN - Ocupa toda la fila en móvil para mejor UX */}
              <Col xs={12} className="mt-3">
                <Button
                  variant="primary"
                  className="w-100 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                  style={{ height: "45px" }}
                  onClick={handleAdd}
                >
                  <FaPlus className="me-2" /> Add to List
                </Button>
              </Col>
            </Row>
          </div>

          {/* SECCIÓN 2: TÍTULO DE LISTA (Opcional si ya tienes la lista debajo) */}
          <div className="d-flex align-items-center px-1 mb-2">
            <div className="flex-grow-1 border-bottom me-2"></div>
            <span className="small text-muted fw-bold text-uppercase">
              Current Dumpsters
            </span>
            <div className="flex-grow-1 border-bottom ms-2"></div>
          </div>
          <div className="equipment-list-container">
            {task?.dumpsters.length === 0 ? (
              <div className="text-center py-5 border rounded-4 bg-light border-dashed">
                {/* <FaTruckContainer className="text-muted mb-2 opacity-25" size={40} /> */}
                <p className="text-muted small mb-0">
                  No dumpsters added to the report yet.
                </p>
              </div>
            ) : (
              <ListGroup className="shadow-sm rounded-4 overflow-hidden">
                {task?.dumpsters.map((item) => (
                  <ListGroup.Item
                    key={item.temporalId}
                    className="py-3 px-3 border-start-0 border-end-0 border-top-0 border-bottom"
                    style={{ borderLeft: "4px solid #0d6efd" }} // Línea de acento lateral
                  >
                    <Row className="align-items-center">
                      {/* Cantidad con Badge Circular */}
                      <Col xs="auto">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "35px",
                            height: "35px",
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.quantity}
                        </div>
                      </Col>

                      {/* Detalles del Contenedor */}
                      <Col>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-dark d-flex align-items-center">
                            {item.materialType}
                            <span className="mx-2 text-muted opacity-50">
                              |
                            </span>
                            <span className="text-primary small">
                              {item.dumpsterSize || "20 Yds"}
                            </span>
                          </span>
                          {/* {item.comments && (
                            <small className="text-muted mt-1 italic">
                                <FaCommentDots className="me-1" size={12} />
                                {item.comments}
                            </small>
                            )} */}
                        </div>
                      </Col>

                      {/* Acciones */}
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="border-0 p-2"
                          onClick={() =>
                            removeDumpster(task.temporalId, item.temporalId)
                          }
                        >
                          <FaTrash size={14} />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
          <Row className="mt-2">
            <Col>
              <FloatingLabel
                controlId="floatingInputTaskDecription"
                label="Comments"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    height: "100px",
                  }}
                  value={task?.dumpsterComments || ""}
                  onChange={(e) =>
                    updateTask(selectedTask, {
                      dumpsterComments: e.target.value,
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

export default DumpsterModal;
