import * as PIXI from 'pixi.js'
import * as PIXIEvents from "@pixi/events"

delete PIXI.Renderer.__plugins.interaction;

const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    backgroundColor: 0xffffff,
})
document.body.appendChild(app.view);

if(!('events' in app.renderer)){
    app.renderer.addSystem(PIXIEvents.EventSystem,"events")
}

function getDist(point1, point2){
    return Math.sqrt(
        Math.pow(point2.x - point1.x,2) +
        Math.pow(point2.y - point1.y,2)
    );
}

function getAngle(point1, point2){
    return Math.atan2(
        point2.x - point1.x,
        point2.y - point1.y
    );
}

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const brush = PIXI.Sprite.from('brush.png').texture


let size = 0.01;
let brush_alpha = 0.5;
let brush_spread_n = 0.5/size;

const circle = app.stage.addChild(new PIXI.Graphics()
    .beginFill(0x000000)
    .drawCircle(0,0,size*55/2)
    .endFill()
);

let render_screen = app.renderer.screen;
circle.position.set(render_screen.width / 2, render_screen.height / 2);


let isDrawing = false;
let lastPoint;

app.stage.interactive = true;

app.stage.hitArea = render_screen;


app.stage.addEventListener('pointerdown',(e) => {
    isDrawing = true;
    lastPoint = {x: e.clientX,y: e.clientY};
    let w = brush.width*size;
    let h = brush.height*size;

    graphics.beginTextureFill({
        texture: brush,
        alpha: brush_alpha,
        matrix: new PIXI.Matrix(size,0,0,size,lastPoint.x-w/2,lastPoint.y-h/2)
    });
    
    //graphics.beginFill(0x000000);
    graphics.drawRect(lastPoint.x-w/2,lastPoint.y-h/2,w,h);
    //graphics.drawCircle(0,0,15);
    graphics.endFill();
})

app.stage.addEventListener('pointermove',(e) => {
    circle.position.copyFrom(e.global);
    if (!isDrawing) return;
    let currentPoint = { x: e.clientX, y:e.clientY};
    let dist = getDist(lastPoint, currentPoint);
    let angle = getAngle(lastPoint, currentPoint);
    for(let i = 0; i <= dist; i++){
        let origin_x = lastPoint.x + (Math.sin(angle) * i);
        let origin_y = lastPoint.y + (Math.cos(angle) * i);
        for(let j = 0;j < brush_spread_n; j++){
            let brush_spread_x = (Math.random()-0.5)*size*100;
            let brush_spread_y = (Math.random()-0.5)*size*100;
            let x = origin_x + brush_spread_x
            let y = origin_y + brush_spread_y
            let brush_spread_size = (Math.random() + 3)/4
            let w = brush.width*size*brush_spread_size
            let h = brush.height*size*brush_spread_size
            graphics.beginTextureFill({
                texture: brush,
                alpha:brush_alpha,
                matrix: new PIXI.Matrix(size,0,0,size,x-w/2,y-h/2)
            });
        
            graphics.drawRect(x-w/2,y-h/2,w,h);
            //graphics.drawCircle(0,0,15);
            graphics.endFill();
        }
    }
    lastPoint = currentPoint;
    
});

app.stage.addEventListener('pointerup',(e) => {
    isDrawing = false;
})
