import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
  const messages = this.props.messages.map(message =>{

    if(message.type === 'incomingNotification') {
      return (
      <div className="message system" key={message.id}>
        {message.content}
        </div>)
         } else {
          return (
            <Message username={message.username} content= {message.content} key={message.id} color={this.props.color}/>)
         }
  });
    return (
      <main className="messages">
        { messages }
    </main>
    );
  }
}
export default MessageList;
