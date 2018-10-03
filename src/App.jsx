import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [] // messages coming from the server will be stored here as they arrive
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
        case 'incMessage':
        const incMessage = data;
        const messages= this.state.messages.concat(incMessage);
        this.setState({messages:messages});
        break;

        case 'incUser':
        const incUser = data;
        const currentUser = this.state.currentUser.name.concat(incUser);
        //this.setState({currentUser:currentUser})
        break;

        default:
          throw new Error('Unknown event type ' + data.type);
       }
     }

  }

 onNewMessage(msg) {
    // console.log(msg);
    // let newId = this.state.messages.length + 1;
    let newMessage = {type:'postmessage',username: msg.username,content: msg.content};
    let templist = this.state.messages;
    this.socket.send(JSON.stringify(newMessage));
    // templist.push(newMessage);
    // this.setState({
    //       messages: templist
    //   })

  }
  onNewUser(username) {
    const neUser = {type:'postUser',username:username}
    this.socket.send(JSON.stringify(neUser));
    this.setState({currentUser: {name: username}});
    console.log(this.state.currentUser)
  }
  render() {

      return (
        <div>
          <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
          </nav>

          <MessageList messages={this.state.messages} />
          <ChatBar currentUser={this.state.currentUser.name}
                  onNewMessage = {this.onNewMessage}
                  onNewUser = {this.onNewUser}/>
        </div>
    )
  }

}

export default App;
