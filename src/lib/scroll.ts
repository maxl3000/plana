import Lenis from "lenis";
import gsap from "./gsap";
import { handleEditor } from "@webflow/detect-editor";

type SubscriberFn = (data: any) => void;

// (*) TODO: disable on webflow editor

const CONSENT_SELECTORS = "[fs-consent-instance], [fs-consent-element], .consent_prefs_list";

const SCROLL_CONFIG = {
  infinite: false,
  lerp: 0.1,
  smoothWheel: true,
  touchMultiplier: 2,
  // autoResize: true,
  prevent: (node: HTMLElement) => node.closest(CONSENT_SELECTORS) !== null,
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

  #locks = new Set<string>();

  lock(reason: string) {
    this.#locks.add(reason);
    this.stop();
  }

  unlock(reason: string) {
    this.#locks.delete(reason);
    if (this.#locks.size === 0) this.start();
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

  bodyLocked ? Scroll.lock("body-overflow") : Scroll.unlock("body-overflow");
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

// Consent Pro V2: lock page scroll while banner or preferences panel is visible.
// `data-lenis-prevent` on scrollable consent containers ensures inner scroll
// still works natively even while Lenis page-scroll is stopped.
const root = document.documentElement;

function tagConsentElements() {
  document
    .querySelectorAll<HTMLElement>(CONSENT_SELECTORS)
    .forEach((el) => el.setAttribute("data-lenis-prevent", ""));
}

root.addEventListener("consentpro:banner-shown", () => {
  tagConsentElements();
  Scroll.lock("consent-banner");
});
root.addEventListener("consentpro:banner-hidden", () => Scroll.unlock("consent-banner"));
root.addEventListener("consentpro:preferences-shown", () => {
  tagConsentElements();
  Scroll.lock("consent-preferences");
});
root.addEventListener("consentpro:preferences-hidden", () => Scroll.unlock("consent-preferences"));

tagConsentElements();
const bannerEl = document.querySelector<HTMLElement>('[fs-consent-element="banner"]');
if (bannerEl && bannerEl.offsetParent !== null) {
  Scroll.lock("consent-banner");
}
