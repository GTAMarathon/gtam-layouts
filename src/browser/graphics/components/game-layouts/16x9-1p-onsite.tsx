import L_Background from '../../img/game-layouts/16x9-1p-onsite.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { MediaBox } from './components/MediaBox'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_16x9_1p_Onsite() {
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
          top: '310px',
          width: '365px',
          height: '93px',
          fontWeight: 'bold',
        }}
        size={56}
        team={1}
      />
      <MediaBox
        style={{
          left: '7.5px',
          bottom: '75px',
          width: '365px',
          height: '598px',
          fontSize: '30px',
        }}
        useWidescreenImages
      />
    </div>
  )
}
