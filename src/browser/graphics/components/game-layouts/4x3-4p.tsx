import L_Background from '../../img/game-layouts/4x3-4p.png'
import { Category } from './components/Category'
import { Estimate } from './components/Estimate'
import { Game } from './components/Game'
import { MediaBox } from './components/MediaBox'
import { Player } from './components/Player'
import { Timer } from './components/Timer'
import '../../css/common.css'
import '../../css/Flex.css'
import '../../css/Fade.css'

export function L_4x3_4p() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={L_Background} />
      </div>
      <Timer
        style={{
          left: '745px',
          top: '538px',
          width: '426px',
          height: '100px',
          fontSize: '40px',
        }}
      />
      <Estimate
        style={{
          left: '628px',
          top: '636px',
          width: '664px',
          height: '75px',
          fontWeight: 'regular',
          fontSize: '32px',
        }}
      />
      <Game
        style={{
          left: '643px',
          top: '331px',
          width: '634px',
          height: '75px',
          fontWeight: 'bold',
        }}
        size={72}
      />
      <Category
        style={{
          left: '643px',
          top: '390px',
          width: '634px',
          height: '75px',
          fontWeight: 'bold',
        }}
        size={44}
      />
      <Player
        style={{
          left: '0px',
          top: '458px',
          width: '614px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={25}
        team={1}
      />
      <Player
        style={{
          left: '1306px',
          top: '458px',
          width: '614px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={25}
        team={2}
      />
      <Player
        style={{
          left: '0px',
          top: '965px',
          width: '614px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={25}
        team={3}
      />
      <Player
        style={{
          left: '1306px',
          top: '965px',
          width: '614px',
          height: '81px',
          fontWeight: 'bold',
        }}
        size={25}
        team={4}
      />
      <MediaBox
        style={{
          left: '625.5px',
          bottom: '75px',
          width: '669px',
          height: '245px',
          fontSize: '30px',
        }}
      />
    </div>
  )
}
