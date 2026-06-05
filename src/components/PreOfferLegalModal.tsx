"use client";
import { useState } from "react";
import { X, Scale, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PreOfferLegalModalProps {
  propertyId: string;
  onClose: () => void;
}

export default function PreOfferLegalModal({ propertyId, onClose }: PreOfferLegalModalProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleProceed = () => {
    // Log acknowledgment in localStorage per listing
    try {
      const key = `hod-legal-ack-${propertyId}`;
      localStorage.setItem(key, new Date().toISOString());
    } catch {}
    router.push(`/offer-builder?property=${propertyId}`);
    onClose();
  };

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }}
        onClick={onClose}
      />
      <div
        role="dialog" aria-modal="true" aria-labelledby="legal-modal-title"
        style={{
          position: "fixed", zIndex: 301, top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(560px, calc(100vw - 24px))",
          maxHeight: "90vh", overflowY: "auto",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Scale style={{ width: 22, height: 22, color: "#d97706" }} />
            <h2 id="legal-modal-title" style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
              Before You Make an Offer
            </h2>
          </div>
          <button onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X style={{ width: 16, height: 16, color: "#6b7280" }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
            As an unrepresented buyer in Illinois, there are key legal facts you should know before making an offer. Please read and acknowledge the following:
          </p>

          {[
            {
              title: "Illinois 5-Day Attorney Review Period",
              content: "Either party may cancel the contract within 5 business days of acceptance by providing written notice of attorney disapproval. The clock starts at acceptance — not when you receive notice.",
              warning: true,
            },
            {
              title: "Earnest Money Customs",
              content: "In Illinois, earnest money (typically 1–3% of purchase price) must be deposited within 24–48 hours of acceptance. This deposit is at risk if you back out for reasons not covered by contingencies.",
              warning: false,
            },
            {
              title: "Agency Disclosure — You Are Unrepresented",
              content: "You are not using a buyer's agent. The listing agent represents the seller's interests, not yours. You have the right to hire your own real estate attorney.",
              warning: true,
            },
            {
              title: "Recommendation to Engage an Attorney",
              content: "HomeOfferDirect strongly recommends (but does not require) that you engage a licensed Illinois real estate attorney before submitting your offer. Attorney review fees are typically $500–$1,000.",
              warning: false,
            },
          ].map(item => (
            <div key={item.title} style={{
              marginBottom: 12, padding: "12px 16px",
              background: item.warning ? "#fffbeb" : "#f9fafb",
              border: `1px solid ${item.warning ? "#fde68a" : "#e5e7eb"}`,
              borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {item.warning && <AlertTriangle style={{ width: 14, height: 14, color: "#d97706", flexShrink: 0 }} />}
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.title}</span>
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>{item.content}</p>
            </div>
          ))}

          <div style={{ display: "flex", gap: 6, fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
            <a href="https://www.idfpr.com/Forms/RE/AGENCY.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>IRELA Agency Disclosure →</a>
            <span>·</span>
            <a href="https://www.chicagorealtor.com/buyers" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>Chicago Association of Realtors Buyer Rights →</a>
          </div>

          {/* Acknowledgment checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "14px 16px", background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, fontWeight: 500 }}>
              I understand my rights and obligations as an unrepresented buyer in Illinois, including the 5-day attorney review period and the risks of proceeding without legal representation.
            </span>
          </label>

          <button
            onClick={handleProceed}
            disabled={!checked}
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              background: checked ? "#2563eb" : "#e5e7eb",
              color: checked ? "#fff" : "#9ca3af",
              border: "none", fontSize: 14, fontWeight: 600,
              cursor: checked ? "pointer" : "not-allowed",
              transition: "all .15s",
            }}
          >
            I understand — proceed to offer builder
          </button>
        </div>
      </div>
    </>
  );
}
