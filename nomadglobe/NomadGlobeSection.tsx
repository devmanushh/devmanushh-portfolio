"use client";

import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import type { MapPlace } from "@/types/map-place";

const earthTexture = "/textures/earth-blue-marble.jpg";
const topologyTexture = "/textures/earth-topology.png";

useTexture.preload(earthTexture);
useTexture.preload(topologyTexture);

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Globe({ places }: { places: MapPlace[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const earthMap = useTexture(earthTexture);
  const bumpMap = useTexture(topologyTexture);
  const globeRadius = 2.25;
  const validPlaces = places.filter(
    (place) =>
      Number.isFinite(place.lat) &&
      Number.isFinite(place.lng) &&
      Math.abs(place.lat) <= 90 &&
      Math.abs(place.lng) <= 180,
  );

  useFrame((state) => {
    if (!globeRef.current) return;

    globeRef.current.rotation.y = state.clock.elapsedTime * 0.12 - 0.75;
    globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.03;
  });

  return (
    <group ref={globeRef} position={[0, 0.12, 0]}>
      <mesh>
        <sphereGeometry args={[globeRadius, 96, 96]} />
        <meshStandardMaterial
          map={earthMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughness={0.72}
          metalness={0.04}
          emissive="#071a2d"
          emissiveIntensity={0.14}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[globeRadius + 0.06, 64, 64]} />
        <meshBasicMaterial color="#dff8ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2.35, 0, 0.25]}>
        <torusGeometry args={[globeRadius + 0.18, 0.006, 16, 220]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.42} />
      </mesh>

      <mesh rotation={[Math.PI / 1.9, 0.3, -0.4]}>
        <torusGeometry args={[globeRadius + 0.34, 0.004, 16, 220]} />
        <meshBasicMaterial color="#8dd7ff" transparent opacity={0.25} />
      </mesh>

      {validPlaces.map((place, index) => {
        const position = latLngToVector3(place.lat, place.lng, globeRadius + 0.12);

        return (
          <Html key={place.id} position={position} center distanceFactor={7.5}>
            <div className="globe-pin">
              <span className="globe-pin-dot" />
              <span className="globe-pin-index">{String(index + 1).padStart(2, "0")}</span>
            </div>
          </Html>
        );
      })}
    </group>
  );
}

function GlobeFallback() {
  return (
    <group position={[0, 0.12, 0]}>
      <mesh>
        <sphereGeometry args={[2.25, 48, 48]} />
        <meshStandardMaterial
          color="#0b2546"
          emissive="#071a2d"
          emissiveIntensity={0.35}
          roughness={0.74}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.33, 48, 48]} />
        <meshBasicMaterial color="#dff8ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function StableGlobeCanvas({ places }: { places: MapPlace[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setReady(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <div className="nomad-canvas-shell">
      {ready ? (
        <Canvas
          camera={{ position: [0, 0, 8.8], fov: 42 }}
          dpr={[1, 1.35]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1.45} />
          <directionalLight position={[4, 3, 5]} intensity={2.8} color="#ffffff" />
          <pointLight position={[-4, -2, 3]} intensity={1.4} color="#8fdcff" />
          <Stars radius={55} depth={18} count={260} factor={1.25} fade speed={0.18} />
          <Suspense fallback={<GlobeFallback />}>
            <Globe places={places} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate
            autoRotate
            autoRotateSpeed={0.45}
            minDistance={8.8}
            maxDistance={8.8}
          />
        </Canvas>
      ) : (
        <div className="nomad-globe-static" aria-hidden="true" />
      )}
    </div>
  );
}

export default function NomadGlobeSection({ places }: { places: MapPlace[] }) {
  const streamPlaces = places.length > 0 ? [...places, ...places] : [];

  return (
    <section id="map" className="nomad-section">
      <div className="nomad-stars" />
      <div className="nomad-background-planet" />

      <div className="section-frame nomad-frame">
        <motion.span
          className="section-eyebrow nomad-eyebrow"
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          nomad globe...
        </motion.span>

        <div className="nomad-layout">
          <motion.div
            className="nomad-globe-panel"
            initial={{ opacity: 0, y: 70, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <StableGlobeCanvas places={places} />
          </motion.div>

          <motion.div
            className="nomad-stream-panel"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          >
            <div className="coordinate-track" aria-label="visited location stream">
              <span className="section-eyebrow nomad-stream-eyebrow">location stream...</span>
              <div className="coordinate-scroll-window">
                <div className="coordinate-scroll-list">
                  {streamPlaces.map((place, index) => {
                    const displayIndex = places.length > 0 ? (index % places.length) + 1 : 1;

                    return (
                      <article
                        key={`${place.id}-${index}`}
                        aria-hidden={index >= places.length}
                        className="coordinate-row"
                        style={{ "--i": index } as CSSProperties}
                      >
                        <span className="coordinate-index">{String(displayIndex).padStart(2, "0")}.</span>
                        <strong>{place.place}</strong>
                        <em>{place.country}</em>
                        <code>
                          {Math.abs(place.lat).toFixed(2)}
                          {place.lat >= 0 ? "N" : "S"} {Math.abs(place.lng).toFixed(2)}
                          {place.lng >= 0 ? "E" : "W"}
                        </code>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
