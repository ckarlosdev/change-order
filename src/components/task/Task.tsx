import { Button, Card, CardBody, Col, Row } from "react-bootstrap";

import { FiEdit3, FiTrash2 } from "react-icons/fi";
import useTaskStore from "../../stores/useTaskStore";
import CrewCard from "./CrewCard";
import EquipmentCard from "./EquipmentCard";
import ToolCard from "./ToolCard";
import DumpsterCard from "./DumpsterCard";
import useOrderStore from "../../stores/useOrderStore";

type Props = {
  tempId: string;
};

function Task({ tempId }: Props) {
  const { orderData } = useOrderStore();
  const { assignedTasks, removeTask, setShowTaskModal, setTaskData } =
    useTaskStore();

  const isLocked = orderData.orderStatus === "FINALIZED";
  const task = assignedTasks.find((task) => task.temporalId === tempId);

  const handleEdit = () => {
    const taskToEdit = assignedTasks.find((t) => t.temporalId === tempId);

    if (taskToEdit) {
      (Object.keys(taskToEdit) as Array<keyof typeof Task>).forEach((key) => {
        setTaskData(
          key as keyof typeof Task,
          taskToEdit[key as keyof typeof Task],
        );
      });
      setShowTaskModal(true);
    }
  };

  // const handleCreateNew = () => {
  //   // Función para resetear a initialData antes de abrir
  //   resetTaskData();
  //   setShowTaskModal(true);
  // };

  return (
    <>
      <Card className="mb-2">
        <CardBody>
          <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom-0">
            <Card.Title className="mb-0">{task?.taskName}</Card.Title>

            <div className="d-flex gap-2 no-print">
              <Button
                variant="outline-secondary"
                size="sm"
                className="border-0 rounded-circle"
                style={{ padding: "8px" }}
                title="Update Task"
                onClick={() => handleEdit()}
                disabled={isLocked}
              >
                <FiEdit3 size={18} className="text-primary" />
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                className="border-0 rounded-circle"
                style={{ padding: "8px" }}
                title="Delete Task"
                onClick={() => {
                  // Levantamos el cuadro de diálogo nativo
                  const seguro = window.confirm(
                    "Are you sure you want to delete this task?",
                  );
                  if (seguro) {
                    removeTask(tempId);
                  }
                }}
                disabled={isLocked}
              >
                <FiTrash2 size={18} className="text-danger" />
              </Button>
            </div>
          </Card.Header>
          <Row className="mb-3">
            <Col>
              <div className="p-3 border-start border-4 border-secondary bg-light rounded-end">
                <label
                  className="d-block text-muted text-uppercase fw-bold mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                >
                  Task Description
                </label>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {task?.taskDescription}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <CrewCard task={task} />
            </Col>
            <Col>
              <EquipmentCard task={task} />
            </Col>
          </Row>
          <Row>
            <Col>
              <ToolCard task={task} />
            </Col>
            <Col>
              <DumpsterCard task={task} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default Task;
