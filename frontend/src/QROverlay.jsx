import { QRCodeSVG } from "qrcode.react";
import { C } from "./constants";

const wrapStyle = {
  position: "absolute",
  bottom: "20px",
  right: "20px",
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
        right: "auto",
        transform: "none",
        flexDirection: "row",
        padding: "10px 16px",
        background: "rgba(8,9,15,0.9)",
        border: `1px solid ${C.green}`,
        boxShadow: C.greenGlow,
      }}>
        <span style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: C.green, boxShadow: C.greenGlow,
          flexShrink: 0,
        }} />
        <div>
          <p style={{ fontSize: "11px", color: C.green, letterSpacing: "1px", margin: 0 }}>
            Smartphone terhubung
          </p>
          <p style={{ fontSize: "9px", color: C.sub, letterSpacing: "0.5px", margin: "4px 0 0" }}>
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
      border: `1px solid ${C.cyan}`,
      boxShadow: C.cyanGlow,
    }}>
      <QRCodeSVG
        value={mobileUrl}
        size={200}
        bgColor="transparent"
        fgColor="#ffffff"
        level="M"
      />
      <p style={{
        fontSize: "14px", color: C.cyan, letterSpacing: "1.5px",
        textTransform: "uppercase", margin: 0,
        textShadow: `0 0 8px ${C.cyan}`,
      }}>
        Scan untuk kontrol
      </p>
    </div>
  );
}
