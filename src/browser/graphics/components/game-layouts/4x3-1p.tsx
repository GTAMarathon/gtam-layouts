import L_Background from '../../img/game-layouts/4x3-1p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { MediaBox } from './components/MediaBox'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_4x3_1p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '0px',
          top: '479px',
          width: '570px',
          height: '75px',
          fontSize: '26px',
        }}
      />
      <Estimate
        style={{
          left: '0px',
          top: '545px',
          width: '570px',
          height: '65px',
          fontWeight: 'regular',
          fontSize: '24px',
        }}
      />
      <Game
        style={{
          left: '12.5px',
          top: '345px',
          width: '550px',
          height: '75px',
          fontWeight: 'bold',
        }}
        size={60}
      />
      <Category
        style={{
          left: '0px',
          top: '403px',
          width: '570px',
          height: '62px',
          fontWeight: 'bold',
        }}
        size={35}
      />
      <Player
        style={{
          left: '12.5px',
          top: '241px',
          width: '550px',
          height: '91px',
          fontWeight: 'bold',
        }}
        size={56}
        team={1}
      />
      <MediaBox
        style={{
          left: '7.5px',
          bottom: '75px',
          width: '551px',
          height: '384px',
          fontSize: '30px',
        }}
      />
    </div>
  )
}
