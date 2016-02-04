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
        viewLayer;    
    
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

        viewLayer = zoomLayer1;
        currentZoomLevel = 0;

        if (fullScreenFlag){ 
            updateVideoContainer(xPosition, yPosition, fullBackLayer, null, "fullscreen");
        } else {
            updateVideoContainer(xPosition, yPosition, fullBackLayer, null, 2);  
        } 

        ServiceBus.publish("Zoom-level1", [xPosition, yPosition, viewLayer]);
        zoomLayer1Status = "attached";
        zoomLayer1.setAttribute('onmousedown', 'dragtool.startMoving(this, videoContainer, event);');
        zoomLayer1.setAttribute('onmouseup', 'dragtool.stopMoving(videoContainer);');
        
        
    } else if (currentZoomLevel === 0) {
  
        viewLayer = fullBackLayer;
        zoomLayer1.removeAttribute('onmousedown');
        zoomLayer1.removeAttribute('onmouseup');
        
        resetPlayers(zoomLayer1PlayerObjects);
        
        if (fullScreenZoomedTo == undefined) { 
            updateVideoContainer(xPosition, yPosition, viewLayer, null, 0.5);
        } else {
            updateVideoContainer(xPosition, yPosition, viewLayer, null, 1.0);
            fullScreenZoomedTo = undefined;
            
        }
        
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

function updateVideoContainer(xPosition, yPosition, viewLayer, delay, resizeFactor) {
    
    if (viewLayer == fullBackLayer){
        
        if (fullScreenFlag == true) {
            
            if (resizeFactor == "fullscreen") {
                
                fullBackLayer.style.height = (screen.width / fullBackLayerContentAspectRatio)  * 2 + "px";
                fullBackLayer.style.width = screen.width * 2 + "px";
                
            } else {
                
                var resizedHeight = parseInt(fullBackLayer.offsetHeight, 10) * resizeFactor;
                var resizedWidth = parseInt(fullBackLayer.offsetWidth, 10) * resizeFactor; 

                fullBackLayer.style.height = resizedHeight + "px";
                fullBackLayer.style.width = resizedWidth + "px";
                
            }         
           
        } else if (fullScreenFlag == false) {
            
            var resizedHeight = parseInt(fullBackLayer.offsetHeight, 10) * resizeFactor;
            var resizedWidth = parseInt(fullBackLayer.offsetWidth, 10) * resizeFactor; 
            
            fullBackLayer.style.height = resizedHeight + "px";
            fullBackLayer.style.width = resizedWidth + "px";

        }

        if (resizeFactor === 0.5) {    
            
            var offsetFromTop = (parseInt(videoContainer.offsetHeight, 10) - parseInt(fullBackLayer.offsetHeight, 10)) / 2;
           
            fullBackLayer.style.left = 0 + 'px';
            fullBackLayer.style.top = offsetFromTop + 'px';
            setVisibleElement("fullbacklayer");   
            
        } else if (resizeFactor === 1.0) { 
            
            fullBackLayer.style.left = 0 + 'px';
            fullBackLayer.style.top = 0 + 'px';
            setVisibleElement("fullbacklayer");
        
        } else if (resizeFactor === 2) {
            
            fullBackLayer.style.left = xPosition + 'px';
            fullBackLayer.style.top = yPosition + 'px';
            
        } else if (resizeFactor === "fullscreen") {
            
            fullBackLayer.style.left = xPosition + 'px';
            fullBackLayer.style.top = yPosition + 'px';
            setVisibleElement("fullbacklayer");
        }
        
    } else if (viewLayer == zoomLayer1) {
     
        var offsetFromTop = (parseInt(videoContainer.offsetHeight, 10) - (parseInt(zoomLayer1.offsetHeight, 10) / 2)) / 2;
        
        if (fullScreenFlag == false) {
            offsetFromTop = 0;
        }
        zoomLayer1.style.left = xPosition + 'px';
        zoomLayer1.style.top = (yPosition + offsetFromTop) + 'px';

        setTimeout(function(){    
            setVisibleElement("zoomlayer1");
            
        }, delay); 
        
    } else if (viewLayer == zoomLayer2) {
        
        var offsetFromTop = (parseInt(videoContainer.offsetHeight, 10) - (parseInt(zoomLayer2.offsetHeight, 10) / 2)) / 2;
        
        if (fullScreenFlag == false) {
            offsetFromTop = 0;
        }
        zoomLayer2.style.left = xPosition + 'px';
        zoomLayer2.style.top = (yPosition + offsetFromTop) + 'px';

        setTimeout(function(){    
            setVisibleElement("zoomlayer2");
        }, delay);        
    }   
}

function updateAspectRatio(viewLayer, contentAspectRatio) {
    
    if (viewLayer == fullBackLayer) { 
    
        SRDPlayer.style.height = ((initialWidth / contentAspectRatio) + 188) + "px";
        videoContainer.style.height = (initialWidth / contentAspectRatio) + "px";
        fullBackLayer.style.height = (initialWidth / contentAspectRatio) + "px";
        bannerbox.style.height = (initialWidth / contentAspectRatio) + "px"; 
    
    }
}

function setVisibleElement(visibleElement){
   
   if (visibleElement === "fullbacklayer") {
       fullBackLayer.style.visibility = "visible";
       zoomLayer1.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "zoomlayer1") {
       zoomLayer1.style.visibility = "visible";
       fullBackLayer.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "zoomlayer2") {
       zoomLayer2.style.visibility = "visible";
       fullBackLayer.style.visibility = "hidden";
       zoomLayer1.style.visibility = "hidden";
       bannerbox.style.visibility = "hidden";

   } else if (visibleElement === "bannerbox") {
       bannerbox.style.visibility = "visible";
       fullBackLayer.style.visibility = "hidden";
       zoomLayer1.style.visibility = "hidden";
       zoomLayer2.style.visibility = "hidden";

   }
}

var dragtool = function(){
                return {
                    move : function(divid,xpos,ypos){
                        divid.style.left = xpos + 'px';
                        divid.style.top = ypos + 'px';
                        fullBackLayer.style.left = xpos + 'px';
                        fullBackLayer.style.top = ypos + 'px';
                        
                    },
                    
                    startMoving : function(divid, videoContainer, evt){
                        
                        var eWi = parseInt(divid.offsetWidth, 10),
                            eHe = parseInt(divid.offsetHeight, 10),
                            vWi = parseInt(videoContainer.offsetWidth, 10),
                            vHe = parseInt(videoContainer.offsetHeight, 10),

                        evt = evt || window.event;
                        videoContainer.style.cursor='move';

                        videoContainer.onmousemove = function(evt){
                            evt = evt || window.event;
                            
                            var parentPosition,
                                xPosition,
                                yPosition;
                            
                            if (fullScreenFlag == false) {
                                parentPosition = getPosition(evt.currentTarget);
                                xPosition = evt.clientX - parentPosition.x - (((eWi / 2) + vWi) / 2);
                                yPosition = evt.clientY - parentPosition.y - (((eHe / 2) + vHe) / 2);
                                
                            } else {  
                                xPosition = evt.clientX - (((eWi / 2) + vWi) / 2);
                                yPosition = evt.clientY - (((eHe / 2) + vHe) / 2);

                            }   
                            
                            if (xPosition < -(eWi - vWi)) {xPosition = -(eWi - vWi);};
                            if (yPosition < -(eHe - vHe)) {yPosition = -(eHe - vHe);};                            
                            if (xPosition > 0) {xPosition = 0;};
                            if (yPosition > 0) {yPosition = 0;};

                            dragtool.move(divid,xPosition,yPosition);
                        };
                    },
                    
                    stopMoving : function(videoContainer){
		        videoContainer.style.cursor='default';
                        videoContainer.onmousemove = function(){};
                    }
                };
            }();
 
function computeVideoDimensions(contentAspectRatio, viewState) {

    if (contentAspectRatio == undefined) {

        // Use fullBackLayerContentAspectRatio as fallback when input content aspect ratio is not available   
        contentAspectRatio = fullBackLayerContentAspectRatio;

    }
    
    if (viewState == "fullscreen") {
        
        var fullScreenVideoHeight,
            fullScreenVideoWidth;

        if (screenAspectRatio  == contentAspectRatio){

            fullScreenVideoHeight = screen.height;
            fullScreenVideoWidth = screen.width;

        } else if (screenAspectRatio < contentAspectRatio){

            fullScreenVideoHeight = screen.width / contentAspectRatio;
            fullScreenVideoWidth = screen.width;   

        } else if (screenAspectRatio > contentAspectRatio) {

            fullScreenVideoHeight = screen.width / contentAspectRatio;
            fullScreenVideoWidth = screen.width;

        }

        return [fullScreenVideoHeight, fullScreenVideoWidth]; 
        
    } else if (viewState == "normal") {
        
        var normalVideoHeight;
        normalVideoHeight = initialWidth / contentAspectRatio;
        
        return normalVideoHeight;

    }
};




            
            
