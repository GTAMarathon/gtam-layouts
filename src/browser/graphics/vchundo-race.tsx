import { render } from '../render'
import { CompletionTable } from './components/vchundo-race/CompletionTable'
import { Player } from './components/vchundo-race/Player'
import { Timer } from './components/vchundo-race/Timer'
import VCHundoBg from './img/vchundo-race/annual_hundo.png'
import VCHundoPlates from './img/vchundo-race/annual_hundo_plates.png'
import './css/vchundo.css'
import './css/Fade.css'
import './css/Flex.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export function VCHundoRace() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={VCHundoBg} />
        <img className="bg" src={VCHundoPlates} />
      </div>
      <Timer style={{ left: '145px', top: '750px', width: '450px', height: '112px', fontSize: '32px' }} />
      <Player
        style={{ left: '221px', top: '494px', width: '300px', height: '62px' }}
        size={45}
        team={1}
      />
      <Player
        style={{ left: '1030px', top: '381px', width: '300px', height: '62px' }}
        size={45}
        team={2}
      />
      <Player
        style={{ left: '1620px', top: '381px', width: '300px', height: '62px' }}
        size={45}
        team={3}
      />
      <Player
        style={{ left: '1030px', top: '824px', width: '300px', height: '62px' }}
        size={45}
        team={4}
      />
      <Player
        style={{ left: '1620px', top: '824px', width: '300px', height: '62px' }}
        size={45}
        team={5}
      />
      <CompletionTable style={{ width: '1921px', height: '193px', bottom: '0px' }} />
    </div>
  )
}

render(<VCHundoRace />)
