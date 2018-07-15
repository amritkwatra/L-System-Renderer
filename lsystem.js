class LSystem {
    constructor(x, y) {
        this.len = 1;
        this.theta = 90;
        this.rotationAngle = -90;
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
        this.color_map = {};
        this.axiom = "";
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
        for (const currTranslation in translations) {
            this.addSafeTranslations(currTranslation);
        };
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
                } else {
                    throw "Undefined Translation for char: " + char;
                }
            }
            return this.translateAxiom(iterations - 1, translation);
        }
    }

    drawString(input_s) {
        for (const char of input_s) {
            switch (char) {
                case 'F':
                    var newX = this._x + this.len * cos(this.theta);
                    var newY = this._y + this.len * sin(this.theta);
                    line(this._x, this._y, newX, newY);
                    this._x = newX;
                    this._y = newY;
                    break;
                case 'f':
                    var newX = this._x + this.len * cos(this.theta);
                    var newY = this._y + this.len * sin(this.theta);
                    this._x = newX;
                    this._y = newY;
                    break;
                case '+':
                    this.theta += this.rotationAngle;
                    break;
                case '-':
                    this.theta -= this.rotationAngle;
                    break;
                case '[':
                    this.pushState();
                    break;
                case ']':
                    let restoreState = this.popState();
                    if (restoreState) {
                        this.setX(restoreState.x);
                        this.setY(restoreState.y);
                        this.setTheta(restoreState.theta);
                        break;
                    }
                default:
                    break;
            }
        }
    }
}