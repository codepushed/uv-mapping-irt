import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
import { extractUVMap } from "../../helpers/loadModel";

const ModelViewer = () => {
  const modelRef = useRef(null);
  const [model, setModel] = useState(null);
  const [uvMap, setUvMap] = useState(null);
  const [textureCanvas, setTextureCanvas] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [uploadedImage, setUploadedImage] = useState(null);
  const uvCanvasRef = useRef(null);
  const uvMapContainerRef = useRef(null);

  const loadModelManually = () => {
    const loader = new GLTFLoader();
    loader.load(
      "/shoppingBag.glb",
      (gltf) => {
        setModel(gltf.scene);
        processModel(gltf);
      },
      undefined,
      (error) => {
        console.error("Error loading the model:", error);
      }
    );
  };

  const processModel = (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.geometry && child.material) {
        const geometry = child.geometry;
        const material = child.material;

        // Extract UV map
        const uvCanvas = extractUVMap(geometry, material);
        if (uvCanvas) {
          setUvMap(uvCanvas.toDataURL());
          uvCanvasRef.current = uvCanvas; // Save reference to UV canvas
        }
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
  
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image onto the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        // Update the textureCanvas state
        setTextureCanvas(canvas);
        setUploadedImage(reader.result);
      };
    };
    reader.readAsDataURL(file);
  };
  

  const handleMouseMove = (event) => {
    if (uvMapContainerRef.current && uploadedImage) {
      const containerRect = uvMapContainerRef.current.getBoundingClientRect();
      const x = (event.clientX - containerRect.left) / containerRect.width;
      const y = 1 - (event.clientY - containerRect.top) / containerRect.height;
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));
      setImagePosition({ x: clampedX, y: clampedY });

      if (textureCanvas) {
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.offset.set(clampedX, clampedY);
        texture.needsUpdate = true;
        updateTextureOnModel(texture);
      }
    }
  };

  const handleImageDrag = (event) => {
    event.preventDefault();
    if (uploadedImage) {
      const containerRect = uvMapContainerRef.current.getBoundingClientRect();
      const x = (event.clientX - containerRect.left) / containerRect.width;
      const y = 1 - (event.clientY - containerRect.top) / containerRect.height;
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));
      setImagePosition({ x: clampedX, y: clampedY });
    }
  };

  const updateTextureOnModel = (texture) => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          // Apply the texture to the mesh
          child.material.map = texture;
  
          // Set texture offset and scale based on image position
          texture.offset.set(imagePosition.x, imagePosition.y);
          texture.repeat.set(1, 1); // Adjust if necessary
  
          child.material.needsUpdate = true;
        }
      });
    }
  };
  

  return (
    <div className="viewer-container">
      <Canvas>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {model && <primitive ref={modelRef} object={model} />}
        <OrbitControls />
      </Canvas>

      <button onClick={loadModelManually}>Load Model</button>

      <div
        className="uv-map"
        ref={uvMapContainerRef}
        style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid black' }}
        onMouseMove={handleMouseMove}
      >
        {uvMap && <img src={uvMap} alt="UV Map" style={{ width: '100%', height: '100%' }} />}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{
              position: 'absolute',
              top: `${imagePosition.y * 100}%`,
              left: `${imagePosition.x * 100}%`,
              width: '100px', // Adjust size as needed
              height: '100px', // Adjust size as needed
              transform: 'translate(-50%, -50%)',
              cursor: 'move',
            }}
            draggable
            onDrag={handleImageDrag}
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default ModelViewer;
