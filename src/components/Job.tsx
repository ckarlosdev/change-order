import { Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useJob from "../hooks/useJob";
import { useContextStore } from "../stores/useContextStore";

type Props = {};

function Job({}: Props) {
  
  const { jobId } = useContextStore();
  const { data: job, isLoading, isError } = useJob(jobId ? Number(jobId) : 0);

  if (isLoading) return <div>Loading Job data {jobId}...</div>;
  if (isError) return <div>Error loading Job data.</div>;

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0">
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Job data
            </Card.Title>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInputJobNumber"
                  label="Job Number"
                  className="mb-2"
                >
                  <Form.Control
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    readOnly
                    value={job?.number ?? ""}
                    type="text"
                    placeholder="#"
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingInputJobAddress"
                  label="Job Address"
                >
                  <Form.Control
                    type="text"
                    placeholder="#"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    readOnly
                    value={job?.address ?? ""}
                  />
                </FloatingLabel>
              </Col>

              <Col>
                <FloatingLabel
                  controlId="floatingInputJobName"
                  label="Job Name"
                  className="mb-2"
                >
                  <Form.Control
                    type="text"
                    placeholder="#"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    readOnly
                    value={job?.name ?? ""}
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingInputContractor"
                  label="Contractor"
                >
                  <Form.Control
                    type="text"
                    placeholder="#"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    readOnly
                    value={job?.contractor ?? ""}
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

export default Job;

