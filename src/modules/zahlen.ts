import gsap from "@lib/gsap";
import { onMount, onDestroy, onView } from "@/modules/_";

export default function (element: HTMLElement, dataset: DOMStringMap) {
  const rohwert = dataset.zahl ?? "0";
  const hatKomma = rohwert.includes(",");
  const normiert = rohwert.replace(",", ".");

  const ziel = parseFloat(normiert);
  const dauer = parseFloat(dataset.dauer ?? "2");
  const verzoegerung = parseFloat(dataset.verzoegerung ?? "0");

  const dezimalstellen = normiert.includes(".")
    ? (normiert.split(".")[1]?.length ?? 0)
    : 0;

  const formatieren = (wert: number) => {
    const str = wert.toFixed(dezimalstellen);
    return hatKomma ? str.replace(".", ",") : str;
  };

  let animation: gsap.core.Tween | null = null;
  let gestartet = false;

  const proxy = { wert: 0 };

  onMount(() => {
    element.textContent = formatieren(0);
  });

  onView(element, {
    threshold: 0.3,
    autoStart: true,
    callback: ({ isIn }) => {
      if (isIn && !gestartet) {
        gestartet = true;
        animation = gsap.to(proxy, {
          wert: ziel,
          duration: dauer,
          delay: verzoegerung,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = formatieren(proxy.wert);
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
