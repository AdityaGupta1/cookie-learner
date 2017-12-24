function hardReset() {
    Game.HardReset(2);
}

function getCookies() {
    return Game.cookies;
}

function getSqrtCookies() {
    return Math.sqrt(Game.cookies);
}

function getCPS() {
    return Game.cookiesPs;
}

function getProduct(id) {
    var string = document.getElementById('productOwned' + id).innerHTML;

    if (string === '') {
        return 0;
    }

    return parseInt(string);
}

// 0 = cookies, 1 = cps, others = product id + 2
function calculateInput(input) {
    switch (input) {
        default:
        case 0:
            return getSqrtCookies();
            break;
        case 1:
            return getCPS();
            break;
        case 2:
        case 3:
            return getProduct(input - 2);
            break;
    }
}

var network = [[], []];

function fillNetwork(inputNodes, hiddenNodes, outputNodes) {
    for (var i = 0; i < inputNodes; i++) {
        network[0][i] = new Array(hiddenNodes);
    }

    for (var j = 0; j < hiddenNodes; j++) {
        network[1][j] = new Array(outputNodes);
    }

    // layers of nodes
    for (var k = 0; k < network.length; k++) {
        // individual nodes
        for (var l = 0; l < network[k].length; l++) {
            // individual weights
            for (var m = 0; m < network[k][l].length; m++) {
                network [k][l][m] = (Math.random() * 50) - 25;
            }
        }
    }
}

function calculateHidden(hidden) {
    var sum = 0;

    for (var i = 0; i < network[0].length; i++) {
        sum += calculateInput(i) * network[0][i][hidden];
    }

    return sum;
}

// 0 = click, others = product id + 1
function calculateOutput(output) {
    var sum = 0;

    for (var i = 0; i < network[1].length; i++) {
        sum += calculateHidden(i) * network[1][i][output];
    }

    return sum;
}

function getOutputs() {
    return [calculateOutput(0), calculateOutput(1), calculateOutput(2)];
}

function getIndexOfMax(array) {
    var index = 0;
    var max = array[index];

    for (var i = 0; i < array.length; i++) {
        if (array[i] > max) {
            index = i;
            max = array[i];
        }
    }

    console.log(array);
    return index;
}

function clickCookie() {
    document.getElementById('bigCookie').click();
}

function buyProduct(id) {
    if (getCookies() < parseInt(document.getElementById('productPrice' + id).innerHTML)) {
        clickCookie();
        return;
    }

    Game.ClickProduct(id);
}

function doStuff() {
    var option = getIndexOfMax(getOutputs());

    switch (option) {
        default:
        case 0:
            clickCookie();
            break;
        case 1:
        case 2:
            buyProduct(option - 1);
            break;
    }
}

function getFitness(time) {
    var loop = setInterval(function(){ doStuff(); }, 100);
    setTimeout(function(){
        clearInterval(loop);
        var fitness = (getCPS() * 100) + getCookies();
        doStuffWithFitness(fitness);
    }, time);
}

function start() {
    fillNetwork(3, 4, 5);
    console.log(getFitness(60000));
}

function doStuffWithFitness(fitness) {
    console.log(fitness);
}