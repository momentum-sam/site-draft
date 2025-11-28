// --- SHADERS ---

const WireframeShaderMaterial = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#e2e8f0') }, // Slate-200
        scrollProgress: { value: 0 },
    },
    vertexShader: `
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
  `,
    fragmentShader: `
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
      
      float colorMix = smoothstep(2.0, -2.5, vY);
      vec3 gradientColor = mix(coolBlue, warmGold, colorMix);
      
      vec3 baseColor = mix(color, gradientColor, 0.3);

      // Blue/White Construction Edge
      vec3 edgeColor = vec3(0.4, 0.7, 1.0);
      vec3 finalColor = baseColor + edgeColor * edgeGlow * 3.0;

      gl_FragColor = vec4(finalColor * intensity, alpha * buildAlpha * (0.4 + pulse * 0.3) + edgeGlow);
    }
  `
};

const ParticleShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#f8fafc') }, // Slate-50
        pixelRatio: { value: 1 }, // Will be set in init
        scrollProgress: { value: 0 }
    },
    vertexShader: `
    uniform float time;
    uniform float pixelRatio;
    uniform float scrollProgress;
    attribute float aSpeed;
    attribute float aOffset;
    attribute float aAngle;
    attribute float aRadiusOffset;
    
    varying float vAlpha;
    varying float vY;
    
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
    }
  `,
    fragmentShader: `
    uniform vec3 color;
    uniform float scrollProgress;
    varying float vAlpha;
    varying float vY;
    
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
  `
};

// --- MAIN SCRIPT ---

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollInteraction();
});

let scene, camera, renderer;
let funnelMesh, flowParticles;
let materialRef, particleMaterialRef;
let scrollProgress = 0; // 0 to 1
let smoothScrollProgress = 0; // Lerped value

function initThreeJS() {
    const container = document.getElementById('canvas-container');

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3.5, 6);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create Objects
    createFunnelMesh();
    createFlowParticles();

    // Resize Handler
    window.addEventListener('resize', onWindowResize, false);

    // Animation Loop
    animate();
}

function createFunnelMesh() {
    const config = {
        height: 7.0,
        waist: 0.25,
        spread: 1.2,
        segments: 64,
        rings: 80
    };

    const points = [];
    const indices = [];

    const getRadius = (y) => {
        const dist = Math.max(0.0, Math.abs(y) - 0.75);
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

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    const uvs = [];
    for (let i = 0; i <= config.rings; i++) {
        for (let j = 0; j < config.segments; j++) {
            uvs.push(j / config.segments, i / config.rings);
        }
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Material
    const material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(WireframeShaderMaterial.uniforms),
        vertexShader: WireframeShaderMaterial.vertexShader,
        fragmentShader: WireframeShaderMaterial.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    materialRef = material;

    funnelMesh = new THREE.LineSegments(geometry, material);
    scene.add(funnelMesh);
}

function createFlowParticles() {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const angles = new Float32Array(count);
    const radiusOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        speeds[i] = 1.0 + Math.random() * 2.0;
        offsets[i] = Math.random() * 10.0;
        angles[i] = Math.random() * Math.PI * 2;
        radiusOffsets[i] = Math.random() * 0.3;

        // Initial positions (dummy, set in shader)
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute('aRadiusOffset', new THREE.BufferAttribute(radiusOffsets, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(ParticleShader.uniforms),
        vertexShader: ParticleShader.vertexShader,
        fragmentShader: ParticleShader.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Set pixel ratio
    material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);

    particleMaterialRef = material;

    flowParticles = new THREE.Points(geometry, material);
    scene.add(flowParticles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (particleMaterialRef) {
        particleMaterialRef.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
}

// --- ANIMATION & SCROLL LOGIC ---

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Smooth Scroll Lerp
    // Adjust stiffness/damping feel here (0.05 is roughly like stiffness 100 damping 30)
    smoothScrollProgress += (scrollProgress - smoothScrollProgress) * 0.05;

    // Update Uniforms
    if (materialRef) {
        materialRef.uniforms.time.value = time;
        materialRef.uniforms.scrollProgress.value = smoothScrollProgress;
    }
    if (particleMaterialRef) {
        particleMaterialRef.uniforms.time.value = time;
        particleMaterialRef.uniforms.scrollProgress.value = smoothScrollProgress;
    }

    // Rotate Mesh
    if (funnelMesh) {
        const baseRotation = time * 0.1;
        const torque = smoothScrollProgress * 1.5;
        funnelMesh.rotation.y = baseRotation + torque;
    }

    // Update Camera
    updateCamera(smoothScrollProgress);

    // Update DOM Elements (Phases)
    updateDOMElements(smoothScrollProgress);

    renderer.render(scene, camera);
}

function updateCamera(val) {
    // Camera Paths
    const startPos = new THREE.Vector3(0, 4.0, 7.0);
    const startTarget = new THREE.Vector3(0, 2.5, 0);

    const midPos = new THREE.Vector3(0, 0.0, 3.0);
    const midTarget = new THREE.Vector3(0, 0.0, 0);

    const endPos = new THREE.Vector3(0, -3.0, 9.0);
    const endTarget = new THREE.Vector3(0, -3.0, 0);

    const r1 = THREE.MathUtils.clamp(val / 0.6, 0, 1); // 0 to 0.6 mapped to 0-1
    const r2 = THREE.MathUtils.clamp((val - 0.6) / 0.4, 0, 1); // 0.6 to 1.0 mapped to 0-1

    const currentPos = new THREE.Vector3();
    const currentTarget = new THREE.Vector3();

    // Cubic ease in/out
    const easeInOutCubic = (x) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    if (val < 0.6) {
        const smoothR1 = easeInOutCubic(r1);
        currentPos.lerpVectors(startPos, midPos, smoothR1);
        currentTarget.lerpVectors(startTarget, midTarget, smoothR1);
    } else {
        const smoothR2 = easeInOutCubic(r2);
        currentPos.lerpVectors(midPos, endPos, smoothR2);
        currentTarget.lerpVectors(midTarget, endTarget, smoothR2);
    }

    // Add float effect
    const time = performance.now() * 0.001;
    currentPos.y += Math.sin(time * 0.5) * 0.1;

    camera.position.copy(currentPos);
    camera.lookAt(currentTarget);
}

function initScrollInteraction() {
    const section = document.getElementById('vortex-section');
    const scrollBar = document.getElementById('scroll-bar');

    const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionHeight = section.offsetHeight;

        // Calculate progress
        // Start: when section top reaches viewport top (or slightly before)
        // End: when section bottom reaches viewport bottom

        // We want 0 when section top is at 0
        // We want 1 when section bottom is at viewport bottom (scrolled all the way)
        // Total scrollable distance = sectionHeight - viewportHeight

        const scrollTop = -rect.top;
        const maxScroll = sectionHeight - viewportHeight;

        let progress = scrollTop / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        scrollProgress = progress;

        // Update Scroll Bar UI immediately
        if (scrollBar) {
            scrollBar.style.height = `${progress * 100}%`;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

// --- DOM ANIMATION HELPERS ---

// Helper to map range to value
function transform(value, inputRange, outputRange) {
    if (value < inputRange[0]) return outputRange[0];
    if (value > inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

    for (let i = 0; i < inputRange.length - 1; i++) {
        if (value >= inputRange[i] && value <= inputRange[i + 1]) {
            const pct = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
            return outputRange[i] + pct * (outputRange[i + 1] - outputRange[i]);
        }
    }
    return outputRange[0];
}

function updateDOMElements(progress) {
    const p1 = document.getElementById('p1-container');
    const p2 = document.getElementById('p2-container');
    const p3 = document.getElementById('p3-container');

    // Phase 1: Clarity
    // Opacity: [0.0, 0.15, 0.35, 0.40] -> [0, 1, 1, 0]
    const p1Opacity = transform(progress, [0.0, 0.15, 0.35, 0.40], [0, 1, 1, 0]);
    // Scale: [0.0, 0.15] -> [0.95, 1]
    const p1Scale = transform(progress, [0.0, 0.15], [0.95, 1]);
    // Y: [0.0, 0.15, 0.35, 0.40] -> [20, 0, 0, -50]
    const p1Y = transform(progress, [0.0, 0.15, 0.35, 0.40], [20, 0, 0, -50]);

    if (p1) {
        p1.style.opacity = p1Opacity;
        p1.style.transform = `translateY(${p1Y}px) scale(${p1Scale})`;
        p1.style.pointerEvents = (progress >= 0 && progress < 0.40) ? 'auto' : 'none';
    }

    // Phase 2: Definition
    // Opacity: [0.45, 0.50, 0.70, 0.75] -> [0, 1, 1, 0]
    const p2Opacity = transform(progress, [0.45, 0.50, 0.70, 0.75], [0, 1, 1, 0]);
    // Y: [0.45, 0.50, 0.70, 0.75] -> [50, 0, 0, -50]
    const p2Y = transform(progress, [0.45, 0.50, 0.70, 0.75], [50, 0, 0, -50]);

    if (p2) {
        p2.style.opacity = p2Opacity;
        p2.style.transform = `translateY(${p2Y}px)`;
        p2.style.pointerEvents = (progress > 0.45 && progress < 0.75) ? 'auto' : 'none';
    }

    // Phase 3: Expansion
    // Opacity: [0.80, 0.85] -> [0, 1]
    const p3Opacity = transform(progress, [0.80, 0.85], [0, 1]);
    // Y: [0.80, 0.85] -> [50, 0]
    const p3Y = transform(progress, [0.80, 0.85], [50, 0]);

    if (p3) {
        p3.style.opacity = p3Opacity;
        p3.style.transform = `translateY(${p3Y}px)`;
        p3.style.pointerEvents = (progress > 0.80) ? 'auto' : 'none';
    }
}
