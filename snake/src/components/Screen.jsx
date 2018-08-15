import React, { Component } from 'react';

class Screen extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <div className='screen'>
        {this.props.pixels.map((e,i)=>{
            return <div key ={i} id= {i} className={e.on? 'pixel on':'pixel'} />
        })}
        
      </div>
    );
  }
}

export default Screen;