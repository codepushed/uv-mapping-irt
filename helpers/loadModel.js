// src/helpers/loadModel.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



// Function to extract UV map from the model and render on a canvas
export const extractUVMap = (geometry, material) => {
    if (!geometry || !geometry.attributes.uv) return;

    const uvArray = geometry.attributes.uv.array;
    const imageSize = 1024;  // Set your UV map canvas size
    const canvas = document.createElement('canvas');
    canvas.width = imageSize;
    canvas.height = imageSize;
    const context = canvas.getContext('2d');

    // Optionally, fill the canvas with the UV layout grid (lines between UVs)
    context.fillStyle = '#ddd';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#000';
    context.beginPath();

    // Draw UV lines
    for (let i = 0; i < uvArray.length; i += 6) {
        const uvs = [
            { u: uvArray[i], v: uvArray[i + 1] },
            { u: uvArray[i + 2], v: uvArray[i + 3] },
            { u: uvArray[i + 4], v: uvArray[i + 5] }
        ];

        context.moveTo(uvs[0].u * imageSize, (1 - uvs[0].v) * imageSize);
        context.lineTo(uvs[1].u * imageSize, (1 - uvs[1].v) * imageSize);
        context.lineTo(uvs[2].u * imageSize, (1 - uvs[2].v) * imageSize);
        context.lineTo(uvs[0].u * imageSize, (1 - uvs[0].v) * imageSize);
    }
    context.stroke();

    // Return the canvas element to display in the UI
    return canvas;
};
