export class Node {
    constructor(id) {
        this.id = id;
        this.g = 999999;
        this.f = 999999;
        this.point = { x: 0, y: 0 };
        this.neighbors = [];
        this.previous = null;
        this.obstacle = false;
        this.pathNode = false;
    }

    // generateGridNeighbors(nodes) {
    //     nodes.forEach(n => {
    //         if ((n.point.x - this.point.x === -1 || n.point.x - this.point.x === 0 || n.point.x - this.point.x === 1) &&
    //             (n.point.y - this.point.y === -1 || n.point.y - this.point.y === 0 || n.point.y - this.point.y === 1) &&
    //             (this.id !== n.id)) {
    //             this.neighbors.push(n);
    //         }
    //     })
    // }
}

export class Graph {
    constructor(graphBase = null) {
        this.graphBase = graphBase;
        this.nodes = this.buildNodes(graphBase);
        this.edges = this.buildEdges(graphBase);

        this.buildNodeNeighbors();
    }

    buildNodes(graphBase) {

        let nodes = Object.keys(graphBase).map(key => {
            const tempNode = new Node(key);
            tempNode.point = graphBase[key]["pos"];
            return tempNode;
        });

        nodes = Object.fromEntries(nodes.map(n => {
            return [n["id"], n]
        }));

        return nodes;
    }

    buildNodeNeighbors() {

        Object.keys(this.nodes).forEach(nKey => {
            const node = this.nodes[nKey];
            node.neighbors = this.edges.filter(edge => {
                if (edge.nodeA.id === node.id) {
                    return true;
                }
                else if (edge.nodeB.id === node.id) {
                    return true;
                }
                else {
                    return false;
                }
            }).map(edge => {
                if (edge.nodeA.id === node.id) {
                    return this.nodes[edge.nodeB.id];
                }
                else if (edge.nodeB.id === node.id) {
                    return this.nodes[edge.nodeA.id];
                }
            });
        })
    }

    buildEdges(graphBase) {

        const edges = [];
        const uniques = [];

        Object.keys(this.nodes).forEach(nKey => {
            Object.keys(graphBase).forEach(nBkey => {

                if (this.nodes[nKey].id === nBkey) {
                    graphBase[nBkey].neighbors.forEach(neighbor => {
                        const k = [this.nodes[nKey].id, this.nodes[neighbor].id].sort().join("-");
                        const tempEdge = {
                            nodeA: {
                                point: this.nodes[nKey].point,
                                id: this.nodes[nKey].id
                            },
                            nodeB: {
                                point: this.nodes[neighbor].point,
                                id: this.nodes[neighbor].id
                            }
                        }

                        if (!uniques.includes(k)) {
                            edges.push(tempEdge);
                            uniques.push(k);
                        }

                    });

                }
            })
        });


        return edges;
    }

    getEdge(nodeA, nodeB) {
        return this.edges.find(edge => {
            if ((edge.nodeA.id === nodeA.id || edge.nodeA.id === nodeB.id) && (edge.nodeB.id === nodeA.id || edge.nodeB.id === nodeB.id)) {
                return true;
            }
        });
    }

    isEdgeInPath(edge, path) {
        return path.some(pathSection => {
            if (pathSection.nodeA.id === edge.nodeA.id && pathSection.nodeB.id === edge.nodeB.id) {
                return true;
            }
            return false;
        });
    }

    // buildGrid(dim) {

    //     const nodes = [];

    //     for (let w = 0; w < dim; w++) {
    //         for (let h = 0; h < dim; h++) {
    //             const temp = new Node(`${w}-${h}`);
    //             temp.point = { x: w, y: h };
    //             nodes.push(temp);
    //         }
    //     }

    //     nodes.forEach(n => {
    //         n.generateGridNeighbors(nodes);
    //     })

    //     this.nodes = Object.fromEntries(nodes.map(n => {
    //         return [n["id"], n]
    //     }));
    // }

    // setObstacle(nodeIds) {
    //     nodeIds.forEach(id => {
    //         this.nodes[id].obstacle = true;
    //     })
    // }
}

export class AStar {
    constructor(graph, heuristicFunction) {
        this.graph = graph;
        this.heuristicFunction = heuristicFunction;

        this.startID = "START";
        this.targetID = "TARGET";

        this.visited = {};
        this.unvisited = {};

        this.finished = false;
        this.path = [];
    }

    static heuristicEuclidean(node1, node2) {
        const xd = (node1.point.x - node2.point.x) ** 2;
        const yd = (node1.point.y - node2.point.y) ** 2;
        return Math.sqrt(xd + yd);
    }

    static heuristicManhattan(node1, node2) {
        return Math.abs(node1.point.x - node2.point.x) + Math.abs(node1.point.y - node2.point.y);
    }

    redrawGraph(type, point, newNeighbors) {
        this.reset();
        console.log(type, point, newNeighbors);
        const oldNeighbors = this.graph.graphBase[type].neighbors;
        console.log(oldNeighbors)

        const tempGraphBase = {
            ...this.graph.graphBase,
            [type]: {
                pos: point,
                neighbors: newNeighbors
            }
        }

        oldNeighbors.forEach((n, index) => {
            if (index === 0) {
                tempGraphBase[n].neighbors.splice(tempGraphBase[n].neighbors.indexOf(type), 1, oldNeighbors[1]);
            }
            else {
                tempGraphBase[n].neighbors.splice(tempGraphBase[n].neighbors.indexOf(type), 1, oldNeighbors[0]);
            }
        });

        newNeighbors.forEach((n, index) => {
            if (index === 0) {
                tempGraphBase[n].neighbors.splice(tempGraphBase[n].neighbors.indexOf(newNeighbors[1]), 1, type);
            }
            else {
                tempGraphBase[n].neighbors.splice(tempGraphBase[n].neighbors.indexOf(newNeighbors[0]), 1, type);
            }
        });

        console.log(tempGraphBase)
        this.graph = new Graph(tempGraphBase);
        console.log(this.graph);
    }

    reset() {
        this.finished = false;
        this.path = [];
        this.visited = {};
        this.unvisited = window.structuredClone(this.graph.nodes);
    }

    // setStart(id) {
    //     this.startID = id;
    // }

    // setTarget(id) {
    //     this.targetID = id;
    // }

    // setup(startId, targetID) {
    //     this.setStart(startId)
    //     this.setTarget(targetID);
    // }

    // setupGrid(startId, endId, obstacles, dim = 10) {
    //     this.graph = new Graph();
    //     this.graph.buildGrid(dim);

    //     this.setStart(this.graph.nodes[startId]);
    //     this.setTarget(this.graph.nodes[startId], this.graph.nodes[endId]);
    //     this.graph.setObstacle(obstacles);

    //     this.unvisited = window.structuredClone(this.graph.nodes);
    // }

    run() {
        this.reset();

        this.unvisited[this.startID].g = 0;
        this.unvisited[this.startID].f = this.heuristicFunction(this.unvisited[this.startID], this.unvisited[this.targetID]);

        this.step(false);
    }

    step(stepped = false) {

        if (Object.keys(this.unvisited).length === 0) {
            this.finished = true
        }

        else {
            const current = Object.keys(this.unvisited).reduce((prev, cur) => {
                if (prev === null) {
                    return this.unvisited[cur];
                }
                if (prev.f < this.unvisited[cur].f) {
                    return prev;
                }
                else {
                    return this.unvisited[cur];
                }
            }, null);

            //console.log(current);

            if (current.id === this.targetID) {
                this.finished = true
                this.visited[current["id"]] = this.unvisited[current["id"]];
                delete this.unvisited[current["id"]];
                this.generatePath();
            }

            else {
                const neighbors = current.neighbors;

                neighbors.forEach(neighbor => {

                    if (this.visited[neighbor["id"]] === undefined) {

                        const new_g = this.unvisited[current["id"]]["g"] + AStar.heuristicEuclidean(this.unvisited[current["id"]], neighbor);

                        if (new_g < this.unvisited[neighbor["id"]]["g"]) {
                            this.unvisited[neighbor["id"]]["g"] = new_g;
                            this.unvisited[neighbor["id"]]["f"] = new_g + this.heuristicFunction(neighbor, this.unvisited[this.targetID]);
                            this.unvisited[neighbor["id"]]["previous"] = current;
                        }
                    }
                })

                this.visited[current["id"]] = this.unvisited[current["id"]];

                delete this.unvisited[current["id"]];

            }
        }

        if (stepped === false && this.finished === false) {
            this.step();
        }
    }

    generatePath(currentNode = this.visited[this.targetID], currentEdge = null) {

        if (currentEdge) {
            this.path.push(currentEdge);
        }

        this.visited[currentNode.id].pathNode = true;

        const previousNode = this.visited[currentNode.id].previous;

        if (previousNode) {
            const edge = this.graph.getEdge(currentNode, previousNode);
            this.generatePath(previousNode, edge);
        }
        else {
            this.path.reverse();
        }
    }
}