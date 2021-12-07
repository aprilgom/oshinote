import { fabric } from 'fabric';

let canvas = new fabric.Canvas('c');

canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas,{
    width: 70,
    opacity: 0.6,
    color: "#ff0000"
});