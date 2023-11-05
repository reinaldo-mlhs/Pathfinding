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
            x: 10,
            y: 10,
            width: this.width - 20,
            height: this.height - 20,
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

        console.log(astar)

        const lines = {};

        graph.edges.forEach(edge => {
            lines[`${edge.nodeA.id}-${edge.nodeB.id}`] = new Konva.Line({
                points: [edge.nodeA.point.x, edge.nodeA.point.y, edge.nodeB.point.x, edge.nodeB.point.y],
                stroke: graph.isEdgeInPath(edge, path) ? "blue" : "#FFFFFF",
                strokeWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
            });
            
        });

        const sortedLines = Object.keys(lines).sort((a, b) => {
            if (lines[a].attrs.stroke > lines[b].attrs.stroke) {
                return 1;
            }
            else {
                return -1;
            }
        });

        sortedLines.forEach(key => {
            this.layer.add(lines[key]);
        })

        drawNode(graph, this.layer, startId, "START", astar);
        drawNode(graph, this.layer, targetId, "TARGET", astar);

    }
}


function drawNode(graph, layer, id, type, astar) {

    const node = graph.nodes[id];
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
        fill: type === "START" ? "#9E9E9E" : type === "TARGET" ? "red" : "orange",
        stroke: 'black',
        strokeWidth: 1,
    });

    const nodeIdText = new Konva.Text({
        x: -10,
        y: -29,
        text: type === "START" ? "A" : type === "TARGET" ? "B" : "",
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
    layer.add(group);


    // group.on("dragmove", () => {
    //     // node.point = { x: group.attrs.x, y: group.attrs.y };

    //     let distance = 0;
    //     let nearestPoint = {x: 0, y: 0};

    //     graph.edges.forEach(edge => {
    //         // pointAtLine()
    //         const d = calcDistancePointToLine(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y});
    //         if (d < 15 && calcIsInsideLineSegment(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y})) {
    //             const temp = calcNearestPointOnLine(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y});
    //             console.log(temp);

    //             const circleSmall2 = new Konva.Circle({
    //                 x: temp.x,
    //                 y: temp.y,
    //                 radius: 4,
    //                 fill: "black",
    //                 stroke: 'black',
    //                 strokeWidth: 1,
    //             });
            
    //             layer.add(circleSmall2);
    //         }
    //     })
    // });

    group.on("dragend", () => {

        let distance = 9999;
        let nearestPoint = null;
        let neighbors = [];
        
        graph.edges.forEach(edge => {

            const d = calcDistancePointToLine(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y});
            if (d < 150 && distance > d && calcIsInsideLineSegment(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y})) {
                distance = d;
                nearestPoint = calcNearestPointOnLine(edge.nodeA.point,edge.nodeB.point,{x: group.attrs.x, y: group.attrs.y});
                neighbors = [edge.nodeA.id, edge.nodeB.id];
            }
        })

        if (nearestPoint) {
            group.absolutePosition(nearestPoint);
            node.point = nearestPoint;
            astar.redrawGraph(type, nearestPoint, neighbors);
        }
    });

}


//Returns {.x, .y}, a projected point perpendicular on the (infinite) line.
function calcNearestPointOnLine(line1, line2, pnt) {
    var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
    if(L2 == 0) return false;
    var r = ( ((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y)) ) / L2;

    return {
        x: line1.x + (r * (line2.x - line1.x)), 
        y: line1.y + (r * (line2.y - line1.y))
    };
}

//Returns float, the shortest distance to the (infinite) line.
function calcDistancePointToLine(line1, line2, pnt) {
    var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
    if(L2 == 0) return false;
    var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
    return Math.abs(s) * Math.sqrt(L2);
}

//Returns bool, whether the projected point is actually inside the (finite) line segment.
function calcIsInsideLineSegment(line1, line2, pnt) {
    var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
    if(L2 == 0) return false;
    var r = ( ((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y)) ) / L2;

    return (0 <= r) && (r <= 1);
}

