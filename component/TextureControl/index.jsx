import React, { useState } from 'react';

import ModelViewer from '../ModelRenderer';
import UvMapCanvas from '../UvMapsCanvas';
import ImageUploader from '../Uploader';

const TextureControl = () => {
    const [model, setModel] = useState(null);
    const [texture, setTexture] = useState(null);

    const handleImageUpload = (cropData) => {
        // Apply the cropped image as texture
        setTexture(cropData);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '80%' }}>
                <ModelViewer texture={texture} />
            </div>
            <div style={{ width: '50%' }}>
                {/* <UvMapCanvas model={model} /> */}
                {/* <ImageUploader onImageUpload={handleImageUpload} /> */}
            </div>
        </div>
    );
};

export default TextureControl;
