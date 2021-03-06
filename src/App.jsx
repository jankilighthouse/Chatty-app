import React, {Component} from 'react';
import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name:'Anonymous',color: '#' + Math.floor(Math.random()*16777215).toString(16)},
      messages: [], // messages coming from the server will be stored here as they arrive
      activeUsers: {}
    };
      this.onNewMessage = this.onNewMessage.bind(this);
      this.onNewUser = this.onNewUser.bind(this);
  }
  componentDidMount() {
    console.log('componentDidMount <App />');
    const websocket = new WebSocket ('ws://localhost:3001');
    this.socket = websocket;
    websocket.onopen = (event) => {
      console.log('Connected to server', event);
     }

     websocket.onmessage = (event) => {
       const data = JSON.parse(event.data);
       switch(data.type) {
        case 'incomingMessage':
          // handle incoming message
          const incomingMessage = data;
          const messages= this.state.messages.concat(incomingMessage);
          this.setState({messages:messages});
          break;
        case 'userCount':
          // Handles the online users count
          this.setState({activeUsers: data})
          break;
        case 'incomingNotification' :
          // for handle incoming notification
          const incomingNotification = data;
          const notifications = this.state.messages.concat(incomingNotification);
          this.setState({messages:notifications});
          break;
        default:
          throw new Error('Unknown event type ' + data.type);
       }
     }
  }
 onNewMessage(msg) {
   let newMessage = {type:'postMessage',color:this.state.currentUser.color,username: msg.username,content: msg.content};
   // this.setState(newMessage);
   this.socket.send(JSON.stringify(newMessage));
  }
  onNewUser(username) {
    const notification = {type:'postNotification',color: this.state.currentUser.color,content:'User ' + this.state.currentUser.name + ' has changed their name to User ' + username}
    this.socket.send(JSON.stringify(notification));
    this.setState({currentUser: {name: username, color: this.state.currentUser.color }});
  }
  render() {
      return (
        <div>
          <Navbar activeUsers = {this.state.activeUsers} />
          <MessageList messages={this.state.messages} />
          <ChatBar currentUser={this.state.currentUser.name}
                  onNewMessage = {this.onNewMessage}
                  onNewUser = {this.onNewUser}/>
        </div>
    )
  }
}
export default App;
