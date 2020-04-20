import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppSettings from '../app-settings.jsx';
import { setIndex, changeSelect, changeHomeClockDisp, recordPrevHash, changeValue, increaseVolume } from './action-creators.js';

const mapDispatchToProps = (dispatch) => ({
	changeSelectState: (part) => dispatch(changeSelect(part)),
	setIndexState: (index, key) => dispatch(setIndex(index, key)),
	changeHomeClockDispState: () => dispatch(changeHomeClockDisp()),
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash)),
	changeValueState: (key, value) => dispatch(changeValue(key, value)),
	increaseVolumeState: () => dispatch(increaseVolume())
});

const mapStateToProps = (state) => {
	return {
		indexObj: state['settingsReducer']['indices'],
		homeSelect: state['settingsReducer']['home-select'],
		homeDisplay: state['settingsReducer']['home-display'],
		prevHash: state['settingsReducer']['prev-hash'],
		selectObj: state['settingsReducer']['select'],
		valueObj: state['settingsReducer']['values'],
		incr_vol: state['settingsReducer']['increase-vol']
		
	};
};

const AppSettingsConnect = withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AppSettings)
);

export default AppSettingsConnect;

