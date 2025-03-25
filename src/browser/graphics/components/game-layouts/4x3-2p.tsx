import L_Background from '../../img/game-layouts/4x3-2p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { MediaBox } from './components/MediaBox'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_4x3_2p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '1285px',
          top: '785px',
          width: '635px',
          height: '150px',
          fontSize: '36px',
        }}
      />
      <Estimate
        style={{
          left: '1285px',
          top: '905px',
          width: '635px',
          height: '75px',
          fontWeight: 'regular',
          fontSize: '30px',
        }}
      />
      <Game
        style={{
          left: '659px',
          top: '824px',
          width: '600px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '652.5px',
          top: '890px',
          width: '615px',
          height: '100px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '12.5px',
          top: '708px',
          width: '610px',
          height: '85px',
          fontWeight: 'bold',
        }}
        size={50}
        team={1}
      />
      <Player
        style={{
          left: '1297.5px',
          top: '708px',
          width: '610px',
          height: '85px',
          fontWeight: 'bold',
        }}
        size={50}
        team={2}
      />
      <MediaBox
        style={{
          left: '7.5px',
          bottom: '75px',
          width: '621px',
          height: '226px',
          fontSize: '30px',
        }}
      />
    </div>
  )
}
