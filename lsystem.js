function Lsystem(){
	this.translation = {"+" : "+" , "-" : "-", "]":"]" , "[": "["};
	this.len = 5;
	this.angle = 90;
	this.axioms = [];

	this.x = 500;
	this.y = 1000;
	this.theta = -90;
	this.state_stack = [];

	this.define_len = function (new_len) {
		this.len = new_len;
	}

	this.define_angle = function (new_angle) {
		this.angle = new_angle;
	}

	this.add_translation = function (alphabet, replacement)	{
		this.translation[alphabet] = replacement;
	}

	this.add_axiom = function (ax) {
		this.axioms.push(ax);
	}

	this.define_x = function(x){
		this.x = x;
	}

	this.define_y = function(y){
		this.y = y;
	}

	this.define_theta = function(theta){
		this.theta = theta;
	}

	this.define_state = function(x, y, theta){
		this.define_x(x);
		this.define_y(y);
		this.define_theta(theta);
	}

	this.translate_string = function (input_s, iters){
		if (iters == 0){
			return input_s;
			console.log(input_s);
		}
		else{
			var translated_s = "";
			for(var i = 0; i<input_s.length; i++){
				if(this.translation[input_s.charAt(i)]){
					translated_s+=this.translation[input_s.charAt(i)];	
				}
				else{
					throw "undefined translation in string";
				}
			}
			return this.translate_string(translated_s,iters-1);
		}
	}

	this.isAxiom = function (propAx) { 
		for(var i = 0; i < this.axioms.length; i++){
			if(this.axioms[i] == propAx){
				return true;
			}
		}
		return false;
	}

	this.draw_string = function (draw_string){
		stroke(Math.random() * 255,Math.random() * 255,Math.random() * 255);
		for(var i=0;i<draw_string.length; i++){
				if(this.isAxiom(draw_string.charAt(i))){
					var new_x = this.x + this.len*cos(this.theta);
					var new_y = this.y + this.len*sin(this.theta);
					line(this.x,this.y,new_x,new_y);
					this.x = new_x;
					this.y = new_y;
				}
				else if(draw_string.charAt(i) == '+'){
					this.theta += this.angle;
				}
				else if(draw_string.charAt(i) == '-'){
					this.theta -= this.angle;
				}
				else if(draw_string.charAt(i) == '['){
					var state = {'x':this.x, 'y': this.y, 'theta':this.theta};
					this.state_stack.push(state);
				}
				else if(draw_string.charAt(i) == ']'){
					var restore_state = this.state_stack.pop();
					this.define_state(restore_state.x, restore_state.y, restore_state.theta);
				}
			}
	}
}