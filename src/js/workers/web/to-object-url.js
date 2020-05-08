const codeToObjectURL = (block) => { 
	let toStr = block.toString();
		toStr = toStr.slice(
			toStr.indexOf("{") + 1, toStr.lastIndexOf("}")
		);
	const blob = new Blob(
			[ toStr ], 
			{ type: "application/javascript" }
		);
	
	return new Worker(
		URL.createObjectURL(blob), 
		{ type: 'module' }
	); 
};

export default codeToObjectURL; 