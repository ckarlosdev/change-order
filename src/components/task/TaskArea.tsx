import { Button, Card, Col, Row } from "react-bootstrap";
import { BiTask } from "react-icons/bi";
import useTaskStore from "../../stores/useTaskStore";
import Task from "./Task";
import useOrderStore from "../../stores/useOrderStore";

type Props = {};

function TaskArea({}: Props) {
  const { setShowTaskModal, assignedTasks, setNewTask } = useTaskStore();
  const { orderData } = useOrderStore();
  // console.log(assignedTasks);

  const isLocked = orderData.orderStatus === "FINALIZED";

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0">
          <Card.Body>
            <Row className="mb-2">
              <Col>
                <div className="d-flex justify-content-center w-100 ">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setShowTaskModal(true);
                      setNewTask();
                    }}
                    disabled={isLocked}
                    style={{
                      display: "flex",
                      alignItems: "center", // Centra verticalmente icono y texto
                      justifyContent: "center",
                      gap: "8px", // Separa el icono del texto de forma exacta
                      padding: "10px 20px",
                      fontWeight: "600",
                      lineHeight: "1", // Evita que el texto empuje el botón hacia abajo
                    }}
                    className="no-print"
                  >
                    <BiTask size={20} />
                    Add New Task
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                {assignedTasks.map((task) => (
                  <Task key={task.temporalId} tempId={task.temporalId} />
                ))}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default TaskArea;
