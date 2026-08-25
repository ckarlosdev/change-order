import { Container, Row, Spinner } from "react-bootstrap";
import Title from "./Title";
import Job from "./Job";
import General from "./General";
import TaskArea from "./task/TaskArea";
import TaskModal from "./task/TaskModal";
import CrewModal from "./task/CrewModal";
import EquipmentModal from "./task/EquipmentModal";
import ToolModal from "./task/ToolModal";
import DumpsterModal from "./task/DumpsterModal";
import ActionButtons from "./ActionButtons";
import { useContextStore } from "../stores/useContextStore";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useGetChangeOrder } from "../hooks/useOrder";
import useOrderStore from "../stores/useOrderStore";
import useTaskStore from "../stores/useTaskStore";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useReactToPrint } from "react-to-print";
import "../styles/buttons.css";
import { useMutationState } from "@tanstack/react-query";
import Popup from "./Popup";
import SignatureSection from "./SignatureSection";

type Props = {};

function Home({}: Props) {
  const [searchParams] = useSearchParams();
  const isLoaded = useContextStore((s) => s.isLoaded);
  const setIsLoaded = useContextStore((s) => s.setIsLoaded);
  const setIds = useContextStore((s) => s.setIds);
  const { changeOrderId, jobId: jobIdStored } = useContextStore();
  const { data: changeOrderData } = useGetChangeOrder(
    changeOrderId ? Number(changeOrderId) : 0,
  );
  const {
    setFullData: setOrder,
    orderData,
    reset: resetOrder,
  } = useOrderStore();
  const { setFullData: setTasks, reset: resetTasks } = useTaskStore();
  const { reset: resetSignatures } = useSignatureStore();

  useEffect(() => {
    const action = searchParams.get("action");
    const jobIdParam = searchParams.get("jobId");
    const changeOrderIdParam = searchParams.get("changeOrderId");

    const isNewAction = action === "new";
    const jobId = jobIdParam ? parseInt(jobIdParam, 10) : null;
    const changeOrderId =
      isNewAction || !changeOrderIdParam
        ? null
        : parseInt(changeOrderIdParam, 10);

    console.log("Params detectados:", { jobId, changeOrderId, action });

    const hasJobChanged = jobId !== null && jobId !== jobIdStored;
    const isNewReportWithoutOrder = hasJobChanged && !changeOrderId;

    if (isNewAction || isNewReportWithoutOrder) {
      handleReset();
      // console.log("It's new");
    }

    setIds(jobId, changeOrderId);
    setIsLoaded(true);
  }, []);

  const handleReset = () => {
    resetOrder();
    resetTasks();
    resetSignatures();
  };

  useEffect(() => {
    if (changeOrderData) {
      // console.log(changeOrderData);

      setOrder(changeOrderData);
      setTasks(changeOrderData.tasks);
    }
  }, [changeOrderData]);

  // console.log(orderData);
  const componenteRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Change Order ${orderData.orderDate}`,
  });

  const isSavingReport =
    useMutationState({
      filters: { mutationKey: ["saveOrder"], status: "pending" },
      select: (mutation) => mutation.state.status === "pending",
    }).length > 0;

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Container ref={componenteRef} className="print-container">
        <Row className="justify-content-md-center">
          <Title />
        </Row>
        <Row className="justify-content-md-center">
          <Job />
        </Row>
        <Row className="justify-content-md-center">
          <General />
        </Row>
        <Row>
          <TaskArea />
        </Row>
        <Row>
          {/* {orderData?.orderStatus === "FINALIZED" ||
          orderData?.orderStatus === "APPROVED" ? (
            <PreViewer />
          ) : (
            // MODO EDICIÓN: Si está en DRAFT (o es una orden nueva), mostramos tu Canvas tal cual lo tienes hoy
            <SignatureArea />
          )} */}

          <SignatureSection />
        </Row>
        <Row>
          <ActionButtons onPrint={handlePrint} />
        </Row>
      </Container>

      {isSavingReport && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          />
          <h4 className="mt-3">Saving Change Order...</h4>
        </div>
      )}

      <TaskModal />
      <CrewModal />
      <EquipmentModal />
      <ToolModal />
      <DumpsterModal />
      <Popup />
    </>
  );
}

export default Home;
