import type { MerchItem, MerchQueueItem } from '@gtam-layouts/types'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from '../../../../css/components/MerchAlert.module.css'

interface Props {
  merchInfo: MerchQueueItem
}

export function MediaBoxMerchAlert({ merchInfo }: Props) {
  const { name, items } = merchInfo

  const [currentItem, setCurrentItem] = useState<MerchItem | undefined>(
    items.length > 0 && items[0] ? items[0] : undefined,
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const merchContainerRef = useRef(null)

  useEffect(() => {
    if (!items.length)
      return

    setCurrentItem(items[currentIndex])

    const timeout = setTimeout(() => {
      if (!(currentIndex + 1 >= items.length)) {
        setCurrentIndex(prev => prev++)
      }
    }, 20000 / items.length)

    return () => clearTimeout(timeout)
  }, [currentIndex, items])

  const getItemImage = (item: string): string => {
    try {
      return new URL(`./merch/${item}.png`, import.meta.url).href
    }
    catch {
      return new URL('./emotes/gtaPOGGERS.png', import.meta.url).href
    }
  }

  return (
    <>
      {merchInfo && currentItem && (
        <div id="MediaBoxMerchAlert" style={{ width: '100%', height: '100%' }}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentItem.name}
              nodeRef={merchContainerRef}
              in
              appear
              timeout={1000}
              classNames="fade"
            >
              <div
                style={{ textShadow: '2px 2px 2px #12222c', gap: '20px' }}
                className={styles['Flex']}
                ref={merchContainerRef}
              >
                <img src={getItemImage(currentItem.name)} />
                <span>
                  <b className={styles['highlight']}>{name}</b>
                  has bought
                  <b className={styles['highlight']}>
                    {currentItem.quantity}
                    x
                    &nbsp;
                    {currentItem.name}
                  </b>
                  !
                </span>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}
    </>
  )
}
