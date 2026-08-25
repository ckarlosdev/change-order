import { Card, Col, Row } from "react-bootstrap";
import useOrderStore from "../stores/useOrderStore";
import SignatureViewer from "./SignatureViewer";

type Props = {};

function PreViewer({}: Props) {
  const { orderData: order } = useOrderStore();

  const subcontractorSig = order.signatures?.find(
    (s) => s.signatureRole === "SUBCONTRACTOR",
  );
  const contractorSig = order.signatures?.find(
    (s) => s.signatureRole === "CONTRACTOR",
  );

  return (
    <>
      <Col>
        <Card className="mb-3 shadow-sm border-0 w-100 mt-3">
          <Card.Body className="p-4">
            <Row className="text-center">
              {/* Columna de la Firma del Subcontratista */}
              <Col md={6} className="mb-4 mb-md-0 px-4">
                <SignatureViewer
                  signature={subcontractorSig}
                  legalText="We are agree to furnish labor & materials complete in accordance with the above specification at the price stated above."
                  label="Scope Approval"
                />
              </Col>

              {/* Columna de la Firma del Contratista General */}
              <Col md={6} className="px-4">
                <SignatureViewer
                  signature={contractorSig}
                  legalText="Above additional work to be performed under the same conditions as specified in the original contract unless otherwise stipulated in writing."
                  label="Finalized"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default PreViewer;
