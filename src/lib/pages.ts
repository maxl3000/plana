import {
  createCycles,
  runMount,
  runPageIn,
} from "@/modules/_";
import { tick } from "@/utils/tick";

export function runInitial() {
  createCycles();
  runPageIn();
  runMount();
  tick.restoreFpsDisplay();
}
