const positions = ["screenX", "screenY",
                           "clientX", "clientY",
                           "x", "y",
                           "offsetX", "offsetY",
                           "pageX", "pageY",
                           "layerX", "layerY"];

const properties = ["this", "currentTarget", "target", "type", "interface"];

const attr = tag => tag.localName === "rect" ? " class=" + tag.getAttribute("class"): "";

function evtSource(e) {
    return (e.currentTarget === window)
        ? "currentTarget: window"
        : "currentTarget: <" + e.currentTarget.localName + attr(e.currentTarget) + ">";
}

export function handler(evt) {
    evt.stopPropagation(); // stop bubbling
    positions.forEach(d => document.getElementById(d).innerHTML = d + ": <b>" + evt[d] + "</b>");
    document.getElementById("this").innerText = (this === window) ? "this: window" : "this: <" + this.localName + attr(this) + ">";
    document.getElementById("currentTarget").innerText = evtSource(evt);
    document.getElementById("target").innerText = "target: <" + evt.target.localName + attr(evt.target) + ">";
    document.getElementById("type").innerText = "type: " + evt.type;
    document.getElementById("interface").innerText = "interface: " + evt.constructor.name;
}

export function log(evt) {
    evt.stopPropagation(); // stop bubbling
    console.clear();
    console.log("this", this);      // which element handled event
    console.log("currentTarget", evt.currentTarget)   // element attached to listener == this
    console.log("target", evt.target)   // element that triggered the event
    console.log("type", evt.type)       // what type of event happened

    console.log("screenX", [evt.screenX, evt.screenY]) // for pointer events
    console.log("clientX", [evt.clientX, evt.clientY]) // for pointer events
    console.log("pointerX", [evt.x, evt.y]) // for pointerover events
    console.log("offsetX", [evt.offsetX, evt.offsetY]) // for pointer events
    console.log("pageX", [evt.pageX, evt.pageY]) // for pointer events
    console.log("layerX", [evt.layerX, evt.layerY]) // for pointerover events

}

export function createPanel() {
    const panel = document.getElementById("panel");

    const positionsHeader = document.createElement("h3");
    positionsHeader.textContent = "Positions";
    panel.appendChild(positionsHeader);

    const positionsList = document.createElement("ul");
    positions.forEach(position => {
        const listItem = document.createElement("li");
        listItem.id = position;
        listItem.textContent = position;
        positionsList.appendChild(listItem);
    });
    panel.appendChild(positionsList);

    const propertiesHeader = document.createElement("h3");
    propertiesHeader.textContent = "Properties";
    panel.appendChild(propertiesHeader);

    const propertiesList = document.createElement("ul");
    properties.forEach(property => {
        const listItem = document.createElement("li");
        listItem.id = property;
        listItem.textContent = property;
        propertiesList.appendChild(listItem);
    });
    panel.appendChild(propertiesList);
}