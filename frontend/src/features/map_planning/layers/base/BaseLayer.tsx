import { NextcloudKonvaImage } from '../../components/image/NextcloudKonvaImage';
import { MAP_PIXELS_PER_METER } from '../../utils/Constants';
import Konva from 'konva';
import { useCallback, useState } from 'react';
import { Layer } from 'react-konva';
import useMapStore from '../../store/MapStore';

type BaseLayerProps = Konva.LayerConfig;

const BaseLayer = (props: BaseLayerProps) => {
  const { listening, ...layerProps } = props
  const trackedState = useMapStore((map) => map.trackedState);

  /** Filepath to the background image in Nextcloud. */
  const nextcloudImagePath = trackedState.layers.base.nextcloudImagePath
  /** Used to align the size of the background image with the real world. */
  const pixelsPerMeter = trackedState.layers.base.scale
  /** The amount of rotation required to align the base layer with geographic north. */
  const rotation = trackedState.layers.base.rotation

  // It shouldn't matter whether the image path starts with a slash or not.
  // TODO: not sure if needed: double slash in a path is OK
  let cleanImagePath = nextcloudImagePath;
  if (cleanImagePath.startsWith('/')) {
    cleanImagePath = cleanImagePath.substring(1);
  }

  // Make sure that the image is centered on, and rotates around, the origin.
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const onload = useCallback((image: HTMLImageElement) => {
    setImageOffset({ x: image.width / 2, y: image.height / 2 });
  }, []);

  const scale = pixelsPerMeter / MAP_PIXELS_PER_METER;

  return (
    <Layer {...layerProps} >
      {cleanImagePath && (
        <NextcloudKonvaImage
          path={cleanImagePath}
          onload={onload}
          rotation={rotation ?? 0}
          scaleX={scale}
          scaleY={scale}
          offset={imageOffset}
        />
      )}
    </Layer>
  );
};

export default BaseLayer;
