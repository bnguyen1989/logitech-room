import { useFrame, useThree } from '@react-three/fiber';
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import {
  Box3,
  type Camera,
  Euler,
  type Mesh,
  type Object3D,
  Spherical,
  Vector2,
  Vector3
} from 'three';
import { clamp, euclideanModulo, lerp } from 'three/src/math/MathUtils.js';

enum TouchMode {
  None,
  Dragging,
  Pinching
}

export interface TurntableControlsImplProps {
  // these props are largely copied from OrbitControls
  // tilt angle limits
  minPolarAngle: number; // default is 0. Range is [0, PI], where 0 is looking straight down, and PI is looking straight up. This is offset from getSpherical().theta by +PI/2
  maxPolarAngle: number; // default is PI

  // turntable angle limits
  minAzimuthAngle: number; // default is -Infinity. in radians
  maxAzimuthAngle: number; // defualt is +Infinity. range is [minAzimuthAngle, minAzimuthAngle + 2*PI]

  // zoom limits
  minDistance: number;
  maxDistance: number;

  enableDamping: boolean; // adds momentum to the controls
  enableZoom: boolean;
  dampingFactor: number; // copied from OrbitControls
  zoomDampingFactor: number;

  sensitivity: number;
  tiltSensitivity: number; // defaults to sensitivity
  zoomSensitivity: number;

  allowMobileVerticalOrbit: boolean;
}

interface TurntableControlsProps extends Partial<TurntableControlsImplProps> {
  children: React.ReactNode;
  camera?: Camera;
  domElement?: HTMLElement;
  enabled?: boolean;
}

export class TurntableControlsImpl implements TurntableControlsImplProps {
  public velocity = new Vector3(
    0, // turntable
    0, // tilt
    0 // zoom
  );

  public minPolarAngle = 0; // 0 is looking straight down, PI is looking straight up
  public maxPolarAngle = Math.PI;
  public minAzimuthAngle = -Infinity;
  public maxAzimuthAngle = +Infinity;
  public minDistance = 0;
  public maxDistance = Infinity;

  public enableZoom = true;

  public enableDamping = true;
  public dampingFactor = 0.2;
  public zoomDampingFactor = 0.5;

  public sensitivity = 1;
  public tiltSensitivity = this.sensitivity;
  public zoomSensitivity = 1;
  public allowMobileVerticalOrbit = false;

  private _eventListeners: Partial<{
    [K in keyof HTMLElementEventMap]: (e: HTMLElementEventMap[K]) => void;
  }> = {};
  private _el: HTMLElement | null = null;
  private _enabled = false;

  private _mouseDown = false;
  private _touchMode = TouchMode.None;

  constructor(
    public pivot: Object3D,
    public camera: Camera,
    props?: Partial<TurntableControlsImplProps>
  ) {
    if (props) this.configure(props);
  }

  public get enabled() {
    return this._enabled;
  }

  public set enabled(enabled: boolean) {
    this._enabled = enabled;
    this.setupEventListeners(this._el);
  }

  private get orbitSensitivityCoefficient() {
    if (!this._el) return 0;
    // 1 full turn when dragging from one side of the screen to the other
    return (Math.PI * 2 * -this.sensitivity) / this._el.clientWidth;
  }
  private get tiltSensitivityCoefficient() {
    if (!this._el) return 0;
    return (Math.PI * 2 * -this.sensitivity) / this._el.clientHeight;
  }
  private get wheelSensitivityCoefficient() {
    // scroll wheel
    return this.zoomSensitivity * 0.001; // doubling/halving of distance [per pixel]
  }
  private get pinchSensitivityCoefficient() {
    // pinch, normalized to the screen size
    if (!this._el) return 0;
    return (
      this.zoomSensitivity /
      Math.min(this._el.clientWidth, this._el.clientHeight)
    ); // doubling/halving of distance [per pixel]
  }

  public setupEventListeners(el: HTMLElement | null) {
    for (const k in this._eventListeners) {
      window.removeEventListener(k, (this._eventListeners as any)[k]);
    }

    this._eventListeners = {};

    this._el = el;
    if (!this._el) return;

    if (!this.enabled) return;

    let prevX = NaN; // for mouse movement
    let prevY = NaN;

    let prevTouches = new Array<Touch>();

    this._eventListeners = {
      // mouse events
      mousedown: (e: MouseEvent) => {
        if (e.target !== el) return;

        if (e.buttons & 1) {
          this._mouseDown = true;
          prevX = e.clientX;
          prevY = e.clientY;

          if (e.cancelable) e.preventDefault();
        }
      },
      mouseup: (e: MouseEvent) => {
        if (e.target !== el) return;

        if (!(e.buttons & 1)) {
          this._mouseDown = false;
          prevX = NaN;
          prevY = NaN;

          if (e.cancelable) e.preventDefault();
        }
      },
      mousemove: (e: MouseEvent) => {
        if (e.buttons & 1 && this._mouseDown) {
          const x = e.clientX;
          const y = e.clientY;

          const delta = new Vector3(
            isNaN(prevX) ? 0 : x - prevX,
            isNaN(prevY) ? 0 : y - prevY,
            0
          );
          delta.x *= this.orbitSensitivityCoefficient;
          delta.y *= this.tiltSensitivityCoefficient;
          prevX = x;
          prevY = y;
          this.velocity.addScaledVector(
            delta,
            this.enableDamping ? this.dampingFactor : 1
          );

          if (e.cancelable) e.preventDefault();
        } else this._mouseDown = false; // if you click and drag outside of the rect the mouseup event doesn't fire
      },
      wheel: (e: WheelEvent) => {
        if (!this.enableZoom) return;

        this.velocity.z +=
          e.deltaY *
          this.wheelSensitivityCoefficient *
          (this.enableDamping ? this.zoomDampingFactor : 1);

        if (e.cancelable) e.preventDefault();
      },

      // touch events
      touchstart: (e: TouchEvent) => {
        if (e.touches.length === 1) this._touchMode = TouchMode.Dragging;
        else if (e.touches.length === 2) this._touchMode = TouchMode.Pinching;
        else this._touchMode = TouchMode.None;
        prevTouches = [...e.touches];

        if (e.cancelable) e.preventDefault();
      },
      touchend: (e: TouchEvent) => {
        this._touchMode = TouchMode.None;
        prevTouches = [];

        if (e.cancelable) e.preventDefault();
      },
      touchcancel: (e: TouchEvent) => {
        this._touchMode = TouchMode.None;
        prevTouches = [];

        if (e.cancelable) e.preventDefault();
      },
      touchmove: (e: TouchEvent) => {
        if ([...e.touches].some((t) => t.target !== el)) {
          this._touchMode = TouchMode.None;
          return;
        }

        switch (e.touches.length) {
          case 0: {
            this._touchMode = TouchMode.None;
            break;
          }
          case 1: {
            this._touchMode = TouchMode.Dragging;
            const touch = e.touches[0];
            const prevTouch = prevTouches.find(
              (prevTouch) => prevTouch.identifier === touch.identifier
            );
            if (!prevTouch) break;
            const delta = new Vector3(
              touch.clientX - prevTouch.clientX,
              touch.clientY - prevTouch.clientY,
              0
            );
            delta.x *= this.orbitSensitivityCoefficient;
            delta.y *= this.tiltSensitivityCoefficient;
            this.velocity.addScaledVector(
              delta,
              this.enableDamping ? this.dampingFactor : 1
            );
            break;
          }
          case 2: {
            if (this.enableZoom) {
              this._touchMode = TouchMode.Dragging;
              const prevTouchesSorted = [...e.touches].map((newTouch) =>
                prevTouches.find(
                  (prevTouch) => prevTouch.identifier === newTouch.identifier
                )
              );
              if (!prevTouchesSorted.some(Boolean)) break;
              // "gap" is the distance between the two fingers at a given point in time
              const prevGap = new Vector2(
                prevTouchesSorted[1]!.clientX - prevTouchesSorted[0]!.clientX,
                prevTouchesSorted[1]!.clientY - prevTouchesSorted[0]!.clientY
              ).length();
              const currGap = new Vector2(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
              ).length();
              const gapDiff = (currGap - prevGap) * window.devicePixelRatio;
              this.velocity.z -=
                gapDiff *
                this.pinchSensitivityCoefficient *
                (this.enableDamping ? this.zoomDampingFactor : 1);
            }
            break;
          }
        }
        prevTouches = [...e.touches];

        if (e.cancelable) e.preventDefault();
      }
    };

    for (const k in this._eventListeners) {
      window.addEventListener(k, (this._eventListeners as any)[k], {
        passive: false
      });
    }
  }

  public configure(props: Partial<TurntableControlsImplProps>) {
    for (const key of [
      'minPolarAngle',
      'maxPolarAngle',
      'minAzimuthAngle',
      'maxAzimuthAngle',
      'minDistance',
      'maxDistance',
      'enableZoom',
      'enableDamping',
      'dampingFactor',
      'zoomDampingFactor',
      'sensitivity',
      'tiltSensitivity',
      'zoomSensitivity',
      'allowMobileVerticalOrbit'
    ]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((props as any)[key] != null) (this as any)[key] = (props as any)[key];
    }
  }

  public update() {
    if (!this.enabled) return;

    // update velocity
    const delta = this.velocity.clone();
    if (this.enableDamping) {
      const turntableDampingFactor = 1 - this.dampingFactor;
      this.velocity.x *= turntableDampingFactor; // turn-table
      this.velocity.y *= 1 - this.dampingFactor; // tilt
      this.velocity.z *= 1 - this.zoomDampingFactor;
    } else this.velocity.set(0, 0, 0);

    // stop once velocity is low enough to prevent constant re-rendering of the scene
    for (let i = 0; i < 3; i++) {
      if (Math.abs(this.velocity.getComponent(i)) < 1e-4) {
        this.velocity.setComponent(i, 0);
      }
    }

    // update position/rotation of 3d stuff
    const oldSpherical = this.getSpherical(new Spherical());
    const newSpherical = oldSpherical.clone();
    newSpherical.phi += delta.x;
    newSpherical.theta += delta.y;
    newSpherical.radius *= 2 ** delta.z;
    this.applyConstraints(newSpherical, oldSpherical);

    this.setSpherical(newSpherical);
  }

  private applyConstraints(spherical: Spherical, oldSpherical: Spherical) {
    const EPSILON = 1e-5;
    if (isFinite(this.minAzimuthAngle) && isFinite(this.maxAzimuthAngle)) {
      let rangeCenter = (this.minAzimuthAngle + this.maxAzimuthAngle) / 2;
      const halfRange = (this.maxAzimuthAngle - this.minAzimuthAngle) / 2;

      // Many numbers represent the same angle, eg. 0 and 2PI. This is very problematic for clamping.
      // The below LOC ensures that oldPhi-rangeCenter is always between [-PI,+PI].
      // This makes the clamping trivial
      rangeCenter =
        oldSpherical.phi + fixRelativeAngleRad(rangeCenter - oldSpherical.phi);
      const min = rangeCenter - halfRange;
      const max = rangeCenter + halfRange;

      spherical.phi = cushionedClamp(oldSpherical.phi, spherical.phi, min, max);
    }
    // tilt
    spherical.theta = cushionedClamp(
      oldSpherical.theta,
      spherical.theta, // 0 is looking straight horizontally
      Math.max(this.minPolarAngle, EPSILON) - Math.PI / 2,
      Math.min(this.maxPolarAngle, Math.PI - EPSILON) - Math.PI / 2
    );
    // zoom
    spherical.radius = cushionedClamp(
      oldSpherical.radius,
      spherical.radius,
      Math.max(this.minDistance, this.computeObjectRadius()),
      this.maxDistance
    );

    return spherical;
  }

  public getSpherical = (() => {
    const tmpEuler = new Euler();
    const tmpCamWorldPos = new Vector3();
    const tmpPivotWorldPos = new Vector3();

    return (outSpherical: Spherical) => {
      // tilt the camera
      const camWorldPos = this.camera.getWorldPosition(tmpCamWorldPos);
      const pivotWorldPos = this.pivot.getWorldPosition(tmpPivotWorldPos);
      const dist = camWorldPos.distanceTo(pivotWorldPos);

      this.camera.lookAt(pivotWorldPos);
      // we create another euler so we can set the rotate order to ZYX
      const quat = this.camera.quaternion.clone();
      const euler = tmpEuler.setFromQuaternion(quat, 'ZYX');

      return outSpherical.set(dist, -(this.pivot?.rotation.y ?? 0), euler.x);
    };
  })();
  public setSpherical = (() => {
    const tmpEuler = new Euler();
    const tmpPivotWorldPos = new Vector3();

    return (spherical: Spherical) => {
      if (this.pivot) this.pivot.rotation.y = -spherical.phi;

      // tilt the camera
      const pivotWorldPos = this.pivot.getWorldPosition(tmpPivotWorldPos);
      this.camera.lookAt(pivotWorldPos);
      // we create another euler so we can set the rotate order to ZYX
      const quat = this.camera.quaternion.clone();
      const euler = tmpEuler.setFromQuaternion(quat, 'ZYX');

      const EPSILON = 1e-5;

      euler.x = clamp(
        spherical.theta,
        -Math.PI / 2 + EPSILON,
        Math.PI / 2 - EPSILON
      );
      quat.setFromEuler(euler);

      this.camera.position
        .set(0, 0, spherical.radius)
        .applyQuaternion(quat)
        .add(pivotWorldPos);

      this.camera.quaternion.copy(quat);
    };
  })();

  public getDistance = (() => {
    const tmpSpherical = new Spherical();
    return () => {
      return this.getSpherical(tmpSpherical).radius;
    };
  })();
  public setDistance = (() => {
    const tmpSpherical = new Spherical();
    return (distance: number) => {
      const spherical = this.getSpherical(tmpSpherical);
      spherical.radius = distance;
      this.setSpherical(spherical);
    };
  })();

  public getAzimuthAngle = (() => {
    const tmpSpherical = new Spherical();
    return () => {
      return this.getSpherical(tmpSpherical).phi;
    };
  })();
  public setAzimuthAngle = (() => {
    const tmpSpherical = new Spherical();
    return (azimuthAngle: number) => {
      const spherical = this.getSpherical(tmpSpherical);
      spherical.phi = azimuthAngle;
      this.setSpherical(spherical);
    };
  })();

  public getPolarAngle = (() => {
    const tmpSpherical = new Spherical();
    return () => {
      return this.getSpherical(tmpSpherical).theta;
    };
  })();
  public setPolarAngle = (() => {
    const tmpSpherical = new Spherical();
    return (polarAngle: number) => {
      const spherical = this.getSpherical(tmpSpherical);
      spherical.theta = polarAngle;
      this.setSpherical(spherical);
    };
  })();

  private computeObjectRadius() {
    this.pivot.updateWorldMatrix(true, false);
    const tmpVec3 = new Vector3();
    const pivotWorldPos = this.pivot.getWorldPosition(new Vector3());
    let radSq = 0;
    this.pivot.traverseVisible((obj) => {
      const geo = (obj as Mesh).geometry;
      if (!geo) return;
      obj.updateWorldMatrix(false, false);
      if (!geo.boundingBox) geo.computeBoundingBox();
      const bbox = geo.boundingBox as Box3;
      for (const x of [bbox.min.x, bbox.max.x]) {
        for (const y of [bbox.min.y, bbox.max.y]) {
          for (const z of [bbox.min.z, bbox.max.z]) {
            tmpVec3.set(x, y, z);
            tmpVec3.applyMatrix4(obj.matrixWorld);
            tmpVec3.sub(pivotWorldPos);
            radSq = Math.max(radSq, tmpVec3.lengthSq());
          }
        }
      }
    });
    const rad = radSq ** 0.5;
    return rad;
  }
}

export const TurntableControls = forwardRef(
  (
    props: TurntableControlsProps,
    ref: ForwardedRef<TurntableControlsImpl | null>
  ) => {
    const { children, camera, domElement, enabled = true } = props;

    const [pivot, setPivot] = useState<Object3D | null>(null);
    const defaultCamera = useThree(({ camera }) => camera);
    const canvas = useThree(({ gl }) => gl.domElement);
    const actualCam = camera || defaultCamera;
    const el = domElement ?? canvas;

    const controls = useMemo(() => {
      if (!pivot || !actualCam) return null;
      return new TurntableControlsImpl(pivot, actualCam);
    }, [pivot, actualCam]);

    useEffect(() => {
      if (!controls) return;
      controls.setupEventListeners(el);
      return () => controls.setupEventListeners(null); // ie. dispose
    }, [controls, el]);

    // adds the controls ref
    useImperativeHandle<
      TurntableControlsImpl | null,
      TurntableControlsImpl | null
    >(
      ref,
      () => {
        return controls;
      },
      [controls]
    );

    useFrame(() => controls?.update());

    if (controls) {
      controls?.configure(props);
      controls.enabled = enabled;
    }

    return (
      <>
        <object3D ref={setPivot}>{children}</object3D>
        {controls && <primitive ref={ref} object={controls} />}
      </>
    );
  }
);

function fixRelativeAngleRad(angInRadians: number) {
  // There are infinite numbers that represent the same angle, eg. 0 and 2*PI
  // This centers the angle around 0, so that the returned result is always between -PI and PI
  return euclideanModulo(angInRadians + Math.PI, Math.PI * 2) - Math.PI;
}

// clamps, but in a soft way when cushionFactor > 0
// this makes it so you come to a gradual stop when approaching the limits, instead of having infinite decceleration, which feels rigid
function cushionedClamp(
  from: number,
  to: number,
  min: number,
  max: number,
  cushionFactor = 1 // range is 0, Infinity, 0 = regular clamp
) {
  if (!cushionFactor) return clamp(to, min, max);

  const EPSILON = 1e-5;

  from = clamp(from, min, max);
  const delta = to - from;
  to = clamp(to, min, max);
  if (delta > 0) {
    if (!isFinite(max)) return to;
    const dist = max - from; // should be positive
    if (dist < EPSILON) return to;
    return lerp(from, max, delta / (dist + cushionFactor));
  } else {
    if (!isFinite(min)) return to;
    const dist = from - min; // should be positive
    if (dist < EPSILON) return to;
    return lerp(from, min, -delta / (dist + cushionFactor));
  }
}
