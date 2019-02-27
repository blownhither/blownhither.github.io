$(document).ready(function () {
    let w = $(window).width();
    let h = $(window).height();
    console.log("width: ", w);
    let bs_md_mode = (w >= 768);
    heat(w, bs_md_mode);
    chord1(w, h);
    chord2(w, h);
});


function heat(w, md_mode) {
    if(md_mode) {
        $('#heat1').css('height', w / 2 * 0.8 + 'px');
        $('#heat2').css('height', w / 2 * 0.8 + 'px');
    } else {
        $('#heat1').css('height', w + 'px');
        $('#heat2').css('height', w + 'px');
    }

    Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json', function (figure) {
        let data = [
            {
                z: [[0.0, 0.1787890902420903, 0.14941471322125455, 0.048848083776572904, 0.08321803620816695, 0.20727647731643606, 0.037414596877983354, 0.12280401457187005, 0.0635287873177645], [0.1787890902420903, 0.0, 0.13157592929484715, 0.05349018222101478, 0.047107564672184715, 0.13902357029543355, 0.04302720420286471, 0.0551117805918617, 0.07763193795289365], [0.14941471322125455, 0.13157592929484715, 0.0, 0.06283546979558355, 0.035463687353795285, 0.1259012921193426, 0.037063297144596496, 0.08104608097991649, 0.08558331582856063], [0.048848083776572904, 0.053490182221014794, 0.06283546979558355, 0.0, 0.0025300221012361825, 0.13848641036867002, 0.100623692556181, 0.024812453502264853, 0.08912558055900315], [0.08321803620816695, 0.047107564672184715, 0.03546368735379529, 0.002530022101236183, 0.0, 0.0739550426297438, 0.009279497776237142, 0.04756363758616193, 0.013847095614818658], [0.20727647731643606, 0.13902357029543358, 0.1259012921193426, 0.13848641036867002, 0.0739550426297438, 0.0, 0.105463978430365, 0.16326575738447882, 0.11078933065693508], [0.03741459687798336, 0.04302720420286471, 0.037063297144596496, 0.100623692556181, 0.009279497776237143, 0.105463978430365, 0.0, 0.020137828127258485, 0.06138695085526457], [0.12280401457187005, 0.055111780591861705, 0.08104608097991647, 0.024812453502264853, 0.04756363758616193, 0.16326575738447882, 0.020137828127258485, 0.0, 0.03698480878644211], [0.0635287873177645, 0.07763193795289365, 0.08558331582856063, 0.08912558055900315, 0.013847095614818658, 0.11078933065693508, 0.06138695085526457, 0.0369848087864421, 0.0]],
                x:
                    ["Blood Cholesterol", "Diabetes", "Cardiovascular Disease", "Sleep Disorder", "High Blood Pressure", "Arthritis", "Asthma", "Cancer", "Difficulty in Vision"],
                y:
                    ["Blood Cholesterol", "Diabetes", "Cardiovascular Disease", "Sleep Disorder", "High Blood Pressure", "Arthritis", "Asthma", "Cancer", "Difficulty in Vision"],
                type: 'heatmap',
                colorscale: 'YIOrRd'
            }
        ];
        let layout1 = {
            title: 'BRFFS<br>clinical survey',
            autosize: true, xaxis: {automargin: true}, yaxis: {automargin: true},
        };
        Plotly.newPlot('heat1', data, layout1);
    });
    Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json', function (figure) {
        let data2 = [
            {
                z:
                    [[0.0, 0.003453476820141077, 0.00599652761593461, 0.0, 0.00025828820071183145, 0.0005431466270238161, 0.00012029713252559304, 0.0006569725810550153, 0.0007955996552482247], [0.003453476820141077, 0.0, 0.01874319277703762, 2.2303505829768255e-05, 0.00015765834541525692, 0.0008672940894030035, 0.0006014785030856729, 0.002004509326070547, 0.002826100680977106], [0.00599652761593461, 0.01874319277703762, 0.0, 1.9093382434220985e-05, 0.0001981795794563368, 0.003961279988288879, 0.0003965772339142859, 0.001433481345884502, 0.001166240661405027], [0.0, 2.2303505829768255e-05, 1.9093382434220985e-05, 0.0, 0.0, 1.036477078741882e-05, 0.0, 3.7212728329905076e-06, 9.499382576905191e-05], [0.00025828820071183145, 0.00015765834541525692, 0.0001981795794563368, 0.0, 0.0, 2.5928256945917383e-05, 1.2657266779569909e-05, 0.000181178271304816, 3.0538412829628214e-05], [0.0005431466270238161, 0.0008672940894030035, 0.003961279988288879, 1.036477078741882e-05, 2.5928256945917383e-05, 0.0, 0.00046544100041501224, 0.00025989607092924416, 0.005992067512124777], [0.00012029713252559304, 0.0006014785030856729, 0.0003965772339142859, 0.0, 1.2657266779569909e-05, 0.00046544100041501224, 0.0, 0.0001065453325281851, 0.0035565474536269903], [0.0006569725810550153, 0.002004509326070547, 0.001433481345884502, 3.7212728329905076e-06, 0.000181178271304816, 0.00025989607092924416, 0.0001065453325281851, 0.0, 0.0011920379474759102], [0.0007955996552482247, 0.002826100680977106, 0.001166240661405027, 9.499382576905191e-05, 3.0538412829628214e-05, 0.005992067512124777, 0.0035565474536269903, 0.0011920379474759102, 0.0]],
                x:
                    ["Blood Cholesterol", "Diabetes", "Cardiovascular Disease", "Sleep Disorder", "High Blood Pressure", "Arthritis", "Asthma", "Cancer", "Difficulty in Vision"],

                y:
                    ["Blood Cholesterol", "Diabetes", "Cardiovascular Disease", "Sleep Disorder", "High Blood Pressure", "Arthritis", "Asthma", "Cancer", "Difficulty in Vision"],
                type: 'heatmap',
                colorscale: 'YIOrRd'
            }
        ];
        let layout2 = {
            title: 'PubMed<br>co-occurrence in research title',
            autosize: true,
            xaxis: {automargin: true},
            yaxis: {automargin: true}
        };
        Plotly.newPlot('heat2', data2, layout2);
    });
}

function chord1(w, h) {
    let data = [['Blood Cholesterol', 'Blood Cholesterol', 0.0],
        ['Blood Cholesterol', 'Diabetes', 0.109],
        ['Blood Cholesterol', 'Cardiovascular Disease', 0],
        ['Blood Cholesterol', 'Sleep Disorder', 0],
        ['Blood Cholesterol', 'High Blood Pressure', 0.002],
        ['Blood Cholesterol', 'Arthritis', 0],
        ['Blood Cholesterol', 'Asthma', 0],
        ['Blood Cholesterol', 'Cancer', 0.094],
        ['Blood Cholesterol', 'Difficulty in Vision', 0.061],
        ['Diabetes', 'Blood Cholesterol', 0.231],
        ['Diabetes', 'Diabetes', 0.0],
        ['Diabetes', 'Cardiovascular Disease', 0.129],
        ['Diabetes', 'Sleep Disorder', 0.028],
        ['Diabetes', 'High Blood Pressure', 0],
        ['Diabetes', 'Arthritis', 0.167],
        ['Diabetes', 'Asthma', 0.042],
        ['Diabetes', 'Cancer', 0],
        ['Diabetes', 'Difficulty in Vision', 0.102],
        ['Cardiovascular Disease', 'Blood Cholesterol', 0.074],
        ['Cardiovascular Disease', 'Diabetes', 0],
        ['Cardiovascular Disease', 'Cardiovascular Disease', 0.0],
        ['Cardiovascular Disease', 'Sleep Disorder', 0],
        ['Cardiovascular Disease', 'High Blood Pressure', 0],
        ['Cardiovascular Disease', 'Arthritis', 0.021],
        ['Cardiovascular Disease', 'Asthma', 0],
        ['Cardiovascular Disease', 'Cancer', 0.011],
        ['Cardiovascular Disease', 'Difficulty in Vision', 0.114],
        ['Sleep Disorder', 'Blood Cholesterol', 0.09],
        ['Sleep Disorder', 'Diabetes', 0.097],
        ['Sleep Disorder', 'Cardiovascular Disease', 0.116],
        ['Sleep Disorder', 'Sleep Disorder', 0.0],
        ['Sleep Disorder', 'High Blood Pressure', 0],
        ['Sleep Disorder', 'Arthritis', 0.261],
        ['Sleep Disorder', 'Asthma', 0.188],
        ['Sleep Disorder', 'Cancer', 0],
        ['Sleep Disorder', 'Difficulty in Vision', 0.168],
        ['High Blood Pressure', 'Blood Cholesterol', 0.263],
        ['High Blood Pressure', 'Diabetes', 0.079],
        ['High Blood Pressure', 'Cardiovascular Disease', 0.11],
        ['High Blood Pressure', 'Sleep Disorder', 0],
        ['High Blood Pressure', 'High Blood Pressure', 0.0],
        ['High Blood Pressure', 'Arthritis', 0.234],
        ['High Blood Pressure', 'Asthma', 0.028],
        ['High Blood Pressure', 'Cancer', 0],
        ['High Blood Pressure', 'Difficulty in Vision', 0.042],
        ['Arthritis', 'Blood Cholesterol', 0.026],
        ['Arthritis', 'Diabetes', 0.023],
        ['Arthritis', 'Cardiovascular Disease', 0],
        ['Arthritis', 'Sleep Disorder', 0.008],
        ['Arthritis', 'High Blood Pressure', 0.007],
        ['Arthritis', 'Arthritis', 0.0],
        ['Arthritis', 'Asthma', 0],
        ['Arthritis', 'Cancer', 0.03],
        ['Arthritis', 'Difficulty in Vision', 0.092],
        ['Asthma', 'Blood Cholesterol', 0],
        ['Asthma', 'Diabetes', 0.004],
        ['Asthma', 'Cardiovascular Disease', 0],
        ['Asthma', 'Sleep Disorder', 0.066],
        ['Asthma', 'High Blood Pressure', 0],
        ['Asthma', 'Arthritis', 0],
        ['Asthma', 'Asthma', 0.0],
        ['Asthma', 'Cancer', 0],
        ['Asthma', 'Difficulty in Vision', 0.137],
        ['Cancer', 'Blood Cholesterol', 0.221],
        ['Cancer', 'Diabetes', 0],
        ['Cancer', 'Cardiovascular Disease', 0.142],
        ['Cancer', 'Sleep Disorder', 0],
        ['Cancer', 'High Blood Pressure', 0],
        ['Cancer', 'Arthritis', 0.294],
        ['Cancer', 'Asthma', 0.035],
        ['Cancer', 'Cancer', 0.0],
        ['Cancer', 'Difficulty in Vision', 0.066],
        ['Difficulty in Vision', 'Blood Cholesterol', 0.08],
        ['Difficulty in Vision', 'Diabetes', 0.067],
        ['Difficulty in Vision', 'Cardiovascular Disease', 0.128],
        ['Difficulty in Vision', 'Sleep Disorder', 0],
        ['Difficulty in Vision', 'High Blood Pressure', 0],
        ['Difficulty in Vision', 'Arthritis', 0.145],
        ['Difficulty in Vision', 'Asthma', 0.081],
        ['Difficulty in Vision', 'Cancer', 0],
        ['Difficulty in Vision', 'Difficulty in Vision', 0.0]]
    ;

    let colors = {
        "Blood Cholesterol": "#da4480"
        , "Diabetes": "#5ab449"
        , "Cardiovascular Disease": "#7f5acd"
        , "Sleep Disorder": "#aab740"
        , "High Blood Pressure": "#ce58c0"
        , "Arthritis": "#50a26e"
        , "Asthma": "#d1434b"
        , "Cancer": "#45c0bc"
        , "Difficulty in Vision": "#ce5929"
        ,
    };
    let size = Math.min(w, h) * 0.85;
    let ch = viz.ch().data(data)
        .padding(.01)
        .label(function (d) {
            return `${d['source']} (${d['value'].toPrecision(3)})`
        })
        .innerRadius(size * 0.38)
        .outerRadius(size * 0.40)
        .duration(1000)
        .chordOpacity(0.3)
        .labelPadding(.05)
        .fill(function (d) {
            return colors[d];
        })
    ;

    // let width = w, height = Math.max(w * 0.8, 800);


    let svg = d3.select("#circle1").append("svg").attr("height", size).
        style("margin-left", "auto").style("margin-right", "auto").attr("width", size);
    // let lm = svg.attr("margin-left");
    svg.append("g").attr("transform", `translate(${size/2},${size/2})`).call(ch);
    // svg.append("g").attr("transform", `translate(${width/2},${height/2})`).call(ch);
    // svg.append("g").attr("transform", "translate(740,330)").call(ch);
    // svg.append("g").attr("transform", "translate(600,550)").call(ch);

    // adjust height of frame in bl.ocks.org
    // d3.select(self.frameElement).style("height", height + "px").style("width", width + "px");

}


function chord2(w, h) {
    let data = [['Blood Cholesterol', 'Blood Cholesterol', 0.0],
        ['Blood Cholesterol', 'Diabetes', 0.0],
        ['Blood Cholesterol', 'Cardiovascular Disease', 0.0],
        ['Blood Cholesterol', 'Sleep Disorder', 0.0],
        ['Blood Cholesterol', 'High Blood Pressure', 0.0],
        ['Blood Cholesterol', 'Arthritis', 0.0],
        ['Blood Cholesterol', 'Asthma', 0.0],
        ['Blood Cholesterol', 'Cancer', 0.0],
        ['Blood Cholesterol', 'Difficulty in Vision', 0.0],
        ['Blood Cholesterol', 'alcoholic', 0],
        ['Blood Cholesterol', 'fruit', 0],
        ['Blood Cholesterol', 'exercise', 0],
        ['Blood Cholesterol', 'sweet', 0.217],
        ['Blood Cholesterol', 'marijuana', 0.108],
        ['Diabetes', 'Blood Cholesterol', 0.0],
        ['Diabetes', 'Diabetes', 0.0],
        ['Diabetes', 'Cardiovascular Disease', 0.0],
        ['Diabetes', 'Sleep Disorder', 0.0],
        ['Diabetes', 'High Blood Pressure', 0.0],
        ['Diabetes', 'Arthritis', 0.0],
        ['Diabetes', 'Asthma', 0.0],
        ['Diabetes', 'Cancer', 0.0],
        ['Diabetes', 'Difficulty in Vision', 0.0],
        ['Diabetes', 'alcoholic', 0],
        ['Diabetes', 'fruit', 0],
        ['Diabetes', 'exercise', 0],
        ['Diabetes', 'sweet', 0.184],
        ['Diabetes', 'marijuana', 0.097],
        ['Cardiovascular Disease', 'Blood Cholesterol', 0.0],
        ['Cardiovascular Disease', 'Diabetes', 0.0],
        ['Cardiovascular Disease', 'Cardiovascular Disease', 0.0],
        ['Cardiovascular Disease', 'Sleep Disorder', 0.0],
        ['Cardiovascular Disease', 'High Blood Pressure', 0.0],
        ['Cardiovascular Disease', 'Arthritis', 0.0],
        ['Cardiovascular Disease', 'Asthma', 0.0],
        ['Cardiovascular Disease', 'Cancer', 0.0],
        ['Cardiovascular Disease', 'Difficulty in Vision', 0.0],
        ['Cardiovascular Disease', 'alcoholic', 0],
        ['Cardiovascular Disease', 'fruit', 0.083],
        ['Cardiovascular Disease', 'exercise', 0],
        ['Cardiovascular Disease', 'sweet', 0.185],
        ['Cardiovascular Disease', 'marijuana', 0],
        ['Sleep Disorder', 'Blood Cholesterol', 0.0],
        ['Sleep Disorder', 'Diabetes', 0.0],
        ['Sleep Disorder', 'Cardiovascular Disease', 0.0],
        ['Sleep Disorder', 'Sleep Disorder', 0.0],
        ['Sleep Disorder', 'High Blood Pressure', 0.0],
        ['Sleep Disorder', 'Arthritis', 0.0],
        ['Sleep Disorder', 'Asthma', 0.0],
        ['Sleep Disorder', 'Cancer', 0.0],
        ['Sleep Disorder', 'Difficulty in Vision', 0.0],
        ['Sleep Disorder', 'alcoholic', 0],
        ['Sleep Disorder', 'fruit', 0.254],
        ['Sleep Disorder', 'exercise', 0.286],
        ['Sleep Disorder', 'sweet', 0],
        ['Sleep Disorder', 'marijuana', 0.098],
        ['High Blood Pressure', 'Blood Cholesterol', 0.0],
        ['High Blood Pressure', 'Diabetes', 0.0],
        ['High Blood Pressure', 'Cardiovascular Disease', 0.0],
        ['High Blood Pressure', 'Sleep Disorder', 0.0],
        ['High Blood Pressure', 'High Blood Pressure', 0.0],
        ['High Blood Pressure', 'Arthritis', 0.0],
        ['High Blood Pressure', 'Asthma', 0.0],
        ['High Blood Pressure', 'Cancer', 0.0],
        ['High Blood Pressure', 'Difficulty in Vision', 0.0],
        ['High Blood Pressure', 'alcoholic', 0],
        ['High Blood Pressure', 'fruit', 0.215],
        ['High Blood Pressure', 'exercise', 0],
        ['High Blood Pressure', 'sweet', 0.209],
        ['High Blood Pressure', 'marijuana', 0.018],
        ['Arthritis', 'Blood Cholesterol', 0.0],
        ['Arthritis', 'Diabetes', 0.0],
        ['Arthritis', 'Cardiovascular Disease', 0.0],
        ['Arthritis', 'Sleep Disorder', 0.0],
        ['Arthritis', 'High Blood Pressure', 0.0],
        ['Arthritis', 'Arthritis', 0.0],
        ['Arthritis', 'Asthma', 0.0],
        ['Arthritis', 'Cancer', 0.0],
        ['Arthritis', 'Difficulty in Vision', 0.0],
        ['Arthritis', 'alcoholic', 0.05],
        ['Arthritis', 'fruit', 0],
        ['Arthritis', 'exercise', 0],
        ['Arthritis', 'sweet', 0.181],
        ['Arthritis', 'marijuana', 0],
        ['Asthma', 'Blood Cholesterol', 0.0],
        ['Asthma', 'Diabetes', 0.0],
        ['Asthma', 'Cardiovascular Disease', 0.0],
        ['Asthma', 'Sleep Disorder', 0.0],
        ['Asthma', 'High Blood Pressure', 0.0],
        ['Asthma', 'Arthritis', 0.0],
        ['Asthma', 'Asthma', 0.0],
        ['Asthma', 'Cancer', 0.0],
        ['Asthma', 'Difficulty in Vision', 0.0],
        ['Asthma', 'alcoholic', 0],
        ['Asthma', 'fruit', 0.097],
        ['Asthma', 'exercise', 0],
        ['Asthma', 'sweet', 0.17],
        ['Asthma', 'marijuana', 0.115],
        ['Cancer', 'Blood Cholesterol', 0.0],
        ['Cancer', 'Diabetes', 0.0],
        ['Cancer', 'Cardiovascular Disease', 0.0],
        ['Cancer', 'Sleep Disorder', 0.0],
        ['Cancer', 'High Blood Pressure', 0.0],
        ['Cancer', 'Arthritis', 0.0],
        ['Cancer', 'Asthma', 0.0],
        ['Cancer', 'Cancer', 0.0],
        ['Cancer', 'Difficulty in Vision', 0.0],
        ['Cancer', 'alcoholic', 0],
        ['Cancer', 'fruit', 0.024],
        ['Cancer', 'exercise', 0],
        ['Cancer', 'sweet', 0.126],
        ['Cancer', 'marijuana', 0.084],
        ['Difficulty in Vision', 'Blood Cholesterol', 0.0],
        ['Difficulty in Vision', 'Diabetes', 0.0],
        ['Difficulty in Vision', 'Cardiovascular Disease', 0.0],
        ['Difficulty in Vision', 'Sleep Disorder', 0.0],
        ['Difficulty in Vision', 'High Blood Pressure', 0.0],
        ['Difficulty in Vision', 'Arthritis', 0.0],
        ['Difficulty in Vision', 'Asthma', 0.0],
        ['Difficulty in Vision', 'Cancer', 0.0],
        ['Difficulty in Vision', 'Difficulty in Vision', 0.0],
        ['Difficulty in Vision', 'alcoholic', 0],
        ['Difficulty in Vision', 'fruit', 0.109],
        ['Difficulty in Vision', 'exercise', 0.138],
        ['Difficulty in Vision', 'sweet', 0],
        ['Difficulty in Vision', 'marijuana', 0],
        ['alcoholic', 'Blood Cholesterol', 0.023],
        ['alcoholic', 'Diabetes', 0.017],
        ['alcoholic', 'Cardiovascular Disease', 0],
        ['alcoholic', 'Sleep Disorder', 0],
        ['alcoholic', 'High Blood Pressure', 0],
        ['alcoholic', 'Arthritis', 0.197],
        ['alcoholic', 'Asthma', 0.054],
        ['alcoholic', 'Cancer', 0.224],
        ['alcoholic', 'Difficulty in Vision', 0.099],
        ['alcoholic', 'alcoholic', 0.0],
        ['alcoholic', 'fruit', 0.0],
        ['alcoholic', 'exercise', 0.0],
        ['alcoholic', 'sweet', 0.0],
        ['alcoholic', 'marijuana', 0.0],
        ['fruit', 'Blood Cholesterol', 0],
        ['fruit', 'Diabetes', 0],
        ['fruit', 'Cardiovascular Disease', 0.039],
        ['fruit', 'Sleep Disorder', 0.246],
        ['fruit', 'High Blood Pressure', 0.21],
        ['fruit', 'Arthritis', 0.059],
        ['fruit', 'Asthma', 0.134],
        ['fruit', 'Cancer', 0],
        ['fruit', 'Difficulty in Vision', 0.141],
        ['fruit', 'alcoholic', 0.0],
        ['fruit', 'fruit', 0.0],
        ['fruit', 'exercise', 0.0],
        ['fruit', 'sweet', 0.0],
        ['fruit', 'marijuana', 0.0],
        ['exercise', 'Blood Cholesterol', 0],
        ['exercise', 'Diabetes', 0.297],
        ['exercise', 'Cardiovascular Disease', 0.297],
        ['exercise', 'Sleep Disorder', 0.41],
        ['exercise', 'High Blood Pressure', 0.241],
        ['exercise', 'Arthritis', 0.367],
        ['exercise', 'Asthma', 0.182],
        ['exercise', 'Cancer', 0.013],
        ['exercise', 'Difficulty in Vision', 0.446],
        ['exercise', 'alcoholic', 0.0],
        ['exercise', 'fruit', 0.0],
        ['exercise', 'exercise', 0.0],
        ['exercise', 'sweet', 0.0],
        ['exercise', 'marijuana', 0.0],
        ['sweet', 'Blood Cholesterol', 0.155],
        ['sweet', 'Diabetes', -0.0],
        ['sweet', 'Cardiovascular Disease', 0.212],
        ['sweet', 'Sleep Disorder', 0],
        ['sweet', 'High Blood Pressure', 0.242],
        ['sweet', 'Arthritis', 0.237],
        ['sweet', 'Asthma', 0.202],
        ['sweet', 'Cancer', 0.264],
        ['sweet', 'Difficulty in Vision', 0.002],
        ['sweet', 'alcoholic', 0.0],
        ['sweet', 'fruit', 0.0],
        ['sweet', 'exercise', 0.0],
        ['sweet', 'sweet', 0.0],
        ['sweet', 'marijuana', 0.0],
        ['marijuana', 'Blood Cholesterol', 0],
        ['marijuana', 'Diabetes', 0.089],
        ['marijuana', 'Cardiovascular Disease', 0],
        ['marijuana', 'Sleep Disorder', 0.105],
        ['marijuana', 'High Blood Pressure', 0.007],
        ['marijuana', 'Arthritis', 0.066],
        ['marijuana', 'Asthma', 0.159],
        ['marijuana', 'Cancer', 0],
        ['marijuana', 'Difficulty in Vision', 0],
        ['marijuana', 'alcoholic', 0.0],
        ['marijuana', 'fruit', 0.0],
        ['marijuana', 'exercise', 0.0],
        ['marijuana', 'sweet', 0.0],
        ['marijuana', 'marijuana', 0.0]];

    let colors = {
        "Blood Cholesterol": "#da4480"
        , "Diabetes": "#5ab449"
        , "Cardiovascular Disease": "#7f5acd"
        , "Sleep Disorder": "#aab740"
        , "High Blood Pressure": "#ce58c0"
        , "Arthritis": "#50a26e"
        , "Asthma": "#d1434b"
        , "Cancer": "#45c0bc"
        , "Difficulty in Vision": "#ce5929"
        , "alcoholic": "#04FAE0"
        , "fruit": "#040CFA"
        , "exercise": "#EF04FA"
        , "sweet": "#FAEF04"
        , "marijuana": "#FA041B"
    };

    let size = Math.min(w, h) * 0.85;
    let ch1 = viz.ch().data(data)
        .padding(.01)
        .label(function (d) {
            // console.log(d); return d['source'];
            return `${d['source']} (${d['value'].toPrecision(3)})`
        })
        .innerRadius(size * 0.38)
        .outerRadius(size * 0.40)
        .duration(1000)
        .chordOpacity(0.3)
        .labelPadding(.05)
        .fill(function (d) {
            return colors[d];
        })
    ;

    // let width = 1200, height = 800;

    let svg = d3.select("#circle2").append("svg").attr("height", size).
        style("margin-left", "auto").style("margin-right", "auto").attr("width", size);
    // let lm = svg.attr("margin-left");
    svg.append("g").attr("transform", `translate(${size/2},${size/2})`).call(ch1);

    // adjust height of frame in bl.ocks.org
    // d3.select(self.frameElement).style("height", height + "px").style("width", width + "px");
}
