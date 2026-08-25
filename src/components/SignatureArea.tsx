import { useCallback, useEffect, useRef } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { useSignatureStore } from "../stores/useSignatureStore";

type Props = {};

function SignatureArea({}: Props) {
  const subcontractorSignRef = useRef<SignatureCanvas>(null!);
  const contractorSignRef = useRef<SignatureCanvas>(null!);

  const {
    subcontractorData,
    contractorData,
    contractorName,
    subcontractorName,
    setContractorName,
    setSubcontractorName,
    setSubcontractorData,
    setContractorData,
  } = useSignatureStore();

  const restoreSignatures = useCallback(() => {
    const configs = [
      { data: subcontractorData, ref: subcontractorSignRef },
      { data: contractorData, ref: contractorSignRef },
    ];

    setTimeout(() => {
      configs.forEach(({ data, ref }) => {
        if (data && ref.current) {
          ref.current.fromDataURL(data, {
            ratio: window.devicePixelRatio || 1,
          });
        }
      });
    }, 150); // Un pelín más de delay para asegurar el layout del iPad
  }, [subcontractorData, contractorData]);

  useEffect(() => {
    restoreSignatures();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", restoreSignatures);
    return () => window.removeEventListener("resize", restoreSignatures);
  }, [restoreSignatures]);

  const handleEnd = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current && !ref.current.isEmpty()) {
      try {
        // Intentamos obtener el canvas recortado
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        setter(dataUrl);
      } catch (e) {
        // Fallback al canvas completo si falla el trim
        const dataUrl = ref.current.getCanvas().toDataURL("image/png");
        setter(dataUrl);
      }
    }
  };

  const clear = (ref: any, setter: (data: string | null) => void) => {
    ref.current.clear();
    setter(null); // Limpiamos el store también
  };

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0">
          <Card.Body>
            <Row className="text-center">
              <Col md={6} className="px-4 mb-4">
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
                  {/* Texto legal */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      right: "45px",
                      zIndex: 10,
                      pointerEvents: "none", // IMPORTANTE: permite firmar "a través" del texto
                      fontSize: "0.75rem",
                      color: "#6c757d",
                      userSelect: "none",
                    }}
                  >
                    We are agree to furnish labor & materials complete in
                    accordance with the above specification at the price stated
                    above.
                  </div>

                  {/* Botón X posicionado arriba a la derecha */}
                  <Button
                    // onClick={() => clearSignature(subcontractorSignRef)}
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
                    placeholder={"Contractor Name / Printed Name"}
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
                  {/* <strong>{new Date().toLocaleDateString()}</strong> */}
                </div>
              </Col>

              <Col md={6} className="px-4">
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
                  {/* Texto legal */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      right: "45px",
                      zIndex: 10,
                      pointerEvents: "none", // IMPORTANTE: permite firmar "a través" del texto
                      fontSize: "0.75rem",
                      color: "#6c757d",
                      userSelect: "none",
                    }}
                  >
                    Above additional work to be performed under the same
                    conditions as specified in the original contract unless
                    otherwise stipulated in writing.
                  </div>

                  {/* Botón X posicionado arriba a la derecha */}
                  <Button
                    // onClick={() => clearSignature(contractorSignRef)}
                    onClick={() => clear(contractorSignRef, setContractorData)}
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
                    placeholder={"Contractor Name / Printed Name"}
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
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default SignatureArea;
