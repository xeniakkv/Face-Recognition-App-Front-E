
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import './App.css';



const particlesOption = {
    
	        particles: {
	        	number: {
	        		value:150,
	        		density: {
	        			enable: true,
	        			value_area: 800

   }
}

}

}


const initialState = {
	        input: '',
			imageURL: '',
			box: {},
			route: 'Signin',
			isSignedIn: false,
			user: {
				id: '',
      	        name: '' ,
      	        email: '' ,
      	        
      	        entries: 0,
      	        joined: ''
			}
}
         
class App extends Component {
	constructor() {
		super();
		this.state = initialState;
			
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
			}
		})
	}
// This code below is used for connecting a server with Front end. 
//Only needed once to make a first installation then can be deleted
	//componentDidMount() {
		//fetch('http://localhost:3000/')
		//.then(response => response.json())
		//.then(console.log)

	//}

	calculateFaceLocation = (data) => {

	const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
    	leftCol: clarifaiFace.left_col * width,
    	topRow: clarifaiFace.top_row * height,
    	rightCol: width - (clarifaiFace.right_col * width),
    	bottomRow: height - (clarifaiFace.bottom_row * height),

    }
	}

	displayFaceBox = (box) => {
		
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageURL: this.state.input});
	
	fetch('https://warm-tundra-13435.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      	input: this.state.input
      	
      })
		})
	.then(response => response.json())
// when we use fetch , we always need to convert it into .json format below
	.then(response => {
		if (response) {
			fetch('https://warm-tundra-13435.herokuapp.com/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      	id: this.state.user.id
      	
      })
		})

			.then(response => response.json())
			.then(count => {
				this.setState(Object.assign(this.state.user, { entries: count}))
					// Object.assign is used in order to show the users name (target object) on the line
                    //  It has a signature of Object.assign(target, ...sources). 
                    //The target object is the first parameter and is also used as the return value. 
                    //Object.assign() is useful for merging objects or cloning them shallowly.
				})
			
                .catch(console.log)
		}
	

	 this.displayFaceBox (this.calculateFaceLocation(response))
        // do something with response
       }) 
      
       .catch(err => console.log(err));
        //console.log(err);
        // there was an error
      }
   
   onRouteChange = (route) => {
   	if (route === 'Signout') {
   		this.setState(initialState)
   	} else if (route === 'home') {
   		this.setState({isSignedIn: true})
   		}
   	this.setState({route: route});
   }
	

  render() {
  	const { isSignedIn, imageURL, route, box } = this.state;
  return (
    <div className="App">
    
    <Particles className='particles'
     params={particlesOption} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}  />
      { route === 'home' 
      ? <div> 
      <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
       <FaceRecognition box={box} imageURL={imageURL}/>
       </div>
       : (

          route === 'Signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

       	)
   }
    </div>
  );
}
}
export default App;

