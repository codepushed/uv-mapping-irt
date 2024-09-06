export const drawUVMap = (canvas, model) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const geometry = model.geometry;
    const uv = geometry.attributes.uv.array;
    
    for (let i = 0; i < uv.length; i += 6) {
        ctx.beginPath();
        ctx.moveTo(uv[i] * canvas.width, (1 - uv[i+1]) * canvas.height);
        ctx.lineTo(uv[i+2] * canvas.width, (1 - uv[i+3]) * canvas.height);
        ctx.lineTo(uv[i+4] * canvas.width, (1 - uv[i+5]) * canvas.height);
        ctx.closePath();
        ctx.stroke();
    }
};
