import { useState } from "react";
import { Button } from "react-bootstrap";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuthStore } from "../stores/authStore";
import { api } from "../hooks/apiConfig";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import useOrderStore from "../stores/useOrderStore";

type Props = {};

function LogoutButton({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);

  const { reset: resetOrder } = useOrderStore();
  const { reset: resetTasks } = useTaskStore();
  const { reset: resetSignatures } = useSignatureStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error,
      );
    } finally {
      handleReset();
      logout();
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };

  const handleReset = () => {
    resetOrder();
    resetTasks();
    resetSignatures();
  };

  return (
    <Button
      onClick={handleLogout}
      title="Logout"
      className="no-print d-flex align-items-center gap-2 "
      disabled={isLoading}
      variant="outline-danger"
      style={{
        fontWeight: "bold",
      }}
    >
      {isLoading ? <span>Logging out</span> : <>Logout</>}
      <RiLogoutBoxRLine />
    </Button>
  );
}

export default LogoutButton;
