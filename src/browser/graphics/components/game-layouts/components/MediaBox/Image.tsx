import type { MediaBoxImages } from '@gtam-layouts/types'
import { useMemo } from 'react'

interface Props {
  images: MediaBoxImages
  useWidescreenImages: boolean
}

export function MediaBoxImage({ images, useWidescreenImages }: Props) {
  const image = useMemo(() => {
    return useWidescreenImages ? images.widescreen : images.standard
  }, [images, useWidescreenImages])
  return (
    <div
      id="MediaBoxImage"
      className="Flex"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        verticalAlign: 'middle',
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
      }}
    >
      {image && image.name && (
        <img
          key={image.name}
          src={image.url}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        />
      )}
    </div>
  )
}
