$(document).ready(function () {

// Adapted from Konva tutorial
    let container = $('#pad_container');
    let min = Math.min(container.width(), 400);
    // let min = Math.min(window.innerWidth, window.innerHeight);
    let width = min;
    let height = min;
    let strokes = [];
    let currentStroke = [];

// first we need Konva core things: stage and layer
    let stage = new Konva.Stage({
        container: 'pad_container',
        width: width,
        height: height
    });

    let layer = new Konva.Layer();
    stage.add(layer);


// then we are going to draw into special canvas element
    let canvas = document.createElement('canvas');
    canvas.width = stage.width() / 1.5;         // TODO: originally 2
    canvas.height = stage.height() / 1.5;

// created canvas we can add to layer as "Konva.Image" element
    let image = new Konva.Image({
        image: canvas,
        x: (stage.width() - canvas.width) / 2,
        y: (stage.height() - canvas.height) / 2,
        stroke: 'green',
        shadowBlur: 5
    });
    layer.add(image);
    stage.draw();

// Good. Now we need to get access to context element
    let context = canvas.getContext('2d');
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;


    let isPaint = false;
    let lastPointerPosition;
    let mode = 'brush';


// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
    image.on('mousedown touchstart', function () {
        isPaint = true;
        lastPointerPosition = stage.getPointerPosition();
    });

// will it be better to listen move/end events on the window?

    stage.addEventListener('mouseup touchend', function () {
        if (isPaint && currentStroke.length > 0) {
            strokes.push(currentStroke);
            currentStroke = [];
            console.log(strokes);
        }
        isPaint = false;
    });

// and core function - drawing
    stage.addEventListener('mousemove touchmove', function () {
        if (!isPaint) {
            return;
        }

        if (mode === 'brush') {
            context.globalCompositeOperation = 'source-over';
        }
        if (mode === 'eraser') {
            context.globalCompositeOperation = 'destination-out';
        }
        context.beginPath();

        let localPos = {
            x: lastPointerPosition.x - image.x(),
            y: lastPointerPosition.y - image.y()
        };
        context.moveTo(localPos.x, localPos.y);
        let pos = stage.getPointerPosition();
        localPos = {
            x: pos.x - image.x(),
            y: pos.y - image.y()
        };
        context.lineTo(localPos.x, localPos.y);

        currentStroke.push(localPos);

        context.closePath();
        context.stroke();


        lastPointerPosition = pos;
        layer.batchDraw();

    });

    $('#reset-button').click(function () {
        updateSuggestion();
        console.log('reset');
        currentStroke = [];
        strokes = [];
        // layer.clear();
        context.clearRect(0, 0, canvas.width, canvas.height);
        layer.batchDraw();

        let result_element = $('#result');
        result_element.text('');
    });

    let lastSubmit = new Date().getTime();
    const submitFrequency = 1000;
    $('#submit-button').click(function () {
        updateSuggestion();
        let now = new Date().getTime();
        if (now - lastSubmit < submitFrequency) {
            return;
        }

        // TODO: submit logic
        // let data = getRedChannel(canvas);
        let data = strokes.map(coordinates2array);      // [[{x:, y:}...]] to [[[x0, x1], [y0, y1]]...]
        $('#result').text("Waiting...");
        console.log('length', data.length);
        getPrediction(data, predictionSuccessCallback);
    });


    function updateSuggestion() {
        let html_str = "";
        for (let i = 0; i < 3; ++i) {
            html_str += "<tr>";
            for (let j = 0; j < 3; ++j) {
                html_str += "<td>";
                let choice = Math.floor(Math.random() * words.length);
                html_str += words[choice];
                html_str += "</td>";
            }
            html_str += "</tr>";
        }
        $('#suggestion-table-body').html(html_str);
    }

    updateSuggestion();

});

function getRedChannel(canvas) {
    let data_uint8 = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; // RGBA RGBA...
    data_uint8 = data_uint8.filter((_, index)=>(index % 4 === 0));     // red channel
    let data = Array.from(data_uint8);
    return data;
}

function coordinates2array(a) {
    // convert [{x:, y:}] to [[x0, x1...], [y0, y1...]]
    let x = a.map((e)=>e.x);
    let y = a.map((e)=>e.y);
    return [x, y];
}


function getPrediction(image, callback) {
    // Use ajax call to get prediction async and use callback to consume the result
    // image is list to be stringify-ed

    $.ajax({
        // url: "http://0.0.0.0:8080/predict",
        // url: "http://35.231.80.56:8080/predict",
        url: "/predict"
        method: 'POST',
        async: true,
        data: JSON.stringify(image),
        success: function (data) {
            console.log('Ajax receive', data);
            callback(data);
        },
        error: function (jqXHR, textStatus) {
            console.log('Request failed ', jqXHR, textStatus);
        }
    });
}

function argmax_k(probabilities, k) {
    // return the index of max k elements
    let n = probabilities.length;
    let index = Array(n).fill().map((x, y) => y);
    index.sort((a, b) => (probabilities[b] - probabilities[a]));
    return index.slice(0, k);
}

function predictionSuccessCallback(data) {
    let result_element = $('#result');
    if('error' in data) {
        result_element.text('Something wrong :( Please try again')
    }

    data = data['predictions'][0];
    // let pred = data['predictions'];
    let prob = data['probability'];
    let max_k = argmax_k(prob, 3);
    let pred_text = max_k.map((x)=>words[x]).join(', ');
    pred_text = 'I think it is some kind of <span class="prediction-result text-capitalize">' + pred_text + '</span>...';
    result_element.html(pred_text);
}

const words = ['The Eiffel Tower', 'The Great Wall of China', 'The Mona Lisa', 'airplane', 'alarm clock', 'ambulance', 'angel', 'animal migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe', 'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed', 'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday cake', 'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling fan', 'cell phone', 'cello', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud', 'coffee cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise ship', 'cup', 'diamond', 'dishwasher', 'diving board', 'dog', 'dolphin', 'donut', 'door', 'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan', 'feather', 'fence', 'finger', 'fire hydrant', 'fireplace', 'firetruck', 'fish', 'flamingo', 'flashlight', 'flip flops', 'floor lamp', 'flower', 'flying saucer', 'foot', 'fork', 'frog', 'frying pan', 'garden', 'garden hose', 'giraffe', 'goatee', 'golf club', 'grapes', 'grass', 'guitar', 'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon', 'hockey puck', 'hockey stick', 'horse', 'hospital', 'hot air balloon', 'hot dog', 'hot tub', 'hourglass', 'house', 'house plant', 'hurricane', 'ice cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light bulb', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon', 'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus', 'onion', 'oven', 'owl', 'paint can', 'paintbrush', 'palm tree', 'panda', 'pants', 'paper clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano', 'pickup truck', 'picture frame', 'pig', 'pillow', 'pineapple', 'pizza', 'pliers', 'police car', 'pond', 'pool', 'popsicle', 'postcard', 'potato', 'power outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote control', 'rhinoceros', 'river', 'roller coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw', 'saxophone', 'school bus', 'scissors', 'scorpion', 'screwdriver', 'sea turtle', 'see saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping bag', 'smiley face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman', 'soccer ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches', 'stop sign', 'stove', 'strawberry', 'streetlight', 'string bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater', 'swing set', 'sword', 't-shirt', 'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis racquet', 'tent', 'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic light', 'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 'umbrella', 'underwear', 'van', 'vase', 'violin', 'washing machine', 'watermelon', 'waterslide', 'whale', 'wheel', 'windmill', 'wine bottle', 'wine glass', 'wristwatch', 'yoga', 'zebra', 'zigzag'];


