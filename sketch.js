function setup() {
    angleMode(DEGREES);
    createCanvas(500, 500);
    background(0);
    stroke(126, 222, 229);
    strokeWeight(1);
    let lsystem = new LSystem(250, 450);
    lsystem.setLength(5);
    lsystem.setRotationAngle(-25);
    lsystem.setTheta(-90);
    lsystem.addTranslation("F", ["FF"]);
    lsystem.addTranslation("X", ["F+[[X]-X]-F[-FX]+X", "F-[[X]+X]+F[+FX]-X"]);
    lsystem.defineAxiom("X");
    let transOut = lsystem.translateAxiom(5);
    lsystem.drawString(transOut);
}

function draw() {}

function chunked(str, n) {
    if (str.length <= n) {
        return [str]
    } else {
        return [str.substring(0, n)].concat(chunked(str.substring(n, str.length), n))
    }
}