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
aStarSearch.setup("a", "f");

const size = 800;
const renderer = new Render("konva", size, size);

renderer.drawGraph(aStarSearch.graph, [], aStarSearch.start.id, aStarSearch.target.id);


function onButtonClick() {
    aStarSearch.run("a", "g");
    renderer.drawGraph(aStarSearch.graph, aStarSearch.path, aStarSearch.start.id, aStarSearch.target.id);
    console.log(aStarSearch.path);
}

const button = document.querySelector('button');
button.addEventListener('click', onButtonClick);













