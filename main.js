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
    switch (true) {
        default:
        case (input === 0):
            return getSqrtCookies();
            break;
        case (input === 1):
            return getCPS();
            break;
        case (input > 1):
            return getProduct(input - 2);
            break;
    }
}

var currentNetwork = [[], []];

function fillNetwork(inputNodes, hiddenNodes, outputNodes) {
    for (var i = 0; i < inputNodes; i++) {
        currentNetwork[0][i] = new Array(hiddenNodes);
    }

    for (var j = 0; j < hiddenNodes; j++) {
        currentNetwork[1][j] = new Array(outputNodes);
    }

    // layers of nodes
    for (var k = 0; k < currentNetwork.length; k++) {
        // individual nodes
        for (var l = 0; l < currentNetwork[k].length; l++) {
            // individual weights
            for (var m = 0; m < currentNetwork[k][l].length; m++) {
                currentNetwork [k][l][m] = (Math.random() * 50) - 25;
            }
        }
    }
}

function calculateHidden(hidden) {
    var sum = 0;

    for (var i = 0; i < currentNetwork[0].length; i++) {
        sum += calculateInput(i) * currentNetwork[0][i][hidden];
    }

    return sum;
}

// 0 = click, others = product id + 1
function calculateOutput(output) {
    var sum = 0;

    for (var i = 0; i < currentNetwork[1].length; i++) {
        sum += calculateHidden(i) * currentNetwork[1][i][output];
    }

    return sum;
}

function getOutputs() {
    var outputs = [];

    for (var i = 0; i < currentNetwork[0].length; i++) {
        outputs[i] = calculateOutput(i);
    }

    return outputs;
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

    return index;
}

function clickCookie() {
    document.getElementById('bigCookie').click();
}

function buyProduct(id) {
    if (getCookies() < parseInt(document.getElementById('productPrice' + id).innerHTML)
        || document.getElementById('product' + id).classList.contains('toggledOff')) {
        clickCookie();
        return;
    }

    Game.ClickProduct(id);
}

var numberOfNetworks = 10;
var networks = new Array(numberOfNetworks);

for (var i = 0; i < numberOfNetworks; i++) {
    networks[i] = new Array(2);
}

function networkToArray(startingNetwork) {
    var finishedArray = [];

    for (var i = 0; i < startingNetwork.length; i++) {
        for (var j = 0; j < startingNetwork[i].length; j++) {
            finishedArray = finishedArray.concat(startingNetwork[i][j]);
        }
    }

    return finishedArray;
}

function arrayToNetwork(startingArray) {
    var finishedNetwork = [[], []];

    var inputNodes = currentNetwork[0].length;
    var hiddenNodes = currentNetwork[1].length;
    var outputNodes = currentNetwork[1][0].length;

    var firstLayer = startingArray.slice(0, inputNodes * hiddenNodes);
    for (var i = 0; i < inputNodes * hiddenNodes; i += hiddenNodes) {
        finishedNetwork[0][i / hiddenNodes] = firstLayer.slice(i, i + hiddenNodes);
    }

    var secondLayer = startingArray.slice(inputNodes * hiddenNodes);
    for (var j = 0; j < hiddenNodes * outputNodes; j += outputNodes) {
        finishedNetwork[1][j / outputNodes] = secondLayer.slice(j, j + outputNodes);
    }

    return finishedNetwork;
}

// time in seconds to run each network
var networkTime = 1;
networkTime *= 1000;
networkTime += 100;

var networkIndex = 0;

var generationNumber = 0;

var logData = false;

function doStuff() {
    var option = getIndexOfMax(getOutputs());

    if (logData) {
        console.log('outputs: ' + getOutputs());
        console.log('option: ' + option);
    }

    switch (true) {
        default:
        case (option === 0):
            clickCookie();
            break;
        case (option > 0):
            buyProduct(option - 1);
            break;
    }
}

function runNetwork(timeToRun) {
    console.log('network ' + networkIndex);

    var loop = setInterval(function() { doStuff(); }, 100);
    setTimeout(function() {
        clearInterval(loop);
        var fitness = (getCPS() * 100) + getCookies();
        console.log(fitness);
        doStuffWithFitness(fitness);
    }, timeToRun);
}

function createRandomNetworks() {
    for (var i = 0; i < numberOfNetworks; i++) {
        currentNetwork = [[], []];
        fillNetwork(5, 5, 5);
        networks[i][0] = currentNetwork.slice();
    }

    currentNetwork = networks[0][0];
}

function start(flag) {
    logData = flag;

    hardReset();

    createRandomNetworks();

    setTimeout(function() { runNetwork(networkTime); }, 2000)
}

function doStuffWithFitness(fitness) {
    networks[networkIndex][1] = fitness;

    hardReset();

    setTimeout(function() {
        networkIndex++;

        if (networkIndex === 10) {
            console.log('done with generation ' + generationNumber);
            generationNumber++;


            for (var i = 0; i < networks.length; i++) {
                console.log('network ' + i + ': ' + networks[i][0] + '\nfitness: ' + networks[i][1]);
            }

            propagate();

            networkIndex = 0;
        }

        currentNetwork = networks[networkIndex][0];
        runNetwork(networkTime);
    }, 2000);
}

function signedSqrt(number) {
    return Math.sign(number) * Math.sqrt(number);
}

function propagate() {
    var fitnesses = new Array(10);

    for (var i = 0; i < networks.length; i++) {
        fitnesses[i] = networks[i][1];
    }

    var mostFit = networkToArray(networks[getIndexOfMax(fitnesses)][0]);

    for (var j = 0; j < networks.length; j++) {
        networks[j][1] = 0;

        var offspring = new Array(mostFit.length);

        for (var k = 0; k < mostFit.length; k++) {
            offspring[k] = signedSqrt((networks[j][0]).slice()[k] * mostFit[k]) * (0.9 + (Math.random() / 5));
            console.log((networks[j][0]).slice()[k]);
        }

        console.log(offspring);

        networks[j][0] = arrayToNetwork(offspring);
    }
}