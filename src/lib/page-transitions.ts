import { App } from "@/app";
import { Transition as BaseTransition } from "@unseenco/taxi";

/* -- Baseline Transition */
export class Transition extends BaseTransition {
  async onLeave({
    from,
    trigger,
    done,
  }: {
    from: Element | HTMLElement;
    trigger: string | false | HTMLElement;
    done: Function;
  }) {
    try {
      await App.pages.transitionOut({ from, trigger });
    } catch (e) {
      console.error("[Transition] onLeave error:", e);
    } finally {
      done();
    }
  }

  async onEnter({
    to,
    trigger,
    done,
  }: {
    to: Element | HTMLElement;
    trigger: string | false | HTMLElement;
    done: Function;
  }) {
    try {
      await App.pages.transitionIn({ to, trigger });
    } catch (e) {
      console.error("[Transition] onEnter error:", e);
    } finally {
      done();
    }
  }
}

/* -- ... Transition */
