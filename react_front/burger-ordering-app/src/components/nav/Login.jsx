import React from 'react';
import './Authentication.css';

export const Login = () => {
  const hideMainContainer = () => {
    // Implement the logic to hide the main container
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const toggleContainers = () => {
    // Implement the logic to toggle containers
  };

  return (
    <>
      <section className="main-container" id="main-container" onClick={hideMainContainer}>
        <div className="signin-container" id="signin-container" onClick={(event) => stopPropagation(event)}>
          <h1>Login</h1>
          <form method="post">
            <div className="txt_field">
              <input type="text" name="email" required />
              <span></span>
              <label>Email</label>
            </div>
            <div className="txt_field">
              <input type="password" name="userpassword" required />
              <span></span>
              <label>Password</label>
            </div>
            <div className="pass">Forgot Password?</div>
            <button className="login-btn">Login</button>
            <div className="signup_link">
              <h3>
                Not a member? <a onClick={toggleContainers}>Sign Up</a>
              </h3>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
