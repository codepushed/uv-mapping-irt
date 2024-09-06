// App.js
import React, { useState } from 'react';
import UVMapEditor from '../component/UVMapEditor';
import ModelViewer from '../component/ModelViewer'

const App = () => {
  const [texture, setTexture] = useState(null);
  const [imageProps, setImageProps] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const uvMapSrc = '/fulluv.png'; // Path to your UV map image

  const handleImageChange = (imageUrl) => {
    setTexture(imageUrl);
  };

  const handleImageUpdate = (props) => {
    setImageProps(props);
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <ModelViewer imageProps={imageProps} texture={texture} />
      </div>
      <div style={{ width: '50%' }}>
        <UVMapEditor uvMapSrc={uvMapSrc} onImageChange={handleImageChange} onImageUpdate={handleImageUpdate} />
      </div>
    </div>
  );
};

export default App;
