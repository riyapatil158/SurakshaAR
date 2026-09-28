"use client";
// Detailed, interactive 3D training environments for every module.
// Every object shows its name + purpose when hovered (or tapped on touch screens).

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef, useState, Suspense, type ReactNode } from "react";
import * as THREE from "three";
import { t, type Lang } from "@/lib/i18n";
import type { ModuleId } from "@/lib/modules";
import {
  Floor,
  Pipe,
  WarningSign,
  Extinguisher,
  ElectricalPanel,
  GasCylinder,
  Smoke,
  Fire,
  WorkerPPE,
  EmergencyExit,
  Barrier,
  Cone,
  Machinery,
} from "@/components/IndustrialScene";

type V3 = [number, number, number];

const SceneLang = createContext<Lang>("en");
const SceneProgress = createContext<Record<string, boolean>>({});
const ScenePick = createContext<{ onPick?: (id: string) => void; hint?: string }>({});

/* ------------------------------------------------------------------ */
/* Tooltip + hover helpers                                             */
/* ------------------------------------------------------------------ */

function Tooltip({ name, desc, footer, action }: { name: string; desc: string; footer: string; action: boolean }) {
  return (
    <div
      style={{ pointerEvents: "none" }}
      className="w-max max-w-[230px] rounded-lg border border-white/15 bg-[#07090d]/95 px-3 py-2 text-left shadow-2xl"
    >
      <div className="text-sm font-bold leading-tight text-white">{name}</div>
      {desc && <div className="mt-1 text-[11px] leading-snug text-[#bcc5d1]">{desc}</div>}
      <div className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${action ? "text-[#ff8236]" : "text-[#22b8cf]"}`}>
        {footer}
      </div>
    </div>
  );
}

/** Non-interactive environment object that shows its name on hover / tap. */
function Hoverable({
  obj,
  children,
  position = [0, 0, 0],
  rotation,
  labelY = 2,
}: {
  obj: string;
  children: ReactNode;
  position?: V3;
  rotation?: V3;
  labelY?: number;
}) {
  const lang = useContext(SceneLang);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (!pinned) return;
    const id = setTimeout(() => setPinned(false), 2500);
    return () => clearTimeout(id);
  }, [pinned]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "help";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPinned(true);
      }}
    >
      {children}
      {(hover || pinned) && (
        <Html position={[0, labelY, 0]} center zIndexRange={[200, 100]} style={{ pointerEvents: "none" }}>
          <Tooltip name={t(lang, `obj.${obj}`)} desc={t(lang, `obj.${obj}.desc`)} footer={t(lang, "scene.info")} action={false} />
        </Html>
      )}
    </group>
  );
}

/** Interactive training object: always-visible name tag, detailed tooltip on hover, floor ring, hint arrow. */
function Interactive({
  obj,
  children,
  position,
  rotation,
  color,
  labelY = 2.3,
  ringY,
  ringRadius = 0.85,
}: {
  obj: string;
  children: ReactNode;
  position: V3;
  rotation?: V3;
  color: string;
  labelY?: number;
  ringY?: number;
  ringRadius?: number;
}) {
  const lang = useContext(SceneLang);
  const { onPick, hint } = useContext(ScenePick);
  const [hover, setHover] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);
  const isHint = hint === obj;

  useFrame(({ clock }) => {
    const tt = clock.elapsedTime;
    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity = (isHint ? 0.7 : 0.4) + Math.sin(tt * 3) * 0.2;
      const s = isHint ? 1 + Math.sin(tt * 3) * 0.08 : 1;
      ringRef.current.scale.set(s, s, s);
    }
    if (arrowRef.current) arrowRef.current.position.y = labelY + 0.75 + Math.sin(tt * 4) * 0.15;
  });

  const name = t(lang, `obj.${obj}`);
  const ringPos: V3 = [0, ringY ?? -position[1] + 0.03, 0];

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onPick?.(obj);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = onPick ? "pointer" : "help";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}
      <mesh ref={ringRef} position={ringPos} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[ringRadius * 0.82, ringRadius, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hover || isHint ? 1.6 : 0.7}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Html position={[0, labelY, 0]} center zIndexRange={hover ? [300, 250] : [150, 50]} style={{ pointerEvents: "none" }}>
        {hover ? (
          <Tooltip name={name} desc={t(lang, `obj.${obj}.desc`)} footer={onPick ? t(lang, "scene.tap") : t(lang, "scene.info")} action />
        ) : (
          <div
            className={`whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-bold shadow ${
              isHint ? "bg-[#ff6a1a] text-white" : "border border-white/20 bg-black/75 text-white"
            }`}
          >
            {isHint ? `👆 ${name}` : name}
          </div>
        )}
      </Html>
      {isHint && (
        <group ref={arrowRef} position={[0, labelY + 0.75, 0]}>
          <mesh rotation={[Math.PI, 0, 0]} raycast={() => null}>
            <coneGeometry args={[0.14, 0.34, 10]} />
            <meshStandardMaterial color="#ff6a1a" emissive="#ff6a1a" emissiveIntensity={1.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** Invisible hover volume, used for effects like gas / dust clouds. */
function HoverVolume({ radius = 0.8 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Room + props                                                        */
/* ------------------------------------------------------------------ */

function Room({ accent = "#ffb020" }: { accent?: string }) {
  return (
    <group>
      {/* back wall */}
      <mesh position={[0, 2, -4.7]} receiveShadow>
        <boxGeometry args={[14, 4, 0.2]} />
        <meshStandardMaterial color="#1c2536" roughness={0.9} />
      </mesh>
      {/* left wall */}
      <mesh position={[-7, 2, -0.7]} receiveShadow>
        <boxGeometry args={[0.2, 4, 8.2]} />
        <meshStandardMaterial color="#182030" roughness={0.9} />
      </mesh>
      {/* hazard band */}
      <mesh position={[0, 0.3, -4.58]}>
        <boxGeometry args={[14, 0.35, 0.02]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {Array.from({ length: 28 }).map((_, i) => (
        <mesh key={i} position={[-6.75 + i * 0.5, 0.3, -4.565]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.45, 0.01]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
      ))}
      {/* wall ribs */}
      {[-5.5, -2.75, 0, 2.75, 5.5].map((x) => (
        <mesh key={x} position={[x, 2, -4.58]}>
          <boxGeometry args={[0.1, 4, 0.06]} />
          <meshStandardMaterial color="#273244" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* ceiling light fixtures */}
      {[-3.5, 0, 3.5].map((x) => (
        <group key={x} position={[x, 3.85, -1]}>
          <mesh>
            <boxGeometry args={[1.6, 0.08, 0.32]} />
            <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={1.1} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
            <meshStandardMaterial color="#3a4759" />
          </mesh>
        </group>
      ))}
      {/* overhead pipes */}
      <Pipe start={[-6.8, 3.4, -4.4]} end={[6.8, 3.4, -4.4]} radius={0.13} color="#3a4759" />
      <Pipe start={[-6.8, 3.1, -4.4]} end={[6.8, 3.1, -4.4]} radius={0.07} color="#ff6a1a" />
      <Pipe start={[-6.8, 3.4, -4.4]} end={[-6.8, 3.4, 3]} radius={0.1} color="#3a4759" />
      {/* floor walkway markings */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.012, 1.2]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <planeGeometry args={[0.1, 5.5]} />
          <meshStandardMaterial color="#ffb020" />
        </mesh>
      ))}
    </group>
  );
}

function StorageRack() {
  return (
    <group>
      {[0, 1].map((side) => (
        <group key={side}>
          {[-0.9, 0.9].map((x) => (
            <mesh key={x} position={[x, 1.2, side ? 0.35 : -0.35]} castShadow>
              <boxGeometry args={[0.06, 2.4, 0.06]} />
              <meshStandardMaterial color="#1f6feb" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {[0.4, 1.2, 2.0].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.9, 0.05, 0.8]} />
            <meshStandardMaterial color="#ff8236" />
          </mesh>
          <mesh position={[-0.45, y + 0.22, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.5]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          <mesh position={[0.4, y + 0.17, 0.05]} castShadow>
            <boxGeometry args={[0.5, 0.3, 0.45]} />
            <meshStandardMaterial color="#a0703c" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WallSign({ color, symbol, text }: { color: string; symbol?: "bolt" | "cross" | "gear" | "helmet"; text?: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.8, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.08, 0.025]}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {symbol === "bolt" && (
        <mesh position={[0, 0.08, 0.03]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.07, 0.36, 0.01]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
      )}
      {symbol === "cross" && (
        <group position={[0, 0.08, 0.03]}>
          <mesh>
            <boxGeometry args={[0.32, 0.1, 0.01]} />
            <meshStandardMaterial color="#1fbf75" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.1, 0.32, 0.01]} />
            <meshStandardMaterial color="#1fbf75" />
          </mesh>
        </group>
      )}
      {symbol === "gear" && (
        <mesh position={[0, 0.08, 0.03]}>
          <torusGeometry args={[0.12, 0.04, 8, 8]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
      )}
      {symbol === "helmet" && (
        <mesh position={[0, 0.04, 0.03]}>
          <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1f6feb" />
        </mesh>
      )}
      {text && (
        <mesh position={[0, -0.27, 0.025]}>
          <planeGeometry args={[0.9, 0.12]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
      )}
    </group>
  );
}

function ExtinguisherTyped({ band, taken = false }: { band: string; taken?: boolean }) {
  if (taken) {
    return (
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#3a4759" />
      </mesh>
    );
  }
  return (
    <group>
      <Extinguisher position={[0, 0, 0]} />
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.18, 16]} />
        <meshStandardMaterial color={band} />
      </mesh>
    </group>
  );
}

function AssemblyPoint({ active = false }: { active?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 2) * 0.3;
  });
  return (
    <group>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#1fbf75" emissive="#1fbf75" emissiveIntensity={0.6} transparent opacity={active ? 0.6 : 0.35} />
      </mesh>
      <mesh position={[0.9, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
        <meshStandardMaterial color="#8895a6" />
      </mesh>
      <mesh position={[0.9, 1.75, 0]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.04]} />
        <meshStandardMaterial color="#1fbf75" />
      </mesh>
      {/* people icon */}
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={x} position={[0.9 + x, 1.75, 0.03]}>
          <circleGeometry args={[0.05, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function Post({ height = 1.1, color = "#3a4759" }: { height?: number; color?: string }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, height, 8]} />
        <meshStandardMaterial color={color} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.06, 16]} />
        <meshStandardMaterial color="#273244" />
      </mesh>
    </group>
  );
}

function BlinkLight({ color, active = true, speed = 6, position = [0, 0, 0] as V3, size = 0.07 }: { color: string; active?: boolean; speed?: number; position?: V3; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = active ? (Math.sin(clock.elapsedTime * speed) > 0 ? 2 : 0.2) : 0.1;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
}

function Sparks({ active = true }: { active?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const tt = clock.elapsedTime * 8 + i * 1.7;
      c.visible = active && Math.sin(tt) > 0.3;
      c.position.set(Math.sin(tt * 1.3) * 0.15, 0.1 + Math.abs(Math.sin(tt)) * 0.25, Math.cos(tt * 1.1) * 0.15);
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} raycast={() => null}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#ffe066" emissive="#ffd000" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

function CableCoil() {
  return (
    <group>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.04, 8, 24]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
      <mesh position={[0.5, 0.04, 0.1]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <torusGeometry args={[0.22, 0.035, 8, 20, Math.PI * 1.3]} />
        <meshStandardMaterial color="#1c2536" />
      </mesh>
      {/* exposed copper */}
      <mesh position={[0.72, 0.05, 0.25]} rotation={[0, 0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Windsock() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = -Math.PI / 2 + Math.sin(clock.elapsedTime * 2) * 0.12;
  });
  return (
    <group>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
        <meshStandardMaterial color="#8895a6" />
      </mesh>
      <mesh ref={ref} position={[0.35, 2.4, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.14, 0.7, 12, 1, true]} />
        <meshStandardMaterial color="#ff6a1a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Toolbox() {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.6, 0.32, 0.3]} />
        <meshStandardMaterial color="#dc2626" metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#0b0f16" />
      </mesh>
    </group>
  );
}

/** Worker figure with optional PPE — used as trainee (PPE) and casualty (first aid). */
function Person({
  helmet = true,
  goggles = false,
  earmuffs = false,
  vest = true,
  gloves = true,
  shirt = "#5a6778",
}: {
  helmet?: boolean;
  goggles?: boolean;
  earmuffs?: boolean;
  vest?: boolean;
  gloves?: boolean;
  shirt?: string;
}) {
  return (
    <group>
      <mesh castShadow position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.24, 0.7, 6, 14]} />
        <meshStandardMaterial color={vest ? "#ff6a1a" : shirt} roughness={0.7} />
      </mesh>
      {vest && (
        <>
          <mesh position={[0, 1.0, 0.245]}>
            <boxGeometry args={[0.5, 0.05, 0.01]} />
            <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.82, 0.245]}>
            <boxGeometry args={[0.5, 0.05, 0.01]} />
            <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={0.4} />
          </mesh>
        </>
      )}
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#b9825a" roughness={0.9} />
      </mesh>
      {helmet && (
        <>
          <mesh castShadow position={[0, 1.66, 0]}>
            <sphereGeometry args={[0.2, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffb020" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.66, 0.02]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 20]} />
            <meshStandardMaterial color="#ffb020" />
          </mesh>
        </>
      )}
      {goggles && (
        <mesh position={[0, 1.57, 0.15]}>
          <boxGeometry args={[0.28, 0.08, 0.05]} />
          <meshStandardMaterial color="#22b8cf" transparent opacity={0.8} />
        </mesh>
      )}
      {earmuffs && (
        <>
          <mesh position={[0.18, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-0.18, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </>
      )}
      {[0.3, -0.3].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 1.0, 0]}>
            <capsuleGeometry args={[0.08, 0.5, 4, 10]} />
            <meshStandardMaterial color={vest ? "#ff6a1a" : shirt} roughness={0.7} />
          </mesh>
          <mesh position={[x, 0.66, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={gloves ? "#1fbf75" : "#b9825a"} />
          </mesh>
        </group>
      ))}
      {[0.1, -0.1].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 0.3, 0]}>
            <capsuleGeometry args={[0.09, 0.6, 4, 10]} />
            <meshStandardMaterial color="#1c2536" />
          </mesh>
          <mesh castShadow position={[x, 0.03, 0.04]}>
            <boxGeometry args={[0.14, 0.1, 0.26]} />
            <meshStandardMaterial color="#0b0f16" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene shell                                                         */
/* ------------------------------------------------------------------ */

function Sway({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && enabled) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.55;
  });
  return <group ref={ref}>{children}</group>;
}

export type MissionSceneProps = {
  moduleId: ModuleId;
  lang: Lang;
  onPick?: (objectId: string) => void;
  hint?: string;
  ar?: boolean;
  preview?: boolean;
  progress?: Record<string, boolean>;
};

export function MissionScene({ moduleId, lang, onPick, hint, ar = false, preview = false, progress = {} }: MissionSceneProps) {
  const accent = moduleId === "gas" ? "#22b8cf" : moduleId === "firstaid" ? "#1fbf75" : "#ffb020";
  return (
    <div className="canvas-host h-full w-full">
      <Canvas
        shadows
        camera={{ position: [0, 3.4, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <OrbitControls
          enablePan={false}
          enableZoom={!preview}
          minDistance={4.5}
          maxDistance={11}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.15}
          minAzimuthAngle={-Math.PI / 2.8}
          maxAzimuthAngle={Math.PI / 2.8}
          target={[0, 1, -0.8]}
        />
        <SceneLang.Provider value={lang}>
          <SceneProgress.Provider value={progress}>
            <ScenePick.Provider value={{ onPick: preview ? undefined : onPick, hint: preview ? undefined : hint }}>
              <Suspense fallback={null}>
                {!ar && <color attach="background" args={["#07090d"]} />}
                {!ar && <fog attach="fog" args={["#07090d", 11, 26]} />}
                <ambientLight intensity={0.5} />
                <directionalLight position={[4, 7, 5]} intensity={1.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
                <Sway enabled={preview}>
                  {!ar && (
                    <>
                      <Floor />
                      <Room accent={accent} />
                    </>
                  )}
                  {moduleId === "fire" && <FireContent />}
                  {moduleId === "gas" && <GasContent />}
                  {moduleId === "machine" && <MachineContent />}
                  {moduleId === "ppe" && <PPEContent />}
                  {moduleId === "firstaid" && <FirstAidContent />}
                  {!ar && <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={15} blur={2.4} />}
                </Sway>
                <Environment preset="warehouse" />
              </Suspense>
            </ScenePick.Provider>
          </SceneProgress.Provider>
        </SceneLang.Provider>
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Module 1 — Fire & Explosion                                         */
/* ------------------------------------------------------------------ */

function FireContent() {
  const p = useContext(SceneProgress);
  return (
    <group>
      {p.alarm && <AlarmGlow />}
      <pointLight position={[0, 2, -3]} intensity={1.8} color="#ff4500" distance={7} />

      {/* Fire alarm call point on the back wall */}
      <Interactive obj="alarm" position={[-3.6, 1.5, -4.5]} color="#ef4444" labelY={0.9}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.45, 0.12]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[0.28, 0.28]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0.45, 0.05]}>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} />
        </mesh>
        <BlinkLight color="#ff2020" active={!!p.alarm} position={[0, 0.72, 0.05]} size={0.08} />
      </Interactive>

      {/* Fire point: three extinguisher types */}
      <Hoverable obj="firepoint" position={[3.3, 1.9, -4.55]} labelY={0.7}>
        <mesh>
          <boxGeometry args={[2.8, 0.4, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </Hoverable>
      <Interactive obj="water" position={[2.3, 0, -3.9]} color="#ef4444" labelY={1.55} ringRadius={0.4}>
        <ExtinguisherTyped band="#ef4444" />
      </Interactive>
      <Interactive obj="foam" position={[3.3, 0, -3.9]} color="#f2e3b3" labelY={2.0} ringRadius={0.4}>
        <ExtinguisherTyped band="#f2e3b3" />
      </Interactive>
      <Interactive obj="extinguisher" position={[4.3, 0, -3.9]} color="#e4e9f0" labelY={1.55} ringRadius={0.4}>
        <ExtinguisherTyped band="#0b0f16" taken={!!p.extinguisher} />
      </Interactive>

      {/* Burning electrical panel */}
      <Interactive obj="panel" position={[-0.4, 0, -4.1]} color="#ffb020" labelY={3.1}>
        <ElectricalPanel position={[0, 0, 0]} />
        <Fire position={[0.1, 0.9, 0.25]} />
        <Fire position={[-0.4, 1.4, 0.25]} />
        <Smoke position={[0, 1.2, 0.3]} />
      </Interactive>
      <Hoverable obj="sign_electric" position={[1.3, 2.5, -4.55]} labelY={0.7}>
        <WallSign color="#ffb020" symbol="bolt" text="DANGER" />
      </Hoverable>

      {/* Emergency exit (left side of back wall) */}
      <Interactive obj="exit" position={[-5.6, 1, -4.5]} color="#1fbf75" labelY={1.6}>
        <EmergencyExit position={[0, 0, 0]} />
      </Interactive>

      {/* Safe assembly point */}
      <Interactive obj="safe" position={[-4.2, 0, 2.4]} color="#2ee38d" labelY={2.4}>
        <AssemblyPoint active={!!p.exit} />
      </Interactive>

      {/* Environment */}
      <Hoverable obj="barrier" position={[-0.4, 0, -2.4]} labelY={1}>
        <Barrier position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[-1.7, 0, -2.3]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[0.9, 0, -2.3]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="machine" position={[-3.3, 0, -1.6]} labelY={1.9}>
        <Machinery position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="rack" position={[-6.3, 0, 0.3]} rotation={[0, Math.PI / 2, 0]} labelY={2.8}>
        <StorageRack />
      </Hoverable>
      <Hoverable obj="worker" position={[0.8, 0, 1.6]} labelY={2.2}>
        <WorkerPPE position={[0, 0, 0]} />
      </Hoverable>
    </group>
  );
}

function AlarmGlow() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.intensity = Math.sin(clock.elapsedTime * 6) > 0 ? 2.5 : 0.3;
  });
  return <pointLight ref={ref} position={[-3.6, 2.5, -3.5]} color="#ff1a1a" distance={9} />;
}

/* ------------------------------------------------------------------ */
/* Module 2 — Gas leak & confined space                               */
/* ------------------------------------------------------------------ */

function GasContent() {
  const p = useContext(SceneProgress);
  return (
    <group>
      <pointLight position={[0, 2, -2]} intensity={0.9} color="#22b8cf" distance={7} />

      {/* Confined space: tank with manhole */}
      <Interactive obj="entry" position={[0, 0, -2.8]} color="#ef4444" labelY={2.1}>
        <mesh castShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 1.2, 28]} />
          <meshStandardMaterial color="#3a4759" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
          <meshStandardMaterial color="#05070a" />
        </mesh>
        <mesh position={[0, 1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 24]} />
          <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* danger plate */}
        <mesh position={[0, 0.65, 1.21]}>
          <planeGeometry args={[0.9, 0.4]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* ladder rails */}
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 1.6, -0.35]}>
            <cylinderGeometry args={[0.025, 0.025, 0.8, 6]} />
            <meshStandardMaterial color="#8895a6" />
          </mesh>
        ))}
      </Interactive>
      <Hoverable obj="gascloud" position={[0, 2.4, -2.8]} labelY={0.9}>
        <HoverVolume radius={0.6} />
      </Hoverable>
      <Smoke position={[0, 1.2, -2.8]} intensity={0.9} />

      {/* Barrier / keep-out (tap to stop entry) */}
      <Interactive obj="barrier" position={[0, 0, -1.1]} color="#ffb020" labelY={1.2}>
        <Barrier position={[0, 0, 0]} />
        {p.stop && (
          <mesh position={[0, 0.62, 0.04]}>
            <boxGeometry args={[1.2, 0.18, 0.02]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        )}
      </Interactive>

      {/* Gas detector + warning sign */}
      <Interactive obj="detector" position={[-3.2, 0, -2.6]} color="#ffb020" labelY={2.6}>
        <Post height={1.9} />
        <group position={[0, 1.9, 0]}>
          <WarningSign position={[0, 0.2, 0]} />
        </group>
        <mesh position={[0, 1.2, 0.08]} castShadow>
          <boxGeometry args={[0.3, 0.42, 0.12]} />
          <meshStandardMaterial color="#ffb020" />
        </mesh>
        <mesh position={[0, 1.26, 0.145]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshStandardMaterial color="#0b3d1f" emissive="#2ee38d" emissiveIntensity={0.5} />
        </mesh>
        <BlinkLight color="#ff2020" position={[0, 1.06, 0.15]} size={0.035} active />
      </Interactive>

      {/* Emergency radio */}
      <Interactive obj="radio" position={[3.4, 0, -3.3]} color="#22b8cf" labelY={2.3}>
        <Post height={1.2} />
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[0.36, 0.5, 0.16]} />
          <meshStandardMaterial color="#1f6feb" />
        </mesh>
        <mesh position={[0.12, 1.75, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
        <BlinkLight color={p.alert ? "#2ee38d" : "#ffb020"} position={[-0.08, 1.5, 0.09]} size={0.03} active />
      </Interactive>

      {/* Breathing apparatus station */}
      <Interactive obj="scba" position={[4.3, 0, -0.6]} color="#1fbf75" labelY={2.3}>
        <mesh position={[0, 0.8, -0.1]} castShadow>
          <boxGeometry args={[0.7, 1.6, 0.1]} />
          <meshStandardMaterial color="#273244" />
        </mesh>
        {!p.protect && (
          <group position={[0, 0.95, 0.05]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.13, 0.5, 6, 12]} />
              <meshStandardMaterial color="#ffb020" metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.55, 0.1]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color="#0b0f16" />
            </mesh>
          </group>
        )}
      </Interactive>

      {/* Upwind safe zone */}
      <Interactive obj="safe" position={[-4.2, 0, 2.4]} color="#2ee38d" labelY={2.4}>
        <AssemblyPoint active={!!p.protect} />
      </Interactive>

      {/* Environment */}
      <Hoverable obj="windsock" position={[-5.6, 0, 1.2]} labelY={3.0}>
        <Windsock />
      </Hoverable>
      <Hoverable obj="cylinders" position={[2.2, 0, -4.0]} labelY={2.1}>
        <GasCylinder position={[0, 0, 0]} />
        <GasCylinder position={[0.55, 0, 0.1]} />
      </Hoverable>
      <Hoverable obj="buddy" position={[1.8, 0, 1.4]} labelY={2.2}>
        <WorkerPPE position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="worker" position={[-0.6, 0, 1.9]} labelY={2.2}>
        <WorkerPPE position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[-1.6, 0, -1.2]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[1.6, 0, -1.2]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Module 3 — Machinery (lockout-tagout)                              */
/* ------------------------------------------------------------------ */

function Rollers({ running }: { running: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && running) ref.current.children.forEach((c) => (c.rotation.x += dt * 6));
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-2 + i * 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.0, 12]} />
          <meshStandardMaterial color="#8895a6" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function MachineContent() {
  const p = useContext(SceneProgress);
  const running = !p.stop;
  return (
    <group>
      {/* Conveyor frame */}
      <Hoverable obj="conveyor" position={[0.3, 0, -3]} labelY={1.9}>
        {[-2.3, 2.3].map((x) => [-0.45, 0.45].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.4, z]} castShadow>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
            <meshStandardMaterial color="#ffb020" />
          </mesh>
        )))}
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[4.8, 0.06, 1.1]} />
          <meshStandardMaterial color="#273244" metalness={0.5} />
        </mesh>
        {/* guard housing */}
        <mesh position={[-2.9, 0.9, 0]} castShadow>
          <boxGeometry args={[1.0, 1.2, 1.3]} />
          <meshStandardMaterial color="#3a4759" metalness={0.5} />
        </mesh>
        <BlinkLight color={running ? "#2ee38d" : "#ef4444"} position={[-2.9, 1.6, 0.66]} size={0.06} active />
      </Hoverable>
      <Interactive obj="rollers" position={[0.3, 0.92, -3]} color="#ef4444" labelY={0.85} ringY={-0.89}>
        <Rollers running={running} />
      </Interactive>

      {/* Jammed material */}
      {!p.clear && (
        <Interactive obj="clear" position={[1.1, 1.18, -3]} color="#1fbf75" labelY={1.1} ringY={-1.15} ringRadius={0.5}>
          <mesh castShadow rotation={[0.2, 0.4, 0.1]}>
            <boxGeometry args={[0.55, 0.4, 0.45]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
        </Interactive>
      )}

      {/* Emergency stop pedestal */}
      <Interactive obj="stop" position={[-3.4, 0, -0.9]} color="#ef4444" labelY={1.9}>
        <Post height={1.05} />
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
          <meshStandardMaterial color="#ffb020" />
        </mesh>
        <mesh position={[0, p.stop ? 1.3 : 1.33, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.1, 20]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
      </Interactive>

      {/* Power isolator on the wall */}
      <Interactive obj="power" position={[-5.2, 1.4, -4.5]} color="#ffb020" labelY={0.9}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.7, 0.2]} />
          <meshStandardMaterial color="#8895a6" metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.12]} rotation={[0, 0, p.power ? Math.PI / 2 : 0]}>
          <boxGeometry args={[0.08, 0.4, 0.05]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {p.lock && (
          <group position={[0.18, -0.2, 0.15]}>
            <mesh>
              <boxGeometry args={[0.12, 0.14, 0.05]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.04, 0.012, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#e4e9f0" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.18, 0]}>
              <planeGeometry args={[0.14, 0.22]} />
              <meshStandardMaterial color="#ffb020" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </Interactive>

      {/* Lockout–tagout station */}
      <Interactive obj="lock" position={[4.2, 0, -3.8]} color="#22b8cf" labelY={2.5}>
        <Post height={1.2} />
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.9, 0.7, 0.06]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {[-0.25, 0, 0.25].map((x) =>
          p.lock && x === 0 ? null : (
            <mesh key={x} position={[x, 1.45, 0.05]}>
              <boxGeometry args={[0.12, 0.14, 0.05]} />
              <meshStandardMaterial color="#ffb020" />
            </mesh>
          )
        )}
      </Interactive>

      {/* Restart button */}
      <Interactive obj="test" position={[3.4, 0, 0.8]} color="#2ee38d" labelY={1.9}>
        <Post height={1.05} />
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
          <meshStandardMaterial color="#e4e9f0" />
        </mesh>
        <mesh position={[0, 1.31, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 20]} />
          <meshStandardMaterial color="#1fbf75" emissive="#1fbf75" emissiveIntensity={p.test ? 2 : 0.5} />
        </mesh>
      </Interactive>

      {/* Environment */}
      <Hoverable obj="sign_moving" position={[2.2, 2.5, -4.55]} labelY={0.7}>
        <WallSign color="#ffb020" symbol="gear" text="CAUTION" />
      </Hoverable>
      <Hoverable obj="toolbox" position={[-1.4, 0, 0.9]} labelY={0.8}>
        <Toolbox />
      </Hoverable>
      <Hoverable obj="worker" position={[0.4, 0, 1.8]} labelY={2.2}>
        <WorkerPPE position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[1.8, 0, -1.4]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Module 4 — PPE selection                                            */
/* ------------------------------------------------------------------ */

function NoiseWaves() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const k = (clock.elapsedTime * 0.8 + i / 3) % 1;
      c.scale.setScalar(0.4 + k * 1.4);
      ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.6 * (1 - k);
    });
  });
  return (
    <group ref={ref} position={[0, 1.4, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
          <torusGeometry args={[0.5, 0.02, 6, 32]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function PPEContent() {
  const p = useContext(SceneProgress);
  const tableY = 0.95;
  const item = (x: number): V3 => [x, tableY, -3.4];
  return (
    <group>
      {/* PPE bench */}
      <Hoverable obj="ppe_bench" position={[0, 0, -3.4]} labelY={-0.2}>
        <mesh position={[0, tableY - 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.6, 0.1, 1.0]} />
          <meshStandardMaterial color="#3a4759" metalness={0.4} />
        </mesh>
        {[-3.6, 3.6].map((x) => (
          <mesh key={x} position={[x, tableY / 2 - 0.05, 0]} castShadow>
            <boxGeometry args={[0.1, tableY - 0.1, 0.9]} />
            <meshStandardMaterial color="#273244" />
          </mesh>
        ))}
      </Hoverable>
      <Hoverable obj="sign_ppe" position={[0, 2.6, -4.55]} labelY={0.7}>
        <WallSign color="#1f6feb" symbol="helmet" text="PPE" />
      </Hoverable>

      {!p.helmet && (
        <Interactive obj="helmet" position={item(-3.0)} color="#ffb020" labelY={0.75} ringY={0.01} ringRadius={0.38}>
          <mesh castShadow position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.24, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffb020" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0.03]}>
            <cylinderGeometry args={[0.29, 0.29, 0.04, 20]} />
            <meshStandardMaterial color="#ffb020" />
          </mesh>
        </Interactive>
      )}
      <Interactive obj="cap" position={item(-2.0)} color="#ef4444" labelY={1.15} ringY={0.01} ringRadius={0.38}>
        <mesh castShadow position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1f6feb" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 0.2]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.18]} />
          <meshStandardMaterial color="#1f6feb" />
        </mesh>
      </Interactive>
      {!p.goggles && (
        <Interactive obj="goggles" position={item(-1.0)} color="#22b8cf" labelY={0.75} ringY={0.01} ringRadius={0.38}>
          <mesh castShadow position={[-0.1, 0.1, 0]}>
            <torusGeometry args={[0.1, 0.035, 8, 16]} />
            <meshStandardMaterial color="#22b8cf" transparent opacity={0.8} />
          </mesh>
          <mesh castShadow position={[0.12, 0.1, 0]}>
            <torusGeometry args={[0.1, 0.035, 8, 16]} />
            <meshStandardMaterial color="#22b8cf" transparent opacity={0.8} />
          </mesh>
        </Interactive>
      )}
      {!p.earmuffs && (
        <Interactive obj="earmuffs" position={item(0)} color="#ef4444" labelY={1.15} ringY={0.01} ringRadius={0.38}>
          {[-0.17, 0.17].map((x) => (
            <mesh key={x} castShadow position={[x, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.11, 0.11, 0.09, 14]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          ))}
          <mesh position={[0, 0.2, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#0b0f16" />
          </mesh>
        </Interactive>
      )}
      {!p.vest && (
        <Interactive obj="vest" position={item(1.0)} color="#ff6a1a" labelY={0.75} ringY={0.01} ringRadius={0.38}>
          <mesh castShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.55, 0.1, 0.45]} />
            <meshStandardMaterial color="#ff6a1a" />
          </mesh>
          <mesh position={[0, 0.115, 0]}>
            <boxGeometry args={[0.55, 0.01, 0.06]} />
            <meshStandardMaterial color="#e4e9f0" emissive="#e4e9f0" emissiveIntensity={0.5} />
          </mesh>
        </Interactive>
      )}
      {!p.gloves && (
        <Interactive obj="gloves" position={item(2.0)} color="#1fbf75" labelY={1.15} ringY={0.01} ringRadius={0.38}>
          <mesh castShadow position={[-0.1, 0.05, 0]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.16, 0.08, 0.3]} />
            <meshStandardMaterial color="#1fbf75" />
          </mesh>
          <mesh castShadow position={[0.12, 0.05, 0]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.16, 0.08, 0.3]} />
            <meshStandardMaterial color="#1fbf75" />
          </mesh>
        </Interactive>
      )}
      <Interactive obj="sandals" position={item(3.0)} color="#ef4444" labelY={0.75} ringY={0.01} ringRadius={0.38}>
        {[-0.09, 0.09].map((x) => (
          <group key={x} position={[x, 0.02, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.03, 0.3]} />
              <meshStandardMaterial color="#8b5a2b" />
            </mesh>
            <mesh position={[0, 0.03, 0.05]}>
              <boxGeometry args={[0.12, 0.02, 0.03]} />
              <meshStandardMaterial color="#0b0f16" />
            </mesh>
          </group>
        ))}
      </Interactive>

      {/* Trainee gets equipped live */}
      <Hoverable obj="trainee" position={[0, 0, 1.2]} labelY={2.3}>
        <Person helmet={!!p.helmet} goggles={!!p.goggles} earmuffs={!!p.earmuffs} vest={!!p.vest} gloves={!!p.gloves} />
      </Hoverable>

      {/* Hazards of this workshop */}
      <Hoverable obj="noisy" position={[-4.4, 0, -0.8]} labelY={2.4}>
        <Machinery position={[0, 0, 0]} />
        <mesh position={[0.9, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 20]} />
          <meshStandardMaterial color="#8895a6" metalness={0.8} />
        </mesh>
        <NoiseWaves />
      </Hoverable>
      <Hoverable obj="dust" position={[4.4, 1.2, -0.6]} labelY={1.1}>
        <HoverVolume radius={0.8} />
      </Hoverable>
      <Smoke position={[4.4, 0.2, -0.6]} intensity={0.6} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Module 5 — First aid & emergency                                    */
/* ------------------------------------------------------------------ */

function FirstAidContent() {
  const p = useContext(SceneProgress);
  const kitPos: V3 = p.kit ? [1.1, 0, -0.6] : [-5.3, 0, 1.6];
  return (
    <group>
      {/* Power isolator (make the area safe) */}
      <Interactive obj="power" position={[-3.4, 1.4, -4.5]} color="#ffb020" labelY={0.9}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.7, 0.2]} />
          <meshStandardMaterial color="#8895a6" metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.12]} rotation={[0, 0, p.danger ? Math.PI / 2 : 0]}>
          <boxGeometry args={[0.08, 0.4, 0.05]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <BlinkLight color={p.danger ? "#2ee38d" : "#ef4444"} position={[0, 0.45, 0.1]} size={0.05} active={!p.danger} />
      </Interactive>

      {/* Live damaged cable with sparks (never touch) */}
      <Interactive obj="cable" position={[-1.6, 0, -1.6]} color="#ef4444" labelY={1.0} ringRadius={0.7}>
        <CableCoil />
        <group position={[0.72, 0.05, 0.25]}>
          <Sparks active={!p.danger} />
        </group>
      </Interactive>

      {/* Casualty */}
      <Interactive obj="casualty" position={[0, 0, -0.6]} color="#ef4444" labelY={1.3} ringRadius={1.1}>
        {/* lying on the back → rolled onto the side (recovery position) after care */}
        <group position={[0, 0.25, 0]} rotation={p.care ? [0, 0, -Math.PI / 2] : [-Math.PI / 2, 0, -Math.PI / 2]}>
          <group position={[0, -0.9, 0]}>
            <Person helmet={false} vest shirt="#5a6778" />
          </group>
        </group>
        {p.response && !p.care && <BlinkLight color="#22b8cf" position={[0.9, 0.6, 0]} size={0.05} speed={3} />}
      </Interactive>
      {/* dropped helmet */}
      <Hoverable obj="helmet_dropped" position={[-0.9, 0.12, 0.3]} labelY={0.6}>
        <mesh rotation={[0.8, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffb020" />
        </mesh>
      </Hoverable>

      {/* Emergency phone */}
      <Interactive obj="phone" position={[3.6, 0, -3.6]} color="#22b8cf" labelY={2.3}>
        <Post height={1.2} />
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.45, 0.6, 0.18]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-0.08, 1.4, 0.11]}>
          <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
          <meshStandardMaterial color="#0b0f16" />
        </mesh>
        <BlinkLight color={p.call ? "#2ee38d" : "#ffb020"} position={[0.14, 1.6, 0.1]} size={0.03} active />
      </Interactive>

      {/* First aid kit (moves next to the casualty once fetched) */}
      <Interactive obj="kit" position={kitPos} color="#1fbf75" labelY={p.kit ? 0.9 : 2.0} ringRadius={0.5}>
        {!p.kit && <Post height={0.9} />}
        <group position={[0, p.kit ? 0.15 : 1.05, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.36, 0.22]} />
            <meshStandardMaterial color="#1fbf75" />
          </mesh>
          <mesh position={[0, 0, 0.115]}>
            <boxGeometry args={[0.24, 0.07, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.115]}>
            <boxGeometry args={[0.07, 0.24, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </Interactive>

      {/* Environment */}
      <Hoverable obj="sign_firstaid" position={[1.5, 2.5, -4.55]} labelY={0.7}>
        <WallSign color="#1fbf75" symbol="cross" text="FIRST AID" />
      </Hoverable>
      <Hoverable obj="machine" position={[-4.4, 0, -2.6]} labelY={1.9}>
        <Machinery position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="coworker" position={[2.4, 0, 1.4]} labelY={2.2}>
        <WorkerPPE position={[0, 0, 0]} />
      </Hoverable>
      <Hoverable obj="cone" position={[-2.8, 0, -0.9]} labelY={0.9}>
        <Cone position={[0, 0, 0]} />
      </Hoverable>
    </group>
  );
}
