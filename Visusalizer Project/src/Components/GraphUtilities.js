
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
