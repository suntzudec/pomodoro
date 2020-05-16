export function forwardDirector(index, diff, base, cond){
	return index + diff > base ? 
		cond 
	: 
		index + diff;
}

export function backwardDirector(index, diff, base, cond){
	return index + diff < base ? 
		cond 
	: 
		index + diff;
}

export function valueLimitCheck(xdiff, ydiff){
	return (Math.abs(xdiff) <= 35 && Math.abs(ydiff) <= 40);
}

export function toSVGPoints(cx, cy){
	let svgPoint = document.getElementById("circle").createSVGPoint();
		svgPoint.x = cx;
		svgPoint.y = cy;
	
	let ctm = document.getElementById("select-circ").getScreenCTM();
		ctm = ctm.inverse();
		svgPoint = svgPoint.matrixTransform(ctm);
		
	return svgPoint;
}

export function setPassProps(e, dim){ 																
	if(dim === "x"){
		return e.screenX || e.touches[0].screenX;
	}
	else if(dim === "cx"){
		return e.clientX || e.touches[0].clientX;
	}
	else if(dim === "cy"){
		return e.clientY || e.touches[0].clientY;
	}
	else {
		return e.screenY || e.touches[0].screenY;
	}
}