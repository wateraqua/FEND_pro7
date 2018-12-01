import React, { Component } from 'react'

class MapAltStyle extends Component {
  state= {
    show:false,
    timeout: null
  }

  componentDidMount = () => {
    let timeout = window.setTimeout(this.showMessage, 1000)
    this.setState({timeout})
  }

  componentWillUnmount = () => {
    window.clearTimeout(this.state.timeout)
  }

  showMessage =() => {
    this.setState({show: true})
  }

  render () {
    return (
      <div>
        {this.state.show
          ? (
              <div>
                <h1> Oops! Something went wrong! </h1>
                 <p>
                    Map is not loading! Try again!</p>
                    </div>
          )
          : (<div><h1> Working on it... </h1></div>)
        }</div>
    )
  }
}

export default MapAltStyle;
