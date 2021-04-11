import React, { Component } from 'react';
import './App.css';

const DogCard = ({ pup, onClick }) => <span onClick={onClick}>{pup.name}</span>;

const DogInfo = ({ pup, onClick }) => {
  return (
    <div>
      <img src={pup.image} alt={pup.name} />
      <h2>{pup.name}</h2>
      <button onClick={onClick}>{pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
    </div>
  );
}

class App extends Component {
  state = {
    pups: [],
    selectedPup: null,
    filterDogs: false
  };

  fetchPuppies = (pupId = '', method = 'GET', body = null) => (
    fetch(`http://localhost:3000/pups/${pupId}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body
    })
    .then(response => response.json())
  );

  componentDidMount() {
    this.fetchPuppies().then(pups => this.setState({ pups }));
  }

  selectPup = pupId => {
    this.fetchPuppies(pupId).then(selectedPup => this.setState({ selectedPup }));
  };

  changeDogType = ({ target }) => {
    const body = JSON.stringify({
      isGoodDog: !this.state.selectedPup.isGoodDog
    });
    
    this.fetchPuppies(this.state.selectedPup.id, 'PATCH', body)
      .then(() => {
        target.innerHTML = target.innerHTML.includes('Good') ? 'Bad Dog!' : 'Good Dog!';
        this.setState(prevState => {
          console.log('Prev state >> ', prevState);
          const updatedPup = {...prevState.selectedPup, isGoodDog: !prevState.selectedPup.isGoodDog};
          const newState = {...prevState, selectedPup: updatedPup};
          console.log(newState.pups.findIndex(pup => pup.id === prevState.selectedPup.id));
          newState.pups[newState.pups.findIndex(pup => pup.id === prevState.selectedPup.id)] = updatedPup;
          console.log('New state >> ', newState);
          return newState;
        });
      });
  };

  filterDogs = ({ target }) => {
    target.innerHTML = `Filter good dogs: ${target.innerHTML.includes('ON') ? 'OFF' : 'ON'}`;
    this.setState({
      filterDogs: target.innerHTML.includes('ON') ? true : false
    })
  }

  render() {
    return (
      <div className="App">
        <div id="filter-div">
          <button id="good-dog-filter" onClick={this.filterDogs}>Filter good dogs: OFF</button>
        </div>

        <div id="dog-bar">
          {
            this.state.filterDogs ?
            this.state.pups.filter(pup => pup.isGoodDog).map(pup => <DogCard key={pup.id} pup={pup} onClick={() => this.selectPup(pup.id)} />) :
            this.state.pups.map(pup => <DogCard key={pup.id} pup={pup} onClick={() => this.selectPup(pup.id)} />)
          }
        </div>

        <div id="dog-summary-container">
          <h1>DOGGO:</h1>
          <div id="dog-info">
            {this.state.selectedPup && <DogInfo pup={this.state.selectedPup} onClick={this.changeDogType} />}
          </div>
        </div>
      </div>
    );
  };
}

export default App;