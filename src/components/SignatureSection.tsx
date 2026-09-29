import { Row, Col, Card } from "react-bootstrap";
import SignatureViewer from "./SignatureViewer"; // Asegura la ruta correcta
import useOrderStore from "../stores/useOrderStore";

function SignatureSection() {
  const { orderData: order } = useOrderStore();

  const savedSubcontractorSig = order?.signatures?.find(
    (s: any) =>
      s.signatureRole === "APPROVED" || s.signatureRole === "SUBCONTRACTOR",
  );
  const savedContractorSig = order?.signatures?.find(
    (s: any) => s.signatureRole === "CONTRACTOR",
  );

  return (
    <Col>
      <Card className="mb-2 shadow-sm border-0">
        <Card.Body>
          <Row className="text-center">
            {/* Subcontractor Signature */}
            <Col md={6} className="px-4 mb-3 mb-md-0">
              {savedSubcontractorSig ? (
                <SignatureViewer
                  signature={savedSubcontractorSig}
                  legalText="We agree to furnish labor & materials complete in accordance with the above specification at the price stated above."
                  label="Scope Approval"
                />
              ) : (
                <div className="p-3 border rounded text-muted bg-light">
                  <small>
                    <em>
                      Scope Approval signature will be captured upon finalizing.
                    </em>
                  </small>
                </div>
              )}
            </Col>

            {/* Contractor Signature */}
            <Col md={6} className="px-4">
              {savedContractorSig ? (
                <SignatureViewer
                  signature={savedContractorSig}
                  legalText="Above additional work to be performed under the same conditions as specified in the original contract unless otherwise stipulated in writing."
                  label="Finalized TMP"
                />
              ) : (
                <div className="p-3 border rounded text-muted bg-light">
                  <small>
                    <em>
                      Contractor signature will be captured upon finalizing.
                    </em>
                  </small>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SignatureSection;
