import { L_4x3_1p } from './4x3-1p'
import { L_4x3_2p } from './4x3-2p'
import { L_4x3_3p } from './4x3-3p'
import { L_4x3_4p } from './4x3-4p'
import { L_4x3_Bingo } from './4x3-bingo'
import { L_16x9_1p } from './16x9-1p'
import { L_16x9_2p } from './16x9-2p'
import { L_16x9_3p } from './16x9-3p'
import { L_16x9_4p } from './16x9-4p'
import { L_16x9_Bingo } from './16x9-bingo'

export {
  L_4x3_1p,
  L_4x3_2p,
  L_4x3_3p,
  L_4x3_4p,
  L_4x3_Bingo,
  L_16x9_1p,
  L_16x9_2p,
  L_16x9_3p,
  L_16x9_4p,
  L_16x9_Bingo,
}

export const layoutsList = {
  '3x2-1p': {
    name: '3x2 - 1 Player',
    code: '3x2-1p',
    component: L_4x3_1p,
  },
  '4x3-1p': {
    name: '4x3 - 1 Player',
    code: '4x3-1p',
    component: L_4x3_1p,
  },
  '4x3-2p': {
    name: '4x3 - 2 Players',
    code: '4x3-2p',
    component: L_4x3_2p,
  },
  '4x3-3p': {
    name: '4x3 - 3 Players',
    code: '4x3-3p',
    component: L_4x3_3p,
  },
  '4x3-4p': {
    name: '4x3 - 4 Players',
    code: '4x3-4p',
    component: L_4x3_4p,
  },
  '4x3-bingo': {
    name: '4x3 - Bingo',
    code: '4x3-bingo',
    component: L_4x3_Bingo,
  },
  '16x9-1p': {
    name: '16x9 - 1 Player',
    code: '16x9-1p',
    component: L_16x9_1p,
  },
  '16x9-2p': {
    name: '16x9 - 2 Players',
    code: '16x9-2p',
    component: L_16x9_2p,
  },
  '16x9-3p': {
    name: '16x9 - 3 Players',
    code: '16x9-3p',
    component: L_16x9_3p,
  },
  '16x9-4p': {
    name: '16x9 - 4 Players',
    code: '16x9-4p',
    component: L_16x9_4p,
  },
  '16x9-bingo': {
    name: '16x9 - Bingo',
    code: '16x9-bingo',
    component: L_16x9_Bingo,
  },
}

export const defaultCode = '4x3-1p'
