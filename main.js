import { AStar, Graph, Node } from "./pathfinder.js";
import { Render } from "./render.js";

const graphBase = {
    START: {
        pos: { x: 65, y: 50 },
        neighbors: ["a", "b"]
    },
    TARGET: {
        pos: { x: 175, y: 200 },
        neighbors: ["g", "h"]
    },
    a: {
        pos: { x: 50, y: 50 },
        neighbors: ["START", "d"]
    },
    b: {
        pos: { x: 150, y: 50 },
        neighbors: ["START", "c", "e"]
    },
    c: {
        pos: { x: 200, y: 50 },
        neighbors: ["b", "f", "q"]
    },
    d: {
        pos: { x: 50, y: 100 },
        neighbors: ["a", "e"]
    },
    e: {
        pos: { x: 125, y: 125 },
        neighbors: ["d", "b", "f", "g"]
    },
    f: {
        pos: { x: 200, y: 100 },
        neighbors: ["e", "c", "h"]
    },
    g: {
        pos: { x: 150, y: 200 },
        neighbors: ["e", "TARGET"]
    },
    h: {
        pos: { x: 200, y: 200 },
        neighbors: ["TARGET", "f", "i", "t"]
    },
    i: {
        pos: { x: 240, y: 300 },
        neighbors: ["h", "j"]
    },
    j: {
        pos: { x: 240, y: 400 },
        neighbors: ["i", "k", "u"]
    },
    k: {
        pos: { x: 240, y: 600 },
        neighbors: ["j", "mn"]
    }, 
    l: {
        pos: { x: 300, y: 700 },
        neighbors: ["k", "m", "p"]
    }, 
    m: {
        pos: { x: 120, y: 750 },
        neighbors: ["l", "mn"]
    },
    mn: {
        pos: { x: 85, y: 450 },
        neighbors: ["m", "n"]
    },
    n: {
        pos: { x: 80, y: 400 },
        neighbors: ["mn", "j", "o"]
    }, 
    o: {
        pos: { x: 80, y: 350 },
        neighbors: ["n", "i", "d"]
    }, 
    p: {
        pos: { x: 550, y: 700 },
        neighbors: ["l", "s"]
    },
    q: {
        pos: { x: 550, y: 50 },
        neighbors: ["r", "c"]
    },
    r: {
        pos: { x: 550, y: 200 },
        neighbors: ["t", "q", "s"]
    },
    s: {
        pos: { x: 550, y: 400 },
        neighbors: ["r", "p", "u"]
    },
    t: {
        pos: { x: 400, y: 200 },
        neighbors: ["h", "r", "u"]
    },
    u: {
        pos: { x: 400, y: 400 },
        neighbors: ["j", "s", "t"]
    },
};

const graph = new Graph(graphBase);
const aStarSearch = new AStar(graph, AStar.heuristicEuclidean);

const size = 800;
const renderer = new Render("konva", 600, size);

renderer.drawGraph(aStarSearch, aStarSearch.graph, [], aStarSearch.startID, aStarSearch.targetID);

function onButtonClick() {
    aStarSearch.run();
    renderer.drawGraph(aStarSearch, aStarSearch.graph, aStarSearch.path, aStarSearch.startID, aStarSearch.targetID);
}

const button = document.querySelector('button');
button.addEventListener('click', onButtonClick);













