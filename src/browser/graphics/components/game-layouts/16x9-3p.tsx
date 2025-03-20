import L_Background from '../../img/game-layouts/16x9-3p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_3p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1401px',
          top: '783px',
          width: '505px',
          height: '120px',
          fontSize: '40px',
        }}
      />
      <Estimate
        style={{
          left: '1401px',
          top: '883px',
          width: '505px',
          height: '100px',
          fontWeight: 'regular',
          fontSize: '30px',
        }}
      />
      <Game
        style={{
          left: '1401.5px',
          top: '565px',
          width: '505px',
          height: '200px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '1401.5px',
          top: '624px',
          width: '505px',
          height: '200px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '7.5px',
          top: '467px',
          width: '557px',
          height: '94px',
        }}
        size={52}
        team={1}
      />
      <Player
        style={{
          left: '1355.5px',
          top: '467px',
          width: '557px',
          height: '94px',
        }}
        size={52}
        team={2}
      />
      <Player
        style={{
          left: '775.5px',
          top: '467px',
          width: '370px',
          height: '92px',
        }}
        size={52}
        team={3}
      />
    </div>
  )
}
