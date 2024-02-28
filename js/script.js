const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let mousemoved = false;

const pointer ={
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
};
const params = {
    pointsNumber:50,
    widthFactor:5,
    mouseThreshold: 0.5,
    spring:0.25,
    friction:0.5,
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++){
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    };
}
window.addEventListener('click',(e)=>{
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener('mousemove', (e) =>{
    mousemoved=true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener('touchmove', (e) =>{
    mousemoved=true;
    updateMousePosition(e.touches[0].pageX, e.touches[0].pageY);
});
function updateMousePosition(eX, eY){
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener('resize', setupCanvas);

function update(t){
    if (!mousemoved){
        pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t)* Math.sin(0.005 * t));
        window.innerWidth;
        pointer.y = (0.5 + 0.2 * Math.sin(0.005 * t)+ 0.1 * Math.cos(0.001 * t));
        window.innerHeight;
    }
    ctx.clearRect (0,0, canvas.width, canvas.height);
    trail.forEach((p,pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    var gradient = ctx.createLinearGradient(0,0, canvas.width, canvas.height);
    gradient.addColorStop(0, "rgb(58,131,226, 1)");
    gradient.addColorStop(1, "rgb(57,34,115,1)");

    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++){
        const xc = 0.5 *(trail[i].x + trail[i+1].x);
        const yc = 0.5 *(trail[i].y + trail[i+1].y);
        ctx.lineWidth=params.widthFactor* (params.pointsNumber-1);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length -1].x, trail[trail.length -1].y);
    ctx.stroke();
    window.requestAnimationFrame(update);
}

function setupCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
