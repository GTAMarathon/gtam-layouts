import { render } from '../render'
import DonationTotal from './components/omnibar/Donationtotal'
import { Ticker } from './components/omnibar/Ticker'
import Omnibar_Background from './img/omnibar/omnibar_bg.png'
import './css/common.css'
import './css/Flex.css'
import './css/Fade.css'
import 'animate.css'

export function Omnibar() {
  return (
    <div>
      <div id="backgrounds">
        <img className="bg" src={Omnibar_Background} />
      </div>
      <div
        id="Omnibar"
        style={{
          position: 'fixed',
          width: '1920px',
          height: '74px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          backgroundColor: 'green',
        }}
      >

        <Ticker style={{ zIndex: 1, width: '100%' }} />
        <DonationTotal style={{ zIndex: 1 }} />
      </div>
    </div>

  )
}

render(<Omnibar />)
