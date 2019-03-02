const React = require('react');
const ReactDOM = require('react-dom');

class Auth extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      signedIn: false,
      authReady: false,
    }
    
    this.onSuccess = this.onSuccess.bind(this);
    this.updateSignedIn = this.updateSignedIn.bind(this);
  }
  
  componentDidMount() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '589643988866-pj92jte8j7de1n04o1frbidqtv995spi.apps.googleusercontent.com'
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignedIn);
        this.renderButton();
        this.setState({
          authReady: true,
        });
      });
    });
  }
  
  componentDidUpdate() {
    if (!this.state.signedIn) {
      this.renderButton();
    }
  }
  
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 120,
      'height': 36,
      'longtitle': false,
      'theme': 'dark',
      'onsuccess': this.onSuccess,
      'onfailure': this.onFailure
    });
  }
  
  onSuccess(googleUser) {
    this.setState({
      signedIn: true,
    });
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  }
  
  onFailure(error) {
    console.log(error);
  }
  
  updateSignedIn(signed) {
    this.setState({
      signedIn: signed,
    });
  }
  
  signOut() {
    console.log("asdf");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
  render() {
    if (!this.state.signedIn) {
      return (
        <div className="container__login">
          <div id="my-signin2"></div>
        </div>
      );
    }
    
    return (
      <div>
        <h1>Hi {gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName()}</h1>
        <div id="my-signin2"></div>
        <div onClick={this.signOut}>Sign out</div>
      </div>
    );
  }
}

ReactDOM.render(<Auth/>, document.getElementById('main'));