import React, { Fragment, useState } from "react"; //useState is a hook
import { connect } from "react-redux"; //if wannna use action you must pass it into connect at the bottom
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert"; //useState is a hook
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

//pass in props into our component
const Register = ({ setAlert, register, isAuthenticated }) => {
  //state will be form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  // const onChange = e => setFormData({ ...formData, name: e.target.value })//will only change name
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  // else {
  //   return <Redirect to='/landing' />;
  // }

  return (
    <Fragment>
      <h2 className='large text-primary'>Sign Up</h2>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            onChange={(e) => onChange(e)}
            value={name}
            name='name'
            // required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            // required
            onChange={(e) => onChange(e)}
            value={email}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            onChange={(e) => onChange(e)}
            value={password}
            // required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            onChange={(e) => onChange(e)}
            value={password2}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired, //react snippits ptfr
  register: PropTypes.func.isRequired, //react snippits ptfr
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

//conect 2 things any sate that you want to map, {object with actions you want to use
//allows to access to props.set alert
export default connect(mapStateToProps, { setAlert, register })(Register);
