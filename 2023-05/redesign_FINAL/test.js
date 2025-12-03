// Include the Potrace library
const potrace = require('potrace');

// Create a bitmap from the canvas
const bitmap = new potrace.Bitmap(canvas);

// Set some options (adjust as needed)
bitmap.turnpolicy = potrace.Potrace.TURNPOLICY_MINORITY;
bitmap.turdsize = 150; // Adjust for your needs

// Trace the bitmap
const path = bitmap.trace();

// Convert the path to a vector2 array
const vector2Array = [];

for (let i = 0; i < path.size(); i++) {
    const segment = path.get(i);
    const segmentVector2 = {
        x: segment.get_x(),
        y: segment.get_y(),
    };
    vector2Array.push(segmentVector2);
}

console.log(vector2Array);
