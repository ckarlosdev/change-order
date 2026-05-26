import { Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useEmployees from "../hooks/useEmployees";
import useOrderStore from "../stores/useOrderStore";

type Props = {};

function General({}: Props) {
  const { data: employees } = useEmployees();
  const { orderData, setChangeOrderData } = useOrderStore();

  const employeesFiltered = employees?.filter(
    (emp) =>
      emp.status.toLowerCase() === "active" &&
      emp.title.toLowerCase() === "supervisor",
  );

  const employeesOrdered = employeesFiltered?.sort((a, b) =>
    a.firstName.localeCompare(b.firstName),
  );

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0">
          <Card.Body>
            {/* <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Job data
            </Card.Title> */}
            <Row>
              <Col>
                <FloatingLabel controlId="floatingInputForeman" label="Foreman">
                  <Form.Select
                    aria-label="Select Foreman"
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "18px",
                    }}
                    value={orderData.employeeId ?? ""}
                    onChange={(e) =>
                      setChangeOrderData("employeeId", Number(e.target.value))
                    }
                  >
                    <option value="">Select foreman</option>
                    {employeesOrdered?.map((employee) => {
                      const fullName = `${employee.firstName} ${employee.lastName}`;

                      return (
                        <option
                          key={employee.employeesId}
                          value={employee.employeesId}
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {fullName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel controlId="floatingInputDate" label="Date">
                  <Form.Control
                    type="date"
                    placeholder="#"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    value={orderData.orderDate}
                    onChange={(e) => setChangeOrderData("orderDate", e.target.value)}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default General;
