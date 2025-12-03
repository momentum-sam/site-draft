import * as THREE from 'three';

// --- CONFIGURATION ---
// Set this to true for the Gold/Warm theme
// Set this to false for the Original (Cool Blue/Slate) theme
const USE_GOLD_THEME = false;

// --- SHARED VERTEX SHADERS ---
// The vertex logic is identical for both versions, so we can reuse it.
const CommonVertexShader = `
    varying vec2 vUv;
    varying float vY;
    varying float vProgress;
    uniform float time;
    uniform float scrollProgress;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Breathing animation
      float breathe = sin(time * 0.8 + pos.y * 1.5) * 0.02;
      pos.x += pos.x * breathe;
      pos.z += pos.z * breathe;

      // Dynamic Shaping based on Scroll
      // We expand the bottom starting from 60% scroll to match the "Scale" phase
      float bottomExpansion = smoothstep(0.6, 1.0, scrollProgress);
      if (pos.y < -1.0) {
        float factor = abs(pos.y + 1.0);
        pos.x *= (1.0 + bottomExpansion * factor * 0.5);
        pos.z *= (1.0 + bottomExpansion * factor * 0.5);
      }

      vY = pos.y;
      vProgress = scrollProgress;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const CommonParticleVertexShader = `
    uniform float time;
    uniform float pixelRatio;
    uniform float scrollProgress;
    attribute float aSpeed;
    attribute float aOffset;
    attribute float aAngle;
    attribute float aRadiusOffset;
    
    varying float vAlpha;
    varying float vY;
    varying float vProgress;
    
    void main() {
      float speedMult = 1.0 + scrollProgress * 2.0;
      
      // Cycle Y from Top (3.5) to Bottom (-3.5) for Height 7
      float yHeight = 7.0;
      float loopTime = time * aSpeed * speedMult + aOffset;
      float y = 3.5 - mod(loopTime, yHeight);
      
      // Physics: Constant fast speed in the cylindrical neck, slow at ends
      // "Taller" neck logic: between -0.75 and 0.75 is the fast zone
      float distFromCenter = max(0.0, abs(y) - 0.75);
      float velocityMod = 1.0 + 2.0 * (1.0 - smoothstep(0.0, 2.5, distFromCenter));
      y -= velocityMod * 0.05 * scrollProgress; 
      
      // Match mesh logic: Cylindrical Neck
      float waist = 0.25; 
      float spread = 1.2; 
      // Logic: max(0.0, abs(y) - 0.75) creates a flat spot (radius=waist) between -0.75 and 0.75
      float dist = max(0.0, abs(y) - 0.75);
      float baseRadius = sqrt(pow(waist, 2.0) + pow(dist * spread, 2.0));
      
      float twist = 2.0 + scrollProgress * 3.0;
      float angle = aAngle + y * twist + time * 0.5;
      
      float radius = baseRadius + aRadiusOffset; 

      float bottomExpansion = smoothstep(0.6, 1.0, scrollProgress);
      if (y < -1.0) {
        float factor = abs(y + 1.0);
        radius *= (1.0 + bottomExpansion * factor * 0.5);
      }
      
      vec3 pos = vec3(
        radius * cos(angle),
        y,
        radius * sin(angle)
      );
      
      pos.x += sin(time * 2.0 + y) * 0.05;
      pos.z += cos(time * 1.5 + y) * 0.05;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (3.0 + aRadiusOffset * 15.0) * pixelRatio * (1.0 / -mvPosition.z);
      
      vAlpha = 1.0 - smoothstep(3.0, 3.5, abs(y));
      vY = y;
      vProgress = scrollProgress;
    }
`;

// --- ORIGINAL FRAGMENT SHADERS (Cool Blue/Slate) ---

const WireframeFragment_Original = `
    varying vec2 vUv;
    varying float vY;
    varying float vProgress;
    uniform vec3 color;
    uniform float time;

    void main() {
      vec2 coord = gl_FragCoord.xy;
      float grid = mod(coord.x + coord.y, 2.0);
      
      // --- DYNAMIC CONSTRUCTION LOGIC ---
      // Reveal from Top (3.5) down to Bottom (-3.5).
      float buildLimit = 2.5 - (vProgress * 6.5); 
      
      // Hard Cutoff
      if (vY < buildLimit) discard;

      // Construction Edge Glow (Scanline effect)
      float edgeWidth = 0.5; 
      float edgeGlow = smoothstep(buildLimit, buildLimit + edgeWidth, vY) * smoothstep(buildLimit + edgeWidth, buildLimit, vY);
      edgeGlow = pow(edgeGlow, 2.0); 
      
      // Fade out top and bottom edges nicely
      float alpha = 1.0 - smoothstep(3.0, 3.5, abs(vY));
      
      float pulse = sin(time * 3.0 - vY * 4.0) * 0.5 + 0.5;
      float intensity = 1.0 + (1.0 - smoothstep(0.0, 1.0, abs(vY))) * 0.5;

      // "Building Dynamically" Effect
      float buildTrace = sin(vUv.y * 30.0 - time * 3.0) * 0.5 + 0.5; 
      float buildAlpha = 0.3 + 0.7 * buildTrace; 
      
      if (grid < 1.0) discard;
      
      // --- COLOR SHIFT LOGIC ---
      vec3 coolBlue = vec3(0.7, 0.85, 1.0);
      vec3 warmGold = vec3(1.0, 0.85, 0.6); // Subtle warmth, not the full gold
      
      // Existing gradient logic
      float colorMix = smoothstep(2.0, -2.5, vY);
      vec3 gradientColor = mix(coolBlue, warmGold, colorMix);
      
      vec3 baseColor = mix(color, gradientColor, 0.3);

      // Blue/White Construction Edge
      vec3 edgeColor = vec3(0.4, 0.7, 1.0);
      
      vec3 finalColor = baseColor + edgeColor * edgeGlow * 3.0;

      gl_FragColor = vec4(finalColor * intensity, alpha * buildAlpha * (0.4 + pulse * 0.3) + edgeGlow);
    }
`;

const ParticleFragment_Original = `
    uniform vec3 color;
    uniform float scrollProgress;
    varying float vAlpha;
    varying float vY;
    varying float vProgress;
    
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;
      
      // DYNAMIC CONSTRUCTION MASK 
      float buildLimit = 2.5 - (scrollProgress * 6.5);
      if (vY < buildLimit) discard;
      
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 1.5);
      
      float edgeGlow = smoothstep(buildLimit, buildLimit + 0.5, vY) * smoothstep(buildLimit + 0.5, buildLimit, vY);

      vec3 coolBlue = vec3(0.6, 0.8, 1.0);
      vec3 warmGold = vec3(1.0, 0.85, 0.5);
      
      float colorMix = smoothstep(2.0, -2.5, vY);
      vec3 gradientColor = mix(coolBlue, warmGold, colorMix);
      
      vec3 particleColor = mix(color, gradientColor, 0.5);
      vec3 scanColor = vec3(0.5, 0.8, 1.0);

      gl_FragColor = vec4(particleColor + scanColor * edgeGlow, vAlpha * glow * 0.9);
    }
`;

// --- GOLD FRAGMENT SHADERS (Synced Spatial Gradient) ---

const WireframeFragment_Gold = `
    varying vec2 vUv;
    varying float vY;
    varying float vProgress;
    uniform vec3 color;
    uniform float time;

    void main() {
      vec2 coord = gl_FragCoord.xy;
      float grid = mod(coord.x + coord.y, 2.0);
      
      // --- DYNAMIC CONSTRUCTION LOGIC ---
      // Reveal from Top (3.5) down to Bottom (-3.5).
      float buildLimit = 2.5 - (vProgress * 6.5); 
      
      // Hard Cutoff
      if (vY < buildLimit) discard;

      // Construction Edge Glow (Scanline effect)
      float edgeWidth = 0.5; 
      float edgeGlow = smoothstep(buildLimit, buildLimit + edgeWidth, vY) * smoothstep(buildLimit + edgeWidth, buildLimit, vY);
      edgeGlow = pow(edgeGlow, 2.0); 
      
      // Fade out top and bottom edges nicely
      float alpha = 1.0 - smoothstep(3.0, 3.5, abs(vY));
      
      float pulse = sin(time * 3.0 - vY * 4.0) * 0.5 + 0.5;
      float intensity = 1.0 + (1.0 - smoothstep(0.0, 1.0, abs(vY))) * 0.5;

      // "Building Dynamically" Effect
      float buildTrace = sin(vUv.y * 30.0 - time * 3.0) * 0.5 + 0.5; 
      float buildAlpha = 0.3 + 0.7 * buildTrace; 
      
      if (grid < 1.0) discard;
      
      // --- COLOR SHIFT LOGIC ---
      vec3 coolBlue = vec3(0.7, 0.85, 1.0);
      vec3 warmGold = vec3(1.0, 0.85, 0.6);
      
      // Existing gradient logic
      float colorMix = smoothstep(2.0, -2.5, vY);
      vec3 gradientColor = mix(coolBlue, warmGold, colorMix);
      
      vec3 baseColor = mix(color, gradientColor, 0.3);

      // --- GOLD TRANSITION FOR 3RD STAGE ---
      // Transition to #FDB447 (0.992, 0.706, 0.278)
      // Purely spatial: Bottom is gold, Top is gray.
      // As "buildLimit" lowers, it reveals the gold bottom.
      vec3 finalGold = vec3(0.992, 0.706, 0.278);
      
      float spatialFactor = smoothstep(0.5, -3.0, vY); // 0 at top, 1 at bottom
      float goldMix = spatialFactor; // Removed temporal factor

      baseColor = mix(baseColor, finalGold, goldMix);

      // Blue/White Construction Edge - also transition this to gold/white
      vec3 edgeColorBlue = vec3(0.4, 0.7, 1.0);
      vec3 edgeColorGold = vec3(1.0, 0.9, 0.5);
      vec3 edgeColor = mix(edgeColorBlue, edgeColorGold, goldMix);
      
      vec3 finalColor = baseColor + edgeColor * edgeGlow * 3.0;

      gl_FragColor = vec4(finalColor * intensity, alpha * buildAlpha * (0.4 + pulse * 0.3) + edgeGlow);
    }
`;

const ParticleFragment_Gold = `
    uniform vec3 color;
    uniform float scrollProgress;
    varying float vAlpha;
    varying float vY;
    varying float vProgress;
    
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;
      
      // DYNAMIC CONSTRUCTION MASK 
      float buildLimit = 2.5 - (scrollProgress * 6.5);
      if (vY < buildLimit) discard;
      
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 1.5);
      
      float edgeGlow = smoothstep(buildLimit, buildLimit + 0.5, vY) * smoothstep(buildLimit + 0.5, buildLimit, vY);

      vec3 coolBlue = vec3(0.6, 0.8, 1.0);
      vec3 warmGold = vec3(1.0, 0.85, 0.5);
      
      float colorMix = smoothstep(2.0, -2.5, vY);
      vec3 gradientColor = mix(coolBlue, warmGold, colorMix);
      
      vec3 particleColor = mix(color, gradientColor, 0.5);
      vec3 scanColor = vec3(0.5, 0.8, 1.0);

      // --- GOLD TRANSITION FOR 3RD STAGE ---
      vec3 finalGold = vec3(0.992, 0.706, 0.278); // #FDB447
      
      float spatialFactor = smoothstep(0.5, -3.0, vY);
      float goldMix = spatialFactor; // Removed temporal factor
      
      particleColor = mix(particleColor, finalGold, goldMix);
      
      // Also shift scan color
      vec3 scanColorGold = vec3(1.0, 0.9, 0.6);
      scanColor = mix(scanColor, scanColorGold, goldMix);

      gl_FragColor = vec4(particleColor + scanColor * edgeGlow, vAlpha * glow * 0.9);
    }
`;

// --- EXPORTS ---

export const WireframeShaderMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#e2e8f0') }, // Slate-200
    scrollProgress: { value: 0 },
  },
  vertexShader: CommonVertexShader,
  fragmentShader: USE_GOLD_THEME ? WireframeFragment_Gold : WireframeFragment_Original
};

export const ParticleShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#f8fafc') }, // Slate-50
    pixelRatio: { value: 1 },
    scrollProgress: { value: 0 }
  },
  vertexShader: CommonParticleVertexShader,
  fragmentShader: USE_GOLD_THEME ? ParticleFragment_Gold : ParticleFragment_Original
};
