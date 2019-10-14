class LSystem {
    constructor(p, x, y, theta) {
        this.p5context = p;
        this.len = 1;
        this.theta = theta;
        this.theta_initial = theta;
        this.num_iters = 5;
        this.rotationAngle = -90;
        this.x_initial = x;
        this.y_initial = y;
        this._x = x;
        this._y = y;
        this._states = [];
        this.translations = {
            "+": "+",
            "-": "-",
            "]": "]",
            "[": "[",
            "F": 'F',
            "f": "f"
        };
        this.translation_descs = {
            "F": "Forward w/ stroke",
            "f": "Forward w/o stroke",
            "+": "Rotate clockwise by rotation angle",
            "-": "Rotate counterclockwise by rotation angle",
            "[": "Save state",
            "]": "Restore saved state"
        }
        this.stroke_translations = ['F'];
        this.user_translations = {}
        this.color_map = {};
        this.axiom = "";
    }

    writeToJson() {
        let jsonData = JSON.stringify(this);
        return jsonData;
    }

    buildFromJsonPath(path) {
        $.getJSON(path, this.buildFromJson);
    }

    buildFromJson(jsonData) {
        for (let field in jsonData) {
            this[field] = jsonData[field];
        }
        this.theta = jsonData.theta_initial;
        this._x = jsonData.x_initial;
        this._y = jsonData.y_initial;
    }

    chunk(str, n) {
        if (str.length <= n) {
            return [str]
        } else {
            return [str.substring(0, n)].concat(this.chunk(str.substring(n, str.length), n))
        }
    }

    // set how much the renderer rotates when +/- appear
    setRotationAngle(angle) {
        this.rotationAngle = angle;
    }

    // Move current position of the renderer to a new x, y coordinate
    shiftPen(newX, newY) {
        this._x = newX;
        this._y = newY;
    }

    // set length of each stroke/line
    setLength(newLen) {
        this.len = newLen;
    }

    //define the initial theta 
    setTheta(newTheta) {
        this.theta = newTheta;
    }

    //set x coord
    setX(newX) {
        this._x = newX;
    }

    //set y coord
    setY(newY) {
        this._y = newY;
    }

    // add a state to the state stack
    pushState() {
        this._states.push({
            x: this._x,
            y: this._y,
            theta: this.theta
        })
    }

    // removed last state from state stack
    popState() {
        return this._states.pop();
    }

    // add a translation to the translation table, also add a translation
    // mapping any translation to itself if there isn't an alternative translation already
    addTranslation(source, translations) {
        this.translations[source] = translations;
        this.user_translations[source] = translations;
        for (const currTranslation in translations) {
            this.addSafeTranslations(currTranslation);
        };
    }

    addStrokeTranslation(input) {
        this.stroke_translations.push(input);
    }

    // add a 'phantom' translation mapping for any unmatched variables 
    addSafeTranslations(translation) {
        for (const char of translation) {
            if (!this.translations[char]) {
                this.translations[char] = char;
            }
        }
    }

    // define initial string
    defineAxiom(axiom) {
        this.axiom = axiom;
    }

    isConstant(char) {
        return this.constants.includes(char);
    }

    selectedTranslation(possibleTranslations) {
        let numPossibilities = possibleTranslations.length;
        let selectedIndex = Math.round(Math.random() * (numPossibilities - 1));
        return possibleTranslations[selectedIndex];
    }

    translateAxiom(iterations, curr_axiom = this.axiom) {
        if (iterations == 0) {
            return curr_axiom;
        } else {
            let translation = "";
            for (const char of curr_axiom) {
                if (this.translations[char]) {
                    let possibleTranslations = this.translations[char];
                    let selectedTranslation = this.selectedTranslation(possibleTranslations);
                    translation += selectedTranslation;
                } else if (this.color_map.hasOwnProperty(char)) {
                    continue;
                } else {
                    throw "Undefined Translation for char: " + char;
                }
            }
            return this.translateAxiom(iterations - 1, translation);
        }
    }

    drawString(input_s) {
        for (const char of input_s) {
            if (this.stroke_translations.indexOf(char) > -1) {
                var newX = this._x + this.len * this.p5context.cos(this.theta);
                var newY = this._y + this.len * this.p5context.sin(this.theta);
                this.p5context.line(this._x, this._y, newX, newY);
                this._x = newX;
                this._y = newY;
            } else if (char === 'f') {
                var newX = this._x + this.len * this.p5context.cos(this.theta);
                var newY = this._y + this.len * this.p5context.sin(this.theta);
                this._x = newX;
                this._y = newY;
            } else if (char === '+') {
                this.theta += this.rotationAngle;
            } else if (char === '-') {
                this.theta -= this.rotationAngle;
            } else if (char === '[') {
                this.pushState()
            } else if (char === ']') {
                let restoreState = this.popState();
                if (restoreState) {
                    this.setX(restoreState.x);
                    this.setY(restoreState.y);
                    this.setTheta(restoreState.theta);
                }
            } else if (this.color_map.hasOwnProperty(char)) {
                this.p5context.stroke(this.color_map[char][0], this.color_map[char][1], this.color_map[char][2]);
            }
        }
    }

    displayLsystemDetails(div_id) {
        let details = $(div_id);
        details.append("<p><span class = 'detail_tag'>lsystem</span> {</p>")
        details.append("<p>&nbspStroke Length : " + this.len + ",</p>");
        details.append("<p>&nbspIntial Angle&nbsp: " + this.theta + ",</p>");
        details.append("<p>&nbspRotation Angle : " + this.rotationAngle + ",</p>")
        details.append("<p>&nbspOriginal Axiom : " + this.axiom + ",</p>");
        details.append("<p>&nbspBuilt-in Terms: </p>");
        for (const elm in this.translation_descs) {
            details.append("<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + elm + " -> " + this.translation_descs[elm] + ",</p>");
        }
        details.append("<p>&nbsp&nbsp&nbspTranslations&nbsp&nbsp: </p>");
        for (const elm in this.user_translations) {
            let multiple_translations = "";
            multiple_translations += ("<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + elm + " -> ")
            if (this.user_translations[elm].length == 1) {
                multiple_translations += (this.user_translations[elm] + ",</p>");
            } else {
                for (const translation in this.user_translations[elm]) {
                    multiple_translations += this.user_translations[elm][translation] + " or ";
                }
                multiple_translations = multiple_translations.substring(0, multiple_translations.length - 3)
                multiple_translations += "</p>";
            }
            details.append(multiple_translations);
        }
        details.append("<p>&nbsp&nbsp&nbspColor Map&nbsp&nbsp: </p>");

        for (let field in this.color_map) {
            if (this.color_map.hasOwnProperty(field)) {
                details.append("<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + field + " -> rgb(" + this.color_map[field] + ")</p>");
            }
        }

        let strokes_terms = "<p>&nbsp&nbsp&nbspStroke Terms &nbsp: ";
        for (const i in this.stroke_translations) {
            strokes_terms += this.stroke_translations[i] + ", "
        }
        strokes_terms += "</p>"
        details.append(strokes_terms)
        details.append("<p>}</p>")

    }
}