import { Container, Row } from "react-bootstrap";
import Title from "./Title";
import Job from "./Job";
import General from "./General";
import TaskArea from "./task/TaskArea";
import TaskModal from "./task/TaskModal";
import CrewModal from "./task/CrewModal";
import EquipmentModal from "./task/EquipmentModal";
import ToolModal from "./task/ToolModal";
import DumpsterModal from "./task/DumpsterModal";
import SignatureArea from "./SignatureArea";
import ActionButtons from "./ActionButtons";
import { useContextStore } from "../stores/useContextStore";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useGetChangeOrder } from "../hooks/useOrder";
import useOrderStore from "../stores/useOrderStore";
import useTaskStore from "../stores/useTaskStore";
import PreViewer from "./PreViewer";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useReactToPrint } from "react-to-print";
import "../styles/buttons.css";

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

    // console.log("Params detectados:", { jobId, changeOrderId, action });

    const hasJobChanged = jobId !== null && jobId !== jobIdStored;
    const isNewReportWithoutOrder = hasJobChanged && !changeOrderId;

    if (isNewAction || isNewReportWithoutOrder) {
      handleReset();
      console.log("It's new");
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
          {orderData?.orderStatus === "FINALIZED" ||
          orderData?.orderStatus === "VOIDED" ? (
            // MODO LECTURA: Si la orden ya está cerrada o anulada, mostramos las imágenes estáticas del VPS
            // <div className="d-flex justify-content-around w-100 mt-3">
            //   <SignatureViewer signature={subcontractorSig} />
            //   <SignatureViewer signature={contractorSig} />
            //   {/* <h2>Entra</h2> */}
            // </div>
            <PreViewer />
          ) : (
            // MODO EDICIÓN: Si está en DRAFT (o es una orden nueva), mostramos tu Canvas tal cual lo tienes hoy
            <SignatureArea />
          )}
        </Row>
        <Row>
          <ActionButtons onPrint={handlePrint} />
        </Row>
      </Container>

      <TaskModal />
      <CrewModal />
      <EquipmentModal />
      <ToolModal />
      <DumpsterModal />
    </>
  );
}

export default Home;
