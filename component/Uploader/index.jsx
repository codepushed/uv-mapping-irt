import React, { useState } from 'react';
import { Cropper } from 'react-advanced-cropper';

import 'react-advanced-cropper/dist/style.css';

const Uploader = ({ onImageUpload }) => {
    const [image, setImage] = useState(null);
    const [cropData, setCropData] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setImage(url);
    };

    const handleSave = () => {
        onImageUpload(cropData);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {image && (
                <Cropper
                    src={image}
                    onCrop={(crop) => setCropData(crop)}
                    stencilProps={{ aspectRatio: 1 }}
                />
            )}
            <button onClick={handleSave}>Apply Texture</button>
        </div>
    );
};

export default Uploader;
