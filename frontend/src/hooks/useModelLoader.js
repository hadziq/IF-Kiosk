import { useRef } from "react";
import * as THREE from "three";
import { OBJLoader }    from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader }    from "three/examples/jsm/loaders/MTLLoader";
import { getExt } from "../constants";

export function useModelLoader({
  sceneRef,
  floorAnimRef,
  isAnimatingRef,
  animateFloorIntro,
  animateTCIntro,
  lastActiveFloorRef,
  pendingRoomRef,
  setStatus,
  setModelInfo,
  setErrorMsg,
  setActiveFloor,
  setActiveRoom,
  setRoomData,
  setView,
}) {
  const originalMaterials = useRef({});
  const savedCameraRef    = useRef(null);
  const modelCacheRef     = useRef(new Map());
  const markerRef         = useRef(null);
  const modelSizeRef      = useRef(null);

  const removeMarker = () => {
    if (markerRef.current) {
      sceneRef.current.scene?.remove(markerRef.current);
      markerRef.current = null;
    }
  };

  const addYouAreHereMarker = () => {
    removeMarker();
    const { scene } = sceneRef.current;
    const model = scene?.getObjectByName("__loaded_model__");
    if (!model) return;

    let tvMesh = null;
    model.traverse((child) => { if (child.isMesh && child.name === "TV") tvMesh = child; });
    if (!tvMesh) return;

    model.updateMatrixWorld(true);
    const tvBox = new THREE.Box3().setFromObject(tvMesh);
    const tvCenter = tvBox.getCenter(new THREE.Vector3());
    const tvSize = tvBox.getSize(new THREE.Vector3());

    const s = Math.max(tvSize.x, tvSize.z) * 0.8;
    const group = new THREE.Group();
    group.name = "__you_are_here__";

    const pinMat = new THREE.MeshBasicMaterial({ color: 0x4d82ff });

    const cone = new THREE.Mesh(new THREE.ConeGeometry(s * 0.5, s * 1.5, 16), pinMat);
    cone.rotation.x = Math.PI;
    cone.position.y = s * 0.75;
    group.add(cone);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(s * 0.6, 16, 16), pinMat);
    sphere.position.y = s * 1.8;
    group.add(sphere);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.25, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    dot.position.y = s * 1.8;
    group.add(dot);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(s * 0.6, s * 0.9, 32),
      new THREE.MeshBasicMaterial({ color: 0x4d82ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    group.add(ring);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 48px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 6;
    ctx.strokeText("Anda berada di sini", 256, 64);
    ctx.fillStyle = "#4d82ff";
    ctx.fillText("Anda berada di sini", 256, 64);

    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }),
    );
    label.scale.set(s * 6, s * 1.5, 1);
    label.position.y = s * 3;
    group.add(label);

    group.position.copy(tvCenter);
    group.position.y = tvBox.max.y;
    scene.add(group);
    markerRef.current = group;
  };

  const deepClone = (obj) => {
    const clone = obj.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.material = Array.isArray(child.material)
        ? child.material.map((m) => m.clone())
        : child.material.clone();
    });
    return clone;
  };

  const onErr = (err) => {
    console.error(err);
    setErrorMsg(err?.message || "Failed to load.");
    setStatus("error");
  };

  const highlightRoom = (roomName) => {
    const { scene } = sceneRef.current;
    const model = scene.getObjectByName("__loaded_model__");
    if (!model) return;

    model.traverse((child) => {
      if (!child.isMesh) return;
      if (!originalMaterials.current[child.uuid]) {
        originalMaterials.current[child.uuid] = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone();
      }

      const highlight = (mat) => {
        const h = mat.clone();
        h.emissive = new THREE.Color(0x22aa44);
        h.emissiveIntensity = 0.8;
        h.transparent = true;
        h.opacity     = 1;
        h.depthWrite  = true;
        return h;
      };
      const dim = (mat) => {
        const d = mat.clone();
        d.transparent = true;
        d.opacity     = roomName ? 0.2 : 1;
        d.emissive    = new THREE.Color(0x000000);
        d.emissiveIntensity = 0;
        return d;
      };

      const orig = originalMaterials.current[child.uuid];
      const isMatch = child.name === roomName;
      child.material = isMatch
        ? (Array.isArray(orig) ? orig.map(highlight) : highlight(orig))
        : (Array.isArray(orig) ? orig.map(dim)       : dim(orig));
    });
  };

  const finalizeModel = (model, switchToRooms = true, preserveCamera = false, floorName = null) => {
    if (floorAnimRef.current) {
      cancelAnimationFrame(floorAnimRef.current);
      floorAnimRef.current  = null;
      isAnimatingRef.current = false;
    }

    const { scene, camera, controls } = sceneRef.current;
    removeMarker();
    const prev = scene.getObjectByName("__loaded_model__");
    if (prev) scene.remove(prev);
    originalMaterials.current = {};

    model.name = "__loaded_model__";
    const meshNames = [];
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
        if (child.name) meshNames.push(child.name);
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => { if (m && m.opacity < 1) { m.transparent = true; m.depthWrite = false; } });
      }
    });

    const box    = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.position.y += size.y / 2;
    scene.add(model);

    modelSizeRef.current = size;

    const dist = Math.max(size.x, size.y, size.z) * 1.8;
    camera.position.set(dist, dist * 0.5, 0);
    controls.target.set(0, size.y / 2, 0);
    controls.update();
    controls.saveState();

    if (preserveCamera && savedCameraRef.current) {
      camera.position.copy(savedCameraRef.current.position);
      controls.target.copy(savedCameraRef.current.target);
      savedCameraRef.current = null;
      controls.update();
    }

    if (switchToRooms) {
      animateFloorIntro(model);
      setModelInfo({
        meshCount: meshNames.length,
        meshNames,
        size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      });

      const pending = pendingRoomRef?.current;
      if (pending && meshNames.includes(pending)) {
        pendingRoomRef.current = null;
        setActiveRoom(pending);
        setRoomData(null);
        highlightRoom(pending);
      } else {
        setActiveRoom(null);
        setRoomData(null);
      }
      setView("rooms");
    } else {
      const lf = lastActiveFloorRef.current;
      lastActiveFloorRef.current = null;
      animateTCIntro(lf);
    }

    if (floorName === "Lantai 1") addYouAreHereMarker();

    setStatus("success");
  };

  const loadTC = (preserveCamera = true) => {
    const { camera, controls } = sceneRef.current;
    if (preserveCamera && camera && controls) {
      savedCameraRef.current = { position: camera.position.clone(), target: controls.target.clone() };
    }
    setStatus("loading"); setModelInfo(null); setErrorMsg("");
    setActiveFloor(null); setActiveRoom(null); setRoomData(null);
    const ml = new MTLLoader();
    ml.load(
      "/models/TC.mtl",
      (mats) => {
        mats.preload();
        const ol = new OBJLoader();
        ol.setMaterials(mats);
        ol.load("/models/TC.obj", (obj) => finalizeModel(obj, false, preserveCamera), undefined, onErr);
      },
      undefined,
      onErr,
    );
  };

  const loadFloorObjMtl = (floorName) => {
    const { camera, controls, scene } = sceneRef.current;
    if (camera && controls) {
      savedCameraRef.current = { position: camera.position.clone(), target: controls.target.clone() };
    }
    const prev = scene?.getObjectByName("__loaded_model__");
    if (prev) prev.visible = false;
    setStatus("loading"); setModelInfo(null); setErrorMsg(""); setView("floors");

    if (modelCacheRef.current.has(floorName)) {
      finalizeModel(deepClone(modelCacheRef.current.get(floorName)), true, true, floorName);
      return;
    }

    const ml = new MTLLoader();
    ml.load(
      `/models/${floorName}.mtl`,
      (mats) => {
        mats.preload();
        const ol = new OBJLoader();
        ol.setMaterials(mats);
        ol.load(`/models/${floorName}.obj`, (obj) => {
          modelCacheRef.current.set(floorName, deepClone(obj));
          finalizeModel(obj, true, true, floorName);
        }, undefined, onErr);
      },
      undefined,
      onErr,
    );
  };

  const loadByUrl = (url) => {
    setStatus("loading"); setModelInfo(null); setErrorMsg(""); setView("floors");
    new OBJLoader().load(url, finalizeModel, undefined, onErr);
  };

  const loadByFiles = (files) => {
    const fm = {};
    Array.from(files).forEach((f) => { fm[getExt(f.name)] = f; });
    setStatus("loading"); setModelInfo(null); setErrorMsg(""); setView("floors");

    if (fm["obj"]) {
      if (fm["mtl"]) {
        const ml = new MTLLoader();
        ml.load(
          URL.createObjectURL(fm["mtl"]),
          (mats) => {
            mats.preload();
            const ol = new OBJLoader();
            ol.setMaterials(mats);
            ol.load(URL.createObjectURL(fm["obj"]), finalizeModel, undefined, onErr);
          },
          undefined,
          onErr,
        );
      } else {
        loadByUrl(URL.createObjectURL(fm["obj"]));
      }
    } else {
      setErrorMsg("No supported file found.");
      setStatus("error");
    }
  };

  return { loadTC, loadFloorObjMtl, loadByFiles, highlightRoom };
}
