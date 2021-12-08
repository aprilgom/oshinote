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
let canvas = new PIXI.Sprite();

let size = 0.05;
let brush_alpha = 0.5;

app.stage.addChild(canvas);
app.stage.addChild(graphics);
let drawingmode = "pencil"

//brush
const pencil = PIXI.Sprite.from('pencil.png').texture



let render_screen = app.renderer.screen;


let isDrawing = false;
let lastPoint;

app.stage.interactive = true;

app.stage.hitArea = render_screen;


function draw_pencil(origin_x,origin_y){
    let brush_spread_n = 0.5/size;
    for(let i = 0;i < brush_spread_n; i++){
        let brush_spread_x = (Math.random()-0.5)*size*100;
        let brush_spread_y = (Math.random()-0.5)*size*100;
        let x = origin_x + brush_spread_x
        let y = origin_y + brush_spread_y
        let brush_spread_size = (Math.random() + 3)/4
        let w = pencil.width*size*brush_spread_size
        let h = pencil.height*size*brush_spread_size
        let brush_spread_angle = Math.random()*Math.PI*2
        graphics.beginTextureFill({
            texture: pencil,
            alpha:brush_alpha,
            matrix: new PIXI.Matrix(size,0,0,size,x-w/2,y-h/2).rotate(brush_spread_angle)
        });
        graphics.drawRect(x-w/2,y-h/2,w,h);
        graphics.endFill();
    }
}

function eraser(origin_x,origin_y){
    canvas.mask = graphics;
    graphics
        .beginFill(0x000000,1)
        .drawRect(0,0,app.screen.width,app.screen.height)
        .beginHole()
        .drawCircle(origin_x,origin_y,55*size*4)
        .endHole()
        .endFill();
    let texture = app.renderer.generateTexture(app.stage)
    canvas.texture.destroy(true)
    canvas.texture = texture
    canvas.mask = null;
    graphics.clear()
}

app.stage.addEventListener('pointerdown',(e) => {
    isDrawing = true;
    lastPoint = {x: e.clientX,y: e.clientY};
    if(drawingmode == "pencil"){
        draw_pencil(lastPoint.x,lastPoint.y)
    }else{
        eraser(lastPoint.x,lastPoint.y);
    }
})


app.stage.addEventListener('pointermove',(e) => {
    if (!isDrawing) return;
    let currentPoint = { x: e.clientX, y:e.clientY};
    let dist = getDist(lastPoint, currentPoint);
    let angle = getAngle(lastPoint, currentPoint);
    for(let i = 0; i <= dist; i++){
        let origin_x = lastPoint.x + (Math.sin(angle) * i);
        let origin_y = lastPoint.y + (Math.cos(angle) * i);
        if(drawingmode == "pencil"){
            draw_pencil(origin_x,origin_y)
        }else{
            eraser(origin_x,origin_y);
        }
    }
    lastPoint = currentPoint;
});

app.stage.addEventListener('pointerup',(e) => {
    isDrawing = false;
    let texture = app.renderer.generateTexture(app.stage)
    canvas.texture.destroy(true)
    canvas.texture = texture
    if(canvas.mask !== null){
        canvas.mask = null
    }
    graphics.clear()
    //canvas.destory()
})

app.stage.addEventListener('rightdown',(e)=>{
    if(drawingmode == "pencil"){
        drawingmode = "eraser"
    }else{
        drawingmode = "pencil"
    }
})