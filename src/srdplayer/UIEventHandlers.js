/* 
 * Copyright (c) 2015, jorritvandenberg
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

function onClickEvent(e) {
    
    var parentPosition,
        xPosition,
        yPosition,
        zoomLayer;    
    
    if (fullScreenFlag == false){
        parentPosition = getPosition(e.currentTarget);
        xPosition = -(e.clientX - parentPosition.x);
        yPosition = -(e.clientY - parentPosition.y); 
    } else {
        
        xPosition = -(e.clientX);
        yPosition = -(e.clientY);
    }
    
    // TODO: elaborate on this to suport more zoomlevels   
    if (typeof currentZoomLevel === "undefined") {
        zoomLayer = zoomLayer1;

        currentZoomLevel = 0;
        if (zoomLayer1Status === null){

            ServiceBus.publish("Zoom-level1", [xPosition, yPosition, zoomLayer]);
            zoomLayer1Status = "attached";

            zoomLayer1.setAttribute('onmousedown', 'dragtool.startMoving(this, videoContainer, event);');
            zoomLayer1.setAttribute('onmouseup', 'dragtool.stopMoving(videoContainer);');

        } else {
            updateVideoContainer(xPosition, yPosition, zoomLayer1, 1);
        }
        
        
    } else if (currentZoomLevel === 0) {
        zoomLayer1.removeAttribute('onmousedown');
        zoomLayer1.removeAttribute('onmouseup');
        setVisibleElement("frontbacklayer");
        currentZoomLevel = undefined;
    }
}
 
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
     
   if (fullScreenFlag == false) {
        
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
    } else {
        
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft);
            yPosition += (element.offsetTop - element.scrollTop);
            element = element.offsetParent;
        }
    }
     
    return { x: xPosition, y: yPosition };
}

function updateVideoContainer(xPosition, yPosition, zoomLayer, delay) {
    
    zoomLayer.style.left = xPosition + 'px';
    zoomLayer.style.top = yPosition + 'px';
    setTimeout(function(){    
        setVisibleElement("zoomlayer1");
    }, delay);
    
}

function setVisibleElement(visibleElement){
   
   if (visibleElement === "frontbacklayer") {
       frontBackLayer.style.visibility = "visible";
       zoomLayer1.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "zoomlayer1") {
       zoomLayer1.style.visibility = "visible";
       frontBackLayer.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "zoomlayer2") {
       zoomLayer2.style.visibility = "visible";
       frontBackLayer.style.visibility = "hidden";
       zoomLayer1.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "bannerbox") {
       bannerbox.style.visibility = "visible";
       frontBackLayer.style.visibility = "hidden";
       zoomLayer1.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";

   }
}

var dragtool = function(){
                return {
                    move : function(divid,xpos,ypos){
                        divid.style.left = xpos + 'px';
                        divid.style.top = ypos + 'px';
                        
                    },
                    startMoving : function(divid, videoContainer, evt){
                        
                        var eWi = parseInt(divid.offsetWidth),
                            eHe = parseInt(divid.offsetHeight),

                            // TODO: enhance capturing of current position
                            // eLo = parseInt(divid.offsetLeft),
                            // eTo = parseInt(divid.offsetTop);
                    

                        evt = evt || window.event;
                        videoContainer.style.cursor='move';

                        videoContainer.onmousemove = function(evt){
                            evt = evt || window.event;
                            
                            var parentPosition,
                                xPosition,
                                yPosition;
                            
                            if (fullScreenFlag == false) {
                                parentPosition = getPosition(evt.currentTarget);
                                xPosition = evt.clientX - parentPosition.x - (eWi / 2);
                                yPosition = evt.clientY - parentPosition.y - (eHe / 2);
                            } else {                              
                                xPosition = evt.clientX - (eWi / 2);
                                yPosition = evt.clientY - (eHe / 2);
                            }                       
                            
                            // TODO: Implement dragging boundaries for FireFox

                            dragtool.move(divid,xPosition,yPosition);
                        };
                    },
                    stopMoving : function(videoContainer){
		        videoContainer.style.cursor='default';
                        videoContainer.onmousemove = function(){};
                    }
                };
            }();
            
            
