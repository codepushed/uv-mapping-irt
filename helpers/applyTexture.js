import * as THREE from 'three';

export const applyTexture = (model, textureData) => {
    const texture = new THREE.TextureLoader().load(textureData);
    model.material.map = texture;
    model.material.needsUpdate = true;
};
