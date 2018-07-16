let translation;
let lsystem = new LSystem(250, 500);
let chunked_translation;
let chunk_i = 0;
let chunk_size = 150;

function setup() {
    angleMode(DEGREES);
    var canvas = createCanvas(500, 500);
    canvas.parent("sketch_container")
    background(0);
    stroke(255, 255, 255);
    strokeWeight(1);
    lsystem.setLength(2.5);
    lsystem.setRotationAngle(-25);
    lsystem.setTheta(-90);
    lsystem.addTranslation("F", ["FF"]);
    lsystem.addTranslation("X", ["F+[[X]-X]-F[-FX]+X", "F-[[X]+X]+F[+FX]-X"]);
    lsystem.defineAxiom("X");
    translation = lsystem.translateAxiom(6);
    chunked_translation = chunked(translation, chunk_size);
    displayLsystemDetails(lsystem);
}

function draw() {
    // background(0, 1);
    if (chunk_i === chunked_translation.length) {
        noLoop();
    } else {
        lsystem.drawString(chunked_translation[chunk_i]);
        chunk_i++;
    }
}

function chunked(str, n) {
    if (str.length <= n) {
        return [str]
    } else {
        return [str.substring(0, n)].concat(chunked(str.substring(n, str.length), n))
    }
}

function displayLsystemDetails(lsystem) {
    let details = $("#lsystem-details");
    details.append("<p>lsystem {</p>")
    details.append("<p>&nbsp&nbsp&nbspStroke Length : " + lsystem.len + ",</p>");
    details.append("<p>&nbsp&nbsp&nbspIntial Angle&nbsp&nbsp: " + lsystem.theta + ",</p>");
    details.append("<p>&nbsp&nbspRotation Angle : " + lsystem.rotationAngle + ",</p>")
    details.append("<p>&nbsp&nbspOriginal Axiom : " + lsystem.axiom + ",</p>");
    details.append("<p>&nbsp&nbsp&nbspBuilt-in Terms: </p>");
    for (const elm in lsystem.translation_descs) {
        details.append("<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + elm + " -> " + lsystem.translation_descs[elm] + ",</p>");
    }
    details.append("<p>&nbsp&nbsp&nbspTranslations&nbsp&nbsp: </p>");
    for (const elm in lsystem.user_translations) {
        let multiple_translations = "";
        multiple_translations += ("<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + elm + " -> ")
        if (lsystem.user_translations[elm].length == 1) {
            multiple_translations += (lsystem.user_translations[elm] + ",</p>");
        } else {
            for (const translation in lsystem.user_translations[elm]) {
                multiple_translations += lsystem.user_translations[elm][translation] + " or ";
            }
            multiple_translations = multiple_translations.substring(0, multiple_translations.length - 3)
            multiple_translations += "</p>";
        }
        details.append(multiple_translations);
    }
    details.append("<p>}</p>")

}