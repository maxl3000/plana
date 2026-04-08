import { onView, onDestroy } from "@/modules/_";
import { isLowEndDevice } from "@/utils/media";

export default function (element: HTMLElement) {
  const fallbackImg = element.parentElement?.querySelector(
    "[data-us-fallback]"
  ) as HTMLElement | null;

  if (isLowEndDevice()) {
    element.style.display = "none";
    if (fallbackImg) fallbackImg.style.display = "block";
    return;
  }

  // On capable devices: pause/resume 3D scene based on viewport visibility
  let scene: any = null;

  const findScene = () => {
    if (scene) return scene;
    // Unicorn Studio stores the scene instance on the element
    scene = (element as any).__scene || (element as any)._scene;
    // Fallback: check for canvas and try global UnicornStudio API
    if (!scene && (window as any).UnicornStudio) {
      const scenes = (window as any).UnicornStudio.getScenes?.();
      if (scenes?.length) scene = scenes[0];
    }
    return scene;
  };

  onView(element, {
    rootMargin: "200px",
    callback: ({ isIn }) => {
      const s = findScene();
      if (!s) return;
      if (isIn) {
        s.play?.();
        s.resume?.();
      } else {
        s.pause?.();
      }
    },
  });

  onDestroy(() => {
    scene = null;
  });
}
