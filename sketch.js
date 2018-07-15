let translation;
let lsystem = new LSystem(250, 500);

function setup() {
    angleMode(DEGREES);
    createCanvas(1000, 500);
    background(0);
    stroke(126, 222, 229);
    strokeWeight(1);
    lsystem.setLength(2.5);
    lsystem.setRotationAngle(-25);
    lsystem.setTheta(-90);
    lsystem.addTranslation("F", ["FF"]);
    lsystem.addTranslation("X", ["F+[[X]-X]-F[-FX]+X", "F-[[X]+X]+F[+FX]-X"]);
    lsystem.defineAxiom("X");
    translation = lsystem.translateAxiom(6);
    lsystem.drawString(translation);
}

function draw() {}

function chunked(str, n) {
    if (str.length <= n) {
        return [str]
    } else {
        return [str.substring(0, n)].concat(chunked(str.substring(n, str.length), n))
    }
}