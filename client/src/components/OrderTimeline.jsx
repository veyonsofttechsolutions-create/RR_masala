const steps = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function formatStatus(status) {
  return String(status || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderTimeline({ status }) {
  const currentStatus = String(status || "").toUpperCase();
  const idx = steps.indexOf(currentStatus);

  return (
    <div className="timeline">
      {steps.map((step, index) => {
        const done = idx >= 0 && index <= idx;
        const current = step === currentStatus;

        return (
          <div
            className={
              `timelineStep ` +
              `${done ? "done " : ""}` +
              `${current ? "current" : ""}`
            }
            key={step}
          >
            <span>{done ? "✓" : index + 1}</span>

            <div>
              <b>{formatStatus(step)}</b>

              {current && (
                <small>Current status</small>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
