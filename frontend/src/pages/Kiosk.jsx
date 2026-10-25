import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { C, EXCLUDE, getRoomSort, groupMeshNames } from "../lib/constants";
import { loadData }     from "../lib/data";
import { getRoom }      from "../lib/directory";
import { GESTURES, RELAY_URL } from "../lib/config";
import { panBy, rotateBy, zoomBy } from "../lib/cameraMoves";
import { useThreeScene }  from "../hooks/useThreeScene";
import { useAnimations }  from "../hooks/useAnimations";
import { useModelLoader } from "../hooks/useModelLoader";
import { Sidebar }        from "../components/Sidebar";
import { SchedulePanel }  from "../components/SchedulePanel";
import { useTVWebSocket } from "../hooks/useWebSocket";
import { QROverlay }      from "../components/QROverlay";

// How often the kiosk checks whether a new data version has been deployed.
const DATA_CHECK_MS = 10 * 60 * 1000;

export default function Kiosk() {
  const mountRef           = useRef(null);
  const lastActiveFloorRef = useRef(null);
  const pendingRoomRef     = useRef(null);
  const idleRotationTimerRef = useRef(null);

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
  const {
    floorAnimRef,
    isAnimatingRef,
    animateFloorTransition,
    animateTCIntro,
    animateFloorIntro,
    startIdleRotation,
    restoreModelRotation,
    cancelRotationAnimation,
    setModelRotationBase,
  } =
    useAnimations(sceneRef);

  // ── Model loading ─────────────────────────────────────────────────
  const { loadTC, loadFloorObjMtl, loadByFiles, highlightRoom } = useModelLoader({
    sceneRef, floorAnimRef, isAnimatingRef,
    animateFloorIntro, animateTCIntro, cancelRotationAnimation, setModelRotationBase,
    lastActiveFloorRef, pendingRoomRef,
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

    const { camera, controls } = sceneRef.current;
    if (action.startsWith("camera") && (!camera || !controls)) return;
    const ground = GESTURES === "map";

    if (action === "cameraRotate") rotateBy(camera, controls, payload.dx, payload.dy);
    if (action === "cameraZoom")   zoomBy(camera, controls, payload.scale ?? (payload.direction === "in" ? 0.93 : 1.07));
    if (action === "cameraPan")    panBy(camera, controls, payload.dx, payload.dy, { ground });

    // One frame of a touch gesture on the phone, batched: any of zoom, pan
    // and rotate, depending on the gesture scheme.
    if (action === "cameraTransform") {
      const { zoom = 1, panDx = 0, panDy = 0, rotateDx = 0, rotateDy = 0 } = payload;
      if (zoom !== 1)                     zoomBy(camera, controls, zoom);
      if (panDx !== 0 || panDy !== 0)     panBy(camera, controls, panDx, panDy, { ground });
      if (rotateDx !== 0 || rotateDy !== 0) rotateBy(camera, controls, rotateDx, rotateDy);
    }

    if (action === "cameraReset") controls.reset();
  };

  // ── WebSocket (sync state to phone on connect) ────────────────────
  const sendStateRef = useRef(null);
  const handleDisconnectRef = useRef(null);
  const resetToDisconnectedView = () => {
    setActiveRoom(null);
    setActiveFloor("Lantai 1");
    loadFloorObjMtl("Lantai 1", true);
  };
  handleDisconnectRef.current = resetToDisconnectedView;

  const { mobileUrl, phoneConnected, sendState } = useTVWebSocket({
    onCmd:             (action, payload) => handleCmdRef.current(action, payload),
    onPhoneConnect:    () => sendStateRef.current(),
    onPhoneDisconnect: () => handleDisconnectRef.current(),
  });

  useEffect(() => {
    if (!phoneConnected) return;
    restoreModelRotation();
  }, [phoneConnected, restoreModelRotation]);

  useEffect(() => {
    const clearIdleTimer = () => {
      if (idleRotationTimerRef.current) {
        clearTimeout(idleRotationTimerRef.current);
        idleRotationTimerRef.current = null;
      }
    };

    const armIdleRotation = () => {
      clearIdleTimer();
      if (phoneConnected) return;
      idleRotationTimerRef.current = setTimeout(() => {
        startIdleRotation();
      }, 10000);
    };

    const handleActivity = () => {
      if (phoneConnected) return;
      restoreModelRotation();
      armIdleRotation();
    };

    armIdleRotation();
    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity, { passive: true });

    return () => {
      clearIdleTimer();
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [phoneConnected, startIdleRotation, restoreModelRotation]);

  sendStateRef.current = () => {
    const rooms = groupMeshNames(modelInfo?.meshNames?.filter(n => !EXCLUDE.test(n)).sort(getRoomSort(activeFloor)) || []);
    sendState({ view, activeFloor, rooms });
  };

  useEffect(() => { sendStateRef.current(); }, [view, activeFloor, modelInfo]);

  // ── Room data (flags + occupants + schedules) from the static data ──
  useEffect(() => {
    if (!activeRoom) { setRoomData(null); setSchedLoading(false); setSchedError(""); return; }
    let current = true;
    setRoomData(null); setSchedLoading(true); setSchedError("");
    loadData()
      .then((data) => { if (current) setRoomData(getRoom(data, activeRoom)); })
      .catch(() => { if (current) setSchedError("Data ruangan tidak dapat dimuat."); })
      .finally(() => { if (current) setSchedLoading(false); });
    return () => { current = false; };
  }, [activeRoom]);

  // A kiosk stays open for weeks. When a new data version has been deployed,
  // reload the page so it picks up the new data and code, but never while a
  // visitor is using it from their phone.
  useEffect(() => {
    if (phoneConnected) return;
    let idle = true;
    const id = setInterval(() => {
      Promise.all([loadData(), loadData({ fresh: true })])
        .then(([loaded, latest]) => { if (idle && loaded.version !== latest.version) window.location.reload(); })
        .catch(() => {});
    }, DATA_CHECK_MS);
    return () => { idle = false; clearInterval(id); };
  }, [phoneConnected]);

  // ── Load the same kiosk view used after phone disconnect on mount ──
  useEffect(() => { resetToDisconnectedView(); }, []);

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
          <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(8,9,15,0.85)", border: `1px solid ${C.cyan}`, boxShadow: C.cyanGlow, borderRadius: "6px", padding: "8px 16px", fontSize: "18px", color: C.cyan, letterSpacing: "1px", backdropFilter: "blur(6px)" }}>
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

      {/* The panel belongs to the paired phone. With no relay nobody can pair,
          so show it whenever a room is tapped on the screen itself. */}
      {(phoneConnected || !RELAY_URL) && (
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
