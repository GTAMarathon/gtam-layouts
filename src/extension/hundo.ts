import type { Configschema } from '@gtam-layouts/types'
import { get } from '@gtam-layouts/util/nodecg'
import { hundoTrackerData } from '@gtam-layouts/util/replicants'
import { TaggedLogger } from '@gtam-layouts/util/tagged-logger'
import needle from 'needle'

const nodecg = get()
const config = (nodecg.bundleConfig as Configschema).hundo
const logger = new TaggedLogger('Hundo Tracker')

async function updateData(): Promise<void> {
  try {
    const resp = await needle('get', `http://localhost:${config.port}/playerdata`)
    hundoTrackerData.value = resp.body
  }
  catch (error) {
    logger.warn(`Error updating data: ${error}`)
  }
}

if (config.enabled) {
  updateData()

  setInterval(() => {
    updateData()
  }, 3000)
}
