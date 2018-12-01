import React, { Component } from 'react'
import MapAltStyle from './MapAltStyle'
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react'

const MAP_KEY = 'AIzaSyD3wWdQFP4CHh7ae64mw79EsTr6tCBrpxA';
const Four_ID = '5LIZTQ5MFIEBT3Y5K3SVMEUUL3ZSFE1LB0OVUQH2AQ5ZBQST'
const Four_SECRET = 'MTVXSDHFHY2GCAHFQCNEK04WVMLVKE4E1PF5SK0MVDK2PXIC'
const Four_VERSION = '20181125'



class MapDisplay extends Component {
  state = {
    map: null,
    markers: [],
    markerGroups: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  }

  componentDidMount = {
  }

  componentWillReceiveProps = (props) =>{
    this.setState({firstDrop: false})

    //update markes based one numbers of locations
    if(this.state.markers.length !== props.locations.length) {
      this.closeInfoWindow()
      this.updateMarkers(props.locations)
      this.setState({activeMarker: null})

      return
    }

    //closed infowindoe if selected location is not the same as the active marker
    if(!props.selectedIndex || (this.state.activeMarker &&
      (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
        this.closeInfoWindow()
      }

      //make sure there is a selected location
    if (props.selectedIndex === null || typeof(props.selectedIndex) === 'undefined') {
      return
    }
    //make the selected location as a clicked marker
    this.onMarkerClick(this.state.markerGroups[props.selectedIndex], this.state.markers[props.selectedIndex])
  }

  mapReady = (props, map) => {
    this.setState({map});
    this.updateMarkers(this.props.locations)
  }

  closeInfoWindow = () =>{
    //disable marker animation
    this.state.activeMarker && this.state.activeMarker.setAnimation(null);
    this.setState({ showingInfoWindow: false, activeMarker: null, activeMarkerProps: null})
  }

  getBusinessInfo = (props, data) => {
    //look for matching data(business name) from yelp, and comparing to the data in the json file
    return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name))
  }

  onMarkerClick = (props, marker, event) => {
    //close already opened infowindows
    this.closeInfoWindow();
    //fetch data from foursquare
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${Four_ID}&client_secret=${Four_SECRET}&v=${Four_VERSION}
    &query=bubble%20tea&radius=100&ll=${props.position.lat},${props.position.lng}`
    let headers = new Headers();
    let request = new Request(url, {
      method: 'GET',
      headers
    })

    let activeMarkerProps;
    fetch(request).then(response => response.json())
    .then(result => {
        let bubbleteaSpots = this.getBusinessInfo(props, result)
        activeMarkerProps = {
           ...props,
           foursquare: bubbleteaSpots[0]
        }

        if (activeMarkerProps.foursquare) {
          let url = `https://api.foursquare.com/v2/venues/${bubbleteaSpots[0].id}/photos?client_id=${Four_ID}&client_secret=${Four_SECRET}&v=${Four_VERSION}`
          fetch(url).then(response => response.json())
          .then(result =>{
            activeMarkerProps = {
              ...activeMarkerProps,
              images: result.response.photos
            }
            if (this.state.activeMarker)
              this.state.activeMarker.setAnimation(null)
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE)
              this.setState({showingInfoWindow:true, activeMarker:marker, activeMarkerProps})
          })
        }else {
          marker.setAnimation(this.props.google.maps.Animation.BOUNCE)
          this.setState({ showingInfoWindow:true, activeMarker: marker, activeMarkerProps})
        }
      })
  }

  updateMarkers = (locations) => {
    if (!locations)
      return;

  this.state.markers.forEach(marker => marker.setMap(null));

  let markerGroups = [];
  let markers = locations.map((location, i) => {
     let mPopup = {
       key: i, i,
       name: location.name,
       position: location.position,
       url: location.url,
       review: location.review,
     }
  markerGroups.push(mPopup);

  let animation = this.props.google.maps.Animation.DROP;
  let marker = new this.props.google.maps.Marker({
    position: location.position,
    map: this.state.map,
    animation: animation
  })
  marker.addListener('click', ()=> {
    this.onMarkerClick(mPopup, marker, null);
  })
    return marker;
  })

  this.setState({ markers, markerGroups });
}

  render () {
    const style = {
      width: '100%',
      height: '90%'
    }
    const center = {
      lat: this.props.lat,
      lng: this.props.lon
    }

    let amPopup = this.state.activeMarkerProps;

    return (
      <Map
        role='application'
        aria-label='map'
        onReady={this.mapReady}
        google={this.props.google}
        zoom={this.props.zoom}
        style={style}
        initialCenter={center}
        onClick={this.closeInfoWindow}>
        <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.closeInfoWindow}>
            <div>
             {amPopup && amPopup.url
               ?(
                 <h3><a href={amPopup.url} rel="noopener noreferrer" target='_blank'>{amPopup && amPopup.name}</a></h3>
               )
               :''}

              <spam><h4> Rating: {amPopup && amPopup.review} &#x2605; </h4></spam>
                   {amPopup && amPopup.images
                       ? (
                           <div><img
                               alt={amPopup.name + " food picture"}
                               src={amPopup.images.items[0].prefix + "120x120" + amPopup.images.items[0].suffix}/>
                               <p><h6>Image from Foursquare</h6></p>
                           </div>
                       )
                       : ''
                   }
                </div>
            </InfoWindow>
        </Map>
    )
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: MapAltStyle})(MapDisplay)
