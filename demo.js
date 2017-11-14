/**
 * Created by bh on 11/14/17.
 */

const RADIUS = 200;

let _dragging = false;
let _x = 2000;
let _y = 800;
let _vx = 0;
let _vy = 0;
let _ax = 0;
let _ay = 0;


function drawDashCircle(context, x, y, radius, startAngle=0, nDash=5) {
    // Arc 2 empty 1
    let unit = 2 * Math.PI / nDash / 3;
    let arcLen = unit * 2;
    let step = unit * 3;
    context.lineWidth = 15;
    context.lineCap = "round";
    context.strokeStyle = "gray";
    for(var i=0; i<nDash; ++i) {
        context.beginPath();
        context.arc(x, y, radius, startAngle, startAngle + arcLen);
        context.stroke();
        startAngle += step;
    }
}

function fireSpinningCircle(context, canvas) {
    const STEP = 2 * Math.PI / 300;
    const SQUAD = [canvas.width / 6, canvas.height / 6];
    let start = 0;

    window.setInterval(function() {
        context.clearRect(SQUAD[0], SQUAD[1], SQUAD[0] * 4, SQUAD[1] * 4);
        drawDashCircle(context, _x, _y, RADIUS, start);
        start += STEP;
        if(start > 2 * Math.pi) {
            start -= 2 * Math.pil
        }
        // console.log(start);
    }, 10);
}

function newton() {
    if(!_dragging) {
        _ax = -1e-2 * _vx;
        _ay = -1e-2 * _vy;
    }
    _x += _vx;
    _y += _vy;
    _vx += _ax;
    _vy += _ay;
    printMove();
}


window.onload = function() {
    let canvas = document.getElementById("container");
    let context = canvas.getContext("2d");
    canvas.width = 4000;
    canvas.height = canvas.width * window.innerHeight / window.innerWidth;
    _x = canvas.width / 2;
    _y = canvas.height / 2;

    canvas.onmousedown = function (e) {
        // Set global parameter if mouse down in the circle
        let coordinate = windowToCanvas(canvas, e.x, e.y);
        let mouse_x = coordinate[0];
        let mouse_y = coordinate[1];
        if(!inCircle(_x, _y, RADIUS, mouse_x, mouse_y)) {
            _dragging = false;
            return;
        }
        _dragging = true;
        context.arc(_x, _y, RADIUS, 0, 2 * Math.PI);
        context.fill();
    };
    canvas.onmouseup = function (e) {
        _dragging = false;
        _ax = 0;
        _ay = 0;
        console.log(_ax.toString() + "," + _ay.toString());
    };
    canvas.onmousemove = function (e) {
        // Set acceleration of the circle (linear to dist)
        if(!_dragging)
            return;
        let coordinate = windowToCanvas(canvas, e.x, e.y);
        let dx = coordinate[0] - _x;
        let dy = coordinate[1] - _y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let delta = Math.atan(dist) / 1e4;
        _ax = dx * delta;
        _ay = dy * delta;
    };



    fireSpinningCircle(context, canvas);
    window.setInterval(newton, 10);


    // drawDashCircle(context, 1000, 500, 200);

    // context.fill();
    // context.restore();
};

function windowToCanvas(canvas, x, y) {
    var box = canvas.getBoundingClientRect();
    return [(x - box.left) * (canvas.width / box.width), (y - box.top) * (canvas.height / box.height)];
}

function inCircle(x, y, radius, point_x, point_y) {
    let dx = x - point_x;
    let dy = y - point_y;
    return (dx * dx + dy * dy) < (radius * radius);
}

function printMove() {
    document.getElementById("xy").innerHTML = "X: " + _x.toString() + " Y: " + _y.toString();
    document.getElementById("vxy").innerHTML = "Vx: " + _vx.toString() + " Vy: " + _vy.toString();
    document.getElementById("axy").innerHTML = "Ax: " + _ax.toString() + " Ay: " + _ay.toString();

}