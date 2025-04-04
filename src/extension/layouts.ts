import type { Configschema } from '@gtam-layouts/types'
import type { ExtensionReturn } from 'speedcontrol/types'
import { get } from '@gtam-layouts/util/nodecg'
import obs from '@gtam-layouts/util/obs'
import { TaggedLogger } from '@gtam-layouts/util/tagged-logger'
import {
  runDataActiveRun as activeRun,
  currentGameLayout,
  timer as timerRep,
} from './util/replicants'

const nodecg = get()
const { sendMessage } = nodecg.extensions[
  'nodecg-speedcontrol'
] as unknown as ExtensionReturn
const config = nodecg.bundleConfig as Configschema
const defaultCode = '4x3-1p'
const logger = new TaggedLogger('Layouts')

timerRep.on('change', (newVal, oldVal) => {
  if (oldVal && oldVal.state !== 'finished' && newVal && newVal.state === 'finished') {
    nodecg.sendMessage('clearIntermission')
  }
})

activeRun.on('change', (newVal) => {
  if (newVal) {
    // Set game layout
    if (newVal.customData.gameLayout) {
      currentGameLayout.value = newVal.customData.gameLayout
    }
    else {
      currentGameLayout.value = defaultCode
    }

    // Set bingo board URL if needed
    if (newVal.category?.includes('Bingo') && newVal.customData.bingoURL) {
      obs.updateBingoBoardURL(newVal.customData.bingoURL)
    }
  }
})

currentGameLayout.on('change', (newVal, oldVal) => {
  // Don't do anything if OBS integration is disabled or not connected
  if (!config.obs.enable || !obs.connected || !newVal)
    return

  if (newVal && oldVal) {
    if (newVal !== oldVal) {
      obs.setGameLayout(newVal || defaultCode)
    }
  }
  else {
    obs.setGameLayout(newVal || defaultCode)
  }
})

nodecg.listenFor('endOfMarathon', async (data, ack) => {
  obs.changeToIntermission().catch(() => {})
  if (ack && !ack.handled) {
    ack(null)
  }
})

nodecg.listenFor('switchToIntermission', async (data, ack) => {
  nodecg.sendMessage('clearIntermission')
  await new Promise(f => setTimeout(f, 60))

  sendMessage('twitchStartCommercial', { duration: 180 })
    .then(() => {
      logger.log('Played ads')
    })
    .catch((err: any) => {
      logger.warn('Cannot play ads: ', err)
    })
  sendMessage('changeToNextRun').catch(() => {})

  obs.changeToIntermission().catch(() => {})
  await obs.muteAudio()
  await obs.unmuteAudio()

  if (ack && !ack.handled) {
    ack(null)
  }
})

nodecg.listenFor('focusOnRunner', (data, ack) => {
  obs.focusOnRunnerX(data).catch(() => {})

  if (ack && !ack.handled) {
    ack(null)
  }
})

nodecg.listenFor('changeRunnersOnVCHundo', (data, ack) => {
  obs.changeRunnersOnVCHundo(data).catch(() => {})

  if (ack && !ack.handled) {
    ack(null)
  }
})

nodecg.listenFor('assignStreamToRunner', (data, ack) => {
  let source: string | undefined

  if (
    data.runner
    && data.stream.twitchAccount
    && data.stream
    && activeRun.value
    && activeRun.value.teams
  ) {
    const players = []
    for (const team of activeRun.value.teams) {
      for (const player of team.players) {
        players.push(player)
      }
    }

    const index = players.findIndex(playerX => playerX.id === data.runner.id)

    switch (index) {
      case 0:
        source = config.obs.names.sources.runner1
        break
      case 1:
        source = config.obs.names.sources.runner2
        break
      case 2:
        source = config.obs.names.sources.runner3
        break
      case 3:
        source = config.obs.names.sources.runner4
        break
      default:
        logger.warn('Cannot assign stream to runner: ', data.runner)
        logger.warn('Index: ', index)
        logger.warn('Players: ', players)
        break
    }
    obs
      .setTwitchUrlToSources(data.stream.twitchAccount, [source])
      .catch(() => {})

    if (ack && !ack.handled) {
      ack(null)
    }
  }
})
