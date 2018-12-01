import React, { Component } from 'react'
import './App.css'
import MapDisplay from './component/MapDisplay'
import locations from './data/locations.json'
import DrawerList from './component/drawerList'

class App extends Component {
  state = {
    //Downtown San Jose, by default
    lat: 37.3345806,
    lon: -121.8728443,
    zoom: 15,
    all: locations,
    filtered: null,
    open: false
  }

  style = {
    menu: {
      margin:'10px 0 0 20px',
      position: 'absolute',
      width: '35px',
    height: '30px',
    background: 'white',
  },
  hide :{
      display: 'none'
  },
  header: {
    margin: 0,
  }
}

  componentDidMount=()=> {
    this.setState({
      ...this.state,
      filtered: this.filterVenues(this.state.all, '')
    })
  }

  openDrawer = () =>{
    //toggle left menu to be displayed or not
    this.setState({
      open: !this.state.open
    })
  }

  updateQuery = (query) =>{
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterVenues(this.state.all, query)
    })
  }

  filterVenues = (venues, query) => {
   // Filter locations to match query string
   return venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
 }

  clickListVenue = (i) =>{
    this.setState({ selectedIndex: i, open: !this.state.open})
  }

  render () {
    return (
      <div className = 'App'>
        <div>
          <button onClick={this.openDrawer} style={this.style.menu}>
            <i className='fa fa-bars'></i>
            </button>
            </div>
        <header>
          <h1> Neighborhood Map - Milk Tea Spots! </h1>
        </header>
        <div className = 'Map'>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
          clickListVenue={this.clickListVenue} />
          </div>
          <DrawerList
            locations={this.state.filtered}
            open={this.state.open}
            openDrawer={this.openDrawer}
            filterVenues={this.updateQuery}
            clickListVenue={this.clickListVenue}/>
        </div>
    )
  }
}

export default App;
