import L_Background from '../../img/game-layouts/16x9-2p-onsite.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_2p_Onsite() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1255px',
          top: '820px',
          width: '635px',
          height: '150px',
          fontSize: '38px',
        }}
      />
      <Estimate
        style={{
          left: '1255px',
          top: '930px',
          width: '635px',
          height: '75px',
          fontWeight: 'regular',
          fontSize: '30px',
        }}
      />
      <Game
        style={{
          left: '1255px',
          top: '660px',
          width: '635px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '1255px',
          top: '719px',
          width: '635px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '12.5px',
          top: '540px',
          width: '671px',
          height: '92px',
          fontSize: '24px',
        }}
        size={56}
        team={1}
      />
      <Player
        style={{
          left: '1236.5px',
          top: '540px',
          width: '671px',
          height: '92px',
          fontSize: '24px',
        }}
        size={56}
        team={2}
      />
    </div>
  )
}
