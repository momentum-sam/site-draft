import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { MotionValue } from 'framer-motion';

import { WireframeShaderMaterial, ParticleShader } from './shaders';

// --- HELPERS ---

const getRange = (val: number, start: number, length: number) => {
  return THREE.MathUtils.clamp((val - start) / length, 0, 1);
};

// Cubic ease in/out for smoother camera transitions
const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// --- COMPONENTS ---

interface SceneProps {
  scrollProgress: MotionValue<number>;
}

const FunnelMesh: React.FC<SceneProps> = ({ scrollProgress }) => {
  const meshRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const config = {
      height: 7.0,
      waist: 0.25,
      spread: 1.2,
      segments: 64,
      rings: 80
    };

    const points = [];
    const indices = [];

    const getRadius = (y: number) => {
      // CYLINDRICAL NECK LOGIC:
      // Create a flat spot in the middle from -0.75 to 0.75
      const dist = Math.max(0.0, Math.abs(y) - 0.75);
      // Standard hyperbola offset by that distance
      return Math.sqrt(Math.pow(config.waist, 2) + Math.pow(dist * config.spread, 2));
    };

    for (let i = 0; i <= config.rings; i++) {
      const v = i / config.rings;
      const y = (v - 0.5) * config.height;
      const radius = getRadius(y);

      for (let j = 0; j < config.segments; j++) {
        const u = j / config.segments;
        const theta = u * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        points.push(x, y, z);
      }
    }

    for (let i = 0; i <= config.rings; i++) {
      for (let j = 0; j < config.segments; j++) {
        const current = i * config.segments + j;
        const next = i * config.segments + ((j + 1) % config.segments);
        indices.push(current, next);
      }
    }

    for (let i = 0; i < config.rings; i++) {
      for (let j = 0; j < config.segments; j++) {
        const current = i * config.segments + j;
        const below = (i + 1) * config.segments + j;
        indices.push(current, below);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    const uvs = [];
    for (let i = 0; i <= config.rings; i++) {
      for (let j = 0; j < config.segments; j++) {
        uvs.push(j / config.segments, i / config.rings);
      }
    }
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const scrollVal = scrollProgress.get();
      const baseRotation = state.clock.getElapsedTime() * 0.1;
      const torque = scrollVal * 1.5;
      meshRef.current.rotation.y = baseRotation + torque;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.scrollProgress.value = scrollProgress.get();
    }
  });

  return (
    <lineSegments ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        args={[WireframeShaderMaterial]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </lineSegments>
  );
};

const FlowParticles: React.FC<SceneProps> = ({ scrollProgress }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 1500;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const angles = new Float32Array(count);
    const radiusOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      speeds[i] = 1.0 + Math.random() * 2.0;
      offsets[i] = Math.random() * 10.0;
      angles[i] = Math.random() * Math.PI * 2;
      radiusOffsets[i] = Math.random() * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geo.setAttribute('aRadiusOffset', new THREE.BufferAttribute(radiusOffsets, 1));

    return geo;
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.scrollProgress.value = scrollProgress.get();
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        args={[ParticleShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const SceneContent: React.FC<SceneProps> = ({ scrollProgress }) => {
  const { camera } = useThree();

  // Camera Paths
  const startPos = useMemo(() => new THREE.Vector3(0, 4.0, 7.0), []);
  const startTarget = useMemo(() => new THREE.Vector3(0, 2.5, 0), []);

  // Mid: In the cylinder neck
  // Y=0.0 is center of cylinder.
  const midPos = useMemo(() => new THREE.Vector3(0, 0.0, 3.0), []);
  // Look at the CENTER of the cylinder (0.0) so text overlays perfectly in middle
  const midTarget = useMemo(() => new THREE.Vector3(0, 0.0, 0), []);

  // End: Expansion
  // Move camera down and PULL BACK (Zoom Out) to show scale
  const endPos = useMemo(() => new THREE.Vector3(0, -3.0, 9.0), []);
  // Look at the expanding base (y=-3.0) to show "Outcomes", keeping view level
  const endTarget = useMemo(() => new THREE.Vector3(0, -3.0, 0), []);

  useFrame(() => {
    const val = scrollProgress.get();

    const r1 = getRange(val, 0, 0.6);
    const r2 = getRange(val, 0.6, 0.4);

    const currentPos = new THREE.Vector3();
    const currentTarget = new THREE.Vector3();

    if (val < 0.6) {
      // Use cubic easing for silkier acceleration into the neck
      const smoothR1 = easeInOutCubic(r1);
      currentPos.lerpVectors(startPos, midPos, smoothR1);
      currentTarget.lerpVectors(startTarget, midTarget, smoothR1);
    } else {
      // Smooth easing out of the neck into expansion
      const smoothR2 = easeInOutCubic(r2);
      currentPos.lerpVectors(midPos, endPos, smoothR2);
      currentTarget.lerpVectors(midTarget, endTarget, smoothR2);
    }

    camera.position.lerp(currentPos, 0.05);
    camera.lookAt(currentTarget);
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <FunnelMesh scrollProgress={scrollProgress} />
        <FlowParticles scrollProgress={scrollProgress} />
      </Float>
    </>
  );
};

export const FunnelScene: React.FC<SceneProps> = ({ scrollProgress }) => {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 3.5, 6], fov: 50 }}
      >
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
