let lSystemSketch = data => p5Context => {
    let jsonData = data;
    let translation;
    let lsystem = new LSystem(p5Context, 350, 580, 90);
    let chunked_translation;
    let chunk_i = 0;
    let chunk_size = 200;

    p5Context.setup = function () {
        p5Context.angleMode(p5Context.DEGREES);
        var canvas = p5Context.createCanvas(700, 580);
        canvas.parent("sketch_container");
        p5Context.background(0);
        p5Context.stroke(177, 0, 0);
        p5Context.strokeWeight(0.8);
        lsystem.buildFromJson(jsonData);
        translation = lsystem.translateAxiom(lsystem.num_iters);
        // lsystem.setLength(5);
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
};

function startLSystemSketch(data) {
    new p5(lSystemSketch(data));
}