import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {

  const messages = this.props.messages.map(message =>{
    return (
      <Message username={message.username} content= {message.content} key={message.id}/>)
  });

    return (
      <main className="messages">
        { messages }
    </main>
    );
  }
}
export default MessageList;

