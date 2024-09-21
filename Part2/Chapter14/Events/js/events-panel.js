import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
    positions.forEach(d => d3.select("#" + d).html(d + ": <b>" + evt[d] + "</b>"));
    d3.select("#this").text((this === window)? "this: window": "this: <" + this.localName + attr(this) + ">");
    d3.select("#currentTarget").text(evtSource(evt));
    d3.select("#target")
        .text("target: <" + evt.target.localName + attr(evt.target) + ">");
    d3.select("#type")
        .text("type: " + evt.type);
    d3.select("#interface")
        .text("interface: " + evt.constructor.name);
}

export function log(evt) {
    evt.stopPropagation(); // stop bubbling
    console.log("this", this);      // which element handled event
    console.log("currentTarget", evt.currentTarget)   // element attached to listener == this
    console.log("target", evt.target)   // element that triggered the event
    console.log("type", evt.type)       // what type of event happened

    console.log("screenX", [evt.screenX, evt.screenY]) // for pointer events
    console.log("clientX", [evt.clientX, evt.clientY]) // for pointer events
    console.log("pointerX", [evt.x, evt.y]) // for mouse events
    console.log("offsetX", [evt.offsetX, evt.offsetY]) // for pointer events
    console.log("pageX", [evt.pageX, evt.pageY]) // for pointer events
    console.log("layerX", [evt.layerX, evt.layerY]) // for mouse events

}

export function createPanel() {
    const panel = d3.select("#panel");
    panel.append("h3").text("Positions");
    panel.append("ul").selectAll("li").data(positions).join("li").attr("id", d => d).text(d => d);
    panel.append("h3").text("Properties");
    panel.append("ul").selectAll("li").data(properties).join("li").attr("id", d => d).text(d => d);
}