import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useTaskStore from "../../stores/useTaskStore";
import { IoMdAddCircle } from "react-icons/io";
import { BiTask } from "react-icons/bi";

type Props = {};

function TaskModal({}: Props) {
  const { showTaskModal, setShowTaskModal, addTask, taskData, setTaskData } =
    useTaskStore();

  const handleAddTask = () => {
    // Validamos que los campos mínimos tengan algo
    if (taskData.taskName === "" || taskData.taskDescription === "") {
      alert("Please fill in both name and description");
      return;
    }

    addTask(); // Esta función en tu store ya genera el temporalId y limpia initialData
    setShowTaskModal(false); // Cerramos el modal tras agregar
  };

  return (
    <>
      <Modal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="mb-0 d-flex align-items-center gap-2">
            <BiTask />
            Task data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInpuTaskName"
                label="Task short name"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                  }}
                  value={taskData.taskName}
                  onChange={(e) => setTaskData("taskName", e.target.value)}
                  type="text"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInputTaskDecription"
                label="Task description"
                className="mb-2"
              >
                <Form.Control
                  style={{
                    fontWeight: "bold",
                    height: "100px",
                  }}
                  value={taskData.taskDescription}
                  onChange={(e) =>
                    setTaskData("taskDescription", e.target.value)
                  }
                  as="textarea"
                  placeholder="#"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-center w-100">
            <Button
              variant="outline-primary"
              style={{
                display: "flex",
                alignItems: "center", // Centra verticalmente icono y texto
                justifyContent: "center",
                gap: "8px", // Separa el icono del texto de forma exacta
                padding: "10px 20px",
                fontWeight: "600",
                lineHeight: "1", // Evita que el texto empuje el botón hacia abajo
              }}
              onClick={() => handleAddTask()}
            >
              {taskData.id != null ? (
                "Save"
              ) : (
                <span className="d-flex align-items-center gap-2">
                  <IoMdAddCircle size={20} />
                  <span>Add task</span>
                </span>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskModal;
