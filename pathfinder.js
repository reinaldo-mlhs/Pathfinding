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

    render(stage, path = [], startId, targetId) {

        stage.destroyChildren();
        const layer = new Konva.Layer();
        stage.add(layer);

        const lines = {};

        this.edges.forEach(edge => {
            lines[`${edge.nodeA.id}-${edge.nodeB.id}`] = new Konva.Line({
                points: [edge.nodeA.point.x, edge.nodeA.point.y, edge.nodeB.point.x, edge.nodeB.point.y],
                stroke: this.isEdgeInPath(edge, path) ? "blue" : "gray",
                strokeWidth: 15,
                lineCap: 'round',
                lineJoin: 'round'
            });
            layer.add(lines[`${edge.nodeA.id}-${edge.nodeB.id}`]);
        });

        Object.keys(this.nodes).forEach(key => {
            const node = this.nodes[key];
            const nodeX = node.point.x;
            const nodeY = node.point.y;

            const group = new Konva.Group({
                x: nodeX,
                y: nodeY,
                draggable: true
            });
    
            const circle = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 10,
                fill: node.id === startId ? "lightblue" : node.id === targetId ? "blue" : "orange",
                stroke: 'black',
                strokeWidth: 2,
            });

            const nodeIdText = new Konva.Text({
                x: -10,
                y: -9,
                text: node.id,
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                width: 20,
                padding: 0,
                align: 'center',
            });

            group.add(circle);
            group.add(nodeIdText);
            layer.add(group);

            group.on("dragmove", () => {
                node.point = { x: group.attrs.x, y: group.attrs.y };
                this.edges.forEach(edge => {
                    if (edge.nodeA.id === node.id) {
                        edge.nodeA.point = { x: group.attrs.x, y: group.attrs.y };
                        lines[`${edge.nodeA.id}-${edge.nodeB.id}`].attrs.points[0] = group.attrs.x;
                        lines[`${edge.nodeA.id}-${edge.nodeB.id}`].attrs.points[1] = group.attrs.y;
                    }
                    else if (edge.nodeB.id === node.id) {
                        edge.nodeB.point = { x: group.attrs.x, y: group.attrs.y };
                        lines[`${edge.nodeA.id}-${edge.nodeB.id}`].attrs.points[2] = group.attrs.x;
                        lines[`${edge.nodeA.id}-${edge.nodeB.id}`].attrs.points[3] = group.attrs.y;
                    }
                })
            });
    
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

        this.start = null;
        this.target = null;

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

    setStart(node) {
        this.start = node;
    }

    setTarget(startNode, target) {
        this.target = target;
        startNode.g = 0;
        startNode.f = this.heuristicFunction(startNode, target);
    }

    setup(startId, endId) {
        this.setStart(this.graph.nodes[startId]);
        this.setTarget(this.graph.nodes[startId], this.graph.nodes[endId]);
    }

    // setupGrid(startId, endId, obstacles, dim = 10) {
    //     this.graph = new Graph();
    //     this.graph.buildGrid(dim);

    //     this.setStart(this.graph.nodes[startId]);
    //     this.setTarget(this.graph.nodes[startId], this.graph.nodes[endId]);
    //     this.graph.setObstacle(obstacles);

    //     this.unvisited = window.structuredClone(this.graph.nodes);
    // }

    run() {
        this.finished = false;
        this.path = [];
        this.visited = {};
        this.unvisited = window.structuredClone(this.graph.nodes);

        this.step();
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

            if (current.id === this.target.id) {
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
                            this.unvisited[neighbor["id"]]["f"] = new_g + this.heuristicFunction(neighbor, this.target);
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

    generatePath(currentNode = this.target, currentEdge = null) {

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