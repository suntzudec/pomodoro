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
			<div id="map-button-cont">
				<button onMouseUp={ () => props.changeSelectState(props.part) }>
					{ "okay" }
				</button>
			</div>
		</section>
	);
};

export default SettingsMapComp;