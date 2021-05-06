import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux"; //if wannna use action you must pass it into connect at the bottom

const Alert = ({ alerts }) => 
alerts!==null && alerts.length > 0 && alerts.map( alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
))


Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
};
//get alert state

const mapStateToProps = state => ({
    alerts: state.alert
})

//2nd param is action
export default connect(mapStateToProps)(Alert)
