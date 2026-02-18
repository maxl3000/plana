import { onMount, onDestroy, onView } from "@/modules/_";

/**
 * Example module — shows how the data-module system works.
 *
 * Usage in Webflow:
 *   Add `data-module="example"` to any element.
 *
 * This module will:
 *  - Log to console when mounted
 *  - Toggle a class when the element enters/leaves the viewport
 *  - Clean up when destroyed (page transition)
 */
export default function (element: HTMLElement) {
  onMount(() => {
    element.classList.add("wds-loaded");
    console.log("[wds] module 'example' mounted", element);
  });

  onView(element, {
    threshold: 0.2,
    callback: ({ isIn }) => {
      element.classList.toggle("wds-in-view", isIn);
    },
  });

  onDestroy(() => {
    element.classList.remove("wds-loaded", "wds-in-view");
  });
}
