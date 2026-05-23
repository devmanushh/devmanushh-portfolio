"use client";

import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef } from "react";
import * as THREE from "three";

import type { MapPlace } from "@/types/map-place";

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
  const earthMap = useTexture("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
  const bumpMap = useTexture("https://unpkg.com/three-globe/example/img/earth-topology.png");
  const globeRadius = 2.25;

  useFrame((state) => {
    if (!globeRef.current) return;

    globeRef.current.rotation.y = state.clock.elapsedTime * 0.12 - 0.75;
    globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.03;
  });

  return (
    <group ref={globeRef} position={[0, 0.12, 0]}>
      <mesh>
        <sphereGeometry args={[globeRadius, 128, 128]} />
        <meshStandardMaterial
          map={earthMap}
          bumpMap={bumpMap}
          bumpScale={0.035}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[globeRadius + 0.06, 128, 128]} />
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

      {places.map((place, index) => {
        const position = latLngToVector3(place.lat, place.lng, globeRadius + 0.12);

        return (
          <Html key={place.id} position={position} center distanceFactor={7.5} occlude>
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

export default function NomadGlobeSection({ places }: { places: MapPlace[] }) {
  const streamPlaces = [...places, ...places];

  return (
    <section id="map" className="nomad-section">
      <div className="nomad-stars" />
      <div className="nomad-background-planet" />
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
          <Canvas camera={{ position: [0, 0, 8.8], fov: 42 }} dpr={[1, 1.5]}>
            <ambientLight intensity={1.45} />
            <directionalLight position={[4, 3, 5]} intensity={2.8} color="#ffffff" />
            <pointLight position={[-4, -2, 3]} intensity={1.4} color="#8fdcff" />
            <Stars radius={55} depth={18} count={450} factor={1.35} fade speed={0.25} />
            <Globe places={places} />
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
                  const displayIndex = (index % places.length) + 1;

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
    </section>
  );
}
