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

function openVideo(){

    if(!$("#iconPlayPause").hasClass("icon-play") || !$("#iconPlayPause").hasClass("icon-pause")) {
        $("#iconPlayPause").toggleClass("icon-play"); 
    }
    
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

    if (fullBackLayer.paused) {
        fullBackLayer.play();
        video1.play();
        video2.play();
        video3.play();
        video4.play();
        $("#iconPlayPause").removeClass("icon-play");
        $("#iconPlayPause").toggleClass("icon-pause");

    } else { 
        fullBackLayer.pause();
        video1.pause();
        video2.pause();
        video3.pause();
        video4.pause();
        $("#iconPlayPause").removeClass("icon-pause");
        $("#iconPlayPause").toggleClass("icon-play");
    }
}

function muteSound() { 
    
    if (fullBackLayer.muted === false){
        lastVolumeValue = fullBackLayer.volume;
        fullBackLayer.muted = true;
        $("#iconMute").removeClass("icon-mute-off");
        $("#iconMute").toggleClass("icon-mute-on");
        $("#volumebar").val(0.0);
        
    } else if (fullBackLayer.muted === true){
        fullBackLayer.muted = false;
        fullBackLayer.volume = lastVolumeValue;
        $("#iconMute").removeClass("icon-mute-on");
        $("#iconMute").toggleClass("icon-mute-off");
        $("#volumebar").val(lastVolumeValue);
        
    }
} 

function switchScreenMode() {
    
    var videoHeight,
        videoWidth,       
        screenChangeEvents;

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        
        fullScreenFlag = true;   
        var dimensions = new fullScreenDimensions();
        fullScreenVideoHeight = dimensions[0];
        fullScreenVideoWidth = dimensions[1]; 
        
        if (browserType === "Chrome" || "FireFox"){

            // TODO : fix fullscreen mode when browser is not maximized
        }
        
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

        fullBackLayer.style.width = "";
        fullBackLayer.style.height = "";  
        zoomLayer1.width = fullScreenVideoWidth * 2;
        zoomLayer1.height = fullScreenVideoHeight * 2;
        zoomLayer2.width = fullScreenVideoWidth * 2;
        zoomLayer2.height = fullScreenVideoHeight * 2;

        $('#fullBackLayer').toggleClass('fullscreen');
        $('#videoContainer').toggleClass('fullscreen');
        $('#bannerbox').toggleClass('bannerbox-fullscreen'); 
        $("#videoController").toggleClass('video-controller-fullscreen');

        adjustVideoSizes(fullScreenVideoHeight, fullScreenVideoWidth);

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
        
        exitHandler();
    } 
        
    screenChangeEvents = "webkitfullscreenchange fullscreenchange MSFullscreenChange";

    if (browserType === "FireFox") {
        setTimeout(function() {

            $(document).one("mozfullscreenchange", function () {
                exitHandler();
                $(document).off("mozfullscreenchange");
            });
        }, 100);
    } else {
        setTimeout(function() {

            $(videoContainer).one(screenChangeEvents, function () {
                exitHandler();
            });
        }, 100);
    }
    
    function exitHandler() {
        
        var xPosition,
            yPosition;
        
        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {       
            
            fullBackLayer.style.width = "";
            fullBackLayer.style.height = "";             

            zoomLayer1.removeAttribute('width');
            zoomLayer1.removeAttribute('height');
            zoomLayer2.removeAttribute('width');
            zoomLayer2.removeAttribute('height');
            
            $('#fullBackLayer').removeClass('fullscreen');
            $('#zoomLayer1').removeClass('fullscreen'); 
            $('#zoomLayer2').removeClass('fullscreen'); 
            $('video').removeClass('fullscreen');
            
            $('#videoContainer').removeClass('fullscreen');           
            $('#videoController').removeClass('video-controller-fullscreen');
            $("#icon-fullscreen").removeClass("icon-fullscreen-exit");
            $("#icon-fullscreen").toggleClass("icon-fullscreen-enter");

            videoWidth = initialWidth;
            videoHeight = initialHeight;
            adjustVideoSizes(videoHeight, videoWidth);
            
            $('#zoomLayer1').width((initialWidth * 2) + "px"); 
            $('#zoomLayer1').height((initialHeight * 2) + "px"); 
            $('#zoomLayer2').width((initialWidth * 2) + "px"); 
            $('#zoomLayer2').height((initialHeight * 2) + "px"); 

            if (currentZoomLevel == undefined) {
                fullScreenZoomedTo = undefined;
                
            } else if (currentZoomLevel == 0){

                xPosition = (zoomLayer1.offsetLeft / fullScreenVideoWidth) * videoWidth;
                yPosition = (zoomLayer1.offsetTop / fullScreenVideoHeight) * videoHeight;

                zoomLayer1.style.left = xPosition + 'px';
                zoomLayer1.style.top = yPosition + 'px';
                fullScreenZoomedTo = 0;           

            } else if (currentZoomLevel == 1){

                xPosition = (zoomLayer2.offsetLeft / fullScreenVideoWidth) * videoWidth;
                yPosition = (zoomLayer2.offsetTop / fullScreenVideoHeight) * videoHeight;

                zoomLayer2.style.left = xPosition + 'px';
                zoomLayer2.style.top = yPosition + 'px';
                fullScreenZoomedTo = 1;
                
            }
            
            fullScreenFlag = false;           
            
        }
    }
    
    function adjustVideoSizes(videoHeight, videoWidth) {
    
        video1.height = videoHeight;
        video1.width = videoWidth;

        video2.height = videoHeight;
        video2.width = videoWidth;

        video3.height = videoHeight;
        video3.width = videoWidth;

        video4.height = videoHeight;
        video4.width = videoWidth;
        
        video5.height = videoHeight;
        video5.width = videoWidth;

        video6.height = videoHeight;
        video6.width = videoWidth;

        video7.height = videoHeight;
        video7.width = videoWidth;

        video8.height = videoHeight;
        video8.width = videoWidth;
        
    }
    
}

