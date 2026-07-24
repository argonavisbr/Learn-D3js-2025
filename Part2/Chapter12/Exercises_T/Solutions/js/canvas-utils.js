/**
 * Fixes the resolution of the canvas element in case the devicePixelRatio is greater than 2
 */
export function fixResolution(ctx) {
    if(devicePixelRatio >= 2){
        ctx.canvas.width *= 2;
        ctx.canvas.height *= 2;
        ctx.setTransform(2,0,0,2,0,0);
    }
    return ctx;
}