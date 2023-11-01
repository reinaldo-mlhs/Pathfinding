export function drawGraph(graph, layer) {

    Object.keys(graph.nodes).forEach(key => {
        const node = graph.nodes[key];
        const nodeX = node.point.x + 100;
        const nodeY = node.point.y + 100;

        node.neighbors.forEach(neighbor => {
            const line = new Konva.Line({
                points: [nodeX, nodeY, neighbor.point.x + 100, neighbor.point.y + 100],
                stroke: 'gray',
                strokeWidth: 15,
                lineCap: 'round',
                lineJoin: 'round'
            });
            layer.add(line);
        });

    });

    Object.keys(graph.nodes).forEach(key => {
        const node = graph.nodes[key];
        const nodeX = node.point.x + 100;
        const nodeY = node.point.y + 100;

        const circle = new Konva.Circle({
            x: nodeX,
            y: nodeY,
            radius: 10,
            fill: 'orange',
            stroke: 'black',
            strokeWidth: 2
        });
        layer.add(circle);

    });
}
