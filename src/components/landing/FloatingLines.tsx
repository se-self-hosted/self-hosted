"use client";

import { useEffect, useRef } from "react";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import styles from "./FloatingLines.module.css";

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform vec3 backgroundColor;
uniform bool lightMode;

mat2 rotate(float radians) {
  return mat2(cos(radians), sin(radians), -sin(radians), cos(radians));
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 0) return vec3(1.0);
  if (lineGradientCount == 1) return lineGradient[0] * 0.5;

  float scaled = clamp(t, 0.0, 0.9999) * float(lineGradientCount - 1);
  int index = int(floor(scaled));
  float amount = fract(scaled);
  int nextIndex = min(index + 1, lineGradientCount - 1);
  return mix(lineGradient[index], lineGradient[nextIndex], amount) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float amplitude = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + offset + time * 0.1) * amplitude;

  if (shouldBend) {
    vec2 distanceToMouse = screenUv - mouseUv;
    float influence = exp(-dot(distanceToMouse, distanceToMouse) * bendRadius);
    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
  }

  float distanceToWave = uv.y - y;
  return 0.0175 / max(abs(distanceToWave) + 0.01, 0.001) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) baseUv += parallaxOffset;

  vec3 color = vec3(0.0);
  float lineSignal = 0.0;
  vec2 mouseUv = vec2(0.0);

  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      float strength = wave(
        rotatedUv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
      color += getLineColor(t) * strength;
      lineSignal += strength;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      float strength = wave(
        rotatedUv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
      color += getLineColor(t) * strength;
      lineSignal += strength;
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 rotatedUv = baseUv * rotate(angle);
      rotatedUv.x *= -1.0;
      float strength = wave(
        rotatedUv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
      color += getLineColor(t) * strength;
      lineSignal += strength;
    }
  }

  if (lightMode) {
    float coverage = smoothstep(0.2, 1.5, lineSignal);
    vec3 ink = clamp((color / max(lineSignal, 0.0001)) * 2.0, 0.0, 1.0);
    fragColor = vec4(mix(backgroundColor, ink, coverage * 0.46), 1.0);
  } else {
    fragColor = vec4(backgroundColor + color, 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;
type Wave = "top" | "middle" | "bottom";

type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

type FloatingLinesProps = {
  linesGradient?: readonly string[];
  enabledWaves?: readonly Wave[];
  lineCount?: number | readonly number[];
  lineDistance?: number | readonly number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  backgroundColor?: string;
  lightMode?: boolean;
  className?: string;
};

function hexToVector(hex: string) {
  const value = hex.trim().replace(/^#/, "");
  const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  return new Vector3(
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  );
}

export function FloatingLines({
  linesGradient,
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition,
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  backgroundColor = "#000000",
  lightMode = false,
  className,
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeUniformsRef = useRef<{
    backgroundColor: { value: Vector3 };
    lightMode: { value: boolean };
  } | null>(null);
  const gradientUniformsRef = useRef<{
    lineGradient: { value: Vector3[] };
    lineGradientCount: { value: number };
  } | null>(null);
  const renderOnceRef = useRef<() => void>(() => undefined);
  const initialThemeRef = useRef({ backgroundColor, lightMode });
  const initialGradientRef = useRef(linesGradient);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = true;
    let visible = true;
    let pageVisible = document.visibilityState === "visible";
    let frame = 0;
    let elapsed = reduceMotion ? 9 : 0;
    let lastTimestamp: number | null = null;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const getValue = (value: number | readonly number[], wave: Wave, fallback: number) => {
      if (typeof value === "number") return value;
      const index = enabledWaves.indexOf(wave);
      return index < 0 ? fallback : (value[index] ?? fallback);
    };

    const uniforms = {
      iTime: { value: elapsed },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      enableTop: { value: enabledWaves.includes("top") },
      enableMiddle: { value: enabledWaves.includes("middle") },
      enableBottom: { value: enabledWaves.includes("bottom") },
      topLineCount: { value: enabledWaves.includes("top") ? getValue(lineCount, "top", 6) : 0 },
      middleLineCount: { value: enabledWaves.includes("middle") ? getValue(lineCount, "middle", 6) : 0 },
      bottomLineCount: { value: enabledWaves.includes("bottom") ? getValue(lineCount, "bottom", 6) : 0 },
      topLineDistance: { value: getValue(lineDistance, "top", 5) * 0.01 },
      middleLineDistance: { value: getValue(lineDistance, "middle", 5) * 0.01 },
      bottomLineDistance: { value: getValue(lineDistance, "bottom", 5) * 0.01 },
      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4),
      },
      middleWavePosition: {
        value: new Vector3(middleWavePosition?.x ?? 5, middleWavePosition?.y ?? 0, middleWavePosition?.rotate ?? 0.2),
      },
      bottomWavePosition: {
        value: new Vector3(bottomWavePosition?.x ?? 2, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4),
      },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive && !reduceMotion },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      parallax: { value: parallax && !reduceMotion },
      parallaxOffset: { value: new Vector2(0, 0) },
      lineGradient: { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount: { value: 0 },
      backgroundColor: { value: hexToVector(initialThemeRef.current.backgroundColor) },
      lightMode: { value: initialThemeRef.current.lightMode },
    };

    if (initialGradientRef.current?.length) {
      const stops = initialGradientRef.current.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, index) => uniforms.lineGradient.value[index].copy(hexToVector(hex)));
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
    themeUniformsRef.current = {
      backgroundColor: uniforms.backgroundColor,
      lightMode: uniforms.lightMode,
    };
    gradientUniformsRef.current = {
      lineGradient: uniforms.lineGradient,
      lineGradientCount: uniforms.lineGradientCount,
    };
    renderOnceRef.current = () => renderer.render(scene, camera);

    const targetMouse = new Vector2(-1000, -1000);
    const currentMouse = new Vector2(-1000, -1000);
    const targetParallax = new Vector2();
    const currentParallax = new Vector2();
    let targetInfluence = 0;
    let currentInfluence = 0;

    const setSize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
      if (reduceMotion) renderer.render(scene, camera);
    };

    const renderFrame = (timestamp: number) => {
      if (!active || reduceMotion) return;
      if (!visible || !pageVisible) {
        frame = 0;
        lastTimestamp = null;
        return;
      }

      if (lastTimestamp !== null) elapsed += Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;
      uniforms.iTime.value = elapsed;

      currentMouse.lerp(targetMouse, mouseDamping);
      uniforms.iMouse.value.copy(currentMouse);
      currentInfluence += (targetInfluence - currentInfluence) * mouseDamping;
      uniforms.bendInfluence.value = currentInfluence;
      currentParallax.lerp(targetParallax, mouseDamping);
      uniforms.parallaxOffset.value.copy(currentParallax);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
      if (reduceMotion) {
        renderer.render(scene, camera);
      } else if (!frame && visible && pageVisible) {
        frame = requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        targetInfluence = 0;
        return;
      }
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pixelRatio = renderer.getPixelRatio();
      targetMouse.set(x * pixelRatio, (rect.height - y) * pixelRatio);
      targetInfluence = 1;
      targetParallax.set(
        ((x - rect.width / 2) / rect.width) * parallaxStrength,
        (-(y - rect.height / 2) / rect.height) * parallaxStrength,
      );
    };

    const handlePointerLeave = () => {
      targetInfluence = 0;
      targetParallax.set(0, 0);
    };

    const handleVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (!pageVisible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      startRendering();
    };

    setSize();
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      startRendering();
    });
    intersectionObserver.observe(container);

    if (interactive && !reduceMotion) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    startRendering();

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      themeUniformsRef.current = null;
      gradientUniformsRef.current = null;
      renderOnceRef.current = () => undefined;
    };
  }, [
    animationSpeed,
    bendRadius,
    bendStrength,
    bottomWavePosition,
    enabledWaves,
    interactive,
    lineCount,
    lineDistance,
    mouseDamping,
    middleWavePosition,
    parallax,
    parallaxStrength,
    topWavePosition,
  ]);

  useEffect(() => {
    const uniforms = themeUniformsRef.current;
    if (!uniforms) return;
    uniforms.backgroundColor.value.copy(hexToVector(backgroundColor));
    uniforms.lightMode.value = lightMode;
    renderOnceRef.current();
  }, [backgroundColor, lightMode]);

  useEffect(() => {
    const uniforms = gradientUniformsRef.current;
    if (!uniforms) return;
    const stops = linesGradient?.slice(0, MAX_GRADIENT_STOPS) ?? [];
    uniforms.lineGradientCount.value = stops.length;
    stops.forEach((hex, index) => uniforms.lineGradient.value[index].copy(hexToVector(hex)));
    renderOnceRef.current();
  }, [linesGradient]);

  return <div ref={containerRef} className={`${styles.container} ${className ?? ""}`} aria-hidden="true" />;
}
