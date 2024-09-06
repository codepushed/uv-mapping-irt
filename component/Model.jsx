// ModelViewer.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Basic setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Load model and texture
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/pastel.jpg'); // Change the path to your texture

    loader.load('/shoppingBag.glb', (gltf) => {
      const model = gltf.scene;

      // Apply texture to model's material
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });

      // Add model to scene
      scene.add(model);

      // Scale model to fit screen
      const bbox = new THREE.Box3().setFromObject(model);
      const size = bbox.getSize(new THREE.Vector3()).length();
      const fitScale = Math.min(window.innerWidth, window.innerHeight) / size;
      model.scale.set(fitScale, fitScale, fitScale);

      // Position the camera
      camera.position.z = 5;
    });

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ModelViewer;
