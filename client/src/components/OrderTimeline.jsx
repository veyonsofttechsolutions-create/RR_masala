import React from "react";
import { CheckCircle2, Clock3, Package, Truck, XCircle, RotateCcw } from "lucide-react";

const STAGES = [
  { key: "PENDING", label: "Order Placed", icon: Clock3 },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "PACKED", label: "Packed", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTimeline({ status = "PENDING" }) {
  const currentStatus = String(status || "PENDING").toUpperCase();

  if (currentStatus === "CANCELLED") {
    return (
      <div className="verticalTimeline cancelledBox">
        <XCircle size={22} color="#dc2626" />
        <div>
          <strong>Order Cancelled</strong>
          <p>This order was cancelled and is no longer active.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="verticalTimelineWrapper">
      <div className="verticalTimelineList">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={stage.key} className={`timelineStepItem ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
              <div className="stepIconColumn">
                <div className="stepNodeCircle">
                  <Icon size={14} />
                </div>
                {idx < STAGES.length - 1 && <div className="stepConnectorLine" />}
              </div>
              <div className="stepContentColumn">
                <strong>{stage.label}</strong>
                <span>{isCompleted ? (isCurrent ? "In progress / Current status" : "Completed") : "Pending"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .verticalTimelineWrapper {
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid #e5e7eb;
        }
        .verticalTimelineList {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .timelineStepItem {
          display: flex;
          gap: 16px;
          position: relative;
        }
        .stepIconColumn {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .stepNodeCircle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #9ca3af;
          display: grid;
          place-items: center;
          border: 2px solid #e5e7eb;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .stepConnectorLine {
          width: 2px;
          flex: 1;
          background: #e5e7eb;
          min-height: 28px;
          margin: 4px 0;
        }
        .timelineStepItem.completed .stepNodeCircle {
          background: #dcfce7;
          color: #16a34a;
          border-color: #bbf7d0;
        }
        .timelineStepItem.completed .stepConnectorLine {
          background: #16a34a;
        }
        .timelineStepItem.current .stepNodeCircle {
          background: #fef3c7;
          color: #d97706;
          border-color: #fde68a;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.15);
          animation: pulseNode 1.5s infinite;
        }
        @keyframes pulseNode {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .stepContentColumn {
          padding-bottom: 20px;
        }
        .timelineStepItem:last-child .stepContentColumn {
          padding-bottom: 0;
        }
        .stepContentColumn strong {
          display: block;
          font-size: 14px;
          color: #9ca3af;
          font-weight: 700;
        }
        .timelineStepItem.completed .stepContentColumn strong {
          color: #111827;
        }
        .timelineStepItem.current .stepContentColumn strong {
          color: #9e1017;
        }
        .stepContentColumn span {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }
        .timelineStepItem.completed .stepContentColumn span {
          color: #6b7280;
        }
        .cancelledBox {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 16px;
          border-radius: 12px;
          color: #b91c1c;
        }
        .cancelledBox strong { display: block; font-size: 14px; }
        .cancelledBox p { margin: 2px 0 0; font-size: 12px; color: #7f1d1d; }
      `}</style>
    </div>
  );
}