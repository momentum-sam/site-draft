import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { GlyphMaterial } from './GlyphMaterial';
import geometricShape from '../../assets/svg/geometric-shape.svg';
import * as THREE from 'three';

const SceneContent = () => {
    const texture = useLoader(TextureLoader, geometricShape);

    return (
        <mesh>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
};

import { ErrorBoundary } from '../ErrorBoundary';

export const GeometricGlyphScene: React.FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <ErrorBoundary fallback={<div className="w-full h-full bg-red-500/20" />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        <SceneContent />
                    </Suspense>
                </Canvas>
            </ErrorBoundary>
        </div>
    );
};
