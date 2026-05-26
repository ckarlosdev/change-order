import type { Signature } from "../types";

type Props = {
  signature?: Signature;
};

function SignatureViewer({ signature }: Props) {
  // const BACKEND_URL = "http://2.24.72.216";
  const BACKEND_URL = "http://localhost:8080";
  //   const BACKEND_URL = "http://2.24.72.216:8080";

  let finalPath = signature?.filePath || "";

  if (finalPath.includes("C:/") || finalPath.includes("C:\\")) {
    // Si contiene la ruta absoluta de Windows, extraemos solo el nombre del archivo final
    const fileName = finalPath.split(/[/\\]/).pop();
    finalPath = `/uploads/signatures/${fileName}`;
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const imgTarget = e.target as HTMLImageElement;
    imgTarget.onerror = null; // Evita bucles infinitos
    imgTarget.src = "https://placehold.co/250x100?text=Error+loading+signature";
  };

  return (
    <div
      className="border rounded p-3 bg-light text-center"
      style={{ minWidth: "280px", minHeight: "160px" }}
    >
      {signature?.filePath ? (
        <img
          src={`${BACKEND_URL}${signature?.filePath}`}
          alt={`Firma de ${signature?.signatureRole}`}
          style={{
            maxWidth: "100%",
            maxHeight: "120px",
            objectFit: "contain",
            backgroundColor: "#f8f9fa", // Fondo claro por si firmaron en transparente
          }}
          onError={handleImageError}
        />
      ) : (
        <p className="text-danger mt-4">⚠️ No Signature</p>
      )}
    </div>
  );
}

export default SignatureViewer;
