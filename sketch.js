let qt;
let count = 0;
let points=[];
function setup(){
	createCanvas(400,400);
	qt = new Rtree(); //each section just could have 4 elements
}
function draw(){
	background(0);
	if (mouseIsPressed){
		for (let i = 0; i < 1; i++){
			let m = [mouseX + random(-5,5), mouseY + random(-5,5)];
			qt.insert(qt.root,m);
			points.push(m);
		}
	}
	background(0);
	show(qt.root,[0,255,0]);
	for ( let i = 0 ; i < points.length ; i ++){
		fill(0,255,0);
		circle(points[i][0],points[i][1],2); //200-y para q se dibuje apropiadamente
	}
}