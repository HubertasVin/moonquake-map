"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import React, { useState } from 'react';
import { Mesh } from "three";

import Button from "./Button";
import ButtonContainer from "./ButtonContainer";
import QuakeList from "./QuakeList"
import { moonquake_data } from './moonquakes';
import { quake_lines } from "./QuakeList";

const radius = 1;
const widthSegments = 180;
const heightSegments = 180;

// let update = true;

// export function changeUpdate() {
//   return update = !update;
// }


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/moon/textures/moon.jpg");

function createLatitudeLongitudeLines() {
  const lines = [];

  // Longitude lines (meridians)
  for (let i = 0; i <= heightSegments; i++) {
    const lat = (i / heightSegments) * Math.PI - Math.PI / 2;
    const points = [];
    for (let j = 0; j <= widthSegments; j++) {
      const lon = (j / widthSegments) * Math.PI * 2 - Math.PI / 2; // Rotate longitude by 90 degrees
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      points.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    lines.push(line);
  }

  // Longitude lines (meridians)
  for (let i = 0; i <= widthSegments; i++) {
    const lon = (i / widthSegments) * Math.PI * 2;
    const points = [];
    for (let j = 0; j <= heightSegments; j++) {
      const lat = (j / heightSegments) * Math.PI - Math.PI / 2;
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      points.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    lines.push(line);
  }

  // Calculate the position where you want the circle to lie flat (adjust these values as needed)
  const lat = (70 / heightSegments) * Math.PI - Math.PI / 2;
  const lon = (10 / widthSegments) * Math.PI * 2 - Math.PI / 2;
  const position = new THREE.Vector3(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.sin(lon)
  );
  return lines;
}

function drawQuake(magnitude: number, latitude: number, longitude: number) {
  const planetRadius = 1; // Radius of the moon
  const quakeRadius = 1 * magnitude * 0.035; // Radius of the quake

  // Convert latitude and longitude to radians
  const latitudeRad = (latitude / 25) * Math.PI;
  const longitudeRad = (longitude / 25) * Math.PI;

  // Calculate the position of the sphere on the outer rim of the moon
  const position = new THREE.Vector3(
    planetRadius * Math.cos(latitudeRad) * Math.cos(longitudeRad),
    planetRadius * Math.sin(latitudeRad),
    planetRadius * Math.cos(latitudeRad) * Math.sin(longitudeRad)
  );

  // Create the sphere geometry and material
  const geometry = new THREE.SphereGeometry(quakeRadius, widthSegments, heightSegments);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 - ((magnitude > 1) ? magnitude - 1 : 0) * 0x004100 });

  // Create the mesh and set its position
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);

  return mesh;
}

export function Sphere({ isLinesToggled = false }) {
  const mesh = useRef<Mesh>(null!);

  useFrame(() => {
    mesh.current.rotation.y += 0.0001;
  });
  
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const material = new THREE.MeshBasicMaterial({ map: texture, color: 0xaeaeae });

  const lines = isLinesToggled ? createLatitudeLongitudeLines() : [];
  const quakemap: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
  quake_lines.forEach(quake => {
    quakemap.push(drawQuake(quake.magnitude, quake.latitude, quake.longitude));
  })
  const allLines =  [...lines, ...quakemap];

  return (
    <mesh ref={mesh}>
      {allLines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
      <mesh ref={mesh} geometry={geometry} material={material} />
    </mesh>
  );
}

export function Moon() {
  const [isLinesToggled, setIsLinesToggled] = useState(false);

  const handleClick = () => {
    setIsLinesToggled((prevIsLinesToggled) => prevIsLinesToggled);
  };

  const toggleLines = () => {
    setIsLinesToggled((prevIsLinesToggled) => !prevIsLinesToggled);
    // changeUpdate();
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <Canvas className='h-2xl w-2xl'>
        <OrbitControls minDistance={1.3} maxDistance={5}/>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        
        <Sphere isLinesToggled={isLinesToggled}/>
        <Stars />
      </Canvas>
      <ButtonContainer>
        {/* <Button onClick={handleClick}>Click Me</Button> */}
        <Button onClick={toggleLines}>Toggle lines</Button>
      </ButtonContainer>
      <QuakeList></QuakeList>
    </div>
  );
}