export class Render {
    constructor(container, width, height) {
        this.width = width;
        this.height = height;

        this.stage = new Konva.Stage({
            container: container,
            width: width,
            height: height,
        });
    }

    drawGraph(graph, path = [], startId, targetId) {

        // reset layer
        this.stage.destroyChildren();
        const layer = new Konva.Layer();
        this.stage.add(layer);

        const lines = {};

        graph.edges.forEach(edge => {
            lines[`${edge.nodeA.id}-${edge.nodeB.id}`] = new Konva.Line({
                points: [edge.nodeA.point.x, edge.nodeA.point.y, edge.nodeB.point.x, edge.nodeB.point.y],
                stroke: graph.isEdgeInPath(edge, path) ? "blue" : "gray",
                strokeWidth: 15,
                lineCap: 'round',
                lineJoin: 'round'
            });
            layer.add(lines[`${edge.nodeA.id}-${edge.nodeB.id}`]);
        });

        Object.keys(graph.nodes).forEach(key => {
            const node = graph.nodes[key];
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
    
        });
    }
}
