
// Function to calculate edge length
export const calculateEdgeLength = (edge) => {
    const dx = edge.from.x - edge.to.x;
    const dy = edge.from.y - edge.to.y;
    return Math.sqrt(dx * dx + dy * dy);
};

// Function to calculate midpoiint of an edge
export const calculateMidpoint = (edge) => {
    const midX = (edge.from.x + edge.to.x) / 2;
    const midY = (edge.from.y + edge.to.y) / 2;
    return { x: midX, y: midY };
};

// Fucntion to calculate angle of an edge
export const calculateAngle = (edge) => {
    const dx = edge.to.x - edge.from.x;
    const dy = edge.to.y - edge.from.y;
    let flipped = false;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (dx >= 0 && dy < 0) {
    } else if (dx < 0 && dy < 0) {
        angle += 180;
        flipped = true;
    } else if (dx < 0 && dy >= 0) {
        angle -= 180;
        flipped = true;
    } else if (dx >= 0 && dy >= 0) {
    }

    return {
        angle: angle,
        flipped: flipped
    };
};

// Function to calcaulate arrow positions
export const calculateArrowPositions = (edges, edge, flipped, angle) => {
    const arrowLength = 15;
    const arrowAngle = 30;
    const nodeRadius = 10;

    
    const dx = edge.to.x - edge.from.x;
    const dy = edge.to.y - edge.from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;
    
    const baseX = edge.to.x - nodeRadius * unitDx;
    const baseY = edge.to.y - nodeRadius * unitDy;
    
    const edgeCount = edges.filter(e => 
        (e.from.id === edge.from.id && e.to.id === edge.to.id) || 
        (e.from.id === edge.to.id && e.to.id === edge.from.id)
    ).length;

    let offsetX = 0;
    let offsetY = 0;

    if (edgeCount > 1) {
        offsetX = 5 * unitDy; 
        offsetY = -5 * unitDx;
    }

    const adjustedFromX = edge.from.x + 10 + offsetX;
    const adjustedFromY = edge.from.y + 10 + offsetY;
    const adjustedToX = baseX + 10 + offsetX ;
    const adjustedToY = baseY + 10 + offsetY;

    const arrowBaseX = baseX + offsetX + 10;
    const arrowBaseY = baseY + offsetY + 10;

    let arrowX1, arrowY1, arrowX2, arrowY2;
    if (flipped) {
        arrowX1 = arrowBaseX + arrowLength * Math.cos((angle + arrowAngle) * Math.PI / 180);
        arrowY1 = arrowBaseY + arrowLength * Math.sin((angle + arrowAngle) * Math.PI / 180);
        arrowX2 = arrowBaseX + arrowLength * Math.cos((angle - arrowAngle) * Math.PI / 180);
        arrowY2 = arrowBaseY + arrowLength * Math.sin((angle - arrowAngle) * Math.PI / 180);
    } else {
        arrowX1 = arrowBaseX - arrowLength * Math.cos((angle - arrowAngle) * Math.PI / 180);
        arrowY1 = arrowBaseY - arrowLength * Math.sin((angle - arrowAngle) * Math.PI / 180);
        arrowX2 = arrowBaseX - arrowLength * Math.cos((angle + arrowAngle) * Math.PI / 180);
        arrowY2 = arrowBaseY - arrowLength * Math.sin((angle + arrowAngle) * Math.PI / 180);
    }

    return {
        arrowX1: arrowX1,
        arrowX2: arrowX2,
        arrowY1: arrowY1,
        arrowY2: arrowY2,
        adjustedFromX: adjustedFromX,
        adjustedFromY: adjustedFromY,
        adjustedToX: adjustedToX,
        adjustedToY: adjustedToY
    }
}
