import { render } from '../render'
import { Ticker } from './components/omnibar/Ticker'
import './css/common.css'
import './css/Flex.css'
import './css/Fade.css'
import 'animate.css'

export function Omnibar() {
  return (
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
      }}
    >
      <div
        id="topBorder"
        style={{
          backgroundColor: '#c736ff',
          position: 'absolute',
          width: '100%',
          height: '4px',
          zIndex: 2,
        }}
      />
      <Ticker style={{ zIndex: 1 }} />
    </div>
  )
}

render(<Omnibar />)
