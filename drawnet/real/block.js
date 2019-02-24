/**
 * Created by bh on 12/4/17.
 * Author: Ziyin Ma @Fudan 14307130033
 *
 * Credit to: Milo的编程 @zhuanlan.zhihu.com
 * Originally implemented in C
 */


$(function() {
    let canvas = document.getElementById('container');

    // Set canvas size
    let width = parseInt($('#left_pane').width());
    console.log('[INFO] canvas width=' + width);
    canvas.width = width;
    canvas.height = width;
    let context = canvas.getContext('2d');

    // Global constants
    const CANVAS_SIZE = width;
    const CANVAS_POS = [canvas.offsetLeft, canvas.offsetTop];

    // Solar plot constants
    const CENTER = .5;
    const RADIUS = .08;
    const N_SAMPLES = 64;
    const TWO_PI = 2 * Math.PI;
    const RANDOM_MAX = .5;
    const MAX_STEPS = 10;
    const MAX_DISTANCE = 1.;
    const EPSILON = 1e-5;
    const LUMINANCE = 1.5;

    // Crust constants
    // const CRUST_CENTER = .3;
    const CRUST_RADIUS = .04;
    const CRUST_LUMINANCE = .8;

    let CRUST_CENTER = [.3, .0];        // could be changed
    let imgData = context.createImageData(CANVAS_SIZE, CANVAS_SIZE);

    let mat = new Array(CANVAS_SIZE);
    for (let i = 0; i < CANVAS_SIZE; ++i) {
        mat[i] = new Float32Array(CANVAS_SIZE);
    }

    function norm(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    function border_dist(x, y) {
        let dx = x - CENTER;
        let dy = y - CENTER;
        return norm(dx, dy) - RADIUS;
    }


    function crust_dist(x, y) {
        return norm(x - CRUST_CENTER[0] - CENTER, y - CRUST_CENTER[1] - CENTER) - CRUST_RADIUS;
    }

    function trace(x, y, dx, dy) {
        let t = 0.;
        for (let i = 0; i < MAX_STEPS && t < MAX_DISTANCE; ++i) {
            let d1 = border_dist(x + dx * t, y + dy * t);
            let d2 = crust_dist(x + dx * t, y + dy * t);
            if (d1 < EPSILON) {
                return LUMINANCE;
            }
            if (d2 < EPSILON) {
                return CRUST_LUMINANCE;
            }
            t += Math.min(d1, d2);
        }
        return 0.;
    }

    function sample(x, y) {
        let sum = 0.;
        for (let i = 0; i < N_SAMPLES; ++i) {
            let theta = TWO_PI * (i + Math.random() / RANDOM_MAX) / N_SAMPLES;
            sum += trace(x, y, Math.cos(theta), Math.sin(theta));
        }
        return sum / N_SAMPLES;
    }

    function map() {
        let data = imgData.data;
        let render_ratio_ele = $('#render_ratio');
        for(let i=0; i<CANVAS_SIZE; ++i) {
            for(let j=0; j<CANVAS_SIZE; ++j) {
                let temp = mat[i][j];
                let index = (i * CANVAS_SIZE + j) * 4;
                data[index] = temp;
                data[index + 1] = temp;
                data[index + 2] = temp;
                data[index + 3] = 255;
            }
            render_ratio_ele.html(((i + 1) / CANVAS_SIZE * 100).toFixed(1) + '%');
            // render_ratio_ele.innerHTML = ((i + 1) / CANVAS_SIZE * 100).toFixed(1) + '%';
        }
        context.putImageData(imgData, 0, 0);
    }

    const start_time = new Date().getTime();
    function worker() {
        let tic = new Date().getTime();
        for (let i = 0.; i < CANVAS_SIZE; i++) {
            for (let j = 0.; j < CANVAS_SIZE; j++) {
                mat[i][j] = Math.min(sample(i / CANVAS_SIZE, j / CANVAS_SIZE) * 255., 255.);
            }
        }
        let toc = new Date().getTime();
        map();

        context_destroy(toc - tic);
    }

    let inClick = false;
    function context_steup() {
        $('#loader_container').css('display', 'block');
        inClick = true;
    }

    function context_destroy(time) {
        $('#loader_container').css('display', 'none');
        inClick = false;
        $('#table_body').append("<tr><td>自定义位置</td><td>100.0%</td><td>"
            + (time / 1000).toFixed(2)
            + "s</td></tr>");
    }

    function parse_mouse_coord(e) {
        let x, y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        return [x, y];
    }

    canvas.addEventListener('click', function(event) {

        if(inClick)
            return;
        context_steup();

        let coordinates = parse_mouse_coord(event);
        let x = coordinates[0];
        let y = coordinates[1];
        CRUST_CENTER = [y / canvas.width - CENTER, x / canvas.width - CENTER];  // reset center
        console.log(x, y, CRUST_CENTER);
        setTimeout(worker, 0);

    });

    function main() {
        $('#loader_container').css('display', 'block');
        let tic = new Date().getTime();
        worker();
        let toc = new Date().getTime();
        $('#reader_const').html(((toc - tic) / 1000).toFixed(2) + 's');
        $('#loader_container').css('display', 'none');
        // setInterval(worker, 60);
    }


    main();
});