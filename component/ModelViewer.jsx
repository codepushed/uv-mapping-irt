import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ModelViewer = ({ txt, imageProps }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelScene, setModelScene] = useState();
  const [gltfScene, setGLTFScene] = useState();
  const mountRef = useRef(null);
  const textureRef = useRef(null);
  const modelMeshRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    setModelScene(scene);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight); // Adjust the size as needed
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 1);
    scene.add(ambientLight);

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.ShadowMaterial({
      opacity: 1,
      color: "gray",
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.y = -0;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);


    

    // Load your model here
    const loader = new GLTFLoader();

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(txt);

   

    loader.load("/shoppingBag.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(5, 5, 5); 
      setGLTFScene(model);
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });
      scene.add(model); 


      const findMesh = (object) => {
        if (object.isMesh) return object;
        for (let child of object.children) {
          const result = findMesh(child);
          if (result) return result;
        }
        return null;
      };

      modelMeshRef.current = findMesh(model);
      if (modelMeshRef.current) {
        setIsModelLoaded(true);
      } else {
        console.error("No mesh found in the loaded model");
      }

      // setIsModelLoaded(true); // Set model loaded state

      // Apply initial texture and UV mapping
      if (txt) {
        updateTexture(txt);
      }
      if (imageProps) {
        updateUVs(imageProps);
      }
    });

    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 1, 5); // Adjust camera position

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, [isModelLoaded, txt]);

  const updateTexture = (textureUrl) => {
  const model = modelMeshRef.current;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureUrl);

    gltfScene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
      }
    });
       
  };

  const updateUVs = ({ x, y, width, height }) => {
    if (modelMeshRef.current && modelMeshRef.current.geometry) {
      const geometry = modelMeshRef.current.geometry;
      const uvAttribute = geometry.attributes.uv;
      // Adjust UV mapping based on the image properties
      for (let i = 0; i < uvAttribute.count; i++) {
        const u = uvAttribute.getX(i);
        const v = uvAttribute.getY(i);
        uvAttribute.setX(i, u * (width / 100) + x / 100);
        uvAttribute.setY(i, v * (height / 100) + y / 100);
      }
      uvAttribute.needsUpdate = true; // Notify Three.js that UVs have changed
    } else {
      console.warn("Model mesh reference is not available.");
    }
  };

  useEffect(() => {
    if (isModelLoaded) {
      if (txt) {
        updateTexture(txt);
      }
      if (imageProps) {
        updateUVs(imageProps);
      }
    }
  }, [imageProps, txt, isModelLoaded]);

  // console.log(imageProps, "image coordinates")

  // useEffect(() => {
  //   if (texture && textureRef.current) {
  //     textureRef.current.image.src = texture; // Update texture image
  //     textureRef.current.needsUpdate = true; // Notify Three.js that texture needs to be updated
  //   }
  // }, [texture]);

  const handleApplyTexture = () => {
    if (txt && isModelLoaded) {
      updateTexture(txt);
    } else {
      console.warn("Model is not loaded or texture URL is not provided");
    }
  };

  return (
    <>
      <button onClick={handleApplyTexture}>Apply Texture</button>
      <div ref={mountRef}></div>
    </>
  );
};

export default ModelViewer;
