import { AStar, Graph, Node } from "./pathfinder.js";
import { Render } from "./render.js";

const graphBase  = {
    a: {
        pos: {x: 50, y: 50},
        neighbors: ["b", "d"]
    },
    b: {
        pos: {x: 150, y: 50},
        neighbors: ["a", "c", "e"]
    },
    c: {
        pos: {x: 200, y: 50},
        neighbors: ["b", "f"]
    },
    d: {
        pos: {x: 50, y: 100},
        neighbors: ["a", "e"]
    },
    e: {
        pos: {x: 125, y: 125},
        neighbors: ["d", "b", "f", "g"]
    },
    f: {
        pos: {x: 200, y: 100},
        neighbors: ["e", "c", "h"]
    },
    g: {
        pos: {x: 150, y: 200},
        neighbors: ["e", "h"]
    },
    h: {
        pos: {x: 200, y: 200},
        neighbors: ["g", "f"]
    }
};

const graph = new Graph(graphBase);
const aStarSearch = new AStar(graph, AStar.heuristicEuclidean);
aStarSearch.setup("a", "g");

const size = 800;
const renderer = new Render("konva", size, size);

renderer.drawGraph(aStarSearch, aStarSearch.graph, [], aStarSearch.startID, aStarSearch.targetID);


function onButtonClick() {
    aStarSearch.run();
    renderer.drawGraph(aStarSearch, aStarSearch.graph, aStarSearch.path, aStarSearch.startID, aStarSearch.targetID);
    console.log(aStarSearch.path);
}

function onFieldChange(e, type) {
    if (type === "start") {
        aStarSearch.setup(e.key, aStarSearch.targetID);
    }
    else if (type === "destination") {
        aStarSearch.setup(aStarSearch.startID, e.key);
    }
    console.log(aStarSearch)
    renderer.drawGraph(aStarSearch, aStarSearch.graph, [], aStarSearch.startID, aStarSearch.targetID);
}

const button = document.querySelector('button');
button.addEventListener('click', onButtonClick);

const startField = document.querySelector('#start');
startField.addEventListener('keypress', (e) => onFieldChange(e, "start"));

const destinationField = document.querySelector('#destination');
destinationField.addEventListener('keypress', (e) => onFieldChange(e, "destination"));














