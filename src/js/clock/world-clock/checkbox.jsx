import React from 'react';

const CheckBox = (props) => {  
	const calcIndexProp = (i) => {		
		if(props.prevSelected === -1){		
			return i;
		}
		else if(i < props.selected.length){						
			return props.selected[i]; 
		}
		
		let indexBase = i - (props.prevSelected + 1);
		
		props.selected.map(num => {						
			if(num <= indexBase){
				indexBase++;
			}
		});							
		return indexBase;
	};

	const changeList = (idNumber, e) => {
		if(e.target.checked === true){ 
			props.update(
				"select", 
				calcIndexProp(idNumber),  
				"push"
			);
		}
		else {				
			props.update(
				"select", 
				idNumber, 
				"filter"
			);
		} 
	}
	
	return (
		<li key={ props.index }
			style={ props.index <= props.prevSelected ?
					{ color: "#FFA500", fontWeight: "900" } 
				: 
					null }> 
			<input id={ `checkbox${ props.index }` }
				   key={ `checkbox${ props.index }` }
				   className="check"
				   type="checkbox"
				   defaultChecked={ props.index <= props.prevSelected }
				   onChange={ (e) => changeList(props.index, e) }
			/> 
				{ 
					`${ props.time_date[0] }  ${ props.time_date[1] }, ${ props.time_date[2] } ${ props.time_date[3] }`
				}  
		</li>
	);	
};

export default CheckBox;