import type { RunData } from 'speedcontrol/types'
import type { RunDataActiveRunSurrounding, TwitchCommercialTimer } from 'speedcontrol/types/schemas'
import { useListenFor, useReplicant } from '@nodecg/react-hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { Helpers } from '../helpers'
import useCurrentRun from '../hooks/useCurrentRun'
import useNextRun from '../hooks/useNextRun'
import { render } from '../render'
import { UpcomingRun } from './components/intermission/UpcomingRun'
import Intermission_Box1 from './img/intermission/bgs/1box.png'
import Intermission_Box2 from './img/intermission/bgs/2box.png'
import Intermission_Box3 from './img/intermission/bgs/3box.png'
import Intermission_Fade from './img/intermission/bgs/fade.png'
import Intermission_MarathonEnd from './img/intermission/bgs/marathonend.png'
import Intermission_MediaBox_Logo from './img/intermission/bgs/mediabox-logo.png'
import Intermission_Label_Intermission from './img/intermission/labels/intermission.png'
import Intermission_Label_StreamEnd from './img/intermission/labels/stream_ending.png'
import Intermission_Label_StreamStart from './img/intermission/labels/stream_starting.png'
import './css/common.css'
import './css/Flex.css'
import './css/Fade.css'

type IntermissionType =
  | 'START OF MARATHON'
  | 'INTERMISSION'
  | 'END OF DAY'
  | 'START OF DAY'
  | 'FINAL RUN'
  | 'END OF MARATHON'
  | null

interface IntermissionRunData {
  run: RunData
  etaUntil: string
}

function timeFormat(duration: number): string {
  const hrs = ~~(duration / 3600)
  const mins = ~~((duration % 3600) / 60)
  const secs = ~~duration % 60

  let ret = ''

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`
  }

  ret += `${mins}:${secs < 10 ? '0' : ''}`
  ret += `${secs}`

  return ret
}

export function Intermission() {
  const [intermissionType, setIntermissionType] = useState<IntermissionType>(null)
  const [intermissionRunData, setIntermissionRunData] = useState<IntermissionRunData[]>([])

  const currentRun = useCurrentRun()
  const nextRun = useNextRun()
  const [runs] = useReplicant<RunData[]>('runDataArray', { bundle: 'nodecg-speedcontrol' })
  const [surroundingRuns] = useReplicant<RunDataActiveRunSurrounding>(
    'runDataActiveRunSurrounding',
    { bundle: 'nodecg-speedcontrol' },
  )
  const [twitchCommercialTimer] = useReplicant<TwitchCommercialTimer>(
    'twitchCommercialTimer',
    { bundle: 'nodecg-speedcontrol' },
  )

  const timeRefreshTimeout = useRef<NodeJS.Timeout | number>(0)
  const isUpdatingRef = useRef(false)

  const run1PlayersRef = useRef(null)
  const run2PlayersRef = useRef(null)
  const run3PlayersRef = useRef(null)
  const adTimerRef = useRef(null)

  useListenFor('endOfMarathon', () => {
    setIntermissionType('END OF MARATHON')
    setIntermissionRunData([])
    clearTimeout(timeRefreshTimeout.current)
  })

  useListenFor('clearIntermission', () => {
    clear()
  })

  useEffect(() => {
    update()
  }, [])

  useEffect(() => {
    console.log(currentRun)
    if (!currentRun)
      clear()

    update()
  }, [currentRun])

  useEffect(() => {
    clearTimeout(timeRefreshTimeout.current)
    timeRefreshTimeout.current = setTimeout(updateRunTimes, 30 * 1000)
    return () => clearTimeout(timeRefreshTimeout.current)
  }, [intermissionRunData])

  const adsAreRunning = useMemo(() => {
    return (twitchCommercialTimer && twitchCommercialTimer.secondsRemaining > 0) || false
  }, [twitchCommercialTimer])

  const adTimer = useMemo(() => {
    if (twitchCommercialTimer && twitchCommercialTimer.secondsRemaining >= 0) {
      return timeFormat(twitchCommercialTimer.secondsRemaining)
    }
    else {
      return ''
    }
  }, [twitchCommercialTimer])

  function clear() {
    clearTimeout(timeRefreshTimeout.current)
    setIntermissionRunData([])
    setIntermissionType(null)
  }

  function update() {
    clear()
    if (!(currentRun && runs?.length && surroundingRuns))
      return

    const currentRunIndex = runs.findIndex(run => run.id === currentRun.id)
    const nextRunIndex = runs.findIndex(run => run.id === nextRun?.id)
    const intermissionRuns: IntermissionRunData[] = []

    const indexToUse = currentRun.gameTwitch !== 'Just Chatting' && nextRunIndex > -1 ? currentRunIndex : nextRunIndex

    for (let i = indexToUse; i < Math.min(indexToUse + 3, runs.length); i++) {
      const run = runs[i]
      if (!run)
        break
      if (run.gameTwitch === 'Just Chatting' && i !== runs.length - 1)
        break // Don't break if it's the final run
      intermissionRuns.push({ run, etaUntil: Helpers.timeToRun(run) })
    }

    // Ensure the final run is included if it wasn’t already
    const lastRun = runs[runs.length - 1]
    if (lastRun && !intermissionRuns.some(r => r.run.id === lastRun.id)) {
      intermissionRuns.push({ run: lastRun, etaUntil: Helpers.timeToRun(lastRun) })
    }

    if (currentRun.gameTwitch === 'Just Chatting') {
      setIntermissionType('END OF DAY')
    }
    else {
      let type: IntermissionType = 'INTERMISSION'
      if (!surroundingRuns.previous) {
        type = 'START OF MARATHON'
      }
      else if (runs.find(run => run.id === surroundingRuns.previous)?.gameTwitch === 'Just Chatting') {
        type = 'START OF DAY'
      }
      if (lastRun && currentRun.id === lastRun.id) {
        type = 'FINAL RUN'
      }
      console.log(type)
      setIntermissionType(type)
    }

    setIntermissionRunData(intermissionRuns)
  }

  function updateRunTimes() {
    if (isUpdatingRef.current)
      return

    isUpdatingRef.current = true
    setIntermissionRunData(intermissionRunData.map(run => ({ run: run.run, etaUntil: Helpers.timeToRun(run.run) })))
    isUpdatingRef.current = false
  }

  return (
    <div>
      <div id="backgrounds">
        {intermissionType !== 'END OF MARATHON' && (
          <>
            <img
              className="bg"
              style={{ zIndex: 10 }}
              src={Intermission_MediaBox_Logo}
            />
            <img
              className="bg"
              src={Intermission_Fade}
            />
            <img
              className="bg"
              style={{ display: intermissionRunData.length === 1 ? 'inline' : 'none' }}
              src={Intermission_Box1}
            />
            <img
              className="bg"
              style={{ display: intermissionRunData.length === 2 ? 'inline' : 'none' }}
              src={Intermission_Box2}
            />
            <img
              className="bg"
              style={{ display: intermissionRunData.length > 2 ? 'inline' : 'none' }}
              src={Intermission_Box3}
            />
          </>
        )}
        <img
          className="bg"
          style={{
            display: ['START OF MARATHON', 'START OF DAY'].includes(intermissionType as string) ? 'inline' : 'none',
          }}
          src={Intermission_Label_StreamStart}
        />
        <img
          className="bg"
          style={{
            display: intermissionType === 'END OF DAY' ? 'inline' : 'none',
          }}
          src={Intermission_Label_StreamEnd}
        />
        <img
          className="bg"
          style={{
            display: ['INTERMISSION', 'FINAL RUN'].includes(intermissionType as string) ? 'inline' : 'none',
          }}
          src={Intermission_Label_Intermission}
        />
        <img
          className="bg"
          style={{
            display: intermissionType === 'END OF MARATHON' ? 'inline' : 'none',
          }}
          src={Intermission_MarathonEnd}
        />
      </div>

      {intermissionRunData[0] && (
        <div
          style={{
            position: 'fixed',
            top: '239px',
            left: '86px',
            height: '200px',
            width: '887px',
          }}
        >
          <p
            style={{
              lineHeight: '5px',
              fontFamily: 'slope_operaregular',
              fontSize: '30px',
              overflow: 'visible',
              whiteSpace: 'nowrap',
              position: 'absolute',
              top: '0px',
              left: '280px',
            }}
          >
            {intermissionRunData[0].etaUntil}
          </p>
          <UpcomingRun
            run={intermissionRunData[0].run}
            style={{
              position: 'absolute',
              top: '65px',
              height: '102px',
              width: '887px',
              lineHeight: '40px',
            }}
          />
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={intermissionRunData[0].run.id}
              nodeRef={run1PlayersRef}
              in
              appear
              timeout={1000}
              classNames="fade"
            >
              <p
                style={{
                  position: 'absolute',
                  top: '35px',
                  lineHeight: '5px',
                  fontFamily: 'slope_operaregular',
                  fontSize: '30px',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                  marginTop: '160px',
                  color: '#C736FF',
                }}
                ref={run1PlayersRef}
              >
                {Helpers.formatPlayers(intermissionRunData[0].run)}
              </p>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}

      {intermissionRunData[1] && (
        <div
          style={{
            position: 'fixed',
            top: '530px',
            left: '86px',
            height: '200px',
            width: '887px',
          }}
        >
          <p
            style={{
              lineHeight: '5px',
              fontFamily: 'slope_operaregular',
              fontSize: '30px',
              overflow: 'visible',
              whiteSpace: 'nowrap',
              position: 'absolute',
              top: '0px',
              left: '430px',
            }}
          >
            {intermissionRunData[1].etaUntil}
          </p>
          <UpcomingRun
            run={intermissionRunData[1].run}
            style={{
              position: 'absolute',
              top: '65px',
              height: '102px',
              width: '887px',
              lineHeight: '40px',
            }}
          />
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={intermissionRunData[1].run.id}
              nodeRef={run2PlayersRef}
              in
              appear
              timeout={1000}
              classNames="fade"
            >
              <p
                style={{
                  position: 'absolute',
                  top: '35px',
                  lineHeight: '5px',
                  fontFamily: 'slope_operaregular',
                  fontSize: '30px',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                  marginTop: '160px',
                  color: '#C736FF',
                }}
                ref={run2PlayersRef}
              >
                {Helpers.formatPlayers(intermissionRunData[1].run)}
              </p>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}

      {intermissionRunData[2] && (
        <div
          style={{
            position: 'fixed',
            top: '820px',
            left: '86px',
            height: '200px',
            width: '887px',
          }}
        >
          <p
            style={{
              lineHeight: '5px',
              fontFamily: 'slope_operaregular',
              fontSize: '30px',
              overflow: 'visible',
              whiteSpace: 'nowrap',
              position: 'absolute',
              top: '0px',
              left: '225px',
            }}
          >
            {intermissionRunData[2].etaUntil}
          </p>
          <UpcomingRun
            run={intermissionRunData[2].run}
            style={{
              position: 'absolute',
              top: '65px',
              height: '102px',
              width: '887px',
              lineHeight: '40px',
            }}
          />
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={intermissionRunData[2].run.id}
              nodeRef={run3PlayersRef}
              in
              appear
              timeout={1000}
              classNames="fade"
            >
              <p
                style={{
                  position: 'absolute',
                  top: '35px',
                  lineHeight: '5px',
                  fontFamily: 'slope_operaregular',
                  fontSize: '30px',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                  marginTop: '160px',
                  color: '#C736FF',
                }}
                ref={run3PlayersRef}
              >
                {Helpers.formatPlayers(intermissionRunData[2].run)}
              </p>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}

      <CSSTransition
        nodeRef={adTimerRef}
        in={adsAreRunning && intermissionType !== 'END OF MARATHON'}
        timeout={1000}
        classNames="fade"
      >
        <div
          style={{
            position: 'fixed',
            fontSize: '36px',
            right: '109px',
            bottom: '15px',
            width: '670px',
            height: '60px',
            textAlign: 'center',
          }}
        >
          Ads are running:
          <span
            style={{ color: '#4fbafe' }}
          >
            {adTimer}
          </span>
        </div>
      </CSSTransition>
    </div>
  )
}

render(<Intermission />)
