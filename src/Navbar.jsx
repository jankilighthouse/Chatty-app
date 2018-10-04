import React, {Component} from 'react';
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span className='user-count'> {this.props.activeUsers.count} users online</span>
      </nav>
    )
  }
}
export default Navbar;
