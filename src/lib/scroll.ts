import Lenis from "lenis";
import gsap from "./gsap";
import { handleEditor } from "@webflow/detect-editor";

type SubscriberFn = (data: any) => void;

// (*) TODO: disable on webflow editor

const SCROLL_CONFIG = {
  infinite: false,
  lerp: 0.1,
  smoothWheel: true,
  touchMultiplier: 2,
  // autoResize: true,
};

class _Scroll extends Lenis {
  #ticker = gsap.ticker.add((time) => this.raf(time * 1000));

  constructor() {
    super(SCROLL_CONFIG);
    this.on("scroll", this.#scroll.bind(this));
  }

  #scroll(data: any) {
    // console.log("scroll", { scroll, limit, progress, velocity, time });
    this.notify(data);
  }

  toTop() {
    this.scrollTo(0, {
      immediate: true,
    });
  }

  /** Subscribable */
  #subscribers: { fn: SubscriberFn; priority: number; id: symbol }[] = [];

  add(fn: SubscriberFn, priority = 0, id = Symbol()) {
    const index = this.#subscribers.findIndex((sub) => sub.priority > priority);
    if (index === -1) {
      this.#subscribers.push({ fn, priority, id });
    } else {
      this.#subscribers.splice(index, 0, { fn, priority, id });
    }
    return () => this.remove(id);
  }

  remove(id: symbol) {
    this.#subscribers = this.#subscribers.filter((f) => f.id !== id);
  }

  notify(data: any) {
    if (this.#subscribers.length < 1) return;
    this.#subscribers.forEach((f) => f.fn(data));
  }
}

export const Scroll = new _Scroll();

handleEditor((isEditor) => {
  if (isEditor) {
    Scroll.destroy();
  } else {
    Scroll.start();
  }
});

// Bridges external scroll-lock mechanisms (e.g. Finsweet fs-scrolldisable,
// body-scroll-lock) with Lenis. Watches both inline style and class changes
// on <body> and <html> to cover all common implementations.
const syncScrollLock = () => {
  const bodyLocked =
    document.body.style.overflow === "hidden" ||
    document.body.style.overflowY === "hidden" ||
    document.documentElement.style.overflow === "hidden";

  bodyLocked ? Scroll.stop() : Scroll.start();
};

const scrollLockObserver = new MutationObserver(syncScrollLock);

scrollLockObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["style", "class"],
});

scrollLockObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["style", "class"],
});
