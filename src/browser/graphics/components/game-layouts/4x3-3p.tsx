import L_Background from '../../img/game-layouts/4x3-3p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_4x3_3p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1304px',
          top: '705px',
          width: '606px',
          height: '125px',
          fontSize: '45px',
        }}
      />
      <Estimate
        style={{
          left: '1304px',
          top: '815px',
          width: '606px',
          height: '75px',
          fontWeight: 'regular',
          fontSize: '32px',
        }}
      />
      <Game
        style={{
          left: '700px',
          top: '720px',
          width: '520px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={80}
      />
      <Category
        style={{
          left: '700px',
          top: '780px',
          width: '520px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={50}
      />
      <Player
        style={{
          left: '0px',
          top: '473px',
          width: '643px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={50}
        team={1}
      />
      <Player
        style={{
          left: '643px',
          top: '473px',
          width: '640px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={50}
        team={2}
      />
      <Player
        style={{
          left: '1280px',
          top: '473px',
          width: '640px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={50}
        team={3}
      />
    </div>
  )
}
