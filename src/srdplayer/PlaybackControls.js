/* 
* The copyright in this software is being made available under the following 
* TNO license terms. This software may be subject to other third party and 
* TNO intellectual property rights, including patent rights, 
* and no such rights are granted under this license.
*
* Created by Jorrit van den Berg on 7/12/15.
* Copyright (c) 2016, TNO.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
*  * Redistributions of source code must retain the above copyright notice,
*    this list of conditions and the following disclaimer.
*  * Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the documentation
*    and/or other materials provided with the distribution.
*  * Neither the name of TNO nor the names of its employees may
*    be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY TNO "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
* INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND 
* FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL TNO
* BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
* THE POSSIBILITY OF SUCH DAMAGE.
*/

/* Script with functions to control playback of a video:
 * - openVideo() opens a video when a valid MPD file URL is provided and Open video is clicked
 * - playPause() either plays a video when paused or pauses it when playing
 * - muteSound() mutes the audio
 * - switchScreenMode() allows the user to switch to fullscreen mode or back 
 */

function openVideo(){
    
    screenAspectRatio = screen.width / screen.height;
    fallBackLayer.style.width = "";
    fallBackLayer.style.height = "";
    initialWidth = parseInt(fallBackLayer.offsetWidth, 10);
    initialHeight = parseInt(fallBackLayer.offsetHeight, 10);
    initialAspectRatio = initialWidth / initialHeight;
    masterQuality = undefined;
    var mpdURL = document.getElementById('mpdURL').value;
    
    function validURL(str) {
        
      var pattern = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
      
      if(!pattern.test(str)) {
          
        window.alert("Please enter a valid URL.");
        return false;
        
      } else {
        return true;
      }
    }
    
    if (validURL(mpdURL) == true){   
        bannerbox.style.backgroundImage = "none";
        bannerbox.style.background = "black";
        MPDManager(mpdURL);
    }
}

function playPause() { 

    if (fallBackLayer.paused) {
        fallBackLayer.play();
        video1.play();
        video2.play();
        video3.play();
        video4.play();
        $("#iconPlayPause").removeClass("icon-play");
        $("#iconPlayPause").toggleClass("icon-pause");

    } else { 
        fallBackLayer.pause();
        video1.pause();
        video2.pause();
        video3.pause();
        video4.pause();
        $("#iconPlayPause").removeClass("icon-pause");
        $("#iconPlayPause").toggleClass("icon-play");
    }
}

function muteSound() { 
    
    if (fallBackLayer.muted === false){
        lastVolumeValue = fallBackLayer.volume;
        fallBackLayer.muted = true;
        $("#iconMute").removeClass("icon-mute-off");
        $("#iconMute").toggleClass("icon-mute-on");
        $("#volumebar").val(0.0);
        
    } else if (fallBackLayer.muted === true){
        fallBackLayer.muted = false;
        fallBackLayer.volume = lastVolumeValue;
        $("#iconMute").removeClass("icon-mute-on");
        $("#iconMute").toggleClass("icon-mute-off");
        $("#volumebar").val(lastVolumeValue);
        
    }
} 

function switchScreenMode() {
    
    var screenChangeEvents;

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        
        fullScreenFlag = true;  
        browserWindowZoomedTo = currentZoomLevel;
        fullScreenZoomedTo = currentZoomLevel;
        
        zoomLayer1VideoHeight = computeVideoDimensions(zoomLayer1ContentAspectRatio, "fullscreen")[0];
        zoomLayer1VideoWidth = computeVideoDimensions(zoomLayer1ContentAspectRatio, "fullscreen")[1];
        zoomLayer2VideoHeight = computeVideoDimensions(zoomLayer2ContentAspectRatio, "fullscreen")[0];
        zoomLayer2VideoWidth = computeVideoDimensions(zoomLayer2ContentAspectRatio, "fullscreen")[1];      
        
        if (videoContainer.requestFullscreen) {
           videoContainer.requestFullscreen();
           
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
            
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
            
        } else if (videoContainer.webkitRequestFullscreen) {       
            videoContainer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

        }

        $("#icon-fullscreen").removeClass("icon-fullscreen-enter");
        $("#icon-fullscreen").toggleClass("icon-fullscreen-exit");

        $('#zoomLayer1').toggleClass('fullscreen'); 
        $('#zoomLayer2').toggleClass('fullscreen');

        SRDPlayer.style.height = "";
        videoContainer.style.height = "";
        bannerbox.style.height = "";
        fallBackLayer.style.width = "";
        fallBackLayer.style.height = "";  
        
        zoomLayer1.width = zoomLayer1VideoWidth * 2;
        zoomLayer1.height = zoomLayer1VideoHeight * 2;         
        zoomLayer2.width = zoomLayer2VideoWidth * 2;
        zoomLayer2.height = zoomLayer2VideoHeight * 2;

        $('#fallBackLayer').toggleClass('fullscreen');
        $('#videoContainer').toggleClass('fullscreen');
        $('#bannerbox').toggleClass('bannerbox-fullscreen'); 
        $("#videoController").toggleClass('video-controller-fullscreen');

        adjustVideoSizes(zoomLayer1VideoHeight, zoomLayer1VideoWidth, zoomLayer2VideoHeight, zoomLayer2VideoWidth);

        if (currentZoomLevel == 1) {
            
            var offsetFromLeft = (parseInt(zoomLayer1.offsetLeft, 10) / initialWidth) * zoomLayer1VideoWidth;
            var offsetFromTop = (parseInt(zoomLayer1.offsetTop, 10) / (initialHeight / zoomLayer1ContentAspectRatio)) * zoomLayer1VideoHeight;
            
            var eHe = zoomLayer1.height;
            var vHe = screen.height;
            if (offsetFromTop < (vHe - eHe)) {offsetFromTop = (vHe - eHe);}; 
   
            zoomLayer1.style.left = offsetFromLeft + 'px';
            zoomLayer1.style.top = offsetFromTop + 'px';
            fallBackLayer.style.left = offsetFromLeft + 'px';
            fallBackLayer.style.top = offsetFromTop + 'px';
                        
            zoomLayer1Hammer.off('panstart', function(evt) {
                dragtool.startMoving(zoomLayer1, videoContainer, evt);
            });

            zoomLayer1Hammer.off('panend', function(evt) {
                dragtool.stopMoving(videoContainer);
            }); 
            
            zoomLayer1Hammer.on('panstart', function(evt) {
                dragtool.startMoving(zoomLayer1, videoContainer, evt);
            });

            zoomLayer1Hammer.on('panend', function(evt) {
                dragtool.stopMoving(videoContainer);
            });
            
        } else if (currentZoomLevel == 2) {
            
            var offsetFromLeft = (parseInt(zoomLayer2.offsetLeft, 10) / initialWidth) * zoomLayer2VideoWidth;
            var offsetFromTop = (parseInt(zoomLayer2.offsetTop, 10) / (initialHeight / zoomLayer2ContentAspectRatio)) * zoomLayer2VideoHeight;

            var eHe = zoomLayer2.height;
            var vHe = screen.height;
            if (offsetFromTop < (vHe - eHe)) {offsetFromTop = (vHe - eHe);};
            
            zoomLayer2.style.left = offsetFromLeft + 'px';
            zoomLayer2.style.top = offsetFromTop + 'px';
            fallBackLayer.style.left = offsetFromLeft + 'px';
            fallBackLayer.style.top = offsetFromTop + 'px';
            
            zoomLayer2Hammer.off('panstart', function(evt) {
                dragtool.startMoving(zoomLayer2, videoContainer, evt);
            });

            zoomLayer2Hammer.off('panend', function(evt) {
                dragtool.stopMoving(videoContainer);
            });

            zoomLayer2Hammer.on('panstart', function(evt) {
                dragtool.startMoving(zoomLayer2, videoContainer, evt);
            });

            zoomLayer2Hammer.on('panend', function(evt) {
                dragtool.stopMoving(videoContainer);
            });
            
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } 
        
    screenChangeEvents = "webkitfullscreenchange fullscreenchange MSFullscreenChange";

    if (browserType === "FireFox") {
        setTimeout(function() {

        if (document.mozFullScreen) {
                $(document).one("mozfullscreenchange", function () {
                    exitHandler();
                });
            }
        }, 400);
    } else {
        
        
        setTimeout(function() {

            if (document.webkitIsFullScreen || document.fullscreen || document.msFullscreenElement) {
                $(videoContainer).one(screenChangeEvents, function () {
                    exitHandler();
                });               
            }
        }, 200);

    }
    
    function exitHandler() {
        
        var xPosition,
            yPosition;
        
        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {       
            
            fallBackLayer.style.width = "";
            fallBackLayer.style.height = "";  
           
            if (fallBackLayerContentAspectRatio != initialAspectRatio) {
        
                updateAspectRatio(fallBackLayer, fallBackLayerContentAspectRatio); 
        
            }

            zoomLayer1.removeAttribute('width');
            zoomLayer1.removeAttribute('height');
            zoomLayer2.removeAttribute('width');
            zoomLayer2.removeAttribute('height');
            
            $('#fallBackLayer').removeClass('fullscreen');
            $('#zoomLayer1').removeClass('fullscreen'); 
            $('#zoomLayer2').removeClass('fullscreen'); 
            $('video').removeClass('fullscreen');
            
            $('#videoContainer').removeClass('fullscreen');           
            $('#videoController').removeClass('video-controller-fullscreen');
            $("#icon-fullscreen").removeClass("icon-fullscreen-exit");
            $("#icon-fullscreen").toggleClass("icon-fullscreen-enter");
            
            zoomLayer1VideoHeight = computeVideoDimensions(zoomLayer1ContentAspectRatio, "normal");
            zoomLayer1VideoWidth = initialWidth;
            zoomLayer2VideoHeight = computeVideoDimensions(zoomLayer2ContentAspectRatio, "normal");
            zoomLayer2VideoWidth = initialWidth;    
            
            adjustVideoSizes(zoomLayer1VideoHeight, zoomLayer1VideoWidth, zoomLayer2VideoHeight, zoomLayer2VideoWidth);
            
            $('#zoomLayer1').width((zoomLayer1VideoWidth * 2) + "px"); 
            $('#zoomLayer1').height((zoomLayer1VideoHeight * 2) + "px"); 
            $('#zoomLayer2').width((zoomLayer2VideoWidth * 2) + "px"); 
            $('#zoomLayer2').height((zoomLayer2VideoHeight * 2) + "px");            
     
            fallBackLayer.style.top = 0 + 'px';

            if (currentZoomLevel == 0) {
                fullScreenZoomedTo = 0;
                
            } else if (currentZoomLevel == 1){

                var zoomLayer1VideoHeightFullScreen = computeVideoDimensions(zoomLayer1ContentAspectRatio, "fullscreen")[0];
                var zoomLayer1VideoWidthFullScreen = computeVideoDimensions(zoomLayer1ContentAspectRatio, "fullscreen")[1];
                xPosition = (zoomLayer1.offsetLeft / zoomLayer1VideoWidthFullScreen) * zoomLayer1VideoWidth; 
                yPosition = (zoomLayer1.offsetTop / zoomLayer1VideoHeightFullScreen) * zoomLayer1VideoHeight;

                zoomLayer1.style.left = xPosition + 'px';
                zoomLayer1.style.top = yPosition + 'px';
                fullScreenZoomedTo = 1;      
                
                zoomLayer1Hammer.off('panstart', function(evt) {
                    dragtool.startMoving(zoomLayer1, videoContainer, evt);
                });

                zoomLayer1Hammer.off('panend', function(evt) {
                    dragtool.stopMoving(videoContainer);
                });
                
                zoomLayer1Hammer.on('panstart', function(evt) {
                    dragtool.startMoving(zoomLayer1, videoContainer, evt);
                });

                zoomLayer1Hammer.on('panend', function(evt) {
                    dragtool.stopMoving(videoContainer);
                });

            } else if (currentZoomLevel == 2){

                xPosition = zoomLayer2.offsetLeft + (zoomLayer2VideoWidth / 2);
                yPosition = zoomLayer2.offsetTop + (zoomLayer2VideoHeight / 2);

                zoomLayer2.style.left = xPosition + 'px';
                zoomLayer2.style.top = yPosition + 'px';
                fullScreenZoomedTo = 2;
                
            }
            
            fullScreenFlag = false;  
            browserWindowZoomedTo = undefined;
            
        }
    }
    
    function adjustVideoSizes(zoomLayer1VideoHeight, zoomLayer1VideoWidth, zoomLayer2VideoHeight, zoomLayer2VideoWidth) {
    
        video1.height = zoomLayer1VideoHeight;
        video1.width = zoomLayer1VideoWidth;

        video2.height = zoomLayer1VideoHeight;
        video2.width = zoomLayer1VideoWidth;

        video3.height = zoomLayer1VideoHeight;
        video3.width = zoomLayer1VideoWidth;

        video4.height = zoomLayer1VideoHeight;
        video4.width = zoomLayer1VideoWidth;
        
        video5.height = zoomLayer2VideoHeight;
        video5.width = zoomLayer2VideoWidth;

        video6.height = zoomLayer2VideoHeight;
        video6.width = zoomLayer2VideoWidth;

        video7.height = zoomLayer2VideoHeight;
        video7.width = zoomLayer2VideoWidth;

        video8.height = zoomLayer2VideoHeight;
        video8.width = zoomLayer2VideoWidth;
        
    }
    
}

