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
    
    var mpdURL = document.getElementById('mpdURL').value; 
    bannerbox.style.backgroundImage = "none";
    bannerbox.style.backgroun = "black";
    MPDManager(mpdURL);
    
}

function playPause() { 

    if (frontBackLayer.paused) {
        frontBackLayer.play();
        video1.play();
        video2.play();
        video3.play();
        video4.play();

    } else { 
        frontBackLayer.pause();
        video1.pause();
        video2.pause();
        video3.pause();
        video4.pause();
    }
}

function switchSound() { 
    
    if (frontBackLayer.muted === false){
        frontBackLayer.muted = true;
    } else if (frontBackLayer.muted === true){
        frontBackLayer.muted = false;
    }
} 

function switchScreenMode() {
    
    var videoHeight,
        videoWidth,       
        fullScreenVideoHeight,
        fullScreenVideoWidth,
        screenChangeEvents;

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        
        fullScreenFlag = true;   
        
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
        
        setTimeout(function() {
            $('#zoomLayer1').toggleClass('fullscreen'); 
            $('#zoomLayer2').toggleClass('fullscreen'); 
            
            zoomLayer1.width = fullScreenVideoWidth * 2;
            zoomLayer1.height = fullScreenVideoHeight * 2;
            zoomLayer2.width = fullScreenVideoWidth * 2;
            zoomLayer2.height = fullScreenVideoHeight * 2;
            
            $('#playbackControls').toggleClass('fullscreen'); 
            $('#frontBackLayer').toggleClass('fullscreen');
            $('#bannerbox').toggleClass('fullscreen');
            $('#videoContainer').toggleClass('fullscreen');

            adjustVideoSizes(fullScreenVideoHeight, fullScreenVideoWidth);
        }, 35);

    } else {
        if (videoContainer.exitFullscreen) {
            videoContainer.exitFullscreen();
        } else if (videoContainer.msExitFullscreen) {
            videoContainer.msExitFullscreen();
        } else if (videoContainer.mozCancelFullScreen) {
            videoContainer.mozCancelFullScreen();
        } else if (videoContainer.webkitExitFullscreen) {
            videoContainer.webkitExitFullscreen();
        }
        
        exitHandler();
    } 
        
    screenChangeEvents = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";

    setTimeout(function() {
        
        $(videoContainer).on(screenChangeEvents, function () {
            exitHandler();
            $(videoContainer).off(screenChangeEvents);
        });
    }, 100);
    
    function exitHandler() {
        
        var xPosition,
            yPosition;
        
        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
                       
            setTimeout(function() {
                $('#playbackControls').removeClass('fullscreen'); 
                $('#frontBackLayer').removeClass('fullscreen');
                $('#zoomLayer1').removeClass('fullscreen'); 
                $('#zoomLayer2').removeClass('fullscreen'); 
                $('video').removeClass('fullscreen');
                $('#videoContainer').removeClass('fullscreen');

                videoWidth = 640;
                videoHeight = 360;

                adjustVideoSizes(videoHeight, videoWidth);
                
                if (currentZoomLevel == 0){
                                     
                    xPosition = (zoomLayer1.offsetLeft / fullScreenVideoWidth) * videoWidth;
                    yPosition = (zoomLayer1.offsetTop / fullScreenVideoHeight) * videoHeight;
                   
                    zoomLayer1.style.left = xPosition + 'px';
                    zoomLayer1.style.top = yPosition + 'px';
                    
                } else if (currentZoomLevel == 1){
                    
                    xPosition = (zoomLayer2.offsetLeft / fullScreenVideoWidth) * videoWidth;
                    yPosition = (zoomLayer2.offsetTop / fullScreenVideoHeight) * videoHeight;
                   
                    zoomLayer2.style.left = xPosition + 'px';
                    zoomLayer2.style.top = yPosition + 'px';
                }

            }, 35);
            
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

