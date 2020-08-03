import React, { Component } from "react";
import './popup.css'

class Popup extends Component {

    render() {
        return (
            <div style={{textAlign:"center", paddingTop:'20px'}}>    
                <div className="popup">                            
                    <span className="popuptext show" id="myPopup">A Simple Popup!</span>
                </div>                
            </div>
        );
    }
}

export default Popup