export class Render {
    constructor(container, width, height) {
        this.width = width;
        this.height = height;

        this.stage = new Konva.Stage({
            container: container,
            width: width,
            height: height,
        });

        this.layer = null;
    }

    drawBackground() {
        const rectOuter = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: '#FFF',
            stroke: 'black',
            strokeWidth: 1,
        });

        const rect = new Konva.Rect({
            x: 20,
            y: 20,
            width: this.width - 40,
            height: this.height - 40,
            fill: '#E0E0E0',
            stroke: 'black',
            strokeWidth: 1,
        });

        this.layer.add(rectOuter);
        this.layer.add(rect);
    }

    drawGraph(astar, graph, path = [], startId, targetId) {

        // reset layer
        this.stage.destroyChildren();
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.drawBackground();

        const lines = {};

        graph.edges.forEach(edge => {
            lines[`${edge.nodeA.id}-${edge.nodeB.id}`] = new Konva.Line({
                points: [edge.nodeA.point.x, edge.nodeA.point.y, edge.nodeB.point.x, edge.nodeB.point.y],
                stroke: graph.isEdgeInPath(edge, path) ? "blue" : "#FFFFFF",
                strokeWidth: 5,
                lineCap: 'round',
                lineJoin: 'round'
            });
            this.layer.add(lines[`${edge.nodeA.id}-${edge.nodeB.id}`]);
        });

        Object.keys(graph.nodes)
            // .filter(key => graph.nodes[key].id === startId || graph.nodes[key].id === targetId)
            .forEach(key => {
                const node = graph.nodes[key];
                const nodeX = node.point.x;
                const nodeY = node.point.y;

                const group = new Konva.Group({
                    x: nodeX,
                    y: nodeY,
                    draggable: true
                });

                const line = new Konva.Line({
                    points: [0, 0, 0, -20],
                    stroke: "black",
                    strokeWidth: 2,
                    lineCap: 'round',
                    lineJoin: 'round'
                });

                const circleSmall = new Konva.Circle({
                    x: 0,
                    y: 0,
                    radius: 2,
                    fill: "black",
                    stroke: 'black',
                    strokeWidth: 1,
                });

                const circle = new Konva.Circle({
                    x: 0,
                    y: -20,
                    radius: 10,
                    fill: node.id === startId ? "#9E9E9E" : node.id === targetId ? "red" : "orange",
                    stroke: 'black',
                    strokeWidth: 1,
                });

                const nodeIdText = new Konva.Text({
                    x: -10,
                    y: -29,
                    text: node.id === startId ? "A" : node.id === targetId ? "B" : node.id,
                    fontSize: 18,
                    fontFamily: 'Calibri',
                    fill: '#FFF',
                    width: 20,
                    padding: 0,
                    align: 'center',
                });

                group.add(line);
                group.add(circleSmall);
                group.add(circle);
                group.add(nodeIdText);
                this.layer.add(group);

                group.on("dragmove", () => {
                    node.point = { x: group.attrs.x, y: group.attrs.y };
                    graph.edges.forEach(edge => {
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



                group.on('pointerdown', function () {
                    console.log(group)
                    const selectField = document.querySelector('#select');
                    console.dir(selectField.checked);
                    group.children[2].attrs["fill"] = "green";

                    let start = astar.start;
                    let target = astar.target;

                    if (selectField.checked) {
                        target = node;
                    }
                    else {
                        start = node;
                    }

                    astar.setup(start.id, target.id);
                });

            });
    }
}
