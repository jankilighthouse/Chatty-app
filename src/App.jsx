import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state =
            {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        { id:1,
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id:2,
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
    }
  ]

}
    this.onNewMessage = this.onNewMessage.bind(this);
    this.onNewUser = this.onNewUser.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount <App />");

  }
 onNewMessage(msg) {
    // console.log(msg);
    let newId = this.state.messages.length + 1;
    let newMessage = {id:newId,username: msg.username,content: msg.content};
    let templist = this.state.messages;
    templist.push(newMessage);
    this.setState({
          messages: templist
      })

  }
  onNewUser(username) {
    this.setState({
          currentUser: {name:username}
      })
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
