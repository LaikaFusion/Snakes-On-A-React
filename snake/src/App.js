import React, { Component } from "react";
import "./App.css";
import Screen from "./components/Screen";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pixels: Array(252).fill({ on: false }),
      direction: "right",
      snake: [136, 135, 134, 133],
      food: -1,
      ylinesize: 21,
      xlinesize: 12,
      removePixel: 0,
      nextPixel: 0,
      intervalId: 0,
      intervalAmount: 200,
      gameOver: false,
      gameStarted: false
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
        if (this.state.direction !== "right") {
          this.setState({
            direction: "left"
          });
        }

        break;
      case "ArrowRight":
      case "d":
        if (this.state.direction !== "left") {
          this.setState({
            direction: "right"
          });
        }
        break;
      case "ArrowUp":
      case "w":
        if (this.state.direction !== "down") {
          this.setState({
            direction: "up"
          });
        }
        break;
      case "ArrowDown":
      case "s":
        if (this.state.direction !== "up") {
          this.setState({
            direction: "down"
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
      snake: [136, 135, 134, 133],
      intervalAmount: 200,
      pixels: Array(252).fill({ on: false }),
      gameStarted: true
    },()=>{

      let gameStart = this.state.pixels.slice();
      this.state.snake.forEach(element => {
        gameStart[element] = { on: true };
      });
      gameStart[this.state.food] = { on: true };
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
        } else {
          snakeMod.unshift(nextPixelRight);
          nextPixelRight = snakeMod[0] + 1;
          this.randomFoodSpot();
          this.goFaster();
        }

        if (nextPixelRight % 21 === 0) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelRight);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove
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
          snakeMod.unshift(nextPixelLeft);

          nextPixelLeft = snakeMod[0] - 1;
        }

        if ((nextPixelLeft + 1) % 21 === 0) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelLeft);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove
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
          snakeMod.unshift(nextPixelUp);

          nextPixelUp = snakeMod[0] - this.state.ylinesize;
        }

        if (nextPixelUp < 0) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelUp);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove
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
          snakeMod.unshift(nextPixelDown);

          nextPixelDown = snakeMod[0] + this.state.ylinesize;
        }

        if (nextPixelDown >= this.state.pixels.length) {
          this.gameOver();
          break;
        }
        snakeMod.unshift(nextPixelDown);
        this.setState(
          {
            snake: snakeMod,
            removePixel: toRemove
          },
          () => {
            this.updateScreen();
          }
        );
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
    pixelsUpdate[this.state.food] = { on: true };

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
        <div className="score"> Score: {(this.state.snake.length -4)/2}</div>
        <div className='buttonContainer'><button className={this.state.gameStarted  ? 'StartButton hidden':'StartButton' } onClick={this.newGame}>{this.state.gameOver?"Game Over Again?":"Start!"}</button></div>
      </div>
      </div>
    );
  }
}

export default App;
