import { AStar, Graph, Node } from "./pathfinder.js";
import { drawGraph } from "./draw.js";

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
// aStarSearch.run();

const size = 800;
const stage = new Konva.Stage({
    container: 'konva',
    width: size,
    height: size,
});

aStarSearch.graph.render(stage, [], aStarSearch.start.id, aStarSearch.target.id);


// drawGraph(graph, layer);
////////////////////////////////

// function render() {
//     const offset = size / (Math.sqrt(Object.keys(aStarSearch.graph.nodes).length));

//     Object.keys(aStarSearch.graph.nodes).forEach(key => {
//         const n = aStarSearch.graph.nodes[key];

//         if (aStarSearch.visited[n["id"]]?.pathNode) {

//             const rect = new Konva.Rect({
//                 x: n.point.x * offset,
//                 y: n.point.y * offset,
//                 width: offset,
//                 height: offset,
//                 fill: 'blue',
//             });
//             layer.add(rect);
//         }
//         else if (aStarSearch.visited[n["id"]]) {
//             const rect = new Konva.Rect({
//                 x: n.point.x * offset,
//                 y: n.point.y * offset,
//                 width: offset,
//                 height: offset,
//                 fill: 'yellow',
//             });
//             layer.add(rect);
//         }
//         else if (n.obstacle) {
//             const rect = new Konva.Rect({
//                 x: n.point.x * offset,
//                 y: n.point.y * offset,
//                 width: offset,
//                 height: offset,
//                 fill: 'black',
//             });
//             layer.add(rect);
//         }
//         else {
//             const rect = new Konva.Rect({
//                 x: n.point.x * offset,
//                 y: n.point.y * offset,
//                 width: offset,
//                 height: offset,
//             });
//             layer.add(rect);
//         }
//     });
// }
// render();

////////////////////////////////





///////////////////////////////////////////////////////////////////////////////////////////////////////////
// ctx.lineWidth = 1;
// const offset = size / (Math.sqrt(Object.keys(aStarSearch.graph.nodes).length));



function onButtonClick() {
    aStarSearch.run("a", "g");
    aStarSearch.graph.render(stage, aStarSearch.path, aStarSearch.start.id, aStarSearch.target.id);
    console.log(aStarSearch.path);
}

const button = document.querySelector('button');
button.addEventListener('click', onButtonClick);













