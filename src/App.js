import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './components/ChatList.js';
import ChatBox from './components/ChatBox.js';
import logo from './logo.svg';
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      username: '',
      chats: []
    };
  }

  doesSomething() {
    return 5;
  }

  componentDidMount() {
    const username = window.prompt('Username: ', 'Anonymous');
    this.setState({ username });
    const pusher = new Pusher('760c1eca936f07dfcdef', {
      cluster: 'us2',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      data.key = Date.now();
      this.setState({ chats: [...this.state.chats, data], test: '' });
    });
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    if (e.keyCode === 13) {
      const payload = {
        username: this.state.username,
        message: this.state.text,
        key: Date.now()
      };
      axios.post('http://localhost:5000/message', payload)
        .then( (resp) => {
          console.log('worked');
        })
        .catch( (err) => {
          console.log(err);
        });
    } else {
      this.setState({ text: e.target.value });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React-Pusher Chat</h1>
        </header>
        <section className="game-section">

        </section>
        <section className="chat-section">
          <ChatList chats={this.state.chats} />
          <ChatBox
            text={this.state.text}
            username={this.state.username}
            handleTextChange={this.handleTextChange}
          /> 
        </section>

      </div>
    );
  }
}

export default App;
