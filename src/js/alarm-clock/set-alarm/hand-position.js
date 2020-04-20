export function alarmCalcDirector(pos, yStart, yChange, xStart, xChange){
	const top = pos === 12,
		right = pos <= 5,
		 left = pos < 12 && pos > 6,
	   bottom = pos === 6
	
	if(top){
		return xStart <= xChange;
	}
	else if(bottom){
		return xStart >= xChange;
	}
	else if(right){
		return yStart <= yChange;
	}
	else if(left){
		return yStart >= yChange;
	}
}

export function alarmIndexDirector(index, direction){
	if(direction){
		return index === 11 ?
				0
			:
				index + 1;
	}
	else {
		return index === 0 ? 
				11
			:
				index - 1;
	}
}