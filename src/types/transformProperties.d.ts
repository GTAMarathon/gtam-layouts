export interface TransformProperties {
  alignment: number;
  boundsAlignment: number;
  boundsHeight: number;
  boundsType:
    | 'OBS_BOUNDS_NONE'
    | 'OBS_BOUNDS_STRETCH'
    | 'OBS_BOUNDS_SCALE_INNER'
    | 'OBS_BOUNDS_SCALE_OUTER'
    | 'OBS_BOUNDS_SCALE_TO_WIDTH'
    | 'OBS_BOUNDS_SCALE_TO_HEIGHT'
    | 'OBS_BOUNDS_MAX_ONLY';
  boundsWidth: number;
  cropBottom: number;
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  height: number;
  positionX: number;
  positionY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  sourceHeight: number;
  sourceWidth: number;
  width: number;
  [k: string]: any;
}
