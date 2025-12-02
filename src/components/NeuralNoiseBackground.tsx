import React, { useEffect, useRef } from 'react';

const NeuralNoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Vertex Shader
        const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        // Fragment Shader - Domain Warping with Simplex Noise
        // Adapted to match the "neural" aesthetic and use the gold color #FDB447
        const fsSource = `
      precision highp float;

      uniform float u_time;
      uniform vec2 u_pointer_position;
      uniform float u_ratio;
      uniform vec2 u_resolution;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_ratio;
        
        vec2 pointer = u_pointer_position;
        pointer.x *= u_ratio;
        
        // Faster time for electricity
        float t = u_time * 0.15;
        
        // Layer 1: Base Neural Structure (Domain Warping)
        // We create a warped coordinate system to simulate the organic twisting of neurons
        float n1 = snoise(st * 2.5 + t * 0.05);
        vec2 warp = vec2(n1, snoise(st * 2.5 + t * 0.06 + 10.0));
        
        // Layer 2: The Synaptic Web
        // Using the warped coordinates to create connected paths
        float n2 = snoise(st * 5.0 + warp * 1.5 - t * 0.1);
        
        // Create "synapses" - thin glowing lines where the noise crosses zero
        // 0.01 / abs(n2) creates a sharp glow
        float synapse = 0.008 / (abs(n2) + 0.005);
        
        // Layer 3: Sparks / Firing Neurons
        // High frequency noise moving quickly along the paths
        float flow = snoise(st * 10.0 + warp * 2.0 + t * 1.5);
        float spark = smoothstep(0.6, 0.8, flow); // Only show the brightest spots
        
        // Colors
        vec3 bg = vec3(0.0, 0.0, 0.0);
        vec3 electricGold = vec3(1.0, 0.7, 0.2); 
        vec3 brightSpark = vec3(1.0, 0.95, 0.8);
        
        vec3 color = bg;
        
        // Add the base glowing web
        // Modulate intensity with low freq noise so it breathes
        float breathing = smoothstep(0.2, 0.8, snoise(st * 1.0 + t * 0.2));
        color += electricGold * synapse * 0.3 * breathing;
        
        // Add the sparks traveling along the synapses
        // We multiply by 'synapse' so sparks only appear ON the lines
        color += brightSpark * spark * synapse * 1.5;
        
        // Interaction - Excite the network
        float dist = distance(st, pointer);
        float interact = smoothstep(0.4, 0.0, dist);
        
        // Interaction creates a burst of energy
        float interactNoise = snoise(st * 20.0 + t * 5.0);
        color += electricGold * interact * synapse * 2.0;
        color += brightSpark * interact * step(0.8, interactNoise) * 2.0; // Extra sparks on hover

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // Shader compilation helpers
        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const createProgram = (gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) => {
            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        };

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertShader || !fragShader) return;

        const program = createProgram(gl, vertShader, fragShader);
        if (!program) return;

        gl.useProgram(program);

        // Geometry
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uPointer = gl.getUniformLocation(program, 'u_pointer_position');
        const uRatio = gl.getUniformLocation(program, 'u_ratio');
        const uResolution = gl.getUniformLocation(program, 'u_resolution');

        let animationFrameId: number;
        const pointer = { x: 0, y: 0, tX: 0, tY: 0 };

        const render = (time: number) => {
            // Guard against zero-sized canvas
            if (canvas.width === 0 || canvas.height === 0) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Smooth pointer movement
            pointer.x += (pointer.tX - pointer.x) * 0.1;
            pointer.y += (pointer.tY - pointer.y) * 0.1;

            gl.viewport(0, 0, canvas.width, canvas.height);
            // Pass time in seconds to avoid large number precision issues
            gl.uniform1f(uTime, time * 0.001);
            gl.uniform2f(uPointer, pointer.x / canvas.width, 1.0 - pointer.y / canvas.height);
            gl.uniform1f(uRatio, canvas.width / canvas.height);
            gl.uniform2f(uResolution, canvas.width, canvas.height);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            pointer.tX = (e.clientX - rect.left) * (canvas.width / rect.width);
            pointer.tY = (e.clientY - rect.top) * (canvas.height / rect.height);
        };

        // Use ResizeObserver for robust sizing
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas);

        window.addEventListener('mousemove', handleMouseMove);

        // Initial sizing
        handleResize();
        requestAnimationFrame(render);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default NeuralNoiseBackground;
