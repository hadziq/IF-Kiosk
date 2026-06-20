import { QRCodeSVG } from "qrcode.react";

const CYAN  = "#00d9ff";
const GREEN = "#00e676";

const cyanGlow  = "0 0 12px rgba(0,217,255,0.35)";
const greenGlow = "0 0 12px rgba(0,230,118,0.3)";

const wrapStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backdropFilter: "blur(8px)",
  borderRadius: "8px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  fontFamily: "'DM Mono', monospace",
};

/**
 * Shows a QR code when no phone is connected, or a
 * "Smartphone terhubung" badge when one is paired.
 */
export function QROverlay({ mobileUrl, phoneConnected }) {
  if (phoneConnected) {
    return (
      <div style={{
        ...wrapStyle,
        left: "20px",
        transform: "none",
        flexDirection: "row",
        padding: "10px 16px",
        background: "rgba(8,9,15,0.9)",
        border: `1px solid ${GREEN}`,
        boxShadow: greenGlow,
      }}>
        <span style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: GREEN, boxShadow: greenGlow,
          flexShrink: 0,
        }} />
        <div>
          <p style={{ fontSize: "11px", color: GREEN, letterSpacing: "1px", margin: 0 }}>
            Smartphone terhubung
          </p>
          <p style={{ fontSize: "9px", color: "rgba(255,80,100,0.8)", letterSpacing: "0.5px", margin: "4px 0 0" }}>
            Sesi terputus otomatis setelah 1 menit tidak aktif
          </p>
        </div>
      </div>
    );
  }

  if (!mobileUrl) return null;

  return (
    <div style={{
      ...wrapStyle,
      background: "rgba(8,9,15,0.9)",
      border: `1px solid ${CYAN}`,
      boxShadow: cyanGlow,
    }}>
      <QRCodeSVG
        value={mobileUrl}
        size={200}
        bgColor="transparent"
        fgColor="#ffffff"
        level="M"
      />
      <p style={{
        fontSize: "14px", color: CYAN, letterSpacing: "1.5px",
        textTransform: "uppercase", margin: 0,
        textShadow: `0 0 8px ${CYAN}`,
      }}>
        Scan untuk kontrol
      </p>
    </div>
  );
}
