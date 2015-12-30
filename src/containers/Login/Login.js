import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import * as authActions from 'redux/modules/auth';

@connect(
  () => ({}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit(event) {
    event.preventDefault();
    const login = this.refs.login;
    const password = this.refs.password;
    this.props.login({
      login: login.value,
      password: password.value,
    });
    login.value = '';
    password.value = '';
  }

  render() {
    return (
      <div className="container">
        <DocumentMeta title="React Redux Example: Login"/>
        <h1>Login</h1>
        <div>
          <form className="login-form" onSubmit={::this.handleSubmit}>
            <div className="form-group">
              <input className="form-control" type="text" ref="login" placeholder="Enter your email or username"/>
            </div>
            <div className="form-group">
              <input className="form-control" type="password" ref="password" placeholder="Enter your password"/>
            </div>
            <button className="btn btn-success" onClick={::this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Log In
            </button>
          </form>
          <p>This will "log you in" as this user, storing the username in the session of the API server.</p>
        </div>
      </div>
    );
  }
}
