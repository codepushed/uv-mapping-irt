import React, { useRef, useState } from "react";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

const ImageCropper = ({ onImageCrop }) => {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      canvas.toBlob(async (blob) => {
        const croppedUrl = URL.createObjectURL(blob);
        onImageCrop(croppedUrl);
      });
    }
   
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <>
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ width: "20%", height: "20%", position: "absolute" }}
            aspectRatio={1}
            className="Cropper"
          />
          <button onClick={handleCrop}>Apply Crop</button>
        </>
      )}
    </div>
  );
};

export default ImageCropper;
