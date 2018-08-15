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
      if(this.state.direction !=='right'){
        this.setState({
          direction: 'left'
        })
      }
      
        break;
      case "ArrowRight":
      case "d":
      if(this.state.direction !=='left'){
      this.setState({
        direction: 'right'
      })
    }
        break;
      case "ArrowUp":
      case "w":
      if(this.state.direction !=='down'){
      this.setState({
        direction: 'up'
      })}
        break;
      case "ArrowDown":
      case "s":
      if(this.state.direction !=='up'){
      this.setState({
        direction: 'down'
      })}
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
    let toRemove = 0;
    switch (this.state.direction) {

      case 'right':
        const nextPixelRight = (snakeMod[0])+1
        if(nextPixelRight !== this.state.food){
           toRemove = snakeMod.pop();   
        }
        else{
          this.randomFoodSpot();
        }

        snakeMod.unshift(nextPixelRight);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'left':
        const nextPixelLeft = (snakeMod[0])-1
        if(nextPixelLeft !== this.state.food){
           toRemove = snakeMod.pop();
        }
        else{
          this.randomFoodSpot();
        }

        snakeMod.unshift(nextPixelLeft);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'up':
        const nextPixelUp = (snakeMod[0])-this.state.ylinesize;
        if(nextPixelUp !== this.state.food){
           toRemove = snakeMod.pop();
        }
        else{
          this.randomFoodSpot();
        }
        snakeMod.unshift(nextPixelUp);
        this.setState({
          snake : snakeMod,
          removePixel: toRemove

        },()=>{
          this.updateScreen();
        })
        break;
        case 'down':
        const nextPixelDown = (snakeMod[0])+this.state.ylinesize;
        if(nextPixelDown !== this.state.food){
           toRemove = snakeMod.pop();
        }
        else{
          this.randomFoodSpot();
        }
        snakeMod.unshift(nextPixelDown);
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
