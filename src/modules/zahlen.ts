import gsap from "@lib/gsap";
import { onMount, onDestroy, onView } from "@/modules/_";

export default function (element: HTMLElement, dataset: DOMStringMap) {
  const ziel = parseFloat(dataset.zahl ?? "0");
  const dauer = parseFloat(dataset.dauer ?? "2");
  const verzoegerung = parseFloat(dataset.verzoegerung ?? "0");

  const dezimalstellen = (dataset.zahl ?? "0").includes(".")
    ? (dataset.zahl!.split(".")[1]?.length ?? 0)
    : 0;

  let animation: gsap.core.Tween | null = null;
  let gestartet = false;

  const proxy = { wert: 0 };

  onMount(() => {
    element.textContent = "0";
  });

  onView(element, {
    threshold: 0.3,
    callback: ({ isIn }) => {
      if (isIn && !gestartet) {
        gestartet = true;
        animation = gsap.to(proxy, {
          wert: ziel,
          duration: dauer,
          delay: verzoegerung,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = proxy.wert.toFixed(dezimalstellen);
          },
        });
      }
    },
  });

  onDestroy(() => {
    animation?.kill();
    gestartet = false;
    proxy.wert = 0;
  });
}
