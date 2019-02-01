import React, { Component } from 'react';
import Particles from 'react-particles-js';
import 'tachyons';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const particlesOptions = {
 particles: {
   number: {
    value: 100,
    density: {
      enable: true,
      value_area: 800,
    }
   }
  }
}

const intialState= {
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user: {
    id:'',
    name: '',
    email:'',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = intialState;
  }

  loadUser = (userData) => {
    this.setState({user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        entries: userData.entries,
        joined: userData.joined
    }})
  }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) =>  {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>  {
    this.setState({imageUrl: this.state.input});
       fetch('https://lit-scrubland-88405.herokuapp.com/imageUrl', {
          method: "post",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            input: this.state.input
          })
        })
       .then(response => response.json())
       .then(response => {
          if (response) {
            fetch('https://lit-scrubland-88405.herokuapp.com/image', {
              method: "put",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
            this.setState(Object.assign(this.state.user, {entries:count}))
            })
            .catch(error => console.log(error));
          }  
          this.displayFaceBox(this.calculateFaceLocation(response))
     });
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(intialState)
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    else if (route === 'register'){
      this.setState({isSignedIn: false})      
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
           <Particles className='particles' params={particlesOptions}/>
           <Navigation 
           isSignedIn={this.state.isSignedIn}
           onRouteChange={ this.onRouteChange}/>
          { this.state.route === 'home' 
          ? <div>
             <Logo />
             <Rank loadUser={this.loadUser} name={this.state.user.name} entries={this.state.user.entries}/>
             <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
             <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
           </div>
          : (this.state.route === 'signin')
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

           
      }
      </div>
    );
  }
}

export default App;
