import L_Background from '../../img/game-layouts/16x9-2p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_2p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1285px',
          top: '685px',
          width: '635px',
          height: '150px',
          fontSize: '44px',
        }}
      />
      <Estimate
        style={{
          left: '1285px',
          top: '820px',
          width: '635px',
          height: '74px',
          fontSize: '36px',
        }}
      />
      <Game
        style={{
          left: '659px',
          top: '730px',
          width: '600px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '652.5px',
          top: '789px',
          width: '615px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '12.5px',
          top: '530px',
          width: '611px',
          height: '92px',
          fontSize: '24px',
        }}
        size={56}
        team={1}
      />
      <Player
        style={{
          left: '1296.5px',
          top: '530px',
          width: '611px',
          height: '92px',
          fontSize: '24px',
        }}
        size={40}
        team={2}
      />
    </div>
  )
}
