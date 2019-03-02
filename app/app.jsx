const React = require('react');
const ReactDOM = require('react-dom');

class Auth extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      signedIn: false,
      googleUser: null,
      message: null,
    }
    
    this.onSuccess = this.onSuccess.bind(this);
    this.updateSignedIn = this.updateSignedIn.bind(this);
    this.connectToBackend = this.connectToBackend.bind(this);
  }
  
  componentDidMount() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '589643988866-pj92jte8j7de1n04o1frbidqtv995spi.apps.googleusercontent.com'
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignedIn);
        this.renderButton();
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
      googleUser,
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
    gapi.auth2.getAuthInstance().signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
  connectToBackend() {
    const id_token = this.state.googleUser.getAuthResponse().id_token;
    
    fetch('/auth', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": id_token,
      },
      body: JSON.stringify({token: id_token}),
    }).then(res => {
      res.json().then((result => {
        this.setState({message: result.result});
      }));
    })
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
        <h1>Hi {this.state.googleUser.getBasicProfile().getGivenName()}</h1>
        <a href="#" onClick={this.connectToBackend}>Authenticate with back-end</a><br/>
        <a href="#" onClick={this.signOut}>Sign out</a><br/>
        <div>{this.state.message}</div>
      </div>
    );
  }
}

ReactDOM.render(<Auth/>, document.getElementById('main'));