import needle from "needle";
import { get } from "./util/nodecg";
import { Configschema } from "@gtam-layouts/types/schemas";
import { hundoTrackerData } from "./util/replicants";

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).hundo;

async function updateData(): Promise<void> {
  try {
    const resp = await needle(
      "get",
      `http://localhost:${config.port}/playerdata`
    );
    hundoTrackerData.value = resp.body;
  } catch (err) {
    nodecg.log.warn("[Hundo Tracker] Error updating data");
    nodecg.log.debug("[Hundo Tracker] Error updating data", err);
  }
}

if (config.enabled) {
  updateData();
}

if (config.enabled) {
  setInterval(() => {
    updateData();
  }, 3000);
}
