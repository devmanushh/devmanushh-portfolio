"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MapPin } from "lucide-react";
import * as THREE from "three";

import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { mapPlaces } from "@/data/mapPlaces";

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Globe() {
  return (
    <group rotation={[0.05, -0.65, 0]}>
      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshStandardMaterial
          color="#fff7e8"
          roughness={0.92}
          metalness={0}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          color="#f7efe1"
          roughness={1}
          transparent
          opacity={0.34}
        />
      </mesh>

      {mapPlaces.map((place) => {
        const position = latLngToVector3(place.lat, place.lng, 2.18);

        return (
          <Html
            key={place.id}
            position={position}
            center
            distanceFactor={6}
            occlude
          >
            <div className="group relative flex -translate-y-2 flex-col items-center">
              <MapPin
                className="drop-shadow-[2px_2px_0_rgba(24,22,20,0.18)]"
                size={30}
                fill="#181614"
                color="#181614"
              />
              <span className="absolute left-6 top-0 hidden whitespace-nowrap rounded-full border-2 border-[#181614] bg-[#fffaf0] px-2 py-1 text-sm font-bold text-[#181614] group-hover:block">
                {place.place}
              </span>
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export default function WorldMapSection() {
  return (
    <section id="map" className="hand-section scroll-mt-28">
      <Container>
        <SectionTitle
          title="Nomad globe."
          subtitle="places I have visited, marked like pins in a notebook"
        />

        <div className="relative mt-12 overflow-hidden">
          <div className="h-[420px] w-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 42 }}>
              <ambientLight intensity={1.8} />
              <directionalLight position={[3, 2, 5]} intensity={1.4} />
              <Globe />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.6}
              />
            </Canvas>
          </div>

          <div className="mt-5 grid gap-2 border-t-2 border-dashed border-[#181614] pt-5 text-xl text-[#4f4942] sm:grid-cols-2">
            {mapPlaces.map((place) => (
              <p key={place.id} className="flex items-center gap-2">
                <MapPin size={18} fill="#181614" />
                {place.place}, {place.country}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
