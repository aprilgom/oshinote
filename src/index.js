import * as PIXI from 'pixi.js'
import * as PIXIEvents from "@pixi/events"

delete PIXI.Renderer.__plugins.interaction;
//PIXI.settings.FILTER_MULTISAMPLE = PIXI.MSAA_QUALITY.HIGH
const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    resolution: devicePixelRatio,
    backgroundColor: 0xffffff,
    //autoResize:true,
    width: innerWidth,
    height: innerHeight
})
document.body.appendChild(app.view);
let windowTopBar = document.createElement('div')
windowTopBar.style.width = "100%"
windowTopBar.style.height = "32px"
//windowTopBar.style.backgroundColor = "#000"
windowTopBar.style.alpha = 0
windowTopBar.style.position = "absolute"
windowTopBar.style.top = windowTopBar.style.left = 0
windowTopBar.style.webkitAppRegion = "drag"
document.body.appendChild(windowTopBar)


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
    )
}
const background = new PIXI.Sprite.from('background.jpg')
app.stage.addChild(background)
background.width = app.screen.width
background.height = app.screen.height
const textures = []
const base64_textures = window.myAPI.getTextures()
for(let i = 0;i<base64_textures.length;i++){
    //console.log(base64_textures[i])
    let bt
    if(base64_textures[i] === null){
        bt = new PIXI.Texture(PIXI.Texture.EMPTY)
    }else{
        bt = new PIXI.Texture.from(base64_textures[i])
    }
    textures.push(bt)
}


const canvas_container = new PIXI.Container()
app.stage.addChild(canvas_container)

const gr_area = new PIXI.Sprite()
gr_area.width = app.screen.width
gr_area.height = app.screen.height

const graphics = new PIXI.Graphics()

const canvas = new PIXI.Sprite()
//canvas.filters = [new PIXI.filters.FXAAFilter()]
if(textures.length !== 0){
    canvas.texture = textures[0]
}

canvas_container.addChild(canvas)
canvas_container.addChild(gr_area)
canvas_container.addChild(graphics)

let current_page_n = 0;

function makeButton(x,y,width,height,texture){
    let button = new PIXI.Sprite(texture)
    button.width = width;
    button.height = height;
    button.x = x;
    button.y = y;
    button.interactive = true;
    button.buttonMode = true;
    return button
}

function movePage(page_n){
    let texture = app.renderer.generateTexture(canvas_container,
        {
            scaleMode: PIXI.SCALE_MODES.LINEAR
        }
    )
    if(textures[current_page_n] === null){
        textures.push(texture)
    }else{
        textures[current_page_n] = texture
    }
    current_page_n = page_n;
    graphics.clear()
    canvas.texture.destroy(true)
    canvas.texture = textures[current_page_n]
}
function nextPage(){
    movePage(current_page_n+1)
}
function prevPage(){
    if(current_page_n === 0){
        return
    }
    movePage(current_page_n-1)
}
function onButtonOver(){
    this.isOver = true;
}
function onButtonOut(){
    this.isOver = false;
}
let button_texture = new PIXI.Texture(PIXI.Texture.WHITE);

const next_button = makeButton(
    app.screen.width,
    0,
    30,
    app.screen.height,
    button_texture,
)
next_button.anchor.set(1,0);
next_button.alpha = 0.5
next_button.tint = 0x000000;
next_button.on('pointerdown',nextPage)
    .on('pointerover',onButtonOver)
    .on('pointerout',onButtonOut)
let next_button_alpha_ease = 0;
app.ticker.add((delta) => {
    if(next_button.isOver){
        next_button_alpha_ease += 0.1;
    }else{
        next_button_alpha_ease -= 0.1;
    }
    if(next_button_alpha_ease < 0){
        next_button_alpha_ease = 0;
    }
    if(next_button_alpha_ease >= 1){
        next_button_alpha_ease = 1;
    }
    next_button.alpha = 0.5*Math.atan(next_button_alpha_ease)
})

app.stage.addChild(next_button)

const prev_button = makeButton(
    0,
    0,
    30,
    app.screen.height,
    button_texture,
)
prev_button.alpha = 0
prev_button.tint = 0x000000;
prev_button.on('pointerdown',prevPage)
    .on('pointerover',onButtonOver)
    .on('pointerout',onButtonOut)
let prev_button_alpha_ease = 0;
app.ticker.add((delta) => {
    if(prev_button.isOver){
        prev_button_alpha_ease += 0.1;
    }else{
        prev_button_alpha_ease -= 0.1;
    }
    if(prev_button_alpha_ease < 0){
        prev_button_alpha_ease = 0;
    }
    if(prev_button_alpha_ease >= 1){
        prev_button_alpha_ease = 1;
    }
    prev_button.alpha = 0.5*Math.atan(prev_button_alpha_ease)
})

app.stage.addChild(prev_button)

let size = 0.5;
//let brush_alpha = 0.5;
let click_duration = 0;

let drawingmode = "pencil"

const pencil = PIXI.Sprite.from('pencil.png').texture

let render_screen = app.renderer.screen;

let isDrawing = false;
let lastPoint;

app.stage.interactive = true;

app.stage.hitArea = render_screen;


function draw_pencil(origin_x,origin_y,dist){
    let dist_max = 3
    if(dist >= dist_max){
        dist = dist_max
    }
    let pressure = Math.atan(dist);
    if(pressure < 0.8){
        pressure = 0.8
    }
    let brush_spread_n = 0.75/size*pressure;
    for(let i = 0;i < brush_spread_n; i++){
        let brush_spread_x = (Math.random()-0.5)*size;
        let brush_spread_y = (Math.random()-0.5)*size;
        let brush_spread_dist = brush_spread_x^2 + brush_spread_y^2
        let brush_alpha = Math.cos(Math.atan(brush_spread_dist));
        let x = origin_x + brush_spread_x
        let y = origin_y + brush_spread_y
        let brush_spread_size = 0.1*size*pressure*(Math.random() + 3)/4
        let w = pencil.width*brush_spread_size
        let h = pencil.height*brush_spread_size
        let r = Math.sqrt(w)
        let brush_spread_angle = Math.random()*Math.PI*2
        /*
        graphics.beginTextureFill({
            texture: pencil,
            alpha:brush_alpha,
            matrix: new PIXI.Matrix(1,0,0,1,x-pencil.width/2,y-pencil.height/2).rotate(brush_spread_angle)
        });
        */
        let tex_mat = new PIXI.Matrix()
            .translate(-pencil.width/2,-pencil.height/2)
            //.rotate(brush_spread_angle)
            .scale(brush_spread_size,brush_spread_size)
            .translate(x,y)
            .rotate(brush_spread_angle)
        graphics.beginTextureFill({
            texture: pencil,
            alpha:brush_alpha,
            matrix: tex_mat
        });
        graphics.drawRect(x-w/2,y-h/2,w,h);
        //graphics.drawCircle(x,y,r)
        graphics.endFill();
    }
}

function eraser(origin_x,origin_y){
    canvas.mask = graphics;
    graphics
        .beginFill(0x000000,1)
        .drawRect(0,0,app.screen.width,app.screen.height)
        .beginHole()
        .drawCircle(origin_x,origin_y,55*size)
        .endHole()
        .endFill();
    let texture = app.renderer.generateTexture(
        canvas_container
    )
    canvas.texture.destroy(true)
    canvas.texture = texture
    canvas.mask = null;
    graphics.clear()
}

app.stage.addEventListener('pointerdown',(e) => {
    isDrawing = true;
    click_duration = 0;
    lastPoint = {x: e.clientX,y: e.clientY};
    /*
    if(drawingmode == "pencil"){
        draw_pencil(lastPoint.x,lastPoint.y,1)
    }else{
        eraser(lastPoint.x,lastPoint.y);
    }
    */
})

app.stage.addEventListener('rightdown',(e)=>{
    if(drawingmode == "pencil"){
        drawingmode = "eraser"
    }else{
        drawingmode = "pencil"
    }
})


app.stage.addEventListener('pointermove',(e) => {
    if (!isDrawing) return;
    click_duration++;
    let currentPoint = { x: e.clientX, y:e.clientY};
    let dist = getDist(lastPoint, currentPoint);
    let angle = getAngle(lastPoint, currentPoint);
    for(let i = 0; i <= dist; i++){
        let origin_x = lastPoint.x + (Math.sin(angle) * i);
        let origin_y = lastPoint.y + (Math.cos(angle) * i);
        if(drawingmode == "pencil"){
            draw_pencil(origin_x,origin_y,dist)
        }else{
            eraser(origin_x,origin_y);
        }
    }
    lastPoint = currentPoint;
});

app.stage.addEventListener('pointerup',(e) => {
    isDrawing = false;
    let texture = app.renderer.generateTexture(
        canvas_container
    )
    base64_textures[current_page_n] = app.renderer.plugins.extract.base64(texture)
    window.myAPI.saveTextures(base64_textures)
    canvas.texture.destroy(true)
    canvas.texture = texture
    if(canvas.mask !== null){
        canvas.mask = null
    }
    graphics.clear()
})