import { useEffect } from 'react'

interface Props {
  message: string
  time: number
  onEnd: () => void
}

export function GenericMessage({ message, time, onEnd }: Props) {
  useEffect(() => {
    console.log('GenericMessage: Mounted')
    const timeout = setTimeout(() => {
      console.log('GenericMessage: End')
      onEnd()
    }, time * 1000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      id="GenericMessage"
      style={{ fontSize: '40px' }}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}
