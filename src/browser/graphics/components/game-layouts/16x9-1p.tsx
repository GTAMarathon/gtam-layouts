import L_Background from '../../img/game-layouts/16x9-1p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_1p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1377px',
          top: '844px',
          width: '550px',
          height: '130px',
          fontSize: '30px',
        }}
      />
      <Estimate
        style={{
          left: '1377px',
          top: '930px',
          width: '550px',
          height: '80px',
          fontWeight: 'regular',
          fontSize: '26px',
        }}
      />
      <Game
        style={{
          left: '384px',
          top: '874px',
          width: '985px',
          height: '80px',
          fontWeight: 'bold',
        }}
        size={60}
      />
      <Category
        style={{
          left: '384px',
          top: '945px',
          width: '985px',
          height: '50px',
          fontWeight: 'bold',
        }}
        size={40}
      />
      <Player
        style={{
          left: '10px',
          top: '240px',
          width: '365px',
          height: '93px',
          fontWeight: 'bold',
        }}
        size={56}
        team={1}
      />
    </div>
  )
}
