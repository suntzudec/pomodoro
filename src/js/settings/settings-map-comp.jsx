import React from 'react';

const SettingsMapComp = (props) => {
	return (
		<section className="section">    
			<ul className="list">
				{
					props.collection.map((val, i) => {
						return (
							<li key={ `settings-zone-${ i }-li`}>
								<input id={ `${ i }-radio` }
									   name="settings-comp-group"
									   type="radio" 
									   defaultChecked={ i === props.index } 
									   onChange={ () => props.setIndexState(i, props.part) }
								/>
								<label key={ `settings-zone-${ i }-label` }
									   htmlFor={ `${ i }-radio` }>	  
									{
										props.func(val)
									}
								</label>	
							</li>
						);
					})
				}
			</ul>
			<button className={ props.part !== 'home' ? 'not-home' : null } 
					onMouseUp={ () => props.changeSelectState(props.part) }>
				{ "okay" }
			</button>
		</section>
	);
};

export default SettingsMapComp;