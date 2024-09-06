// src/components/ModelViewer.js
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { loadModel } from '../../helpers/loadModel';

const ModelViewer = ({ texture }) => {
    const modelRef = useRef(null);
    const [model, setModel] = useState(null); // State to store the loaded model

    useEffect(() => {
        loadModel(modelRef, setModel);
    }, []);

    useEffect(() => {
        if (modelRef.current && texture) {
            // Apply texture if available
        }
    }, [texture]);

    return (
        <Canvas>
            <ambientLight />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {model && <primitive object={model} />}  {/* Render the loaded model */}
            <OrbitControls />
        </Canvas>
    );
};

export default ModelViewer;
