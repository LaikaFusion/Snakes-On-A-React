import React, { Component } from "react";
import "./App.css";
import Screen from "./components/Screen";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pixels: Array(252).fill({ on: false }),
      direction: "right",
      snake :[136,135,134,133],
      food: 0,
      ylinesize: 21,
      xlinesize:12,
      removePixel: 0
    };
  }
  componentWillMount() {
    document.addEventListener("keydown", this.handleKeypress);

    this.randomFoodSpot();
  }
  handleKeypress = e => {
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      this.setState({
        direction: 'left'
      })
        break;
      case "ArrowRight":
      case "d":
      this.setState({
        direction: 'right'
      })
        break;
      case "ArrowUp":
      case "w":
      this.setState({
        direction: 'up'
      })
        break;
      case "ArrowDown":
      case "s":
      this.setState({
        direction: 'down'
      })
        break;
      default:
        break;
    }
  };
  newGame = () => {
    let gameStart = this.state.pixels.slice();
  
    this.state.snake.forEach(element => {
      gameStart[element] = {on:true}
    })
    gameStart[this.state.food] = {on:true}
    this.setState({
      pixels : gameStart
    },()=>{
      this.gameRunTime();
    })
    
  };
  randomFoodSpot = () =>{
    const foodLocation= Math.floor(Math.random() * this.state.pixels.length);
    if (this.state.snake.indexOf(foodLocation)!== -1){
      this.randomFoodSpot();
    }
    else{
      this.setState({
        food : foodLocation
      })
    }
  }
  gameRunTime = ()=>{
    setInterval(()=>{ this.animate() }, 500);
  }
  animate = ()=>{
    const snakeMod = this.state.snake.slice();
    const toRemove = snakeMod.pop();

    switch (this.state.direction) {

      case 'right':
        snakeMod.unshift((snakeMod[0])+1);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'left':
        snakeMod.unshift((snakeMod[0])-1);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'up':
        snakeMod.unshift((snakeMod[0])-this.state.ylinesize);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'down':
        snakeMod.unshift((snakeMod[0])+this.state.ylinesize);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
      default:
        break;
    }
  }
  updateScreen=()=>{
    let pixelsUpdate = this.state.pixels.slice();

    this.state.snake.forEach(element => {
      pixelsUpdate[element] = {on:true}
    })


   
    pixelsUpdate[this.state.removePixel] = {on:false}
    pixelsUpdate[this.state.food] = {on:true}

    this.setState({
      pixels : pixelsUpdate
    })
  }
  render() {
    return (
      <div className="App">
        <Screen pixels={this.state.pixels} />
        <button onClick={this.newGame}> Start </button>
      </div>
    );
  }
}

export default App;
