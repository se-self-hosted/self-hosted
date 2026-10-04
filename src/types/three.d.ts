declare module "three" {
  export class Vector2 {
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
    copy(value: Vector2): this;
    lerp(value: Vector2, alpha: number): this;
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    copy(value: Vector3): this;
  }

  export class Scene {
    add(object: Mesh): void;
  }

  export class OrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
    position: Vector3;
  }

  export class PlaneGeometry {
    constructor(width?: number, height?: number);
    dispose(): void;
  }

  export class ShaderMaterial {
    constructor(parameters: {
      uniforms: Record<string, { value: unknown }>;
      vertexShader: string;
      fragmentShader: string;
    });
    dispose(): void;
  }

  export class Mesh {
    constructor(geometry: PlaneGeometry, material: ShaderMaterial);
  }

  export class WebGLRenderer {
    constructor(parameters?: {
      antialias?: boolean;
      alpha?: boolean;
      powerPreference?: "default" | "high-performance" | "low-power";
    });
    domElement: HTMLCanvasElement;
    setPixelRatio(value: number): void;
    getPixelRatio(): number;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: OrthographicCamera): void;
    dispose(): void;
    forceContextLoss(): void;
  }
}
