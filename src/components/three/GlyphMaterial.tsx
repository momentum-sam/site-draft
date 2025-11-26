import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const GlyphMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#000000'),
        uResolution: new THREE.Vector2(0, 0),
        uTexture: null,
        uGridSize: 40.0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    uniform float uGridSize;
    varying vec2 vUv;

    // Pseudo-random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Simple glyph generation (blocks/lines) based on hash
    float getGlyph(vec2 uv, float seed) {
        vec2 grid = fract(uv * 8.0); // 8x8 pixels per glyph
        float rnd = random(floor(uv * 8.0) + seed);
        
        // Simple patterns based on random seed
        if (rnd < 0.2) return step(0.5, grid.x); // Vertical lines
        if (rnd < 0.4) return step(0.5, grid.y); // Horizontal lines
        if (rnd < 0.6) return step(0.8, distance(grid, vec2(0.5))); // Circles
        if (rnd < 0.8) return step(0.5, grid.x + grid.y); // Diagonals
        return step(0.5, random(grid + seed)); // Noise
    }

    void main() {
        // Grid coordinates
        vec2 gridUv = vUv * uGridSize;
        vec2 cellId = floor(gridUv);
        vec2 cellUv = fract(gridUv);

        // Sample the texture
        vec4 texColor = texture2D(uTexture, vUv);
        
        // Only draw where the texture has content (alpha > 0 or not white)
        // Assuming the SVG is black on transparent or similar. 
        // Adjust threshold based on actual SVG appearance.
        float shapeIntensity = texColor.a; 
        
        // If texture is not loaded yet or empty, just show pattern for testing
        // shapeIntensity = 1.0; 

        if (shapeIntensity < 0.1) discard;

        // Generate glyph
        float seed = random(cellId + floor(uTime * 2.0)); // Animate seed over time
        float glyph = getGlyph(cellUv, seed);

        // Dither logic: 
        // If glyph is active, draw color. 
        // We can modulate opacity based on mouse or time.
        
        vec3 finalColor = uColor;
        float alpha = glyph * shapeIntensity * 0.8;

        gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ GlyphMaterial });

export { GlyphMaterial };
