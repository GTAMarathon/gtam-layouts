import { render } from '../render'
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
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <div
          id="topBorder"
          style={{
            backgroundColor: '#4fbafe',
            position: 'absolute',
            width: '100%',
            height: '8px',
            zIndex: 1,
          }}
        >
        </div>
        <Ticker style={{ zIndex: 2, width: '1385px', marginTop: '12px' }} />
      </div>
    </div>

  )
}

render(<Omnibar />)
