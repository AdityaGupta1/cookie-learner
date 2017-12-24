function hardReset() {
    Game.HardReset();
    Game.HardReset(1);
    Game.HardReset(2);
    Game.ClosePrompt();
}

function getCookies() {
    return Game.cookies;
}

function getCPS() {
    return Game.cookiesPs;
}

function getCursors() {
    return parseInt(document.getElementById('productOwned0').innerHTML);
}

function getGrandmas() {
    return parseInt(document.getElementById('productOwned1').innerHTML);
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
                network [k][l][m] = (Math.random() * 4) - 2;
            }
        }
    }
}

fillNetwork(3, 4, 5);

// assumes the first node is number 0
function calculateNode(node) {
    return (getCookies() * network[0][0][node]) + (getCPS() * network[0][1][node]) + (getCursors() * network[0][2][node]) + (getGrandmas() * network[0][3][node]);
}

// 0 = click, 1 = cursor, 2 = grandma
function calculateOutput(output) {
    var sum = 0;

    for (var i = 0; i < network[0][0].length; i++) {
        sum += calculateNode(i) * network[1][node][output];
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

    return i;
}

function clickCookie() {
    document.getElementById('bigCookie').click();
}

function buyProduct(id) {
    Game.ClickProduct(id);
}

function doStuff() {
    var option = getIndexOfMax(getOutputs);

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

    console.log(option);
}

function start() {
    setInterval(function(){
        doStuff();
    }, 100);
}