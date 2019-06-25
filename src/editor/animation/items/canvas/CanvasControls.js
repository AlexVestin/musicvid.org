import fonts from "editor/util/Fonts";

export function addCanvasControls(parent, ctx, folder,  a = {}) {
    const ctxFolder = folder.addFolder("Context");

    const object = {};
    const c = {
        alpha: true,
        glow: true,
        line: true,
        text: true,
        fill: true,
        filter: true,
        transform: true,
        ...a
    };


    const add = (f, attr, options) => {
        if(object[attr] === undefined)
            object[attr] = ctx[attr] || 1;
        parent.addController(f, object, attr, { path: "ctx", ...options });
    }

    if (c.alpha) {
        add(ctxFolder, "globalAlpha", { min: 0, max: 1 });
    }

    if (c.glow) {
        const glow = ctxFolder.addFolder("Glow");
        add(glow, "shadowBlur", { min: 0 });
        add(glow, "shadowColor", { color: true });
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
        object.font = ctx.fontFamily || "Montserrat";
        add(text, "fontFamily", { values: fonts });
        

        object.fontSize = ctx.fontSize || 30;
        add(text, 'fontSize', {min: 0, step: 1});
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

    
    if (c.transform) {
        const translate = ctxFolder.addFolder("Translate");
        object.translateX = ctx.translateX || 0;
        object.translateY = ctx.translateY || 0;

        add(translate, "translateX");
        add(translate, "translateY");
    }

    const lookUp = {
        blur: "filterBlurAmountPx",
        invert: "filterInvertAmount",
        contrast: "filterContrastAmount",
        brightness: "filterBrightnessAmount",
        huerotate: "filterHueRotateAmount",
        saturate: "filterSaturateAmount",
        sepia: "filterSepiaAmount",
        grayscale: "filterGrayscaleAmount",
    }

    object.filterBlurAmountPx = 0;
    object.filterInvertAmount = 0;
    object.filterContrastAmount = 0;
    object.filterBrightnessAmount = 0;
    object.filterHueRotateAmount = 0;
    object.filterSaturateAmount = 0;
    object.filterSepiaAmount = 0;
    object.filterGrayscaleAmount = 0;
    object.filterCommand = ""; 

    if(c.filter) {
        const filter = ctxFolder.addFolder("Filter effects");
        add(filter, "filterCommand");
        add(filter, "filterBlurAmountPx", {min: 0, max: 60});
        add(filter, "filterInvertAmount", {min: 0, max: 100});
        add(filter, "filterContrastAmount", {min: 0, max: 100});
        add(filter, "filterBrightnessAmount", {min: 0, max: 100});
        add(filter, "filterGrayscaleAmount", {min: 0, max: 100});
        add(filter, "filterHueRotateAmount");
        add(filter, "filterSaturateAmount", {min: 0, max: 100});
        add(filter, "filterSepiaAmount", {min: 0, max: 100});
    }

    object.apply = (ctx) => {
        const filters = object.filterCommand.split(" ");
        let fltStr = ""; 
        filters.forEach(cmd => {
            const filter = lookUp[cmd];
            if(filter) {
                if(cmd === "blur") {
                    fltStr += `${cmd}(${Math.floor(object[filter])}px) `;
                } else if(cmd === "huerotate")
                    fltStr += `hue-rotate(${object[filter]}deg) `;
                else {
                    fltStr += `${cmd}(${object[filter]}%) `;
                }
            }
        })

        ctx.font = `normal ${object.fontSize}px ${object.fontFamily}`;
        ctx.filter = fltStr;
        ctx.translate(object.translateX, object.translateY);

        Object.assign(ctx, object);
    };

    return object;
}
