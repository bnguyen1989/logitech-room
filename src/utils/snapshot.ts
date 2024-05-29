import { CopyPass, EffectComposer } from "postprocessing";
import {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  UnsignedByteType,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";

type SnapshotOptions = {
  size?: {
    width: number;
    height: number;
  };
  mimeType?: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
  camera?: Camera;
};

const getCopyPass = (() => {
  const renderTarget = new WebGLRenderTarget(1, 1, { type: UnsignedByteType });
  let copyPass: CopyPass | null = null;
  return () => {
    if (!copyPass) {
      copyPass = new CopyPass(renderTarget);
      copyPass.renderToScreen = false;
    }
    return {
      copyPass,
      renderTarget,
    };
  };
})();

function pixelsToBlobUrl(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  opts: { mimeType?: string; quality?: number } = {}
) {
  const imgDataCanvas = document.createElement("canvas");
  const ctx = imgDataCanvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");
  const imageData = ctx.createImageData(width, height);
  const dst = new Uint8ClampedArray(imageData.data.buffer);

  for (let y = 0; y < height; y++) {
    const srcOff = y * width * 4;
    const dstOff = (height - y - 1) * width * 4;
    for (let x = 0; x < width * 4; x++) {
      dst[dstOff + x] = src[srcOff + x];
    }
  }

  imgDataCanvas.width = width;
  imgDataCanvas.height = height;
  ctx.putImageData(imageData, 0, 0);
  const result = (imgDataCanvas as HTMLCanvasElement).toDataURL(
    opts?.mimeType || "image/png",
    opts?.quality
  );
  imgDataCanvas.width = imgDataCanvas.height = 0; // dispose

  return result;
}

function setCameraAspect(camera: Camera, aspect: number) {
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  } else if (camera instanceof OrthographicCamera) {
    const viewHeight = camera.top - camera.bottom;
    const viewWidth = viewHeight * aspect;
    camera.left = -viewWidth / 2;
    camera.right = +viewWidth / 2;
    camera.updateProjectionMatrix();
  } else
    throw new Error(
      "Unknown camera type. Was it important from another instance of three.js?"
    );
}

function getCameraAspect(camera: Camera) {
  if (camera instanceof PerspectiveCamera) {
    return camera.aspect;
  }
  if (camera instanceof OrthographicCamera) {
    return (camera.right - camera.left) / (camera.top - camera.bottom);
  } else
    throw new Error(
      "Unknown camera type. Was it important from another instance of three.js?"
    );
}

export function snapshot(
  effectComposer: EffectComposer,
  opts: SnapshotOptions = {}
) {
  if (!effectComposer)
    throw new Error("Snapshot called without effectComposer");
  if (!effectComposer.setMainCamera) {
    throw new Error(
      "Snapshot function expects an effectComposer from the npm postprocessing library. Are you using three or three-stdlib instead?"
    );
  }

  const renderer = (effectComposer as any).renderer as WebGLRenderer;
  if (!renderer) {
    throw new Error("Expected .renderer property on EffectComposer");
  }

  const restore = new Array<() => void>();

  if (opts.size) {
    if (!opts.size.width || !opts.size.height) {
      throw new Error(
        "Invalid size for snapshot. Expected { width: number, height: number }"
      );
    }
    const oldPixelRatio = renderer.getPixelRatio();
    const oldSize = renderer.getSize(new Vector2());
    renderer.setPixelRatio(1);
    effectComposer.setSize(opts.size.width, opts.size.height, false);
    restore.push(() => {
      renderer.setPixelRatio(oldPixelRatio);
      effectComposer.setSize(oldSize.x, oldSize.y, false);
    });
  }
  const { width, height } = renderer.getDrawingBufferSize(new Vector2());
  const aspect = width / height;

  {
    // save and restore passes' cameras and the camera's aspect ratio
    const oldCamera = (
      effectComposer.passes.find((pass) => !!(pass as any).camera) as any
    )?.camera as Camera | undefined;
    if (!oldCamera) {
      throw new Error("Could not find RenderPass in effectComposer.passes");
    }
    if (opts.camera) {
      // save and restore passes' cameras
      effectComposer.setMainCamera(opts.camera);
      restore.push(() => effectComposer.setMainCamera(oldCamera));
    }
    // save and restore camera's aspect ratio
    const camera = opts.camera || oldCamera;
    const oldAspect = getCameraAspect(camera);
    setCameraAspect(camera, aspect);
    restore.push(() => setCameraAspect(camera, oldAspect));
  }

  // render to offscreen texture
  const srcPixelsBuffer = new Uint8ClampedArray(4 * width * height);
  {
    const oldRT = renderer.getRenderTarget();
    // Render
    if (effectComposer.autoRenderToScreen) {
      effectComposer.autoRenderToScreen = false;
      restore.push(() => (effectComposer.autoRenderToScreen = true));
    }
    if (effectComposer.passes.length) {
      const lastPass = effectComposer.passes[effectComposer.passes.length - 1];
      if (lastPass.renderToScreen) {
        lastPass.renderToScreen = false;
        restore.push(() => (lastPass.renderToScreen = true));
      }
    }
    effectComposer.render();
    const { copyPass, renderTarget } = getCopyPass();
    renderTarget.setSize(width, height);
    copyPass.initialize(renderer, false, UnsignedByteType);
    renderer.setRenderTarget(renderTarget);
    copyPass.render(renderer, effectComposer.inputBuffer, renderTarget);
    renderer.setRenderTarget(renderTarget);
    renderer.readRenderTargetPixels(
      renderTarget,
      0,
      0,
      width,
      height,
      srcPixelsBuffer
    );
    renderer.setRenderTarget(oldRT);
    renderTarget.width = 1; // dispose of memory while keeping the render target usable
    renderTarget.height = 1;
  }

  restore.forEach((fn) => fn());

  return pixelsToBlobUrl(srcPixelsBuffer, width, height, opts);
}
