import React from 'react'
import '../Universal/css/Admin.css'


export class Template_Class extends React.Component {
    constructor(props) 
    {
      super(props);
      this.state = {
        count: 0
      };
      this.props=props
      this.console = () => {
        console.log(this)
      }
    }

  
    render() {
      return (
        <div>
            {this.console()}
          <p>You clicked {this.state.count} times</p>
          <button onClick={() => this.setState({ count: this.state.count + 1 })}>
            Click me
          </button>
        </div>
      );
    }
  }
