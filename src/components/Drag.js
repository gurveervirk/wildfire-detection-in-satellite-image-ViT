import React from 'react';
import { useDrag } from 'react-dnd';

const ItemType = 'item';

const DraggableItem = ({ type }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { type },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                padding: '8px',
                margin: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: type === 'Personal' ? '#ffcccb' : '#b0c4de',
            }}
        >
            {type}
        </div>
    );
};

export default DraggableItem;
