import type { Signature } from "../types";

type Props = {
  signature?: Partial<Signature> & { signatureData?: string | null };
  legalText: string;
  label: string;
};

function SignatureViewer({ signature, legalText, label }: Props) {
  const finalPath = signature?.filePath || signature?.signatureData || "";
  const finalizeName = signature?.signatureName || "";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const imgTarget = e.target as HTMLImageElement;
    imgTarget.onerror = null; // Evita bucles infinitos
    imgTarget.src = "https://placehold.co/250x100?text=Error+loading+signature";
  };

  return (
    <>
      <div
        className="signature-wrapper position-relative overflow-hidden bg-white"
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
        }}
      >
        {/* Texto legal (Deshabilitado e idéntico al modo edición) */}
        <div
          className="text-secondary text-start"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            zIndex: 10,
            pointerEvents: "none",
            fontSize: "0.75rem",
            userSelect: "none",
            opacity: 0.6, // Un toque más tenue para priorizar la firma visualmente
          }}
        >
          {legalText}
        </div>

        {/* Imagen de la firma */}
        {finalPath ? (
          <img
            src={finalPath}
            alt={`Firma de ${signature?.signatureRole}`}
            style={{
              maxWidth: "100%",
              maxHeight: "130px",
              objectFit: "contain",
              zIndex: 5,
            }}
            onError={handleImageError}
          />
        ) : (
          <p className="text-danger small mt-4" style={{ zIndex: 5 }}>
            ⚠️ No Signature Provided
          </p>
        )}
      </div>

      {/* Nombre Aclarado (Formato Contrato Cerrado) */}
      <div className="mt-2 text-center py-1">
        <span
          style={{ fontSize: "0.85rem", fontWeight: "bold", display: "block" }}
        >
          {finalizeName || "— No name provided —"}
        </span>
      </div>

      {/* Etiqueta del Rol */}
      <div
        className="d-flex justify-content-center align-items-center text-muted small"
        style={{ borderTop: "1px solid #000", marginTop: "4px" }}
      >
        <strong>{label}</strong>
      </div>
    </>
  );
}

export default SignatureViewer;
