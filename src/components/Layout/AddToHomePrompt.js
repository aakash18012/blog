import React, { Component } from 'react';
import './addToHomePrompt.scss';

class AddToHomePrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrompt: true,
      deferredPrompt: null,
      outcome: 'Not Triggered Yet...',
    };
  }

  componentDidMount() {
    this.state.listener = window.addEventListener(
      'beforeinstallprompt',
      this.handlePrompt,
    );

    this.state.appinstalled = window.addEventListener(
      'appinstalled',
      this.handleAppInstalled,
    );
  }

  componentWillUnmount() {
    this.state.listener = window.removeEventListener(
      'beforeinstallprompt',
      this.handlePrompt,
    );

    this.state.appinstalled = window.removeEventListener(
      'appinstalled',
      this.handleAppInstalled,
    );
  }

  handleAppInstalled() {
    this.setState({
      outcome: 'Thank you for install this APP',
    });
  }

  handlePrompt(e) {
    e.preventDefault();
    this.setState({
      deferredPrompt: e,
      showPrompt: true,
    });
  }

  handleClick() {
    // hide our user interface that shows our A2HS button
    this.setState({ showPrompt: false });
    // Show the prompt
    this.state.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.state.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        this.setState({ outcome: 'User accepted the A2HS prompt' });
      } else {
        this.setState({
          outcome: 'User dismissed the A2HS prompt',
          showPrompt: true,
        });
      }

      this.setState({ deferredPrompt: null });
    });
  }

  render() {
    return (
      <div className="m-addToHomePrompt">
        <p>{this.state.outcome}</p>
        {this.state.showPrompt === true && (
          <button className="btn btn-info" onClick={e => this.handleClick(e)}>
            Add to Home Screen
          </button>
        )}
      </div>
    );
  }
}

export default AddToHomePrompt;
