import fonts from "editor/util/Fonts";

export function addCanvasControls(parent, object, folder, a = {}) {
    const ctxFolder = folder.addFolder("Context");

    const c = {
        alpha: true,
        glow: true,
        line: true,
        text: true,
        fill: true,
        ...a
    };

    function add(f, attr, options) {
        parent.addController(f, object, attr, { path: "ctx", ...options });
    }

    if (c.alpha) {
        add(ctxFolder, "globalAlpha", { min: 0, max: 1 });
    }

    if (c.glow) {
        const glow = ctxFolder.addFolder("Glow");
        add(glow, "shadowBlur", { min: 0 });
        add(glow, "shadowColor", { min: 0 });
        add(glow, "shadowOffsetX");
        add(glow, "shadowOffsetY");
    }

    if (c.line) {
        const line = ctxFolder.addFolder("Line style");
        add(line, "lineWidth", { min: 0 });
        add(line, "lineCap", { min: 0 });
        add(line, "lineJoin", { values: ["butt", "round", "square"] });
        add(line, "miterLimit", { min: 0 });
    }

    if (c.text) {
        const text = ctxFolder.addFolder("Text");
        add(text, "font", { values: fonts });
        add(text, "textAlign", {
            values: ["start", "end", "left", "right", "center"]
        });
        add(text, "textBaseline", {
            values: [
                "top",
                "hanging",
                "middle",
                "alphabetic ",
                "ideographic",
                "bottom"
            ]
        });
    }

    if (c.fill) {
        const fill = ctxFolder.addFolder("Fill and stroke styles");
        add(fill, "fillStyle", { color: true });
        add(fill, "strokeStyle", { color: true });
    }
}
