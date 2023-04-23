import { BaseStage } from '../components/BaseStage';
import PlantsLayer from '../layers/PlantsLayer';
import useMapStore from '@/features/undo_redo';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Rect } from 'react-konva';

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = () => {
  const state = useMapStore((map) => map.state);
  const dispatch = useMapStore((map) => map.dispatch);

  // Event listener responsible for adding a single shape to the transformer
  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const transformer = useMapStore.getState().transformer.current;

    const nodes = transformer?.getNodes() || [];
    if (!nodes.includes(node)) {
      transformer?.nodes([node]);
    }
  };

  return (
    <BaseStage>
      <PlantsLayer>
        {state.layers['plant'].objects.map((o) => (
          <Rect
            {...o}
            key={o.id}
            fill="blue"
            draggable={true}
            shadowBlur={5}
            onClick={(e) => {
              addToTransformer(e.target as Shape<ShapeConfig>);
            }}
            onDragEnd={(e) => {
              const transformer = useMapStore.getState().transformer.current;
              const nodes = transformer?.getNodes() || [];

              // workaround, because objects can be dragged without being selected...
              for (const n of nodes) {
                if (n.id() === o.id) {
                  // we return here, because selected objects are updated via the transformer
                  return;
                }
              }

              dispatch({
                type: 'OBJECT_UPDATE',
                payload: [{ ...o, x: e.target.x(), y: e.target.y() }],
              });
            }}
          />
        ))}
      </PlantsLayer>
    </BaseStage>
  );
};
