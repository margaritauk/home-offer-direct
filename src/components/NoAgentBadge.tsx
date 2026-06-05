"use client";
import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

export default function NoAgentBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [open, setOpen] = useState(false);

  const fontSize = size === "sm" ? 11 : size === "lg" ? 14 : 12;
  const padding = size === "sm" ? "4px 10px" : size === "lg" ? "8px 18px" : "5px 14px";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize, fontWeight: 700, color: "#166534",
          background: "#dcfce7", border: "1.5px solid #86efac",
          borderRadius: 99, padding, cursor: "pointer",
        }}
        aria-label="Learn about our no-agent-referrals commitment"
      >
        <ShieldCheck style={{ width: fontSize + 2, height: fontSize + 2 }} />
        No Agent Referrals — Ever
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200 }}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog" aria-modal="true" aria-labelledby="no-referral-title"
            style={{
              position: "fixed", zIndex: 201, top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(520px, calc(100vw - 32px))",
              background: "#fff", borderRadius: 16, padding: 28,
              boxShadow: "0 25px 60px -12px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck style={{ width: 24, height: 24, color: "#16a34a" }} />
                <h2 id="no-referral-title" style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                  Our Commitment to You
                </h2>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X style={{ width: 16, height: 16, color: "#6b7280" }} />
              </button>
            </div>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
              We never earn referral fees. We never recommend you hire an agent.
              Our only revenue comes from you, the buyer, through our transparent tool pricing.
            </p>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>
              HomeOfferDirect was built because buyers deserve a platform that is 100% on their side.
              Every feature we build is designed to help you buy a home without an agent —
              not to funnel you toward one.
            </p>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, margin: 0 }}>
                <strong>What this means:</strong> We have no referral agreements with brokerages, agents, or lenders.
                We are not compensated by any third party for directing buyers anywhere.
                See our <a href="/legal/terms" style={{ color: "#16a34a", textDecoration: "underline" }}>Terms of Service</a> for full details on our revenue model.
              </p>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#16a34a", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Got it
            </button>
          </div>
        </>
      )}
    </>
  );
}
