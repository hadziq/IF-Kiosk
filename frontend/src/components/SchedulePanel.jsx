import { C, displayName, DAYS } from "../constants";

const JS_DAY_TO_ID = ["", ...DAYS, ""];
const trimSecs = (t) => t?.slice(0, 5) ?? t;

function getTodayName() {
  return JS_DAY_TO_ID[new Date().getDay()] || null;
}

const panelStyle = {
  width: "300px", minWidth: "300px",
  background: C.sidebar, borderLeft: `1px solid ${C.border}`,
  display: "flex", flexDirection: "column",
  overflowY: "auto", fontFamily: "'DM Mono', monospace",
};

function ScheduleItems({ items, color, loading, error, today }) {
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.cyan, fontSize: "12px" }}>
      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Memuat jadwal...
    </div>
  );
  if (error) return (
    <div style={{ background: "#200a10", border: "1px solid #5a1020", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#ff4060" }}>
      ⚠ {error}
    </div>
  );
  if (!today) return <p style={{ fontSize: "11px", color: C.muted, letterSpacing: "1px", textAlign: "center", padding: "20px 0" }}>— AKHIR PEKAN —</p>;
  if (items.length === 0) return <p style={{ fontSize: "11px", color: C.muted, letterSpacing: "1px", textAlign: "center", padding: "20px 0" }}>— TIDAK ADA KELAS —</p>;
  return items.map((item) => (
    <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, borderRadius: "6px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ background: `${color}26`, border: `1px solid ${color}66`, borderRadius: "4px", padding: "3px 9px", fontSize: "13px", color: "#d0dcff", fontWeight: "400", letterSpacing: "0.3px" }}>
          {trimSecs(item.jam_mulai)} – {trimSecs(item.jam_selesai)}
        </span>
        {item.kode_kelas && <span style={{ fontSize: "11px", color: C.sub, letterSpacing: "1px" }}>{item.kode_kelas}</span>}
      </div>
      <p style={{ fontSize: "15px", fontWeight: "600", color: C.text, margin: 0 }}>{item.mata_kuliah}</p>
      {item.nama_dosen   && <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>▸ {item.nama_dosen}</p>}
      {item.nama_dosen_2 && <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>▸ {item.nama_dosen_2}</p>}
      {item.nama_dosen_3 && <p style={{ fontSize: "13px", color: C.text, margin: 0 }}>▸ {item.nama_dosen_3}</p>}
    </div>
  ));
}

export function SchedulePanel({ roomName, roomData, loading, error }) {
  const today       = getTodayName();
  const daySchedule = today && roomData?.schedules ? roomData.schedules.filter((s) => s.hari === today) : [];

  // No room selected
  if (!roomName) return (
    <div style={{ ...panelStyle, alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: "12px", color: C.muted, textAlign: "center", padding: "20px", letterSpacing: "0.5px" }}>
        Pilih ruangan untuk melihat jadwal
      </p>
    </div>
  );

  // Loading or room not found in DB — show just the name
  if (loading || !roomData) return (
    <div style={{ ...panelStyle, alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: "11px", color: C.muted, textAlign: "center", padding: "20px", letterSpacing: "0.5px" }}>
        {loading ? "Memuat..." : displayName(roomName)}
      </p>
    </div>
  );

  const { lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, label, occupants } = roomData;

  // Label-only room (Mushola, Ruang Rapat, Alumni Corner, etc.)
  if (is_ruangan && !is_lab && !is_kelas && !is_ruang_dosen) return (
    <div style={panelStyle}>
      <div style={{ padding: "20px 16px 14px", borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${C.schedGreen}`, background: `linear-gradient(90deg, ${C.schedGreen}0d 0%, transparent 100%)` }}>
        <p style={{ fontSize: "12px", letterSpacing: "2px", color: C.schedGreen, marginBottom: "8px", textTransform: "uppercase", textShadow: `0 0 8px ${C.schedGreen}` }}>
          Informasi Ruangan
        </p>
        <p style={{ fontSize: "22px", fontWeight: "700", color: C.text, margin: "0 0 6px", letterSpacing: "1px" }}>{displayName(roomName)}</p>
        <p style={{ fontSize: "13px", color: C.sub, margin: 0, letterSpacing: "0.5px" }}>{lantai ?? "—"}</p>
      </div>
      <div style={{ flex: 1, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "14px", color: C.sub, letterSpacing: "1px" }}>{label ?? displayName(roomName)}</p>
      </div>
    </div>
  );

  // Determine top header label from flags
  const topLabel = is_lab ? "Laboratorium" : is_ruang_dosen ? "Ruang Dosen" : null;
  const topColor = is_lab ? C.cyan : C.blue;

  return (
    <div style={panelStyle}>

      {/* Top header — for lab or dosen rooms */}
      {topLabel && (
        <div style={{ padding: "20px 16px 14px", borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${topColor}`, background: `linear-gradient(90deg, ${topColor}0d 0%, transparent 100%)` }}>
          <p style={{ fontSize: "12px", letterSpacing: "2px", color: topColor, marginBottom: "8px", textTransform: "uppercase", textShadow: `0 0 8px ${topColor}` }}>
            {topLabel}
          </p>
          {label && <p style={{ fontSize: "22px", fontWeight: "700", color: C.text, margin: "0 0 4px", letterSpacing: "1px" }}>{label}</p>}
          {!label && <p style={{ fontSize: "22px", fontWeight: "700", color: C.text, margin: "0 0 4px", letterSpacing: "1px" }}>{displayName(roomName)}</p>}
          <p style={{ fontSize: "13px", color: C.sub, margin: 0, letterSpacing: "0.5px" }}>{lantai ?? "—"}</p>
        </div>
      )}

      {/* Dosen occupants section */}
      {is_ruang_dosen && (
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", borderBottom: `1px solid ${C.border}` }}>
          {occupants.length === 0
            ? <p style={{ fontSize: "11px", color: C.muted, letterSpacing: "1px", margin: 0 }}>—</p>
            : occupants.map((name, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.blue}`, borderRadius: "6px", padding: "12px 14px" }}>
                  <span style={{ fontSize: "13px", color: C.text }}>▸ {name}</span>
                </div>
              ))
          }
        </div>
      )}

      {/* Jadwal Kelas section */}
      {is_kelas && (
        <>
          <div style={{ padding: "20px 16px 14px", borderBottom: `1px solid ${C.border}`, borderLeft: `3px solid ${C.schedGreen}`, background: `linear-gradient(90deg, ${C.schedGreen}0d 0%, transparent 100%)`, flexShrink: 0 }}>
            <p style={{ fontSize: "12px", letterSpacing: "2px", color: C.schedGreen, marginBottom: "8px", textTransform: "uppercase", textShadow: `0 0 8px ${C.schedGreen}` }}>
              Jadwal Kelas
            </p>
            {!topLabel && (
              <p style={{ fontSize: "22px", fontWeight: "700", color: C.text, margin: "0 0 6px", letterSpacing: "1px" }}>{displayName(roomName)}</p>
            )}
            <p style={{ fontSize: "13px", color: C.sub, margin: 0, letterSpacing: "0.5px" }}>{today ?? "Akhir Pekan"}</p>
          </div>
          <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <ScheduleItems items={daySchedule} color={C.schedGreen} loading={false} error={error} today={today} />
          </div>
        </>
      )}

      {/* Fill remaining space for non-kelas rooms */}
      {!is_kelas && <div style={{ flex: 1 }} />}
    </div>
  );
}
