import { useEffect, useRef } from "react";
import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import useEmployees from "../hooks/useEmployees";
import useOrderStore from "../stores/useOrderStore";
import { useContextStore } from "../stores/useContextStore";
import { useNextOrderNumber } from "../hooks/useOrder";

type Props = {};

function General({}: Props) {
  const { data: employees } = useEmployees();
  const { orderData, setChangeOrderData } = useOrderStore();
  const jobId = useContextStore((s) => s.jobId);
  const changeOrderId = useContextStore((s) => s.changeOrderId);

  // Only a new order gets a proposed number; an existing order keeps the one it
  // was saved with (the "Suggest" button stays available for it).
  const isNewOrder = !changeOrderId && !orderData.id;
  const needsNumber = isNewOrder && !orderData.orderNumber;

  // Propose only once per mount, so clearing the field on purpose doesn't refill it.
  const hasProposed = useRef(false);

  const {
    data: nextNumber,
    isFetching: isFetchingNextNumber,
    refetch: refetchNextNumber,
  } = useNextOrderNumber(jobId, needsNumber && !hasProposed.current);

  useEffect(() => {
    if (!nextNumber || isFetchingNextNumber || hasProposed.current) return;
    // Re-check the live state: a late response must not overwrite an existing order.
    const current = useOrderStore.getState().orderData;
    const isStillNew =
      !useContextStore.getState().changeOrderId && !current.id;
    if (isStillNew && !current.orderNumber) {
      setChangeOrderData("orderNumber", nextNumber.nextOrderNumber);
    }
    hasProposed.current = true;
  }, [nextNumber, isFetchingNextNumber]);

  const handleSuggestNumber = async () => {
    hasProposed.current = true;
    const { data } = await refetchNextNumber();
    if (data) setChangeOrderData("orderNumber", data.nextOrderNumber);
  };

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
              <Col>
                <InputGroup>
                  <FloatingLabel
                    controlId="floatingInputOrderNumber"
                    label="Order #"
                  >
                    <Form.Control
                      type="number"
                      min={1}
                      step={1}
                      placeholder="#"
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                      value={orderData.orderNumber ?? ""}
                      onChange={(e) =>
                        setChangeOrderData(
                          "orderNumber",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                  </FloatingLabel>
                  <Button
                    variant="outline-secondary"
                    className="no-print"
                    title="Suggest the next order number for this job"
                    onClick={handleSuggestNumber}
                    disabled={!jobId || isFetchingNextNumber}
                  >
                    {isFetchingNextNumber ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Suggest"
                    )}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default General;
