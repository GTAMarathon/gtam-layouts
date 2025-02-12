import type { Configschema } from '@gtam-layouts/types'
import type {
  ExtensionReturn,
  RunDataTeam,
  SendMessageArgsMap,
} from 'speedcontrol/types'
import { TaggedLogger } from '@gtam-layouts/util/tagged-logger'
import needle from 'needle'
import parseDuration from 'parse-duration'
import { get } from './util/nodecg'
import { runDataActiveRun, timer } from './util/replicants'

const logger = new TaggedLogger('Polls and Predictions')
const nodecg = get()
const config = (nodecg.bundleConfig as Configschema).betting
const speedcontrol = nodecg.extensions[
  'nodecg-speedcontrol'
] as unknown as ExtensionReturn

const predictionEndpoint = '/predictions'
const pollEndpoint = '/polls'

const currentPrediction = nodecg.Replicant<Prediction | undefined>(
  'currentPrediction',
  { defaultValue: undefined, persistent: true, persistenceInterval: 10000 },
)
const currentPoll = nodecg.Replicant<Poll | undefined>('currentPoll', {
  defaultValue: undefined,
  persistent: true,
  persistenceInterval: 10000,
})

const config2 = (nodecg.bundleConfig as Configschema).highlight

currentPrediction.on('change', (newValue) => {
  if ((newValue as any) === '') {
    currentPrediction.value = undefined
  }
})
currentPoll.on('change', (newValue) => {
  if ((newValue as any) === '') {
    currentPoll.value = undefined
  }
})

enum PredictionType {
  GoalTime,
  Winner,
  Estimate,
}

enum PredictionStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  RESOLVED = 'RESOLVED',
  CANCELED = 'CANCELED',
}

interface Prediction {
  id: string
  runId: string
  type: PredictionType
  outcomes: { id: string, teamId: string }[]
  goalTime?: number
  status: PredictionStatus
}
interface Poll {
  id: string
  runId: string
}

(async () => {
  if (currentPrediction.value) {
    logger.log('check currentPrediction')
    const status = await getPredictionStatus(currentPrediction.value.id)
    if (!status) {
      currentPrediction.value = undefined
    }
    else if (
      status === PredictionStatus.ACTIVE
      || status === PredictionStatus.LOCKED
    ) {
      logger.log('currentPrediction checked')
      currentPrediction.value.status = status
    }
    else {
      logger.log('currentPrediction is old')
      currentPrediction.value = undefined
    }
  }

  runDataActiveRun.on('change', async (newVal, oldVal) => {
    try {
      if (config.enable && newVal && (!oldVal || oldVal.id !== newVal.id)) {
        logger.log('Run detected')
        await new Promise(f => setTimeout(f, 5000)) // wait 5s to make sure the timer has been reset
        if (currentPoll.value && currentPoll.value.runId !== newVal.id) {
          await endPoll(currentPoll.value.id)
        }
        if (
          currentPrediction.value
          && currentPrediction.value.runId !== newVal.id
        ) {
          await cancelPrediction(currentPrediction.value.id)
        }
        if (
          newVal.customData.betting
          && !currentPoll.value
          && !currentPrediction.value
          && newVal.teams.length > 0
          && timer.value!.state === 'stopped'
        ) {
          logger.log('New Bet')
          if (newVal.teams.length === 1) {
            if (newVal.customData.goalTime) {
              await createPredictionGoalTime(
                newVal.id,
                'Final time for the run?', // 45 characters limit
                newVal.customData.goalTime,
                1800,
                newVal.teams[0].id,
              )
            }
            else {
              // if no goal time, make a prediction about the estimate
              await createPredictionEstimate(newVal.id, 1800, newVal.teams[0].id)
            }
          }
          else if (newVal.teams.length < 11) {
            await createPredictionWinner(
              newVal.id,
              'Who will win the race?', // 45 characters limit
              newVal.teams,
              1800,
            )
          }
        }
      }
    }
    catch (err) {
      logger.error('error', err)
    }
  })

  timer.on('change', (newVal, oldVal) => {
    if (newVal) {
      if (currentPrediction.value) {
        if (
          currentPrediction.value.type === PredictionType.GoalTime
          && currentPrediction.value.goalTime
        ) {
          // goal time prediction
          if (
            newVal.milliseconds >= currentPrediction.value.goalTime
            || (newVal.state === 'finished'
              && newVal.teamFinishTimes[
                currentPrediction.value.outcomes[0].teamId
              ]
              && newVal.teamFinishTimes[currentPrediction.value.outcomes[0].teamId]
                .state === 'forfeit')
          ) {
            // LOSER
            resolvePrediction(
              currentPrediction.value.id,
              currentPrediction.value.outcomes[1].id,
            )
          }
          else if (
            newVal.state === 'finished'
            && newVal.milliseconds < currentPrediction.value.goalTime
          ) {
            // GG
            resolvePrediction(
              currentPrediction.value.id,
              currentPrediction.value.outcomes[0].id,
            )
          }
        }
        else if (currentPrediction.value.type === PredictionType.Winner) {
          // race winner prediction
          if (
            oldVal
            && oldVal.state !== 'finished'
            && newVal.state === 'finished'
          ) {
            let teamFinishTimes = currentPrediction.value.outcomes.map(
              (outcome) => {
                return newVal.teamFinishTimes[outcome.teamId]
              },
            )
            teamFinishTimes = teamFinishTimes.filter(
              teamFinishTime =>
                teamFinishTime && teamFinishTime.state === 'completed',
            )
            teamFinishTimes.sort((a, b) => a.milliseconds - b.milliseconds)
            if (
              teamFinishTimes.length < 2
              || teamFinishTimes[0].milliseconds === teamFinishTimes[1].milliseconds
            ) {
              cancelPrediction(currentPrediction.value.id)
            }
            else {
              const teamId = Object.keys(newVal.teamFinishTimes).find(
                key => newVal.teamFinishTimes[key] === teamFinishTimes[0],
              )
              const winningOutcome = currentPrediction.value.outcomes.filter(
                outcome => outcome.teamId === teamId,
              )
              if (winningOutcome.length > 0) {
                resolvePrediction(
                  currentPrediction.value.id,
                  winningOutcome[0].id,
                )
              }
              else {
                cancelPrediction(currentPrediction.value.id)
              }
            }
          }
        }
        else if (currentPrediction.value.type === PredictionType.Estimate) {
          // estimate prediction
          if (
            newVal.milliseconds / 1000 >= runDataActiveRun.value!.estimateS!
            || (newVal.state === 'finished'
              && newVal.teamFinishTimes[
                currentPrediction.value.outcomes[0].teamId
              ]
              && newVal.teamFinishTimes[currentPrediction.value.outcomes[0].teamId]
                .state === 'forfeit')
          ) {
            // OVERESTIMATE
            resolvePrediction(
              currentPrediction.value.id,
              currentPrediction.value.outcomes[1].id,
            )
          }
          else if (
            newVal.state === 'finished'
            && newVal.milliseconds / 1000 < runDataActiveRun.value!.estimateS!
          ) {
            // UNDERESTIMATE
            resolvePrediction(
              currentPrediction.value.id,
              currentPrediction.value.outcomes[0].id,
            )
          }
        }
      }

      if (oldVal && oldVal.state === 'stopped' && newVal.state === 'running') {
        if (currentPoll.value) {
          endPoll(currentPoll.value.id)
        }
        if (
          currentPrediction.value
          && currentPrediction.value.status === PredictionStatus.ACTIVE
        ) {
          lockPrediction(currentPrediction.value.id)
        }
      }
    }
  })
})()

function getTeamNameForPollOrPrediction(team: RunDataTeam): string {
  if (team.name) {
    return team.name
  }
  else if (team.players.length === 1) {
    return team.players[0].name
  }
  else if (team.players.length > 1) {
    return `${team.players[0].name} et al.`
  }
  else {
    return team.id
  }
}

async function createPoll(
  runId: string,
  title: string,
  choices: string[],
  duration: number,
): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: pollEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title,
        choices: choices.map((choice) => {
          return { title: choice }
        }),
        duration,
      },
      newAPI: true,
    }
    const resp = await speedcontrol.sendMessage('twitchAPIRequest', data)
    currentPoll.value = {
      id: resp.body.data[0].id,
      runId,
    }
    logger.log('Poll created')
  }
  catch (err) {
    logger.error('Failed to create a new Poll', err)
    currentPoll.value = undefined
  }
}
async function endPoll(id: string): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: pollEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id,
        status: 'TERMINATED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data)
    logger.log('Poll ended')
  }
  catch (err) {
    logger.error('Failed to end Poll', err)
  }
  finally {
    currentPoll.value = undefined
  }
}

async function getPredictionStatus(
  predictionId: string,
): Promise<PredictionStatus | undefined> {
  logger.log('get the Prediction', predictionId)
  try {
    const endpoint
      = `${predictionEndpoint
      }?broadcaster_id=${
        config.broadcaster_id
      }&id=${
        predictionId}`
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'get',
      endpoint,
      newAPI: true,
    }
    const resp = await speedcontrol.sendMessage('twitchAPIRequest', data)
    if (
      resp.body.data
      && resp.body.data.length === 1
      && resp.body.data[0].id === predictionId
    ) {
      logger.log(
        'get the Prediction status',
        resp.body.data[0],
      )
      return resp.body.data[0].status as PredictionStatus
    }
    else {
      logger.log(
        'Failed to get the Prediction',
        JSON.stringify(resp),
      )
      throw new Error(`Prediction doesnt exist \n${JSON.stringify(resp)}`)
    }
  }
  catch (err) {
    logger.error('Failed to get the Prediction', err)
  }
}
async function createPredictionWinner(
  runId: string,
  title: string,
  teams: RunDataTeam[],
  duration: number,
): Promise<void> {
  if (teams.length < 11) {
    await createPredictionWinnerWithAPI(runId, title, teams, duration)
  }
}
async function createPredictionWinnerWithAPI(
  runId: string,
  title: string,
  teams: RunDataTeam[],
  duration: number,
) {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title,
        outcomes: teams.map((team) => {
          return { title: getTeamNameForPollOrPrediction(team) }
        }),
        prediction_window: duration,
      },
      newAPI: true,
    }
    const resp = await speedcontrol.sendMessage('twitchAPIRequest', data)
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId,
      type: PredictionType.Winner,
      outcomes: teams.map((team, index) => {
        return { id: resp.body.data[0].outcomes[index].id, teamId: team.id }
      }),
      status: PredictionStatus.ACTIVE,
    }
    logger.log('Prediction created')
  }
  catch (err) {
    logger.error(
      'Failed to create a new Prediction',
      err,
    )
    currentPrediction.value = undefined
  }
}
async function createPredictionWinnerWithGQL(
  runId: string,
  title: string,
  teams: RunDataTeam[],
  duration: number,
) {
  try {
    if (!config2.gqlOAuth || !config2.clientID) {
      throw new Error(`config2.gqlOAuth || !config2.clientID`)
    }

    const data = [
      {
        operationName: 'createPredictionEvent',
        variables: {
          input: {
            title,
            channelID: config.broadcaster_id,
            outcomes: teams.map((team) => {
              return {
                title: getTeamNameForPollOrPrediction(team),
                color: 'BLUE',
              }
            }),
            predictionWindowSeconds: duration,
          },
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              '92268878ac4abe722bcdcba85a4e43acdd7a99d86b05851759e1d8f385cc32ea',
          },
        },
      },
    ]

    const resp = await needle('post', 'https://gql.twitch.tv/gql', data, {
      headers: {
        'Authorization': `OAuth ${config2.gqlOAuth}`,
        'Client-ID': config2.clientID,
        'User-Agent': 'gtam-layouts',
        'Content-Type': 'application/json',
      },
    })

    if (resp.statusCode !== 200) {
      throw new Error(
        `Status Code: ${resp.statusCode} - Body: ${JSON.stringify(resp.body)}`,
      )
    }
    // @ts-expect-error: parser exists but isn't in the typings
    else if (resp.parser !== 'json') {
      throw new Error('Response was not JSON')
    }
    if (resp.body[0].data.createPredictionEvent.error) {
      throw new Error(
        `Status Code: createPredictionEvent error - Body: ${JSON.stringify(
          resp.body,
        )}`,
      )
    }
    if (!resp.body[0].data.createPredictionEvent.predictionEvent) {
      throw new Error(
        `Status Code: no predictionEvent error - Body: ${JSON.stringify(
          resp.body,
        )}`,
      )
    }
    currentPrediction.value = {
      id: resp.body[0].data.createPredictionEvent.predictionEvent.id,
      runId,
      type: PredictionType.Winner,
      outcomes: teams.map((team, index) => {
        return {
          id: resp.body[0].data.createPredictionEvent.predictionEvent.outcomes[
            index
          ].id,
          teamId: team.id,
        }
      }),
      status: PredictionStatus.ACTIVE,
    }

    logger.log('Prediction created')
  }
  catch (err) {
    logger.error(
      'Failed to create a new Prediction',
      err,
    )
    currentPrediction.value = undefined
    if (teams.length < 6) {
      logger.log('Creating a poll instead')
      await createPoll(
        runId,
        title, // 60 characters limit
        teams.map((team) => {
          return getTeamNameForPollOrPrediction(team)
        }),
        1800,
      )
    }
  }
}
async function createPredictionGoalTime(
  runId: string,
  title: string,
  goalTimeString: string,
  duration: number,
  teamId: string,
): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title,
        outcomes: [
          { title: `Under ${goalTimeString}` },
          { title: `${goalTimeString} or over` },
        ],
        prediction_window: duration,
      },
      newAPI: true,
    }
    const resp = await speedcontrol.sendMessage('twitchAPIRequest', data)
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId,
      type: PredictionType.GoalTime,
      outcomes: [
        { id: resp.body.data[0].outcomes[0].id, teamId },
        { id: resp.body.data[0].outcomes[1].id, teamId },
      ],
      goalTime: parseDuration(goalTimeString),
      status: PredictionStatus.ACTIVE,
    }
    logger.log('Prediction created')
  }
  catch (err) {
    logger.error(
      'Failed to create a new Prediction',
      err,
    )
    currentPrediction.value = undefined
  }
}

async function createPredictionEstimate(
  runId: string,
  duration: number,
  teamId: string,
): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title: 'Will this run be over or under the estimate?',
        outcomes: [
          { title: 'Under the estimate' },
          { title: 'Over the estimate' },
        ],
        prediction_window: duration,
      },
      newAPI: true,
    }
    const resp = await speedcontrol.sendMessage('twitchAPIRequest', data)
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId,
      type: PredictionType.Estimate,
      outcomes: [
        { id: resp.body.data[0].outcomes[0].id, teamId },
        { id: resp.body.data[0].outcomes[1].id, teamId },
      ],
      status: PredictionStatus.ACTIVE,
    }
    logger.log('Prediction created')
  }
  catch (err) {
    logger.error(
      'Failed to create a new Prediction',
      err,
    )
    currentPrediction.value = undefined
  }
}
async function lockPrediction(predictionId: string): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'LOCKED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data)
    if (currentPrediction.value) {
      currentPrediction.value.status = PredictionStatus.LOCKED
    }
    logger.log('Prediction locked')
  }
  catch (err) {
    logger.error(
      'Failed to lock the Prediction',
      err,
    )
    const status = await getPredictionStatus(predictionId)
    if (status === PredictionStatus.LOCKED) {
      if (currentPrediction.value) {
        currentPrediction.value.status = status
      }
      logger.log('Prediction already locked')
    }
    else {
      currentPrediction.value = undefined
    }
  }
}
async function resolvePrediction(
  predictionId: string,
  winnerId: string,
): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'RESOLVED',
        winning_outcome_id: winnerId,
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data)
    logger.log('Prediction resolved')
  }
  catch (err) {
    logger.error(
      'Failed to resolve the Prediction',
      err,
    )
  }
  finally {
    currentPrediction.value = undefined
  }
}
async function cancelPrediction(predictionId: string): Promise<void> {
  try {
    const data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'CANCELED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data)
    logger.log('Prediction canceled')
  }
  catch (err) {
    logger.error(
      'Failed to cancel the Prediction',
      err,
    )
  }
  finally {
    currentPrediction.value = undefined
  }
}
