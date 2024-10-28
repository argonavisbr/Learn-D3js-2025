const symbols = {};
export default symbols;

/**
 * A custom symbol for a zig-zag line. Can be used with fill, stroke, or both.
 * @type {{draw: (function(*, number=): null|string)}}
 */
symbols.symbolZigZag = {
    draw: function(context, size = 64) {
        const side = Math.sqrt(size)/16;
        context.moveTo(12*side,0);
        context.lineTo(side,-3*side);
        context.lineTo(12*side,-16*side);
        context.lineTo(-12*side,0);
        context.lineTo(-side,3*side);
        context.lineTo(-12*side,16*side);
        context.closePath();

        return context.canvas ? null : context.toString();
    }
}

symbols.symbolDrop = {
    draw: function(context, size = 64) {
        const side = Math.sqrt(size)/16;
        context.arc(0,4*side,8*side,-Math.PI*.2,Math.PI*1.2);
        context.lineTo(0,-12*side);
        context.lineTo(0,-12*side);
        context.closePath();

        return context.canvas ? null : context.toString();
    }
}

/**
 * A custom symbol for the Venus symbol. Best for use with stroke and no fill.
 * @type {{draw: (function(*, number=): null|string)}}
 */
symbols.symbolVenus = {
    draw: function(context, size = 64) {
        const side = Math.sqrt(size)/16;
        context.arc(0,-6*side,8*side,0,2*Math.PI);
        context.moveTo(-6*side,8*side);
        context.lineTo(6*side,8*side);
        context.moveTo(0,14*side);
        context.lineTo(0,2*side);

        return context.canvas ? null : context.toString();
    }
}

/**
 * A custom symbol for the Mars symbol. Best for use with stroke and no fill.
 * @type {{draw: (function(*, number=): null|string)}}
 */
symbols.symbolMars = {
    draw: function(context, size = 64) {
        const side = Math.sqrt(size)/16;
        context.arc(-3*side,3*side,8*side,0,2*Math.PI);
        context.moveTo(2.5*side,-2.5*side);
        context.lineTo(11*side,-11*side);
        context.moveTo(side,-11*side);
        context.lineTo(11*side,-11*side);
        context.lineTo(11*side,-side);

        return context.canvas ? null : context.toString();
    }
}

symbols.symbolsFill = [symbols.symbolZigZag, symbols.symbolDrop];
symbols.symbolsStroke = [symbols.symbolVenus, symbols.symbolMars];