import React, { Fragment, useEffect } from "react";
import { setAlert } from "../../actions/alert"; //useState is a hook
import { connect } from "react-redux"; 
import { getCurrentProfile } from '../../actions/profile'
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner"
import { Link } from "react-router-dom";
//get profile as soon as this loads, so we gna use useEffect
const Dashboard = ({getCurrentProfile, auth: { user }, profile: {profile, loading}}) => {
  useEffect(() => {
    getCurrentProfile(); //can add [] as second parameter to only run once
  }, []);//runninf one
  return loading && profile === null ? <Spinner /> : <>
    ,<h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user">Welcome { user && user.name }</i>
    </p>
    {profile != null ? (
      <>
        has
      </>
    ) : (
      <>
       <p>You have not yet setup aprofile, please add some info</p>
       <Link to='create-profile' className="btn btn-primary my-1"> 
        Create Profile
       </Link>
      </>
    )}
  </>;
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,

});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
