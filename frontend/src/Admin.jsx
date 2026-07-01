import { useEffect, useState, useRef } from "react";
import { API_URL, C, FLOORS, DAYS } from "./constants";

const api = (path, opts) =>
  fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  }).then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))));

const TABS = [
  { key: "ruangan", label: "Ruangan" },
  { key: "dosen", label: "Dosen" },
  { key: "jadwal", label: "Jadwal" },
  { key: "penghuni", label: "Penghuni Ruangan" },
  { key: "reservasi", label: "Reservasi" },
];

// ── Shared styles ───────────────────────────────────────────────────
const S = {
  input: {
    width: "100%",
    padding: "8px 10px",
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    color: C.text,
    fontSize: "13px",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    color: C.text,
    fontSize: "13px",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
  },
  btn: (color = C.cyan) => ({
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${color}`,
    borderRadius: "6px",
    color,
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.5px",
  }),
  btnFill: (color = C.cyan) => ({
    padding: "8px 16px",
    background: color,
    border: "none",
    borderRadius: "6px",
    color: "#000",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.5px",
  }),
  label: {
    fontSize: "10px",
    color: C.sub,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={S.label}>{label}</span>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: C.text, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function SearchableSelect({ value, onChange, options, placeholder = "Pilih...", emptyValue = "" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    setQuery(selected?.label || "");
  }, [selected?.label]);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const filtered = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          setOpen(true);
          if (selected?.label !== next) onChange(emptyValue);
        }}
        placeholder={placeholder}
        style={S.input}
      />
      {open && (
        <div style={{ position: "absolute", zIndex: 1200, top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: "6px", boxShadow: "0 12px 24px rgba(0,0,0,0.35)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "9px 10px", color: C.muted, fontSize: "12px" }}>Tidak ada pilihan</div>
          ) : filtered.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.value);
                setQuery(opt.label);
                setOpen(false);
              }}
              style={{ width: "100%", padding: "9px 10px", background: String(opt.value) === String(value) ? C.cyanDim : "transparent", border: "none", borderBottom: `1px solid ${C.border}`, color: C.text, cursor: "pointer", textAlign: "left", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.sidebar,
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          padding: "24px",
          minWidth: "400px",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "16px", color: C.cyan, letterSpacing: "1px", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: "18px", cursor: "pointer" }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Konfirmasi" onClose={onCancel}>
      <p style={{ color: C.text, fontSize: "13px" }}>{message}</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={S.btn(C.sub)}>Batal</button>
        <button onClick={onConfirm} style={S.btnFill("#ff4060")}>Hapus</button>
      </div>
    </Modal>
  );
}

// ── Ruangan Tab ─────────────────────────────────────────────────────
function RuanganTab() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => api("/api/rooms").then(setData);
  useEffect(() => { load(); }, []);

  const empty = { nama_ruang: "", lantai: "Lantai 1", is_kelas: false, is_lab: false, is_ruang_dosen: false, is_ruangan: false, is_reservable: false, keterangan: "" };

  const save = async (form) => {
    if (form.id) {
      await api(`/api/rooms/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
    } else {
      await api("/api/rooms", { method: "POST", body: JSON.stringify(form) });
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api(`/api/rooms/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = data.filter((r) =>
    r.nama_ruang.toLowerCase().includes(search.toLowerCase()) ||
    (r.keterangan || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ruangan..."
          style={{ ...S.input, flex: 1, minWidth: "200px" }}
        />
        <button onClick={() => setEditing({ ...empty })} style={S.btnFill()}>+ Tambah</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Nama Ruang", "Lantai", "Kelas", "Lab", "R. Dosen", "Ruangan", "Reservable", "Keterangan", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.sub, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 10px", color: C.muted }}>{r.id}</td>
                <td style={{ padding: "8px 10px", color: C.cyan }}>{r.nama_ruang}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{r.lantai}</td>
                <td style={{ padding: "8px 10px", color: r.is_kelas ? C.green : C.muted }}>{r.is_kelas ? "Ya" : "-"}</td>
                <td style={{ padding: "8px 10px", color: r.is_lab ? C.green : C.muted }}>{r.is_lab ? "Ya" : "-"}</td>
                <td style={{ padding: "8px 10px", color: r.is_ruang_dosen ? C.green : C.muted }}>{r.is_ruang_dosen ? "Ya" : "-"}</td>
                <td style={{ padding: "8px 10px", color: r.is_ruangan ? C.green : C.muted }}>{r.is_ruangan ? "Ya" : "-"}</td>
                <td style={{ padding: "8px 10px", color: r.is_reservable ? C.green : C.muted }}>{r.is_reservable ? "Ya" : "-"}</td>
                <td style={{ padding: "8px 10px", color: C.sub }}>{r.keterangan || "-"}</td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <button onClick={() => setEditing({ ...r })} style={{ ...S.btn(C.cyan), padding: "4px 10px", marginRight: "6px" }}>Edit</button>
                  <button onClick={() => setDeleting(r)} style={{ ...S.btn("#ff4060"), padding: "4px 10px" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <RuanganForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          message={`Hapus ruangan "${deleting.nama_ruang}"? Semua jadwal dan penghuni terkait juga akan dihapus.`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

function RuanganForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={form.id ? "Edit Ruangan" : "Tambah Ruangan"} onClose={onClose}>
      <Field label="Nama Ruang">
        <input value={form.nama_ruang} onChange={(e) => set("nama_ruang", e.target.value)} style={S.input} />
      </Field>
      <Field label="Lantai">
        <SearchableSelect
          value={form.lantai || ""}
          onChange={(value) => set("lantai", value)}
          options={FLOORS.map((f) => ({ value: f, label: f }))}
          placeholder="Pilih lantai..."
        />
      </Field>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Checkbox label="Kelas" checked={form.is_kelas} onChange={(e) => set("is_kelas", e.target.checked)} />
        <Checkbox label="Lab" checked={form.is_lab} onChange={(e) => set("is_lab", e.target.checked)} />
        <Checkbox label="Ruang Dosen" checked={form.is_ruang_dosen} onChange={(e) => set("is_ruang_dosen", e.target.checked)} />
        <Checkbox label="Ruangan" checked={form.is_ruangan} onChange={(e) => set("is_ruangan", e.target.checked)} />
        <Checkbox label="Reservable" checked={form.is_reservable} onChange={(e) => set("is_reservable", e.target.checked)} />
      </div>
      <Field label="Keterangan">
        <input value={form.keterangan || ""} onChange={(e) => set("keterangan", e.target.value)} style={S.input} />
      </Field>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={S.btn(C.sub)}>Batal</button>
        <button onClick={() => onSave(form)} style={S.btnFill()} disabled={!form.nama_ruang.trim()}>Simpan</button>
      </div>
    </Modal>
  );
}

// ── Dosen Tab ───────────────────────────────────────────────────────
function DosenTab() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => api("/api/dosen").then(setData);
  useEffect(() => { load(); }, []);

  const save = async (form) => {
    if (form.id) {
      await api(`/api/dosen/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
    } else {
      await api("/api/dosen", { method: "POST", body: JSON.stringify(form) });
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api(`/api/dosen/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = data.filter((d) => d.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari dosen..." style={{ ...S.input, flex: 1, minWidth: "200px" }} />
        <button onClick={() => setEditing({ nama: "" })} style={S.btnFill()}>+ Tambah</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Nama", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.sub, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 10px", color: C.muted }}>{d.id}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{d.nama}</td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <button onClick={() => setEditing({ ...d })} style={{ ...S.btn(C.cyan), padding: "4px 10px", marginRight: "6px" }}>Edit</button>
                  <button onClick={() => setDeleting(d)} style={{ ...S.btn("#ff4060"), padding: "4px 10px" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Dosen" : "Tambah Dosen"} onClose={() => setEditing(null)}>
          <Field label="Nama">
            <input
              value={editing.nama}
              onChange={(e) => setEditing((f) => ({ ...f, nama: e.target.value }))}
              style={S.input}
            />
          </Field>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(null)} style={S.btn(C.sub)}>Batal</button>
            <button onClick={() => save(editing)} style={S.btnFill()} disabled={!editing.nama.trim()}>Simpan</button>
          </div>
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          message={`Hapus dosen "${deleting.nama}"? Ini bisa gagal jika dosen masih terkait dengan jadwal.`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

// ── Jadwal Tab ──────────────────────────────────────────────────────
function JadwalTab() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => Promise.all([
    api("/api/jadwal").then(setData),
    api("/api/rooms").then(setRooms),
    api("/api/dosen").then(setDosen),
  ]);
  useEffect(() => { load(); }, []);

  const empty = { ruangan_id: "", hari: "Senin", jam_mulai: "08:00", jam_selesai: "10:00", mata_kuliah: "", dosen_id: "", dosen_id_2: "", dosen_id_3: "" };

  const save = async (form) => {
    const body = { ...form, dosen_id_2: form.dosen_id_2 || null, dosen_id_3: form.dosen_id_3 || null };
    if (form.id) {
      await api(`/api/jadwal/${form.id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      await api("/api/jadwal", { method: "POST", body: JSON.stringify(body) });
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api(`/api/jadwal/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = data.filter((j) =>
    j.mata_kuliah.toLowerCase().includes(search.toLowerCase()) ||
    j.nama_ruang.toLowerCase().includes(search.toLowerCase()) ||
    (j.nama_dosen || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari jadwal..." style={{ ...S.input, flex: 1, minWidth: "200px" }} />
        <button onClick={() => setEditing({ ...empty })} style={S.btnFill()}>+ Tambah</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Ruangan", "Hari", "Mulai", "Selesai", "Mata Kuliah", "Dosen", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.sub, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 10px", color: C.muted }}>{j.id}</td>
                <td style={{ padding: "8px 10px", color: C.cyan }}>{j.nama_ruang}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{j.hari}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{j.jam_mulai?.slice(0, 5)}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{j.jam_selesai?.slice(0, 5)}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{j.mata_kuliah}</td>
                <td style={{ padding: "8px 10px", color: C.sub, fontSize: "11px" }}>
                  {j.nama_dosen}
                  {j.nama_dosen_2 && <>, {j.nama_dosen_2}</>}
                  {j.nama_dosen_3 && <>, {j.nama_dosen_3}</>}
                </td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => setEditing({
                      id: j.id, ruangan_id: j.ruangan_id, hari: j.hari,
                      jam_mulai: j.jam_mulai?.slice(0, 5), jam_selesai: j.jam_selesai?.slice(0, 5),
                      mata_kuliah: j.mata_kuliah, dosen_id: j.dosen_id,
                      dosen_id_2: j.dosen_id_2 || "", dosen_id_3: j.dosen_id_3 || "",
                    })}
                    style={{ ...S.btn(C.cyan), padding: "4px 10px", marginRight: "6px" }}
                  >Edit</button>
                  <button onClick={() => setDeleting(j)} style={{ ...S.btn("#ff4060"), padding: "4px 10px" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <JadwalForm initial={editing} rooms={rooms} dosen={dosen} onSave={save} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Hapus jadwal "${deleting.mata_kuliah}" di ${deleting.nama_ruang}?`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

function JadwalForm({ initial, rooms, dosen, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal title={form.id ? "Edit Jadwal" : "Tambah Jadwal"} onClose={onClose}>
      <Field label="Ruangan">
        <SearchableSelect
          value={form.ruangan_id}
          onChange={(value) => set("ruangan_id", value ? Number(value) : "")}
          options={rooms.filter((r) => r.is_kelas).map((r) => ({ value: r.id, label: r.nama_ruang }))}
          placeholder="Pilih ruangan..."
        />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <Field label="Hari">
          <SearchableSelect
            value={form.hari}
            onChange={(value) => set("hari", value)}
            options={DAYS.map((d) => ({ value: d, label: d }))}
            placeholder="Pilih hari..."
          />
        </Field>
        <Field label="Jam Mulai">
          <input type="time" value={form.jam_mulai} onChange={(e) => set("jam_mulai", e.target.value)} style={S.input} />
        </Field>
        <Field label="Jam Selesai">
          <input type="time" value={form.jam_selesai} onChange={(e) => set("jam_selesai", e.target.value)} style={S.input} />
        </Field>
      </div>
      <Field label="Mata Kuliah">
        <input value={form.mata_kuliah} onChange={(e) => set("mata_kuliah", e.target.value)} style={S.input} />
      </Field>
      <Field label="Dosen Utama">
        <SearchableSelect
          value={form.dosen_id}
          onChange={(value) => set("dosen_id", value ? Number(value) : "")}
          options={dosen.map((d) => ({ value: d.id, label: d.nama }))}
          placeholder="Pilih dosen..."
        />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="Dosen 2 (opsional)">
          <SearchableSelect
            value={form.dosen_id_2}
            onChange={(value) => set("dosen_id_2", value ? Number(value) : "")}
            options={dosen.map((d) => ({ value: d.id, label: d.nama }))}
            placeholder="Pilih dosen..."
          />
        </Field>
        <Field label="Dosen 3 (opsional)">
          <SearchableSelect
            value={form.dosen_id_3}
            onChange={(value) => set("dosen_id_3", value ? Number(value) : "")}
            options={dosen.map((d) => ({ value: d.id, label: d.nama }))}
            placeholder="Pilih dosen..."
          />
        </Field>
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={S.btn(C.sub)}>Batal</button>
        <button
          onClick={() => onSave(form)}
          style={S.btnFill()}
          disabled={!form.ruangan_id || !form.mata_kuliah.trim() || !form.dosen_id}
        >Simpan</button>
      </div>
    </Modal>
  );
}

// ── Penghuni Ruangan Tab ────────────────────────────────────────────
function PenghuniTab() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => Promise.all([
    api("/api/penghuni").then(setData),
    api("/api/rooms").then(setRooms),
    api("/api/dosen").then(setDosen),
  ]);
  useEffect(() => { load(); }, []);

  const empty = { ruangan_id: "", dosen_id: "", urutan: 0 };

  const save = async (form) => {
    if (form.id) {
      await api(`/api/penghuni/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
    } else {
      await api("/api/penghuni", { method: "POST", body: JSON.stringify(form) });
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api(`/api/penghuni/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = data.filter((p) =>
    p.nama_ruang.toLowerCase().includes(search.toLowerCase()) ||
    p.nama_dosen.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari dosen..." style={{ ...S.input, flex: 1, minWidth: "200px" }} />
        <button onClick={() => setEditing({ ...empty })} style={S.btnFill()}>+ Tambah</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Ruangan", "Dosen", "Urutan", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.sub, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 10px", color: C.muted }}>{p.id}</td>
                <td style={{ padding: "8px 10px", color: C.cyan }}>{p.nama_ruang}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{p.nama_dosen}</td>
                <td style={{ padding: "8px 10px", color: C.sub }}>{p.urutan}</td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <button onClick={() => setEditing({ ...p })} style={{ ...S.btn(C.cyan), padding: "4px 10px", marginRight: "6px" }}>Edit</button>
                  <button onClick={() => setDeleting(p)} style={{ ...S.btn("#ff4060"), padding: "4px 10px" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Penghuni" : "Tambah Penghuni"} onClose={() => setEditing(null)}>
          <Field label="Ruangan">
            <SearchableSelect
              value={editing.ruangan_id}
              onChange={(value) => setEditing((f) => ({ ...f, ruangan_id: value ? Number(value) : "" }))}
              options={rooms.filter((r) => r.is_ruang_dosen).map((r) => ({ value: r.id, label: r.nama_ruang }))}
              placeholder="Pilih ruangan..."
            />
          </Field>
          <Field label="Dosen">
            <SearchableSelect
              value={editing.dosen_id}
              onChange={(value) => setEditing((f) => ({ ...f, dosen_id: value ? Number(value) : "" }))}
              options={dosen.map((d) => ({ value: d.id, label: d.nama }))}
              placeholder="Pilih dosen..."
            />
          </Field>
          <Field label="Urutan">
            <input
              type="number"
              value={editing.urutan}
              onChange={(e) => setEditing((f) => ({ ...f, urutan: Number(e.target.value) }))}
              style={S.input}
            />
          </Field>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(null)} style={S.btn(C.sub)}>Batal</button>
            <button
              onClick={() => save(editing)}
              style={S.btnFill()}
              disabled={!editing.ruangan_id || !editing.dosen_id}
            >Simpan</button>
          </div>
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          message={`Hapus penghuni "${deleting.nama_dosen}" dari ruangan "${deleting.nama_ruang}"?`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

// ── Reservasi Tab ───────────────────────────────────────────────────
function ReservasiTab() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () => Promise.all([
    api("/api/reservasi").then(setData),
    api("/api/rooms").then(setRooms),
    api("/api/dosen").then(setDosen),
  ]);
  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const empty = { ruangan_id: "", dosen_id: "", tanggal: today, jam_mulai: "08:00", jam_selesai: "10:00", keterangan: "" };

  const save = async (form) => {
    try {
      setError("");
      if (form.id) {
        await api(`/api/reservasi/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await api("/api/reservasi", { method: "POST", body: JSON.stringify(form) });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.error || "Gagal menyimpan reservasi.");
    }
  };

  const remove = async (id) => {
    await api(`/api/reservasi/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const filtered = data.filter((rv) =>
    rv.nama_ruang.toLowerCase().includes(search.toLowerCase()) ||
    (rv.nama_dosen || "").toLowerCase().includes(search.toLowerCase()) ||
    (rv.keterangan || "").toLowerCase().includes(search.toLowerCase())
  );

  const reservableRooms = rooms.filter((r) => r.is_reservable);

  return (
    <>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari reservasi..." style={{ ...S.input, flex: 1, minWidth: "200px" }} />
        <button onClick={() => { setError(""); setEditing({ ...empty }); }} style={S.btnFill()}>+ Tambah</button>
      </div>

      {reservableRooms.length === 0 && (
        <p style={{ fontSize: "12px", color: C.muted, letterSpacing: "0.5px" }}>
          Belum ada ruangan yang ditandai sebagai "Reservable". Tandai ruangan di tab Ruangan terlebih dahulu.
        </p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["ID", "Ruangan", "Tanggal", "Mulai", "Selesai", "Dosen", "Keterangan", ""].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.sub, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rv) => (
              <tr key={rv.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 10px", color: C.muted }}>{rv.id}</td>
                <td style={{ padding: "8px 10px", color: C.cyan }}>{rv.nama_ruang}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{rv.tanggal?.slice(0, 10)}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{rv.jam_mulai?.slice(0, 5)}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{rv.jam_selesai?.slice(0, 5)}</td>
                <td style={{ padding: "8px 10px", color: C.text }}>{rv.nama_dosen}</td>
                <td style={{ padding: "8px 10px", color: C.sub }}>{rv.keterangan || "-"}</td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => { setError(""); setEditing({ ...rv, tanggal: rv.tanggal?.slice(0, 10), jam_mulai: rv.jam_mulai?.slice(0, 5), jam_selesai: rv.jam_selesai?.slice(0, 5) }); }}
                    style={{ ...S.btn(C.cyan), padding: "4px 10px", marginRight: "6px" }}
                  >Edit</button>
                  <button onClick={() => setDeleting(rv)} style={{ ...S.btn("#ff4060"), padding: "4px 10px" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit Reservasi" : "Tambah Reservasi"} onClose={() => setEditing(null)}>
          {error && (
            <div style={{ background: "#200a10", border: "1px solid #5a1020", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#ff4060" }}>
              {error}
            </div>
          )}
          <Field label="Ruangan">
            <SearchableSelect
              value={editing.ruangan_id}
              onChange={(value) => setEditing((f) => ({ ...f, ruangan_id: value ? Number(value) : "" }))}
              options={reservableRooms.map((r) => ({ value: r.id, label: r.nama_ruang }))}
              placeholder="Pilih ruangan..."
            />
          </Field>
          <Field label="Tanggal">
            <input type="date" value={editing.tanggal} onChange={(e) => setEditing((f) => ({ ...f, tanggal: e.target.value }))} style={S.input} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Jam Mulai">
              <input type="time" value={editing.jam_mulai} onChange={(e) => setEditing((f) => ({ ...f, jam_mulai: e.target.value }))} style={S.input} />
            </Field>
            <Field label="Jam Selesai">
              <input type="time" value={editing.jam_selesai} onChange={(e) => setEditing((f) => ({ ...f, jam_selesai: e.target.value }))} style={S.input} />
            </Field>
          </div>
          <Field label="Dosen">
            <SearchableSelect
              value={editing.dosen_id}
              onChange={(value) => setEditing((f) => ({ ...f, dosen_id: value ? Number(value) : "" }))}
              options={dosen.map((d) => ({ value: d.id, label: d.nama }))}
              placeholder="Pilih dosen..."
            />
          </Field>
          <Field label="Keterangan">
            <input value={editing.keterangan || ""} onChange={(e) => setEditing((f) => ({ ...f, keterangan: e.target.value }))} style={S.input} />
          </Field>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(null)} style={S.btn(C.sub)}>Batal</button>
            <button
              onClick={() => save(editing)}
              style={S.btnFill()}
              disabled={!editing.ruangan_id || !editing.dosen_id || !editing.tanggal}
            >Simpan</button>
          </div>
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          message={`Hapus reservasi "${deleting.nama_dosen}" di ${deleting.nama_ruang} (${deleting.tanggal?.slice(0, 10)})?`}
          onConfirm={() => remove(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState("ruangan");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Mono', monospace",
      color: C.text,
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${C.border}`,
        borderTop: `2px solid ${C.cyan}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: "8px", letterSpacing: "3px", color: "#ffffff", textTransform: "uppercase", margin: "0 0 2px" }}>Teknik Informatika</p>
          <p style={{ fontSize: "20px", fontWeight: "700", margin: 0, letterSpacing: "2px" }}>
            <span style={{ color: C.cyan }}>IF Kiosk</span>
            <span style={{ color: C.sub, fontSize: "14px", marginLeft: "10px" }}>Admin</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "0",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
        flexShrink: 0,
      }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: "none",
              borderBottom: tab === t.key ? `2px solid ${C.cyan}` : "2px solid transparent",
              color: tab === t.key ? C.cyan : C.sub,
              fontSize: "12px",
              letterSpacing: "0.5px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px", overflow: "auto" }}>
        {tab === "ruangan" && <RuanganTab />}
        {tab === "dosen" && <DosenTab />}
        {tab === "jadwal" && <JadwalTab />}
        {tab === "penghuni" && <PenghuniTab />}
        {tab === "reservasi" && <ReservasiTab />}
      </div>
    </div>
  );
}
