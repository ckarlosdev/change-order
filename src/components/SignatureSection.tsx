import React, { useRef, useEffect, useCallback } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import SignatureViewer from "./SignatureViewer"; // Asegura la ruta correcta
import useOrderStore from "../stores/useOrderStore";
import { useSignatureStore } from "../stores/useSignatureStore";

function SignatureSection() {
  const { orderData: order } = useOrderStore();
  const {
    subcontractorData,
    subcontractorName,
    contractorData,
    contractorName,
    setSubcontractorName,
    setSubcontractorData,
    setContractorName,
    setContractorData,
  } = useSignatureStore();

  // Creamos las referencias para AMBOS canvas
  const subcontractorSignRef = useRef<SignatureCanvas>(null!);
  const contractorSignRef = useRef<SignatureCanvas>(null!);

  // Buscamos si ya existen firmas guardadas en el backend
  const savedSubcontractorSig = order?.signatures?.find(
    (s) =>
      s.signatureRole === "APPROVED" || s.signatureRole === "SUBCONTRACTOR",
  );
  const savedContractorSig = order?.signatures?.find(
    (s) => s.signatureRole === "CONTRACTOR",
  );

  // Función unificada para restaurar los trazos desde el store (útil si rotan la pantalla en iPad)
  const restoreSignatures = useCallback(() => {
    setTimeout(() => {
      // Restauramos subcontratista si no está guardado en DB pero hay info en el store
      if (
        !savedSubcontractorSig &&
        subcontractorData &&
        subcontractorSignRef.current
      ) {
        subcontractorSignRef.current.fromDataURL(subcontractorData, {
          ratio: window.devicePixelRatio || 1,
        });
      }
      // Restauramos contratista si no está guardado en DB pero hay info en el store
      if (!savedContractorSig && contractorData && contractorSignRef.current) {
        contractorSignRef.current.fromDataURL(contractorData, {
          ratio: window.devicePixelRatio || 1,
        });
      }
    }, 150);
  }, [
    subcontractorData,
    contractorData,
    savedSubcontractorSig,
    savedContractorSig,
  ]);

  useEffect(() => {
    restoreSignatures();
  }, [restoreSignatures]);

  useEffect(() => {
    window.addEventListener("resize", restoreSignatures);
    return () => window.removeEventListener("resize", restoreSignatures);
  }, [restoreSignatures]);

  const handleEnd = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current && !ref.current.isEmpty()) {
      try {
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        setter(dataUrl);
      } catch (e) {
        const dataUrl = ref.current.getCanvas().toDataURL("image/png");
        setter(dataUrl);
      }
    }
  };

  const clear = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current) {
      ref.current.clear();
    }
    setter(null);
  };

  return (
    <Col>
      <Card className="mb-2 shadow-sm border-0">
        <Card.Body>
          <Row className="text-center">
            {/* --- COLUMNA 1: SUBCONTRACTOR (Scope Approval) --- */}
            <Col md={6} className="px-4 mb-4 mb-md-0">
              {savedSubcontractorSig ? (
                // Si ya se firmó y guardó en DB, se muestra la imagen bloqueada
                <SignatureViewer
                  signature={savedSubcontractorSig}
                  legalText="We are agree to furnish labor & materials complete in accordance with the above specification at the price stated above."
                  label="Scope Approval"
                />
              ) : (
                // Si es un reporte nuevo, se muestra el Canvas activo para dibujar
                <>
                  <div
                    className="signature-wrapper"
                    style={{
                      position: "relative",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        right: "45px",
                        zIndex: 10,
                        pointerEvents: "none",
                        fontSize: "0.75rem",
                        color: "#6c757d",
                        userSelect: "none",
                        textAlign: "left",
                      }}
                    >
                      We are agree to furnish labor & materials complete in
                      accordance with the above specification at the price
                      stated above.
                    </div>

                    <Button
                      onClick={() =>
                        clear(subcontractorSignRef, setSubcontractorData)
                      }
                      title="Clear signature"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        zIndex: 30,
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        lineHeight: "1",
                      }}
                      variant="danger"
                    >
                      ✕
                    </Button>

                    <SignatureCanvas
                      ref={subcontractorSignRef as React.MutableRefObject<any>}
                      onEnd={() =>
                        handleEnd(subcontractorSignRef, setSubcontractorData)
                      }
                      penColor="black"
                      canvasProps={{
                        className: "sigCanvas",
                        style: {
                          width: "100%",
                          height: "100%",
                          display: "block",
                        },
                      }}
                    />
                  </div>

                  <Form.Group className="mt-2 text-start">
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Approval Name / Printed Name"
                      value={subcontractorName}
                      onChange={(e) => setSubcontractorName(e.target.value)}
                      style={{
                        textAlign: "center",
                        border: "none",
                        backgroundColor: "transparent",
                        borderBottom: "1px dashed #ced4da",
                        borderRadius: "0",
                        boxShadow: "none",
                      }}
                    />
                  </Form.Group>

                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ borderTop: "1px solid #000", marginTop: "10px" }}
                  >
                    <strong>Scope Approval</strong>
                  </div>
                </>
              )}
            </Col>

            {/* --- COLUMNA 2: CONTRACTOR (Finalized TMP) --- */}
            <Col md={6} className="px-4">
              {savedContractorSig ? (
                // Si el contratista ya firmó en DB, se muestra bloqueado
                <SignatureViewer
                  signature={savedContractorSig}
                  legalText="Above additional work to be performed under the same conditions as specified in the original contract unless otherwise stipulated in writing."
                  label="Finalized TMP"
                />
              ) : (
                // Si es reporte nuevo o no ha firmado, se muestra su Canvas activo
                <>
                  <div
                    className="signature-wrapper"
                    style={{
                      position: "relative",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        right: "45px",
                        zIndex: 10,
                        pointerEvents: "none",
                        fontSize: "0.75rem",
                        color: "#6c757d",
                        userSelect: "none",
                        textAlign: "left",
                      }}
                    >
                      Above additional work to be performed under the same
                      conditions as specified in the original contract unless
                      otherwise stipulated in writing.
                    </div>

                    <Button
                      onClick={() =>
                        clear(contractorSignRef, setContractorData)
                      }
                      title="Clear signature"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        zIndex: 30,
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        lineHeight: "1",
                      }}
                      variant="danger"
                    >
                      ✕
                    </Button>

                    <SignatureCanvas
                      ref={contractorSignRef as React.MutableRefObject<any>}
                      onEnd={() =>
                        handleEnd(contractorSignRef, setContractorData)
                      }
                      penColor="black"
                      canvasProps={{
                        className: "sigCanvas",
                        style: {
                          width: "100%",
                          height: "100%",
                          display: "block",
                        },
                      }}
                    />
                  </div>

                  <Form.Group className="mt-2 text-start">
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Contractor Name / Printed Name"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      style={{
                        textAlign: "center",
                        border: "none",
                        backgroundColor: "transparent",
                        borderBottom: "1px dashed #ced4da",
                        borderRadius: "0",
                        boxShadow: "none",
                      }}
                    />
                  </Form.Group>

                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ borderTop: "1px solid #000", marginTop: "10px" }}
                  >
                    <strong>Finalized TMP</strong>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SignatureSection;
