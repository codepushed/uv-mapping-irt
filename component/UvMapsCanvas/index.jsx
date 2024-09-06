import React, { useEffect, useRef } from 'react';

import { drawUVMap } from '../../helpers/drawUVMap';

const UvMapsCanvas = ({ model }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (model && canvasRef.current) {
            drawUVMap(canvasRef.current, model);
        }
    }, [model]);

    return <canvas ref={canvasRef} width="512" height="512" />;
};

export default UvMapsCanvas;
