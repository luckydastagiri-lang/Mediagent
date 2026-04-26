import React from "react";
import { jsPDF } from "jspdf";

export default function RightPanel({ clinicalData }) {
  const risk = clinicalData?.risk?.toLowerCase() || "none";

  const riskColors = {
    low: { bg: "#EAF3DE", border: "#C0DD97", label: "#3B6D11" },
    medium: { bg: "#FAEEDA", border: "#FAC775", label: "#BA7517" },
    high: { bg: "#FCEBEB", border: "#F7C1C1", label: "#A32D2D" },
    none: { bg: "#fff", border: "rgba(0,0,0,0.1)", label: "#6b6b68" },
  };

  const rc = riskColors[risk] || riskColors.none;

  function downloadPDF() {
    const doc = new jsPDF();
    const d = clinicalData;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 110, 86);
    doc.text("MediAgent — Draft Consultation Report", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
    y += 6;
    doc.text("DISCLAIMER: This is an AI-generated draft for reference only. Not a final diagnosis.", 20, y);
    doc.text("Always consult a licensed physician.", 20, y + 5);
    y += 18;

    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 8;

    const fields = [
      ["Risk Level", d?.risk],
      ["Provisional Estimate", d?.estimate],
      ["Identified Symptoms", Array.isArray(d?.symptoms) ? d.symptoms.join(", ") : d?.symptoms],
      ["Possible Causes", d?.causes],
      ["Suggested Medications", Array.isArray(d?.meds) ? d.meds.join(", ") : d?.meds],
      ["Advice", d?.advice],
      ["Precautions", d?.precautions],
      ["Foods / Substances to Avoid", d?.foodsToAvoid],
    ];

    fields.forEach(([label, value]) => {
      if (!value) return;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(50);
      doc.text(label, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      const lines = doc.splitTextToSize(String(value), 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save(`MediAgent_Report_${Date.now()}.pdf`);
  }

  const rxRows = clinicalData ? [
    ["Provisional Estimate", clinicalData.estimate],
    ["Possible Causes", clinicalData.causes],
    ["Suggested Medications", Array.isArray(clinicalData.meds) ? clinicalData.meds.join(", ") : clinicalData.meds],
    ["Advice", clinicalData.advice],
    ["Precautions", clinicalData.precautions],
    ["Foods to Avoid", clinicalData.foodsToAvoid],
  ].filter(([, v]) => v) : [];

  return (
    <aside style={{ width: 300, borderLeft: "0.5px solid rgba(0,0,0,0.1)", background: "#f9f9f7", overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>

      {/* Triage Summary */}
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>Triage Summary</div>
        <div style={{ borderRadius: 10, padding: "12px 14px", background: rc.bg, border: `0.5px solid ${rc.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: rc.label }}>
            {clinicalData ? `${clinicalData.risk || "Unknown"} Risk` : "Awaiting Analysis"}
          </div>
          {clinicalData?.estimate && <div style={{ fontSize: 13, marginTop: 4, fontWeight: 500, color: "var(--text)" }}>{clinicalData.estimate}</div>}
          {clinicalData?.lang && <div style={{ fontSize: 11, marginTop: 3, color: "var(--text-muted)" }}>Detected language: {clinicalData.lang}</div>}
          {!clinicalData && <div style={{ fontSize: 12, marginTop: 4, color: "var(--text-muted)" }}>Start a consultation to see your triage summary.</div>}
        </div>
      </div>

      {/* Symptoms */}
      {clinicalData?.symptoms?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>Identified Symptoms</div>
          <div>
            {clinicalData.symptoms.map((s, i) => (
              <span key={i} style={{ display: "inline-block", padding: "3px 8px", background: "var(--teal-light)", color: "var(--teal)", borderRadius: 20, fontSize: 11, fontWeight: 500, margin: "2px", border: "0.5px solid #9FE1CB" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Draft Prescription */}
      {rxRows.length > 0 && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>Draft Prescription / Report</div>
          <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "var(--teal)", color: "#fff", padding: "10px 14px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Draft Report
            </div>
            <div style={{ padding: "12px 14px" }}>
              {rxRows.map(([label, value], i) => (
                <div key={i} style={{ padding: "6px 0", borderBottom: i < rxRows.length - 1 ? "0.5px solid rgba(0,0,0,0.08)" : "none" }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 2, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={downloadPDF}
            style={{ width: "100%", marginTop: 8, padding: "8px", background: "transparent", border: "0.5px solid var(--teal)", color: "var(--teal)", borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.target.style.background = "var(--teal-light)")}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
          >
            Download PDF Report
          </button>
        </div>
      )}

      {!clinicalData && (
        <div style={{ textAlign: "center", color: "var(--text-hint)", fontSize: 12, padding: "20px 10px", lineHeight: 1.6 }}>
          Your triage analysis, identified symptoms, and draft prescription will appear here during the consultation.
        </div>
      )}
    </aside>
  );
}
