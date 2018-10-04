import React, {Component} from 'react';

import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [], // messages coming from the server will be stored here as they arrive
      activeUsers: {}
    };
      this.onNewMessage = this.onNewMessage.bind(this);
      this.onNewUser = this.onNewUser.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const websocket = new WebSocket ('ws://localhost:3001');
    this.socket = websocket;
    websocket.onopen = (event) => {
    console.log('Connected to server', event);
     }

     websocket.onmessage = (event) => {
      console.log(event);
       const data = JSON.parse(event.data);
        console.log(data);

       switch(data.type) {
        case 'incomingMessage':
        const incomingMessage = data;
        const messages= this.state.messages.concat(incomingMessage);
        this.setState({messages:messages});
        break;

        case 'userCount':
        this.setState({activeUsers: data})
        break;

        case 'incomingNotification' :
          // for handle incoming notification
        const incomingNotification = data;
        const notifications = this.state.messages.concat(incomingNotification);
        this.setState({messages:notifications});
        break;

        // case 'incomingUser':
        // const incUser = data;
        // const currentUser = this.state.currentUser.name.concat(incUser);
        // //this.setState({currentUser:currentUser})
        // break;

        default:
          throw new Error('Unknown event type ' + data.type);
       }
     }

  }

 onNewMessage(msg) {
    // console.log(msg);
    // let newId = this.state.messages.length + 1;
    let newMessage = {type:'postMessage',username: msg.username,content: msg.content};
    let templist = this.state.messages;
    this.socket.send(JSON.stringify(newMessage));
    // templist.push(newMessage);
    // this.setState({
    //       messages: templist
    //   })

  }
  onNewUser(username) {
    const notification = {type:'postNotification',content:'User ' + this.state.currentUser.name + ' has changed their name to User ' + username}
    this.socket.send(JSON.stringify(notification));
    this.setState({currentUser: {name: username}});
    console.log(this.state.currentUser)

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
