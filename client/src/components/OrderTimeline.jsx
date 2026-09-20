import {
  Check,
  CheckCircle2,
  Clock3,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Order placed", icon: Clock3 },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "PACKED", label: "Packed", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const normalize = (status = "") => String(status).toUpperCase();

export default function OrderTimeline({ status = "PENDING" }) {
  const current = normalize(status);

  // Keep the timeline useful even if the backend sends a status
  // that is not represented in the standard customer journey.
  const currentIndex = Math.max(
    0,
    STEPS.findIndex((step) => step.key === current)
  );

  const isCancelled = ["CANCELLED", "FAILED"].includes(current);
  const isReturn = ["RETURN_REQUESTED", "RETURNED"].includes(current);

  return (
    <div className={`orderTimeline ${isCancelled ? "timelineCancelled" : ""}`}>
      <div className="timelineRail">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const completed = !isCancelled && index < currentIndex;
          const active = !isCancelled && index === currentIndex;
          const upcoming = !isCancelled && index > currentIndex;

          return (
            <div
              className={`timelineStep ${
                completed ? "completed" : ""
              } ${active ? "active" : ""} ${upcoming ? "upcoming" : ""}`}
              key={step.key}
            >
              <div className="timelineNodeWrap">
                {index > 0 && (
                  <div
                    className={`timelineConnector ${
                      index <= currentIndex && !isCancelled ? "filled" : ""
                    }`}
                  />
                )}

                <div className="timelineNode">
                  {completed ? (
                    <Check size={15} strokeWidth={3} />
                  ) : (
                    <StepIcon size={15} strokeWidth={active ? 2.4 : 1.8} />
                  )}
                </div>
              </div>

              <div className="timelineLabel">
                <strong>{step.label}</strong>

                {active && (
                  <span className="timelineCurrent">
                    <span className="timelineCurrentDot" />
                    Current status
                  </span>
                )}

                {completed && (
                  <span className="timelineDone">Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(isCancelled || isReturn) && (
        <div className={`timelineNotice ${isCancelled ? "danger" : "return"}`}>
          <ShieldCheck size={16} />
          <div>
            <strong>
              {isCancelled
                ? "Order cancelled"
                : current === "RETURNED"
                ? "Order returned"
                : "Return requested"}
            </strong>
            <span>
              {isCancelled
                ? "This order is no longer moving through the delivery journey."
                : "The return status is being handled separately from the delivery journey."}
            </span>
          </div>
        </div>
      )}

      <style>{`
        .orderTimeline {
          width: 100%;
          padding: 12px 2px 4px;
        }

        .timelineRail {
          display: grid;
          grid-template-columns: repeat(7, minmax(90px, 1fr));
          min-width: 700px;
        }

        .timelineStep {
          position: relative;
          min-width: 0;
          text-align: center;
        }

        .timelineNodeWrap {
          height: 36px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timelineConnector {
          position: absolute;
          left: -50%;
          right: 50%;
          top: 50%;
          height: 2px;
          transform: translateY(-50%);
          background: #e7e5dd;
          z-index: 0;
        }

        .timelineConnector.filled {
          background: #d6a900;
        }

        .timelineNode {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          position: relative;
          z-index: 2;
          background: #fff;
          color: #a1a39b;
          border: 1px solid #dddcd5;
          box-shadow: 0 1px 0 rgba(0,0,0,.02);
          transition: .2s ease;
        }

        .timelineStep.completed .timelineNode {
          background: #f4c400;
          color: #171814;
          border-color: #f4c400;
        }

        .timelineStep.active .timelineNode {
          width: 35px;
          height: 35px;
          background: #191b17;
          color: #fff;
          border: 4px solid #fff;
          box-shadow:
            0 0 0 2px #191b17,
            0 5px 15px rgba(25,27,23,.16);
        }

        .timelineLabel {
          margin-top: 10px;
          min-height: 42px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 0 4px;
        }

        .timelineLabel strong {
          font-size: 10px;
          line-height: 1.25;
          font-weight: 850;
          color: #8b8e85;
          white-space: nowrap;
        }

        .timelineStep.completed .timelineLabel strong {
          color: #383a34;
        }

        .timelineStep.active .timelineLabel strong {
          color: #171914;
          font-weight: 950;
        }

        .timelineStep.upcoming .timelineLabel strong {
          color: #a0a29b;
          font-weight: 700;
        }

        .timelineCurrent {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 7px;
          border-radius: 999px;
          background: #191b17;
          color: #fff;
          font-size: 8px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: .01em;
          white-space: nowrap;
          box-shadow: 0 3px 9px rgba(25,27,23,.13);
        }

        .timelineCurrentDot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f4c400;
          box-shadow: 0 0 0 2px rgba(244,196,0,.16);
        }

        .timelineDone {
          color: #8a8d84;
          font-size: 8px;
          font-weight: 750;
        }

        .timelineNotice {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 17px;
          padding: 11px 12px;
          border-radius: 11px;
          background: #faf9f4;
          border: 1px solid #ebe8df;
        }

        .timelineNotice strong,
        .timelineNotice span {
          display: block;
        }

        .timelineNotice strong {
          font-size: 10px;
        }

        .timelineNotice span {
          margin-top: 3px;
          color: #777a72;
          font-size: 9px;
          line-height: 1.4;
        }

        .timelineNotice.danger {
          background: #fff5f5;
          border-color: #f0d5d5;
          color: #9d3c3c;
        }

        .timelineNotice.return {
          background: #fff9e9;
          border-color: #eee0b7;
          color: #806415;
        }

        @media (max-width: 760px) {
          .timelineRail {
            overflow-x: auto;
            padding-bottom: 8px;
          }

          .timelineStep {
            min-width: 105px;
          }
        }
      `}</style>
    </div>
  );
}
