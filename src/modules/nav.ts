import State from "@lib/hey";
import { Scroll } from "@lib/scroll";
import { onDestroy } from "@/modules/_";
import gsap from "@lib/gsap";

const SCROLL_THRESHOLD = 50;

export default function (element: HTMLElement, dataset: any) {
  const toggle = element.querySelector<HTMLElement>(".w-nav-button");
  const navbar = element.querySelector<HTMLElement>(".navbar18_component") ?? element;

  let isMenuOpen = false;
  let isHidden = false;
  let lastScroll = 0;

  if (toggle) {
    const onToggle = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.attributeName !== "aria-expanded") continue;
        isMenuOpen = toggle.getAttribute("aria-expanded") === "true";
        isMenuOpen ? Scroll.stop() : Scroll.start();
        if (isMenuOpen && isHidden) show();
      }
    };

    var menuObserver = new MutationObserver(onToggle);
    menuObserver.observe(toggle, { attributes: true, attributeFilter: ["aria-expanded"] });
  }

  function hide() {
    if (isHidden) return;
    isHidden = true;
    gsap.to(navbar, { yPercent: -100, duration: 0.4, ease: "power3.inOut" });
  }

  function show() {
    if (!isHidden) return;
    isHidden = false;
    gsap.to(navbar, { yPercent: 0, duration: 0.35, ease: "power3.out" });
  }

  const unsubScroll = Scroll.add((data: any) => {
    const { scroll, direction } = data;

    if (isMenuOpen) return;

    if (scroll < SCROLL_THRESHOLD) {
      show();
      lastScroll = scroll;
      return;
    }

    if (direction === 1 && scroll > lastScroll) {
      hide();
    } else if (direction === -1) {
      show();
    }

    lastScroll = scroll;
  });

  onDestroy(() => {
    menuObserver?.disconnect();
    unsubScroll();
    gsap.set(navbar, { clearProps: "transform" });
    Scroll.start();
  });

  State.on("PAGE", () => {
    Scroll.start();
  });
}
