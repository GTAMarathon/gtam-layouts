import L_Background from '../../img/game-layouts/16x9-4p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { MediaBox } from './components/MediaBox'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_4p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '777px',
          top: '557px',
          width: '366px',
          height: '80px',
          fontSize: '32px',
        }}
      />
      <Estimate
        style={{
          left: '777px',
          top: '630px',
          width: '366px',
          height: '55px',
          fontWeight: 'regular',
          fontSize: '28px',
        }}
      />
      <Game
        style={{
          left: '798px',
          top: '246px',
          width: '326px',
          height: '65px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '798px',
          top: '320px',
          width: '326px',
          height: '50px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '0px',
          top: '427px',
          width: '768px',
          height: '107px',
        }}
        size={50}
        team={1}
      />
      <Player
        style={{
          left: '1152px',
          top: '427px',
          width: '768px',
          height: '107px',
        }}
        size={50}
        team={2}
      />
      <Player
        style={{
          left: '0px',
          top: '936px',
          width: '768px',
          height: '107px',
        }}
        size={50}
        team={3}
      />
      <Player
        style={{
          left: '1152px',
          top: '936px',
          width: '768px',
          height: '107px',
        }}
        size={50}
        team={4}
      />
      <MediaBox
        style={{
          left: '779.5px',
          bottom: '75px',
          width: '360px',
          height: '249px',
          fontSize: '30px',
        }}
      />
    </div>
  )
}
