// UVMapEditor.js
import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const UVMapEditor = ({ uvMapSrc, onImageChange, onImageUpdate }) => {
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      onImageChange(url); // Notify parent of new image
    }
  };

  const handleResize = (e, { size }) => {
    setSize(size);
    onImageUpdate({ ...position, ...size }); // Notify parent of updated size
  };

  const handleDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    onImageUpdate({ x, y, ...size }); // Notify parent of updated position
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseMove={handleDrag}
      onMouseDown={handleDrag}
    >
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <img src={uvMapSrc} alt="UV Map" style={{ width: '100%', height: '100%' }} />
      {image && (
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[50, 50]}
          maxConstraints={[500, 500]}
          onResizeStop={handleResize}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            cursor: 'move'
          }}
        >
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: size.width,
              height: size.height,
              pointerEvents: 'none'
            }}
          />
        </ResizableBox>
      )}
    </div>
  );
};

export default UVMapEditor;
