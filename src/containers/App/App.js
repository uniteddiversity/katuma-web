import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import config from '../../config';

const NavbarLink = ({to, className, component, children}) => {
  const Comp = component || Link;

  return (
    <Comp to={to} className={className} activeStyle={{
      color: '#33e0ff'
    }}>
      {children}
    </Comp>
  );
};

@connect(
    state => ({user: state.auth.user}),
    dispatch => bindActionCreators({logout, pushState}, dispatch))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState(null, '/groups');
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState(null, '/login');
    }
  }

  static fetchData(getState, dispatch) {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <NavbarLink to="/" className="navbar-brand" component={IndexLink}>
              <div className={styles.brand}/>
              Katuma
            </NavbarLink>

            <ul className="nav navbar-nav">
              <li><NavbarLink to="/widgets">Widgets</NavbarLink></li>
              <li><NavbarLink to="/survey">Survey</NavbarLink></li>
              <li><NavbarLink to="/groups">groups</NavbarLink></li>
              {!user && <li><NavbarLink to="/login">Login</NavbarLink></li>}
              {!user && <li><NavbarLink to="/signup">Signup</NavbarLink></li>}
              {user && <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
            </ul>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.full_name}</strong>.</p>}
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/erikras/react-redux-universal-hot-example"
                   target="_blank" title="View on Github"><i className="fa fa-github"/></a>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="http://www.reactiflux.com/" target="_blank">#react-redux-universal</a> Slack channel.
        </div>
      </div>
    );
  }
}
