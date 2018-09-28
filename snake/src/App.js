import React, { Component } from "react";
import "./App.css";
import Screen from "./components/Screen";

const xline = 18;
const yline = 28;
const freshScreen = Array(xline*yline).fill({ on: false, food:false });


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pixels: freshScreen,
      direction: "right",
      snake: [210, 209, 208, 207],
      food: -1,
      ylinesize: yline,
      xlinesize: xline,
      removePixel: 0,
      nextPixel: 0,
      intervalId: 0,
      intervalAmount: 200,
      gameOver: false,
      gameStarted: false,
      keyblock: false
    };
  }
  componentWillMount() {
    document.addEventListener("keydown", this.handleKeypress);

    this.randomFoodSpot();
  }
  handleKeypress = e => {
    if(this.state.keyblock){
      return;
    }
    switch (e.key) {
      case "ArrowLeft":
      case "a":
        if (this.state.direction !== "right") {
          this.setState({
            direction: "left",
            keyblock:true
          });
        }

        break;
      case "ArrowRight":
      case "d":
        if (this.state.direction !== "left") {
          this.setState({
            direction: "right",
            keyblock:true
          });
        }
        break;
      case "ArrowUp":
      case "w":
        if (this.state.direction !== "down") {
          this.setState({
            direction: "up",
            keyblock:true
          });
        }
        break;
      case "ArrowDown":
      case "s":
        if (this.state.direction !== "up") {
          this.setState({
            direction: "down",
            keyblock:true
          });
        }
        break;
      default:
        break;
    }
  };
  newGame = (e) => {
    this.setState({
      gameOver: false,
      direction: "right",
      snake: [210, 209, 208, 207],
      intervalAmount: 200,
      pixels: freshScreen,
      gameStarted: true
    },()=>{

      let gameStart = this.state.pixels.slice();
      this.state.snake.forEach(element => {
        gameStart[element] = { on: true };
      });
      gameStart[this.state.food] = { food: true };
      this.setState(
        {
          pixels: gameStart
        },
        () => {
          this.gameRunTime(200);
        }
      );
    })

  };
  randomFoodSpot = () => {
    const foodLocation = Math.floor(Math.random() * this.state.pixels.length);
    if (this.state.snake.indexOf(foodLocation) !== -1 ||foodLocation=== 0||foodLocation===20 ||foodLocation=== 231||foodLocation===251) {
      this.randomFoodSpot();
    } else {
      
      this.setState({
        food: foodLocation
      });
    }
  };
  gameRunTime = int => {
    const interval = setInterval(() => {
      this.animate();
    }, int);
    this.setState({
      intervalID: interval,
      intervalAmount: int
    });
  };
  animate = () => {
    const snakeMod = this.state.snake.slice();
    let toRemove = -1;
    switch (this.state.direction) {
      case "right":
        let nextPixelRight = snakeMod[0] + 1;
        if (snakeMod.indexOf(nextPixelRight) !== -1) {
          this.gameOver();
          break;
        }
        if (nextPixelRight !== this.state.food) {
          toRemove = snakeMod.pop();
          snakeMod.unshift(nextPixelRight);
        } else {
          snakeMod.unshift(nextPixelRight);
          this.randomFoodSpot();
          this.goFaster();
        }

        if (nextPixelRight % this.state.ylinesize === 0) {
          this.gameOver();
          break;
        }
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove,
            keyblock: false
          },
          () => {
            this.updateScreen();
          }
        );
        break;
      case "left":
        let nextPixelLeft = snakeMod[0] - 1;
        if (snakeMod.indexOf(nextPixelLeft) !== -1) {
          this.gameOver();
          break;
        }
        if (nextPixelLeft !== this.state.food) {
          toRemove = snakeMod.pop();
        } else {
          this.randomFoodSpot();
          this.goFaster();
        }

        if ((nextPixelLeft + 1) % this.state.ylinesize === 0) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelLeft);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove,
            keyblock: false
          },
          () => {
            this.updateScreen();
          }
        );
        break;
      case "up":
        let nextPixelUp = snakeMod[0] - this.state.ylinesize;
        if (snakeMod.indexOf(nextPixelUp) !== -1) {
          this.gameOver();
          break;
        }
        if (nextPixelUp !== this.state.food) {
          toRemove = snakeMod.pop();
        } else {
          this.randomFoodSpot();
          this.goFaster();
        }

        if (nextPixelUp < 0) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelUp);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove,
            keyblock: false
          },
          () => {
            this.updateScreen();
          }
        );
        break;
      case "down":
        let nextPixelDown = snakeMod[0] + this.state.ylinesize;
        if (snakeMod.indexOf(nextPixelDown) !== -1) {
          this.gameOver();
          break;
        }
        if (nextPixelDown !== this.state.food) {
          toRemove = snakeMod.pop();
        } else {
          this.randomFoodSpot();
          this.goFaster();
        }

        if (nextPixelDown >= this.state.pixels.length) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelDown);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove,
            keyblock: false
          },
          () => {
            this.updateScreen();
          }
        );
        break;
      case "enter":
      case "spaceBar":
         if (this.state.gameOver) {
        this.newGame();
       }
    break;
      default:
        break;
    }
  };
  updateScreen = () => {
    let pixelsUpdate = this.state.pixels.slice();

    this.state.snake.forEach(element => {
      pixelsUpdate[element] = { on: true };
    });
    pixelsUpdate[this.state.removePixel] = { on: false };
    pixelsUpdate[this.state.food] = { food: true };

    this.setState({
      pixels: pixelsUpdate
    });
  };
  goFaster = () => {
    const newAmount = this.state.intervalAmount - 5;
    if (newAmount < 50) {
      return;
    }
    clearInterval(this.state.intervalID);

    this.gameRunTime(newAmount);
  };
  gameOver = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      gameOver: true,
      gameStarted: false
    })
  };
  render() {
    return (
      <div className="App">
      <div className='screenContainer'>
        <Screen pixels={this.state.pixels} />
        <div className="score"> Score: {(this.state.snake.length -4)}</div>
        <div className='buttonContainer'><button className={this.state.gameStarted  ? 'StartButton hidden':'StartButton' } onClick={this.newGame}>{this.state.gameOver?"Game Over Again?":"Start!"}</button></div>
      </div>
      </div>
    );
  }
}

export default App;
