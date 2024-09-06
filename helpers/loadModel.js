// src/helpers/loadModel.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadModel = (modelRef, setModel) => {
    const loader = new GLTFLoader();

    loader.load(
        '/shoppingBag.glb', // Update the path to match your actual file location
        (gltf) => {
            modelRef.current = gltf.scene;
            setModel(gltf.scene); // Pass the loaded model to state (optional if needed)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened while loading the model', error);
        }
    );
};
