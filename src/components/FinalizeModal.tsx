import { useRef, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";

type SignatureItem = {
  signatureRole: "SUBCONTRACTOR" | "CONTRACTOR";
  signatureData: string;
  signatureName: string;
};

type Props = {
  show: boolean;
  onHide: () => void;
  onConfirm: (signatures: SignatureItem[]) => void;
  isSubmitting: boolean;
};

export function FinalizeModal({
  show,
  onHide,
  onConfirm,
  isSubmitting,
}: Props) {
  const subSignRef = useRef<SignatureCanvas>(null!);
  const conSignRef = useRef<SignatureCanvas>(null!);

  const [subName, setSubName] = useState("");
  const [conName, setConName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = () => {
    setErrorMsg(null);

    const isSubValid =
      subSignRef.current &&
      !subSignRef.current.isEmpty() &&
      subName.trim() !== "";
    const isConValid =
      conSignRef.current &&
      !conSignRef.current.isEmpty() &&
      conName.trim() !== "";

    // 1. Exigir al menos una firma completa
    if (!isSubValid && !isConValid) {
      setErrorMsg(
        "At least one signature (with printed name) is required to finalize.",
      );
      return;
    }

    // 2. Si un usuario firmó pero no puso el nombre (o viceversa), opcionalmente puedes validar incompletez individual
    const isSubPartial =
      (subSignRef.current && !subSignRef.current.isEmpty()) !==
      Boolean(subName.trim());
    const isConPartial =
      (conSignRef.current && !conSignRef.current.isEmpty()) !==
      Boolean(conName.trim());

    if (isSubPartial || isConPartial) {
      setErrorMsg(
        "Please provide both signature and printed name for any completed section.",
      );
      return;
    }

    // 3. Construir el array dinámico de firmas válidas
    const signatures: SignatureItem[] = [];

    if (isSubValid) {
      signatures.push({
        signatureRole: "SUBCONTRACTOR",
        signatureData: subSignRef.current.getCanvas().toDataURL("image/png"),
        signatureName: subName.trim(),
      });
    }

    if (isConValid) {
      signatures.push({
        signatureRole: "CONTRACTOR",
        signatureData: conSignRef.current.getCanvas().toDataURL("image/png"),
        signatureName: conName.trim(),
      });
    }

    onConfirm(signatures);
  };

  const clearCanvas = (ref: React.RefObject<SignatureCanvas>) => {
    if (ref.current) ref.current.clear();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          Finalize Order - Signature Required
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

        <Row>
          {/* Subcontractor Signature */}
          <Col md={6} className="mb-3">
            <h6 className="fw-bold text-center">
              Scope Approval (Subcontractor)
            </h6>
            <div
              style={{
                position: "relative",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                height: "180px",
              }}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={() => clearCanvas(subSignRef)}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  zIndex: 30,
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  padding: 0,
                }}
              >
                ✕
              </Button>
              <SignatureCanvas
                ref={subSignRef}
                penColor="black"
                canvasProps={{ style: { width: "100%", height: "100%" } }}
              />
            </div>
            <Form.Control
              type="text"
              size="sm"
              className="mt-2 text-center"
              placeholder="Printed Name (Subcontractor)"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
          </Col>

          {/* Contractor Signature */}
          <Col md={6} className="mb-3">
            <h6 className="fw-bold text-center">Finalized TMP (Contractor)</h6>
            <div
              style={{
                position: "relative",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                height: "180px",
              }}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={() => clearCanvas(conSignRef)}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  zIndex: 30,
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  padding: 0,
                }}
              >
                ✕
              </Button>
              <SignatureCanvas
                ref={conSignRef}
                penColor="black"
                canvasProps={{ style: { width: "100%", height: "100%" } }}
              />
            </div>
            <Form.Control
              type="text"
              size="sm"
              className="mt-2 text-center"
              placeholder="Printed Name (Contractor)"
              value={conName}
              onChange={(e) => setConName(e.target.value)}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Finalizing..." : "Confirm & Finalize"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
