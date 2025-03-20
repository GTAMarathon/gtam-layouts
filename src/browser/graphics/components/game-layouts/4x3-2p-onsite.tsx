import L_Background from '../../img/game-layouts/4x3-2p-onsite.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_4x3_2p_Onsite() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1255px',
          top: '840px',
          width: '635px',
          height: '150px',
          fontSize: '30px',
        }}
      />
      <Estimate
        style={{
          left: '1255px',
          top: '930px',
          width: '635px',
          height: '75px',
          fontWeight: 'regular',
          fontSize: '24px',
        }}
      />
      <Game
        style={{
          left: '1255px',
          top: '764px',
          width: '635px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={56}
      />
      <Category
        style={{
          left: '1255px',
          top: '805px',
          width: '635px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={40}
      />
      <Player
        style={{
          left: '12.5px',
          top: '708px',
          width: '680px',
          height: '65px',
          fontWeight: 'bold',
        }}
        size={50}
        team={1}
      />
      <Player
        style={{
          left: '1237.5px',
          top: '708px',
          width: '680px',
          height: '65px',
          fontWeight: 'bold',
        }}
        size={50}
        team={2}
      />
    </div>
  )
}
