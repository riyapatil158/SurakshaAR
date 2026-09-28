"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, OrbitControls, Html } from "@react-three/drei";
import { useRef, Suspense, useMemo, useState } from "react";
import * as THREE from "three";

export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1a2231" metalness={0.2} roughness={0.85} />
    </mesh>
  );
}

export function Pipe({
  start,
  end,
  radius = 0.14,
  color = "#3a4759",
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
}) {
  const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const length = dir.length();
  const mid = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(0.5));
  return (
    <mesh position={mid} castShadow>
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
    </mesh>
  );
}

export function WarningSign({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshStandardMaterial color="#ffb020" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
      {/* triangle */}
      <mesh position={[0, 0, 0.05]}>
        <coneGeometry args={[0.22, 0.38, 3]} />
        <meshStandardMaterial color="#ffb020" />
      </mesh>
    </group>
  );
}

export function Extinguisher({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1, 16]} />
        <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 12]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 1.1, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.04]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
    </group>
  );
}

export function ElectricalPanel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.3]} />
        <meshStandardMaterial color="#273244" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0.16]}>
        <boxGeometry args={[1.4, 2.2, 0.02]} />
        <meshStandardMaterial color="#1c2536" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* warning label */}
      <mesh position={[0, 1.8, 0.18]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshStandardMaterial color="#ffb020" />
      </mesh>
      {/* LED */}
      <mesh position={[-0.4, 0.5, 0.18]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#2ee38d" emissive="#2ee38d" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.4, 0.5, 0.18]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

export function GasCylinder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.22, 1.3, 6, 16]} />
        <meshStandardMaterial color="#16a34a" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.16, 10]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Smoke({ position, intensity = 1 }: { position: [number, number, number]; intensity?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const offset = i * 0.7;
      mesh.position.y = 1.2 + ((t + offset) % 3) * 0.5;
      mesh.position.x = Math.sin(t * 0.6 + offset) * 0.25;
      const s = 0.3 + ((t + offset) % 3) * 0.15;
      mesh.scale.set(s, s, s);
      (mesh.material as THREE.MeshStandardMaterial).opacity =
        Math.max(0, 0.55 - ((t + offset) % 3) * 0.18) * intensity;
    });
  });
  const puffs = useMemo(() => Array.from({ length: 8 }), []);
  return (
    <group ref={ref} position={position}>
      {puffs.map((_, i) => (
        <mesh key={i} raycast={() => null}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#555" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function Fire({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const t = state.clock.elapsedTime;
      const s = 0.5 + Math.sin(t * 8 + i) * 0.1;
      mesh.scale.set(s, s * 1.2, s);
      mesh.rotation.z = Math.sin(t * 4 + i) * 0.1;
    });
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.25, 0.7, 10]} />
        <meshStandardMaterial
          color="#ff6a1a"
          emissive="#ff4500"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0.1, 0.2, 0.1]}>
        <coneGeometry args={[0.16, 0.5, 10]} />
        <meshStandardMaterial
          color="#ffb020"
          emissive="#ff8c00"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

export function WorkerPPE({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* body - reflective vest */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.24, 0.7, 6, 14]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.7} />
      </mesh>
      {/* reflective stripes */}
      <mesh position={[0, 0.95, 0.245]}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
        <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0.245]}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
        <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={0.4} />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#b9825a" roughness={0.9} />
      </mesh>
      {/* helmet */}
      <mesh castShadow position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.21, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffb020" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 20]} />
        <meshStandardMaterial color="#ffb020" roughness={0.4} />
      </mesh>
      {/* arms */}
      <mesh castShadow position={[0.3, 1.0, 0]}>
        <capsuleGeometry args={[0.08, 0.55, 4, 10]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.3, 1.0, 0]}>
        <capsuleGeometry args={[0.08, 0.55, 4, 10]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.7} />
      </mesh>
      {/* legs */}
      <mesh castShadow position={[0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.09, 0.6, 4, 10]} />
        <meshStandardMaterial color="#1c2536" />
      </mesh>
      <mesh castShadow position={[-0.1, 0.3, 0]}>
        <capsuleGeometry args={[0.09, 0.6, 4, 10]} />
        <meshStandardMaterial color="#1c2536" />
      </mesh>
      {/* boots */}
      <mesh castShadow position={[0.1, 0, 0.03]}>
        <boxGeometry args={[0.14, 0.1, 0.24]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
      <mesh castShadow position={[-0.1, 0, 0.03]}>
        <boxGeometry args={[0.14, 0.1, 0.24]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
    </group>
  );
}

export function EmergencyExit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 1.9, 0.06]} />
        <meshStandardMaterial color="#1c2536" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.1, 0.05]}>
        <boxGeometry args={[1.1, 0.3, 0.04]} />
        <meshStandardMaterial color="#1fbf75" emissive="#1fbf75" emissiveIntensity={0.6} />
      </mesh>
      {/* arrow */}
      <mesh position={[-0.25, 2.1, 0.09]}>
        <coneGeometry args={[0.08, 0.18, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function Barrier({ position, rotation = [0, 0, 0] as [number, number, number] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.18, 0.06]} />
        <meshStandardMaterial color="#ffb020" />
      </mesh>
      <mesh castShadow position={[-0.95, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#273244" />
      </mesh>
      <mesh castShadow position={[0.95, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#273244" />
      </mesh>
    </group>
  );
}

export function Cone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <coneGeometry args={[0.16, 0.5, 12]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.15, 0.02, 8, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
    </group>
  );
}

export function Machinery({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 1.2]} />
        <meshStandardMaterial color="#3a4759" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.9]} />
        <meshStandardMaterial color="#273244" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0.5, 1.0, 0.61]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function RotatingRig({ children, enabled = true }: { children: React.ReactNode; enabled?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || !enabled) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.12 + 0.15;
  });
  return <group ref={ref}>{children}</group>;
}

// Circular showcase platform used for the rotating hero model
function Platform() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[5.6, 5.8, 0.3, 48]} />
        <meshStandardMaterial color="#1a2231" metalness={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.35, 5.6, 64]} />
        <meshStandardMaterial color="#ff6a1a" emissive="#ff6a1a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.35, 64]} />
        <meshStandardMaterial color="#141b28" metalness={0.2} roughness={0.85} />
      </mesh>
    </group>
  );
}

type ScenePreset = "hero" | "fire" | "gas" | "hazard" | "machine" | "ppe";

export function IndustrialScene({
  preset = "hero",
  className = "",
  fireActive = false,
  gasActive = false,
  autoRotate = false,
}: {
  preset?: ScenePreset;
  className?: string;
  fireActive?: boolean;
  gasActive?: boolean;
  autoRotate?: boolean;
}) {
  return (
    <div className={`canvas-host ${className}`} style={{ minHeight: 260 }}>
      <Canvas
        shadows
        camera={{ position: [7, 5, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        {autoRotate && (
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.6}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.3}
            target={[0, 1, 0]}
          />
        )}
        <Suspense fallback={null}>
          <color attach="background" args={["#07090d"]} />
          <fog attach="fog" args={["#07090d", 10, 28]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3, 3, -2]} intensity={0.6} color="#ff6a1a" />
          {fireActive && <pointLight position={[1.5, 2, 1]} intensity={1.8} color="#ff4500" distance={6} />}
          <RotatingRig enabled={!autoRotate}>
            {autoRotate ? <Platform /> : <Floor />}
            <Machinery position={[-2.5, 0, -1]} />
            {preset !== "machine" && <ElectricalPanel position={[1.5, 0, -1.5]} />}
            {preset !== "gas" && preset !== "ppe" && preset !== "machine" && (
              <Extinguisher position={[-1.5, 0, 1.2]} />
            )}
            {(preset === "gas" || preset === "hazard") && (
              <>
                <GasCylinder position={[2.2, 0, 1]} />
                <GasCylinder position={[2.8, 0, 1.2]} />
              </>
            )}
            {preset === "machine" && (
              <>
                <Machinery position={[2.2, 0, 1]} />
                <Machinery position={[0, 0, 0]} />
              </>
            )}
            {preset === "ppe" && (
              <>
                <WorkerPPE position={[1.5, 0, 0]} />
                <WorkerPPE position={[-1.5, 0, 0]} />
              </>
            )}
            <EmergencyExit position={[-3.5, 1, -3]} />
            <WarningSign position={[3, 1.8, -3]} />
            <Cone position={[-0.8, 0, 2]} />
            <Cone position={[0.4, 0, 2.2]} />
            <Barrier position={[0, 0, -2.5]} />
            <WorkerPPE position={[0.2, 0, 2.5]} />
            {fireActive && (
              <>
                <Fire position={[1.5, 0.8, -1.2]} />
                <Smoke position={[1.5, 0.8, -1.2]} intensity={1} />
              </>
            )}
            {gasActive && (
              <Smoke position={[2.5, 0.5, 1]} intensity={0.8} />
            )}
            {/* pipes */}
            <Pipe start={[-4, 3.2, -3]} end={[4, 3.2, -3]} radius={0.12} color="#3a4759" />
            <Pipe start={[-4, 2.8, -3.2]} end={[4, 2.8, -3.2]} radius={0.08} color="#ff6a1a" />
            <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={14} blur={2.5} />
          </RotatingRig>
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Simplified interactive scene for training modules.
export function FireScene({ onObjectClick, hintId, ar = false }: { onObjectClick: (id: string) => void; hintId?: string; ar?: boolean }) {
  return (
    <div className="canvas-host h-full w-full">
      <Canvas shadows camera={{ position: [0, 3, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          {!ar && <color attach="background" args={["#07090d"]} />}
          {!ar && <fog attach="fog" args={["#07090d", 8, 20]} />}
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
          <pointLight position={[2, 2, 0]} intensity={1.6} color="#ff4500" distance={6} />

          {!ar && <Floor />}
          <Interactive id="alarm" position={[-2.5, 1.4, -1.5]} onObjectClick={onObjectClick} color="#ef4444" label="Alarm" showHint={hintId === "alarm"}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.4, 0.15]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
            </mesh>
          </Interactive>
          <Interactive id="extinguisher" position={[2.3, 0, -1]} onObjectClick={onObjectClick} color="#dc2626" label="Extinguisher" showHint={hintId === "extinguisher"}>
            <Extinguisher position={[0, 0, 0]} />
          </Interactive>
          <Interactive id="panel" position={[0, 0, -2]} onObjectClick={onObjectClick} color="#ffb020" label="Fire" showHint={hintId === "panel"}>
            <ElectricalPanel position={[0, 0, 0]} />
            <Fire position={[0, 0.8, 0.2]} />
            <Smoke position={[0, 0.8, 0.2]} />
          </Interactive>
          <Interactive id="exit" position={[-3.5, 1, -2.5]} onObjectClick={onObjectClick} color="#1fbf75" label="Exit" showHint={hintId === "exit"}>
            <EmergencyExit position={[0, 0, 0]} />
          </Interactive>
          <Interactive id="safe" position={[0, 0, 3]} onObjectClick={onObjectClick} color="#2ee38d" label="Safe Zone" showHint={hintId === "safe"}>
            <mesh>
              <ringGeometry args={[0.8, 1.2, 24]} />
              <meshStandardMaterial color="#2ee38d" emissive="#2ee38d" emissiveIntensity={0.8} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.7, 24]} />
              <meshStandardMaterial color="#1fbf75" transparent opacity={0.3} />
            </mesh>
          </Interactive>
          <WorkerPPE position={[0.5, 0, 1.5]} />
          <Cone position={[-1.2, 0, 1.5]} />
          <WarningSign position={[2.8, 1.8, -2.5]} />
          {!ar && <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={12} blur={2.2} />}
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function GasScene({ onObjectClick, hintId, ar = false }: { onObjectClick: (id: string) => void; hintId?: string; ar?: boolean }) {
  return (
    <div className="canvas-host h-full w-full">
      <Canvas shadows camera={{ position: [0, 3, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          {!ar && <color attach="background" args={["#07090d"]} />}
          {!ar && <fog attach="fog" args={["#07090d", 8, 20]} />}
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
          <pointLight position={[2, 1.5, 0]} intensity={0.8} color="#22b8cf" distance={6} />

          {!ar && <Floor />}
          {/* confined space entry (manhole/tank opening) */}
          <Interactive id="entry" position={[0, 0, -1.2]} onObjectClick={onObjectClick} color="#ef4444" label="Entry" showHint={hintId === "entry"}>
            <mesh castShadow position={[0, 0.6, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 1.2, 20]} />
              <meshStandardMaterial color="#273244" metalness={0.5} roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.15, 20]} />
              <meshStandardMaterial color="#0b0f16" />
            </mesh>
            <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.55, 20]} />
              <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={0.8} side={THREE.DoubleSide} />
            </mesh>
          </Interactive>
          <Smoke position={[0, 1, -1.2]} intensity={0.9} />

          <Interactive id="assess" position={[-2.2, 1.4, -1.5]} onObjectClick={onObjectClick} color="#ffb020" label="Assess" showHint={hintId === "assess"}>
            <WarningSign position={[0, 0, 0]} />
          </Interactive>

          <Interactive id="alert" position={[2.3, 1.2, -1]} onObjectClick={onObjectClick} color="#22b8cf" label="Alert" showHint={hintId === "alert"}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.6, 0.15]} />
              <meshStandardMaterial color="#22b8cf" emissive="#22b8cf" emissiveIntensity={0.6} />
            </mesh>
          </Interactive>

          <Interactive id="protect" position={[2.6, 0, 1.5]} onObjectClick={onObjectClick} color="#1fbf75" label="PPE" showHint={hintId === "protect"}>
            <GasCylinder position={[0, 0, 0]} />
          </Interactive>

          <Interactive id="safe" position={[0, 0, 3]} onObjectClick={onObjectClick} color="#2ee38d" label="Safe Zone" showHint={hintId === "safe"}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.8, 1.2, 24]} />
              <meshStandardMaterial color="#2ee38d" emissive="#2ee38d" emissiveIntensity={0.8} side={THREE.DoubleSide} />
            </mesh>
          </Interactive>

          <WorkerPPE position={[-0.8, 0, 1.5]} />
          <Cone position={[1.5, 0, 1.2]} />
          <Cone position={[-1.5, 0, 1]} />
          <Barrier position={[2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          {!ar && <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={12} blur={2.2} />}
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Interactive({
  id,
  children,
  position,
  onObjectClick,
  color,
  label,
  showHint,
}: {
  id: string;
  children: React.ReactNode;
  position: [number, number, number];
  onObjectClick: (id: string) => void;
  color: string;
  label?: string;
  showHint?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const ring = ref.current.children.find((c) => c.userData.type === "ring") as THREE.Mesh | undefined;
    if (ring?.material) {
      (ring.material as THREE.MeshStandardMaterial).opacity = 0.4 + Math.sin(t * 3) * 0.2;
    }
    const arrow = ref.current.children.find((c) => c.userData.type === "arrow") as THREE.Group | undefined;
    if (arrow) {
      arrow.position.y = 3.2 + Math.sin(t * 4) * 0.3;
    }
  });
  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onObjectClick(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}

      {/* Label floating above object */}
      {label && (
        <Html position={[0, 2.8, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap pointer-events-none transition-all ${
              hover ? "bg-white text-black scale-110" : "bg-black/80 text-white border border-white/20"
            }`}
          >
            {label}
          </div>
        </Html>
      )}

      {/* Pulse ring */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]} userData={{ type: "ring" }}>
        <ringGeometry args={[0.2, 0.28, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hover || showHint ? 1.6 : 0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Base highlight */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hover ? 1.0 : 0.8, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hover ? 0.4 : showHint ? 0.3 : 0.15}
        />
      </mesh>

      {/* Hint arrow (animated, visible when this is the next step) */}
      {showHint && (
        <group position={[0, 3.2, 0]} userData={{ type: "arrow" }}>
          <mesh>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color="#ff6a1a" emissive="#ff6a1a" emissiveIntensity={1.2} />
          </mesh>
          <Html position={[0, 0.6, 0]} center>
            <div className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold whitespace-nowrap pointer-events-none shadow-lg border-2 border-white/30">
              TAP HERE
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

export function HazardScene({ onHazardClick }: { onHazardClick: (id: string, isReal: boolean) => void }) {
  // 5 real hazards + a few decoys
  return (
    <div className="canvas-host h-full w-full">
      <Canvas shadows camera={{ position: [0, 3, 7], fov: 55 }} dpr={[1, 1.5]}>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={14}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 1, 0]}
        />
        <Suspense fallback={null}>
          <color attach="background" args={["#07090d"]} />
          <fog attach="fog" args={["#07090d", 8, 20]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
          <Floor />

          {/* HAZARD 1: fire */}
          <Hazard id="h1" position={[1.5, 0, -1.2]} onClick={onHazardClick} isReal label="🔥 Fire near panel">
            <ElectricalPanel position={[0, 0, 0]} />
            <Fire position={[0, 0.8, 0.2]} />
            <Smoke position={[0, 0.8, 0.2]} />
          </Hazard>
          {/* HAZARD 2: blocked exit */}
          <Hazard id="h2" position={[-3, 0, -2]} onClick={onHazardClick} isReal label="🚪 Blocked exit">
            <EmergencyExit position={[0, 1, 0]} />
            <mesh castShadow position={[0, 0.4, 0.4]}>
              <boxGeometry args={[1.2, 0.8, 0.6]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
            </mesh>
          </Hazard>
          {/* HAZARD 3: gas leak */}
          <Hazard id="h3" position={[2.8, 0, 1]} onClick={onHazardClick} isReal label="☣ Gas leak">
            <GasCylinder position={[0, 0, 0]} />
            <Smoke position={[0, 1, 0]} intensity={0.6} />
          </Hazard>
          {/* HAZARD 4: missing PPE worker */}
          <Hazard id="h4" position={[-1.2, 0, 2]} onClick={onHazardClick} isReal label="⚠ No helmet">
            <group>
              <mesh castShadow position={[0, 0.95, 0]}>
                <capsuleGeometry args={[0.24, 0.7, 6, 14]} />
                <meshStandardMaterial color="#5a6778" />
              </mesh>
              <mesh castShadow position={[0, 1.55, 0]}>
                <sphereGeometry args={[0.17, 16, 16]} />
                <meshStandardMaterial color="#b9825a" />
              </mesh>
              {/* NO helmet */}
              <mesh castShadow position={[0.1, 0.3, 0]}>
                <capsuleGeometry args={[0.09, 0.6, 4, 10]} />
                <meshStandardMaterial color="#1c2536" />
              </mesh>
              <mesh castShadow position={[-0.1, 0.3, 0]}>
                <capsuleGeometry args={[0.09, 0.6, 4, 10]} />
                <meshStandardMaterial color="#1c2536" />
              </mesh>
            </group>
          </Hazard>
          {/* HAZARD 5: electrical cables on floor */}
          <Hazard id="h5" position={[-2.5, 0, 1]} onClick={onHazardClick} isReal label="⚡ Loose cables">
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.8, 24]} />
              <meshStandardMaterial color="#ffb020" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <torusGeometry args={[0.4, 0.05, 8, 24]} />
              <meshStandardMaterial color="#0b0f16" />
            </mesh>
            <mesh position={[0.3, 0.03, 0.2]} rotation={[0, 0.5, 0]}>
              <torusGeometry args={[0.3, 0.04, 8, 20]} />
              <meshStandardMaterial color="#273244" />
            </mesh>
          </Hazard>

          {/* DECOY: normal cone (not a hazard) */}
          <Hazard id="d1" position={[0.5, 0, 2.5]} onClick={onHazardClick} isReal={false}>
            <Cone position={[0, 0, 0]} />
          </Hazard>
          <Hazard id="d2" position={[2, 0, 2.2]} onClick={onHazardClick} isReal={false}>
            <Cone position={[0, 0, 0]} />
          </Hazard>

          <Machinery position={[-2.5, 0, -1]} />
          <Barrier position={[0, 0, -3]} />
          <WorkerPPE position={[0, 0, 3.5]} />
          <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={14} blur={2.4} />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Hazard({
  id,
  position,
  children,
  onClick,
  isReal,
  label,
}: {
  id: string;
  position: [number, number, number];
  children: React.ReactNode;
  onClick: (id: string, isReal: boolean) => void;
  isReal: boolean;
  label?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id, isReal);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}
      {label && hover && (
        <Html position={[0, 2.3, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div className="px-2 py-1 rounded bg-white text-black text-xs font-bold whitespace-nowrap pointer-events-none shadow-lg">
            {label}
          </div>
        </Html>
      )}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color={hover ? "#ff6a1a" : "#ffffff"} transparent opacity={hover ? 0.25 : 0} />
      </mesh>
    </group>
  );
}

// Camera AR overlay (when the user enables camera) — simple video passthrough with 3D overlay.
export function ARCameraOverlay({
  children,
  active,
  videoRef,
}: {
  children: React.ReactNode;
  active: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {active && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover"
            id="ar-camera"
          />
          <div className="absolute inset-0 z-[1] bg-black/10 pointer-events-none" />
          {/* AR reticle */}
          <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
            <div className="h-40 w-40 rounded-full border-2 border-brand-500/60 relative opacity-70">
              <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brand-500 -translate-x-1 -translate-y-1" />
              <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-brand-500 translate-x-1 -translate-y-1" />
              <span className="absolute left-0 bottom-0 h-4 w-4 border-l-2 border-b-2 border-brand-500 -translate-x-1 translate-y-1" />
              <span className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-brand-500 translate-x-1 translate-y-1" />
            </div>
          </div>
          <div className="scan-line pointer-events-none absolute inset-0 z-[3]" />
        </>
      )}
      <div className="absolute inset-0 z-[2]">{children}</div>
    </div>
  );
}

export async function startCamera(videoEl: HTMLVideoElement | null): Promise<MediaStream | null> {
  if (!videoEl || typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return null;
  try {
    let stream: MediaStream;
    try {
      // Prefer the back camera on phones
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
    } catch {
      // Laptops / devices without a back camera
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    videoEl.srcObject = stream;
    await videoEl.play().catch(() => undefined);
    return stream;
  } catch {
    return null;
  }
}

export function stopCamera(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

// Machinery safety scene — lockout-tagout training
export function MachineryScene({ onObjectClick, hintId, ar = false }: { onObjectClick: (id: string) => void; hintId?: string; ar?: boolean }) {
  return (
    <div className="canvas-host h-full w-full">
      <Canvas shadows camera={{ position: [0, 3, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} target={[0, 1, 0]} />
        <Suspense fallback={null}>
          {!ar && <color attach="background" args={["#07090d"]} />}
          {!ar && <fog attach="fog" args={["#07090d", 8, 20]} />}
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
          {!ar && <Floor />}

          {/* Stop button */}
          <Interactive id="stop" position={[-2.5, 1, -1.5]} onObjectClick={onObjectClick} color="#ef4444" label="Stop" showHint={hintId === "stop"}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 20]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1, 10]} />
              <meshStandardMaterial color="#273244" />
            </mesh>
          </Interactive>

          {/* Power switch */}
          <Interactive id="power" position={[2.5, 1, -1.5]} onObjectClick={onObjectClick} color="#ffb020" label="Power" showHint={hintId === "power"}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.7, 0.2]} />
              <meshStandardMaterial color="#273244" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.12]}>
              <boxGeometry args={[0.1, 0.3, 0.02]} />
              <meshStandardMaterial color="#ffb020" />
            </mesh>
          </Interactive>

          {/* Lock point on machine */}
          <Interactive id="lock" position={[0, 1.2, -2]} onObjectClick={onObjectClick} color="#22b8cf" label="Lock Point" showHint={hintId === "lock"}>
            <Machinery position={[0, -1.2, 0]} />
            <mesh position={[0.8, 0, 0.7]}>
              <torusGeometry args={[0.12, 0.03, 8, 16]} />
              <meshStandardMaterial color="#22b8cf" emissive="#22b8cf" emissiveIntensity={0.8} />
            </mesh>
          </Interactive>

          {/* Jam location */}
          <Interactive id="clear" position={[0, 0.8, -0.8]} onObjectClick={onObjectClick} color="#1fbf75" label="Clear Jam" showHint={hintId === "clear"}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.6, 0.4, 0.4]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
            </mesh>
          </Interactive>

          {/* Test / restart button */}
          <Interactive id="test" position={[0, 1, 3]} onObjectClick={onObjectClick} color="#2ee38d" label="Restart" showHint={hintId === "test"}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 20]} />
              <meshStandardMaterial color="#1fbf75" emissive="#1fbf75" emissiveIntensity={0.8} />
            </mesh>
          </Interactive>

          <WorkerPPE position={[-1, 0, 1.5]} />
          <Cone position={[1.5, 0, 1.5]} />
          <WarningSign position={[-2.8, 1.8, -2.5]} />
          {!ar && <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={12} blur={2.2} />}
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// PPE scene — select correct PPE for a noisy, dusty workshop
export function PPEScene({ onObjectClick, hintId, ar = false }: { onObjectClick: (id: string) => void; hintId?: string; ar?: boolean }) {
  return (
    <div className="canvas-host h-full w-full">
      <Canvas shadows camera={{ position: [0, 3, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} target={[0, 1, 0]} />
        <Suspense fallback={null}>
          {!ar && <color attach="background" args={["#07090d"]} />}
          {!ar && <fog attach="fog" args={["#07090d", 8, 20]} />}
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
          {!ar && <Floor />}

          {/* Helmet */}
          <Interactive id="helmet" position={[-2.5, 1.2, -1.5]} onObjectClick={onObjectClick} color="#ffb020" label="Helmet" showHint={hintId === "helmet"}>
            <mesh castShadow>
              <sphereGeometry args={[0.26, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ffb020" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.06, 20]} />
              <meshStandardMaterial color="#ffb020" />
            </mesh>
          </Interactive>

          {/* Goggles */}
          <Interactive id="goggles" position={[0, 1.2, -2]} onObjectClick={onObjectClick} color="#22b8cf" label="Goggles" showHint={hintId === "goggles"}>
            <mesh castShadow>
              <torusGeometry args={[0.18, 0.05, 8, 16]} />
              <meshStandardMaterial color="#22b8cf" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.3, 0, 0]} castShadow>
              <torusGeometry args={[0.18, 0.05, 8, 16]} />
              <meshStandardMaterial color="#22b8cf" transparent opacity={0.7} />
            </mesh>
          </Interactive>

          {/* Earmuffs */}
          <Interactive id="earmuffs" position={[2.5, 1.2, -1.5]} onObjectClick={onObjectClick} color="#ef4444" label="Earmuffs" showHint={hintId === "earmuffs"}>
            <mesh castShadow position={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 14]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh castShadow position={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 14]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <torusGeometry args={[0.2, 0.02, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#0b0f16" />
            </mesh>
          </Interactive>

          {/* Vest */}
          <Interactive id="vest" position={[-1.5, 1, 1]} onObjectClick={onObjectClick} color="#ff6a1a" label="Vest" showHint={hintId === "vest"}>
            <mesh castShadow>
              <capsuleGeometry args={[0.24, 0.7, 6, 14]} />
              <meshStandardMaterial color="#ff6a1a" />
            </mesh>
            <mesh position={[0, 0, 0.25]}>
              <boxGeometry args={[0.5, 0.05, 0.01]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </mesh>
          </Interactive>

          {/* Gloves */}
          <Interactive id="gloves" position={[1.5, 1, 1]} onObjectClick={onObjectClick} color="#1fbf75" label="Gloves" showHint={hintId === "gloves"}>
            <mesh castShadow>
              <boxGeometry args={[0.25, 0.4, 0.12]} />
              <meshStandardMaterial color="#1fbf75" roughness={0.7} />
            </mesh>
            <mesh castShadow position={[0.35, 0, 0]}>
              <boxGeometry args={[0.25, 0.4, 0.12]} />
              <meshStandardMaterial color="#1fbf75" roughness={0.7} />
            </mesh>
          </Interactive>

          {/* Workshop noise source (machinery) */}
          <Machinery position={[0, 0, -3.5]} />
          <WorkerPPE position={[0, 0, 3]} />
          <Cone position={[-2, 0, 2]} />
          <Cone position={[2, 0, 2]} />
          <WarningSign position={[3, 1.8, -2.5]} />
          {!ar && <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={12} blur={2.2} />}
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Re-export Float for potential usage elsewhere
export { Float };
