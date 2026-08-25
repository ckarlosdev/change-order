import hmbLogo from "../assets/hmbLogo.png";
import { Button } from "react-bootstrap";
import "../styles/buttons.css";
import LogoutButton from "./LogoutButton";
import { IoBackspace } from "react-icons/io5";
import useOrderStore from "../stores/useOrderStore";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useAuthStore } from "../stores/authStore";
import useUser from "../hooks/useUser";
import { useContextStore } from "../stores/useContextStore";

type Props = {};

function Title({}: Props) {
  const { isLoading } = useUser();
  const { user: userAuth } = useAuthStore();
  const jobId = useContextStore((s) => s.jobId);

  const { reset: resetOrder } = useOrderStore();
  const { reset: resetTasks } = useTaskStore();
  const { reset: resetSignatures } = useSignatureStore();

  if (isLoading) return <p>Loading user data...</p>;

  const handleReset = () => {
    resetOrder();
    resetTasks();
    resetSignatures();
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "10px",
        marginBottom: "5px",
      }}
    >
      <div>
        <img style={{ width: "200px" }} src={hmbLogo} alt="" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
        className="title-flex-container"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: "1 1 0px",
          }}
          className="no-print"
        >
          <Button
            variant="outline-secondary"
            title="Go back to the binder"
            onClick={() => {
              handleReset();
              window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
            }}
            className="no-print d-flex align-items-center gap-2"
            style={{ fontWeight: "bold" }}
          >
            <IoBackspace />
            Binder
          </Button>
        </div>

        <div style={{ flex: "2 1 0px" }}>
          <h2
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "10px",
              fontSize: "1.75rem",
              whiteSpace: "nowrap",
            }}
          >
            Change Order
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            flex: "1 1 0px",
          }}
          className="no-print"
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6c757d",
              borderRight: "1px solid #dee2e6",
              paddingRight: "15px",
              fontWeight: "500",
            }}
            className="no-print"
          >
            <span style={{ opacity: 0.7 }}>User: </span>
            <span className="text-dark">{userAuth?.fullName || "Guest"}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default Title;
