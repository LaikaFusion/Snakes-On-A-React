import React, { Component } from 'react';

class Screen extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <div className='screen'>
        {this.props.pixels.map((e,i)=>{
            return <div key ={i} id= {i} className={e.on? 'pixel ':'pixel'} >
            <div className={e.on? ' on':''} />
            <div className={e.on? ' on':''} />
            <div className={e.on? ' on':''}/>
            <div className={e.on? ' on':''}/>
            </div>
        })}
        
      </div>
    );
  }
}

export default Screen;