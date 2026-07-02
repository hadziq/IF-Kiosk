import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { API_URL, C, EXCLUDE, getRoomSort, groupMeshNames } from "./constants";
import { useThreeScene }  from "./hooks/useThreeScene";
import { useAnimations }  from "./hooks/useAnimations";
import { useModelLoader } from "./hooks/useModelLoader";
import { Sidebar }        from "./components/Sidebar";
import { SchedulePanel }  from "./components/SchedulePanel";
import { useTVWebSocket } from "./hooks/useWebSocket";
import { QROverlay }      from "./QROverlay";

export default function App() {
  const mountRef           = useRef(null);
  const lastActiveFloorRef = useRef(null);
  const pendingRoomRef     = useRef(null);

  const [status,       setStatus]       = useState("idle");
  const [modelInfo,    setModelInfo]    = useState(null);
  const [errorMsg,     setErrorMsg]     = useState("");
  const [activeFloor,  setActiveFloor]  = useState(null);
  const [activeRoom,   setActiveRoom]   = useState(null);
  const [view,         setView]         = useState("floors");
  const [roomData,     setRoomData]     = useState(null);
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedError,   setSchedError]   = useState("");

  // ── Three.js scene (renderer, camera, lights, controls) ──────────
  const sceneRef = useThreeScene(mountRef);

  // ── Floor/room animations ─────────────────────────────────────────
  const { floorAnimRef, isAnimatingRef, animateFloorTransition, animateTCIntro, animateFloorIntro } =
    useAnimations(sceneRef);

  // ── Model loading ─────────────────────────────────────────────────
  const { loadTC, loadFloorObjMtl, loadByFiles, highlightRoom, applyMarkerCameraView } = useModelLoader({
    sceneRef, floorAnimRef, isAnimatingRef,
    animateFloorIntro, animateTCIntro, lastActiveFloorRef, pendingRoomRef,
    setStatus, setModelInfo, setErrorMsg,
    setActiveFloor, setActiveRoom, setRoomData, setView,
  });

  // ── WebSocket command handler ─────────────────────────────────────
  const handleCmdRef = useRef(null);
  handleCmdRef.current = (action, payload) => {
    if (action === "selectFloor") {
      setActiveFloor(payload);
      animateFloorTransition(payload, () => loadFloorObjMtl(payload));
    }
    if (action === "selectRoom") { setActiveRoom(payload); highlightRoom(payload); }
    if (action === "selectFloorAndRoom") {
      const { floor, room } = payload;
      pendingRoomRef.current = room;
      setActiveFloor(floor);
      animateFloorTransition(floor, () => loadFloorObjMtl(floor));
    }
    if (action === "back") {
      lastActiveFloorRef.current = activeFloor;
      setActiveFloor(null); setView("floors"); loadTC();
    }

    if (action === "cameraRotate") {
      const { camera, controls } = sceneRef.current;
      if (!camera || !controls) return;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      const sph = new THREE.Spherical().setFromVector3(offset);
      sph.theta -= payload.dx * 0.005;
      sph.phi    = Math.max(0.05, Math.min(Math.PI - 0.05, sph.phi - payload.dy * 0.005));
      offset.setFromSpherical(sph);
      camera.position.copy(controls.target).add(offset);
    }

    if (action === "cameraZoom") {
      const { camera, controls } = sceneRef.current;
      if (!camera || !controls) return;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      const scale  = payload.scale ?? (payload.direction === "in" ? 0.93 : 1.07);
      const newLen = Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * scale));
      offset.setLength(newLen);
      camera.position.copy(controls.target).add(offset);
    }

    if (action === "cameraTransform") {
      const { camera, controls } = sceneRef.current;
      if (!camera || !controls) return;
      if (payload.zoom !== 1) {
        const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
        const newLen = Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * payload.zoom));
        offset.setLength(newLen);
        camera.position.copy(controls.target).add(offset);
      }
      if (payload.panDx !== 0 || payload.panDy !== 0) {
        const distance = camera.position.distanceTo(controls.target);
        const speed    = distance * 0.002;
        const dir = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3();
        camera.getWorldDirection(dir);
        right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        up.crossVectors(right, dir).normalize();
        const panOffset = new THREE.Vector3()
          .addScaledVector(right, -payload.panDx * speed)
          .addScaledVector(up,     payload.panDy * speed);
        camera.position.add(panOffset);
        controls.target.add(panOffset);
      }
    }

    if (action === "cameraPan") {
      const { camera, controls } = sceneRef.current;
      if (!camera || !controls) return;
      const distance = camera.position.distanceTo(controls.target);
      const speed    = distance * 0.002;
      const dir = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3();
      camera.getWorldDirection(dir);
      right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      up.crossVectors(right, dir).normalize();
      const offset = new THREE.Vector3()
        .addScaledVector(right, -payload.dx * speed)
        .addScaledVector(up,     payload.dy * speed);
      camera.position.add(offset);
      controls.target.add(offset);
    }

    if (action === "cameraReset") {
      const { controls } = sceneRef.current;
      if (controls) controls.reset();
    }
  };

  // ── WebSocket (sync state to phone on connect) ────────────────────
  const sendStateRef = useRef(null);
  const handleDisconnectRef = useRef(null);
  handleDisconnectRef.current = () => {
    setActiveRoom(null);
    setActiveFloor("Lantai 1");
    loadFloorObjMtl("Lantai 1", true);
  };

  const { mobileUrl, phoneConnected, sendState } = useTVWebSocket({
    onCmd:             (action, payload) => handleCmdRef.current(action, payload),
    onPhoneConnect:    () => sendStateRef.current(),
    onPhoneDisconnect: () => handleDisconnectRef.current(),
  });

  sendStateRef.current = () => {
    const rooms = groupMeshNames(modelInfo?.meshNames?.filter(n => !EXCLUDE.test(n)).sort(getRoomSort(activeFloor)) || []);
    sendState({ view, activeFloor, rooms });
  };

  useEffect(() => { sendStateRef.current(); }, [view, activeFloor, modelInfo]);

  useEffect(() => {
    if (!phoneConnected || activeFloor !== "Lantai 1" || status !== "success") return;
    const id = setTimeout(() => applyMarkerCameraView("connected"), 50);
    return () => clearTimeout(id);
  }, [phoneConnected, activeFloor, status]);

  // ── Room data fetch (single call: flags + occupants + schedules) ──
  const fetchRoomData = (room, showLoading) => {
    if (!room) { setRoomData(null); setSchedLoading(false); setSchedError(""); return; }
    if (showLoading) { setRoomData(null); setSchedLoading(true); setSchedError(""); }
    fetch(`${API_URL}/api/rooms/${encodeURIComponent(room)}`)
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null)
      .then((data) => { setRoomData(data); setSchedLoading(false); });
  };

  useEffect(() => { fetchRoomData(activeRoom, true); }, [activeRoom]);

  // Auto-refresh room data every 30s so admin changes appear on the kiosk
  useEffect(() => {
    if (!activeRoom) return;
    const id = setInterval(() => fetchRoomData(activeRoom, false), 30000);
    return () => clearInterval(id);
  }, [activeRoom]);

  // ── Load TC model on mount ────────────────────────────────────────
  useEffect(() => { loadTC(false); }, []);

  // ── Layout ────────────────────────────────────────────────────────
  return (
    <div
      style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Mono', monospace", color: C.text }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); loadByFiles(e.dataTransfer.files); }}
    >
      <Sidebar
        view={view}
        activeFloor={activeFloor}
        activeRoom={activeRoom}
        modelInfo={modelInfo}
        status={status}
        errorMsg={errorMsg}
        isAnimatingRef={isAnimatingRef}
        onFloorSelect={(f) => { setActiveFloor(f); animateFloorTransition(f, () => loadFloorObjMtl(f)); }}
        onBack={() => { lastActiveFloorRef.current = activeFloor; setActiveFloor(null); setView("floors"); loadTC(); }}
        onRoomSelect={(name) => { setActiveRoom(name); highlightRoom(name); }}
      />

      {/* 3D viewport */}
      <div style={{ flex: 1, minWidth: 0, position: "relative", overflow: "hidden" }}>
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

        {activeFloor && status === "success" && (
          <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(8,9,15,0.85)", border: `1px solid ${C.cyan}`, boxShadow: C.cyanGlow, borderRadius: "6px", padding: "8px 16px", fontSize: "14px", color: C.cyan, letterSpacing: "1px", backdropFilter: "blur(6px)" }}>
            {activeFloor}{activeRoom && <span style={{ color: C.sub }}> / {activeRoom.replace(/_/g, " ")}</span>}
          </div>
        )}

        <QROverlay mobileUrl={mobileUrl} phoneConnected={phoneConnected} />

        {phoneConnected && view === "rooms" && activeFloor && activeFloor !== "Lantai 1" && status === "success" && (
          <div style={{
            position: "absolute", bottom: "20px", right: "20px",
            background: "rgba(8,9,15,0.9)", border: `1px solid ${C.green}`,
            boxShadow: C.greenGlow,
            borderRadius: "8px", padding: "10px 16px",
            display: "flex", alignItems: "center", gap: "8px",
            backdropFilter: "blur(8px)",
            fontFamily: "'DM Mono', monospace",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.green, boxShadow: C.greenGlow, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: C.green, letterSpacing: "0.5px" }}>
              Anda berada di Lantai 1
            </span>
          </div>
        )}
      </div>

      {phoneConnected && (
        <div style={{ width: "300px", minWidth: "300px", height: "100%", flexShrink: 0 }}>
          <SchedulePanel
            roomName={activeRoom}
            roomData={roomData}
            loading={schedLoading}
            error={schedError}
          />
        </div>
      )}
    </div>
  );
}
