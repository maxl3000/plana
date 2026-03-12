import { onMount, onDestroy } from "@/modules/_";

const EMBED_BASE = "https://iframe.mediadelivery.net/embed";
const PLAYERJS_URL = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";

let playerjsLoadPromise: Promise<typeof window.playerjs> | null = null;

function loadPlayerJs(): Promise<typeof window.playerjs> {
  if (typeof window !== "undefined" && (window as unknown as { playerjs?: typeof window.playerjs }).playerjs) {
    return Promise.resolve((window as unknown as { playerjs: typeof window.playerjs }).playerjs);
  }
  if (playerjsLoadPromise) return playerjsLoadPromise;
  playerjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYERJS_URL;
    script.async = true;
    script.onload = () => resolve((window as unknown as { playerjs: typeof window.playerjs }).playerjs);
    script.onerror = () => reject(new Error("Player.js failed to load"));
    document.head.appendChild(script);
  });
  return playerjsLoadPromise;
}

function parseBool(val: string | undefined, fallback: boolean): boolean {
  if (val === undefined) return fallback;
  return val === "true" || val === "1";
}

function buildEmbedUrl(library: string, video: string, dataset: DOMStringMap): string {
  const params = new URLSearchParams();

  if (dataset.autoplay !== undefined) params.set("autoplay", dataset.autoplay);
  else params.set("autoplay", "false");

  if (dataset.muted !== undefined) params.set("muted", dataset.muted);
  if (dataset.loop !== undefined) params.set("loop", dataset.loop);
  if (dataset.preload !== undefined) params.set("preload", dataset.preload);
  else params.set("preload", "true");

  if (dataset.start !== undefined) params.set("t", String(dataset.start));
  if (dataset.playsinline !== undefined) params.set("playsinline", dataset.playsinline);
  if (dataset.rememberPosition !== undefined) params.set("rememberPosition", dataset.rememberPosition);
  if (dataset.captions !== undefined) params.set("captions", dataset.captions);
  if (dataset.chromecast !== undefined) params.set("chromecast", dataset.chromecast);
  if (dataset.disableAirplay !== undefined) params.set("disableAirplay", dataset.disableAirplay);
  if (dataset.disableIosPlayer !== undefined) params.set("disableIosPlayer", dataset.disableIosPlayer);
  if (dataset.showHeatmap !== undefined) params.set("showHeatmap", dataset.showHeatmap);
  if (dataset.showSpeed !== undefined) params.set("showSpeed", dataset.showSpeed);

  const query = params.toString();
  return `${EMBED_BASE}/${library}/${video}${query ? `?${query}` : ""}`;
}

function ensurePreconnect(): void {
  if (document.querySelector('link[href="https://iframe.mediadelivery.net"]')) return;
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = "https://iframe.mediadelivery.net";
  document.head.appendChild(link);
}

/**
 * Bunny.net video player module.
 * Use data-module="bunny" with data-library and data-video (required).
 * Optional: data-thumbnail, data-autoplay, data-muted, data-loop, data-preload,
 * data-start, data-fullscreen, data-playsinline, data-remember-position, data-captions.
 */
export default function bunny(element: HTMLElement, dataset: DOMStringMap) {
  const library = dataset.library;
  const video = dataset.video;
  const thumbnail = dataset.thumbnail;

  if (!library || !video) {
    console.warn("[bunny] data-library and data-video are required");
    return;
  }

  ensurePreconnect();

  element.classList.add("bunny-player");

  const iframeWrap = document.createElement("div");
  iframeWrap.className = "bunny-player__iframe-wrap";

  const iframe = document.createElement("iframe");
  iframe.className = "bunny-player__iframe";
  iframe.src = buildEmbedUrl(library, video, dataset);
  iframe.loading = "lazy";
  iframe.setAttribute(
    "allow",
    "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
  );
  iframe.allowFullscreen = parseBool(dataset.fullscreen, true);

  iframeWrap.appendChild(iframe);
  element.appendChild(iframeWrap);

  let posterEl: HTMLDivElement | null = null;
  let playerInstance: { on: (event: string, fn: () => void) => void } | null = null;

  const hidePoster = () => {
    if (posterEl) {
      element.classList.add("bunny-player--playing");
      posterEl.style.pointerEvents = "none";
    }
  };

  if (thumbnail) {
    posterEl = document.createElement("div");
    posterEl.className = "bunny-player__poster";
    posterEl.setAttribute("aria-hidden", "true");
    posterEl.style.backgroundImage = `url(${thumbnail})`;
    posterEl.style.backgroundSize = "cover";
    posterEl.style.backgroundPosition = "center";
    element.insertBefore(posterEl, iframeWrap);

    const handleClick = () => {
      hidePoster();
      posterEl?.removeEventListener("click", handleClick);
    };
    posterEl.addEventListener("click", handleClick);

    onMount(() => {
      loadPlayerJs()
        .then((playerjs) => {
          playerInstance = new playerjs.Player(iframe);
          playerInstance.on("play", hidePoster);
        })
        .catch(() => {
          iframe.addEventListener("load", () => setTimeout(hidePoster, 150), { once: true });
        });
    });
  }

  onDestroy(() => {
    playerInstance = null;
  });
}
