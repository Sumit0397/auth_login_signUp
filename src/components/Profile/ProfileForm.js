import { useContext, useRef } from 'react';
// import {useHistory} from 'react-router-dom';
import classes from './ProfileForm.module.css';
import AuthContext from '../Store/auth-context';

const ProfileForm = () => {

  // const history = useHistory();

  const newPasswordInputRef = useRef('');
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const newPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDpcWGAiJ1tQipNkYjw9eDG4TkDAzE5g2U',{
      method : "POST",
      body : JSON.stringify({
        idToken	: authCtx.token,
        password : newPassword,
        returnSecureToken	: true	
      }),
      headers : {
        "Content-Type" : "application/json"
      }
    }).then((res) => {

      // history.replace('/');
    })

  }

  return (
    <form className={classes.form} onClick={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
