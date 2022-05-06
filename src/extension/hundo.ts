import needle from "needle";
import { get } from "./util/nodecg";
import { Configschema, HundoTrackerData } from "@gtam-layouts/types/schemas";

const nodecg = get();
const port = (nodecg.bundleConfig as Configschema).hundo.port;
const hundoTrackerData = nodecg.Replicant<HundoTrackerData>(
  "hundoTrackerData",
  { defaultValue: [] }
);

async function updateData(): Promise<void> {
  try {
    const resp = await needle("get", `http://localhost:${port}/playerdata`);
    hundoTrackerData.value = resp.body;
  } catch (err) {
    nodecg.log.warn("[Hundo Tracker] Error updating data");
    nodecg.log.debug("[Hundo Tracker] Error updating data", err);
  }
}

updateData();

setInterval(() => {
  updateData();
}, 3000);
