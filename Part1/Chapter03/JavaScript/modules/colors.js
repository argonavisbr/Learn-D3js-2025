const red = '#ff0000';
const blue = '#0000ff';
const yellow = '#ffff00';

function random() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}

export {red, blue, yellow, random};