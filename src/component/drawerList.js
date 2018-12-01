import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'

class DrawerList extends Component {
  state = {
    open: false,
    query: ''
  }

  style = {
    list: {
      width: '300px',
      padding: '0px 10px 0px 10px'
    },
    noBullets: {
      listStyleType: 'none',
      padding: 0
    },
    fullList: {
      width: 'auto'
    },
    listItem: {
      marginBottom: '10px'
    },
    listLink: {
      background: 'transparent',
      border: 'none',
      color: 'blue'
    },
    filterEntry: {
      border: '1px solid lightgray',
      padding: '5px',
      margin: '20px 0 15px',
      width: '100%'
    }
  }

  updateQuery = (newQuery) => {
    //update new query state and pass it to the filter
    this.setState({ query: newQuery});
    this.props.filterVenues(newQuery)
  }

  render () {
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.openDrawer}>
          <div style={this.style.list}>
              <input
                  style={this.style.filterEntry}
                  type='text'
                  placeholder='Filter List'
                  name='filter'
                  onChange={e => this.updateQuery(e.target.value)}
                  value={this.state.query} />
              <ul style={this.style.noBullets}>
                  {this.props.locations && this.props.locations.map((location, i) => {
                    return (
                      <li
                      style={this.style.listItem}
                      key={i}>
                      <button style={this.style.listLink}
                      key={i}
                      onClick={(e => this.props.clickListVenue(i))}>
                      {location.name}</button>
                      </li>
                    )
                  })}
                  </ul>
                </div>
              </Drawer>
            </div>

    )
  }
}

export default DrawerList;
