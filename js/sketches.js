let lSystemSketch = (data) => (p5Context) => {
    let jsonData = data;
    let translation;
    let lsystem = new LSystem(p5Context, 350, 580, 90);
    let chunked_translation;
    let chunk_i = 0;
    let chunk_size = 200;

    p5Context.setup = function () {
        p5Context.angleMode(p5Context.DEGREES);
        var canvas = p5Context.createCanvas(700, 580);
        canvas.parent("sketch_container")
        p5Context.background(0);
        p5Context.stroke(255, 255, 255);
        p5Context.strokeWeight(1);
        lsystem.buildFromJson(jsonData);
        translation = lsystem.translateAxiom(8);
        lsystem.setLength(0.75);
        chunked_translation = lsystem.chunk(translation, chunk_size);
        lsystem.displayLsystemDetails("#lsystem-details");
    };

    p5Context.draw = function () {
        // background(0, 1);
        if (chunk_i === chunked_translation.length) {
            p5Context.noLoop();
        } else {
            lsystem.drawString(chunked_translation[chunk_i]);
            chunk_i++;
        }
    };
}

function startLSystemSketch(data) {
    new p5(lSystemSketch(data));
}