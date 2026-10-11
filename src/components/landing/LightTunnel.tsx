"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import styles from "./LightTunnel.module.css";

export type FlowDirection = "inward" | "outward";

export interface LightTunnelProps {
  cableColor?: string;
  pulseColor?: string;
  tunnelColor?: string;
  lightBackgroundColor?: string;
  tunnelOpacity?: number;
  speed?: number;
  flowDirection?: FlowDirection;
  pulseSpeed?: number;
  pulseLength?: number;
  pulseBlend?: number;
  pulseWidth?: number;
  cableCount?: number;
  thickness?: number;
  rimWidth?: number;
  waviness?: number;
  sway?: number;
  size?: number;
  centerX?: number;
  centerY?: number;
  glow?: number;
  fadeNear?: number;
  fadeFar?: number;
  brightness?: number;
  colorVariance?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  lightMode?: boolean;
  className?: string;
}

type UniformValue = number | Float32Array;
type Uniforms = Record<string, { value: UniformValue }>;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [Number.parseInt(result[1], 16) / 255, Number.parseInt(result[2], 16) / 255, Number.parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform vec3 uLightBackground;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float speedBase = uSpeed * 4.0 * uFlowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);
  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;
  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = fract(finalAngle * cablesCount) - 0.5;
  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);
  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));
  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);
  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);

  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);
  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;
  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;
  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  if (uLightMode > 0.5) {
    float peak = max(o.r, max(o.g, o.b));
    vec3 chroma = pow(clamp(o.rgb / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(uLightBackground, chroma, o.a * 0.95), 1.0);
  } else {
    fragColor = o;
  }
}
`;

type LightTunnelContext = {
  renderer: InstanceType<typeof Renderer>;
  program: InstanceType<typeof Program>;
  mesh: InstanceType<typeof Mesh>;
  render: () => void;
};

const contexts = new WeakMap<HTMLDivElement, LightTunnelContext>();

export function LightTunnel({
  cableColor = "#D4F36B",
  pulseColor = "#D4F36B",
  tunnelColor = "#657A2D",
  lightBackgroundColor = "#F4F2EC",
  tunnelOpacity = 0,
  speed = 0.1,
  flowDirection = "outward",
  pulseSpeed = 2,
  pulseLength = 0.28,
  pulseBlend = 1,
  pulseWidth = 1,
  cableCount = 20,
  thickness = 0.35,
  rimWidth = 0.15,
  waviness = 0.3,
  sway = 0.5,
  size = 1,
  centerX = 0,
  centerY = 0,
  glow = 1,
  fadeNear = 0.5,
  fadeFar = 2,
  brightness = 1,
  colorVariance = true,
  grain = true,
  grainIntensity = 0.05,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.1,
  lightMode = false,
  className = "",
}: LightTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseEnabledRef = useRef(mouseInteraction);
  const mouseStrengthRef = useRef(mouseStrength);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uSpeed: { value: 0.1 }, uFlowDir: { value: -1 },
        uPulseSpeed: { value: 2 }, uPulseLength: { value: 0.28 }, uPulseBlend: { value: 1 }, uPulseWidth: { value: 1 },
        uCableCount: { value: 20 }, uThickness: { value: 0.35 }, uRimWidth: { value: 0.15 }, uWaviness: { value: 0.3 },
        uSway: { value: 0.5 }, uSize: { value: 1 }, uCenter: { value: new Float32Array([0, 0]) }, uMouseOffset: { value: new Float32Array([0, 0]) },
        uGlow: { value: 1 }, uFadeNear: { value: 0.5 }, uFadeFar: { value: 2 }, uBrightness: { value: 1 }, uColorVariance: { value: 1 },
        uOpacity: { value: 1 }, uCableColor: { value: new Float32Array([0.831, 0.953, 0.42]) }, uPulseColor: { value: new Float32Array([0.831, 0.953, 0.42]) },
        uTunnelColor: { value: new Float32Array([0.396, 0.478, 0.176]) }, uLightBackground: { value: new Float32Array([0.957, 0.949, 0.925]) },
        uTunnelOpacity: { value: 0 }, uGrain: { value: 1 }, uGrainIntensity: { value: 0.05 }, uLightMode: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const render = () => renderer.render({ scene: mesh });
    contexts.set(container, { renderer, program, mesh, render });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      const resolution = (program.uniforms.iResolution as { value: Float32Array }).value;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;
      render();
    };
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    const currentMouse: [number, number] = [0.5, 0.5];
    let targetMouse: [number, number] = [0.5, 0.5];
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height];
    };
    const handlePointerLeave = () => { targetMouse = [0.5, 0.5]; };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const startedAt = performance.now();

    const draw = (time: number) => {
      const uniforms = program.uniforms as Uniforms;
      uniforms.iTime.value = reducedMotion.matches ? 2.4 : (time - startedAt) * 0.001;
      if (mouseEnabledRef.current && !reducedMotion.matches) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      } else {
        currentMouse[0] += 0.05 * (0.5 - currentMouse[0]);
        currentMouse[1] += 0.05 * (0.5 - currentMouse[1]);
      }
      const offset = uniforms.uMouseOffset.value as Float32Array;
      offset[0] = (currentMouse[0] - 0.5) * mouseStrengthRef.current;
      offset[1] = (currentMouse[1] - 0.5) * mouseStrengthRef.current;
      render();
    };
    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const tryStart = () => {
      if (!reducedMotion.matches && isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
      else if (reducedMotion.matches) draw(performance.now());
    };
    const tryStop = () => { if (raf !== 0) cancelAnimationFrame(raf); raf = 0; };
    const restart = () => { tryStop(); tryStart(); };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) tryStart();
      else tryStop();
    }, { threshold: 0 });
    intersectionObserver.observe(container);
    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", restart);
    tryStart();

    return () => {
      tryStop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", restart);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      contexts.delete(container);
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    mouseEnabledRef.current = mouseInteraction;
    mouseStrengthRef.current = mouseStrength;
    const container = containerRef.current;
    const context = container ? contexts.get(container) : undefined;
    if (!context) return;
    const uniforms = context.program.uniforms as Uniforms;
    const numberValues: Record<string, number> = {
      uSpeed: speed, uFlowDir: flowDirection === "outward" ? -1 : 1, uPulseSpeed: pulseSpeed, uPulseLength: pulseLength,
      uPulseBlend: pulseBlend, uPulseWidth: pulseWidth, uCableCount: cableCount, uThickness: thickness, uRimWidth: rimWidth,
      uWaviness: waviness, uSway: sway, uSize: size, uGlow: glow, uFadeNear: fadeNear, uFadeFar: fadeFar,
      uBrightness: brightness, uColorVariance: colorVariance ? 1 : 0, uGrain: grain ? 1 : 0, uGrainIntensity: grainIntensity,
      uOpacity: opacity, uLightMode: lightMode ? 1 : 0, uTunnelOpacity: tunnelOpacity,
    };
    Object.entries(numberValues).forEach(([key, value]) => { uniforms[key].value = value; });
    const center = uniforms.uCenter.value as Float32Array;
    center[0] = centerX; center[1] = centerY;
    const setColor = (name: string, color: string) => {
      const rgb = hexToRgb(color);
      const uniform = uniforms[name].value as Float32Array;
      uniform[0] = rgb[0]; uniform[1] = rgb[1]; uniform[2] = rgb[2];
    };
    setColor("uCableColor", cableColor);
    setColor("uPulseColor", pulseColor);
    setColor("uTunnelColor", tunnelColor);
    setColor("uLightBackground", lightBackgroundColor);
    context.render();
  }, [brightness, cableColor, cableCount, centerX, centerY, colorVariance, fadeFar, fadeNear, flowDirection, glow, grain, grainIntensity, lightBackgroundColor, lightMode, mouseInteraction, mouseStrength, opacity, pulseBlend, pulseColor, pulseLength, pulseSpeed, pulseWidth, rimWidth, size, speed, sway, thickness, tunnelColor, tunnelOpacity, waviness]);

  return <div ref={containerRef} className={`${styles.container} ${className}`.trim()} aria-hidden="true" />;
}
