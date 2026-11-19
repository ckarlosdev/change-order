import { Alert, Badge, Card, Placeholder } from "react-bootstrap";
import useJob from "../hooks/useJob";
import { useContextStore } from "../stores/useContextStore";

export default function Job() {
  const { jobId } = useContextStore();
  const numericJobId = jobId ? Number(jobId) : 0;

  const { data: job, isLoading, isError, refetch } = useJob(numericJobId);

  if (isLoading) return <JobSkeletonCompact />;

  if (isError) {
    return (
      <Alert
        variant="danger"
        className="py-2 px-3 mb-2 d-flex justify-content-between align-items-center"
      >
        <small>
          Error loading Job <strong>#{jobId}</strong>
        </small>
        <button
          className="btn btn-outline-danger btn-sm py-0 px-2 fs-7"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-3 mb-2 bg-white">
      <Card.Body className="py-2 px-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          {/* Job Number Badge */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted text-uppercase fw-semibold fs-7">
              Job
            </span>
            <Badge bg="primary" className="fs-6 px-2.5 py-1 fw-bold">
              #{job?.number || "—"}
            </Badge>
          </div>

          {/* Job Name */}
          <div className="border-start ps-3 me-auto">
            <small className="text-muted d-block lh-1 text-uppercase fs-7 mb-1">
              Name
            </small>
            <span className="fw-bold text-dark fs-6 lh-1">
              {job?.name || "—"}
            </span>
          </div>

          {/* Contractor */}
          <div className="border-start ps-3 me-3">
            <small className="text-muted d-block lh-1 text-uppercase fs-7 mb-1">
              Contractor
            </small>
            <span className="fw-semibold text-dark fs-6 lh-1">
              {job?.contractor || "—"}
            </span>
          </div>

          {/* Address */}
          <div className="border-start ps-3">
            <small className="text-muted d-block lh-1 text-uppercase fs-7 mb-1">
              Address
            </small>
            <span className="text-secondary fs-6 lh-1">
              {job?.address || "—"}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function JobSkeletonCompact() {
  return (
    <Card className="border-0 shadow-sm rounded-3 mb-2">
      <Card.Body className="py-2 px-3">
        <Placeholder
          as="div"
          animation="glow"
          className="d-flex align-items-center gap-3"
        >
          <Placeholder xs={2} size="lg" />
          <Placeholder xs={3} />
          <Placeholder xs={3} />
          <Placeholder xs={3} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
}
