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
    
    bannerbox.style.visibility = "hidden";
    
    var mpdURL = document.getElementById('mpdURL').value;
    var videoElements = ['videonormal', 'video1', 'video2', 'video3', 'video4'];
    
    function launchDashPlayer (mpdURL, videoElement){
        var context = new Dash.di.DashContext();
        var player = new MediaPlayer(context);
        player.setAutoPlay(false);
        player.startup();
        player.attachView(document.querySelector("#" + videoElement));
        player.attachSource(mpdURL);
        playerObjects.push(player);
    };

    var playerObjects = [];
    for (var i = 0; i < videoElements.length; i++) { 
        var videoElement = videoElements[i];
        launchDashPlayer(mpdURL, videoElement);
    }
    
    setTimeout(function() {playPause();
    }, 1200);
}

function playPause() { 

    if (videonormal.paused) {
        videonormal.play();
        video1.play();
        video2.play();
        video3.play();
        video4.play();

    } else { 
        videonormal.pause();
        video1.pause();
        video2.pause();
        video3.pause();
        video4.pause();
    }
}


function makeBig() { 
    videonormal.width = 560;
    videoContainer.width = 560;
    videoContainer.height = 315;
    video1.width = 560; 
    video2.width = 560; 
    video3.width = 560; 
    video4.width = 560; 
} 

function makeSmall() { 
    videonormal.width = 320;
    videoContainer.width = 320;
    videoContainer.height = 180;
    video1.width = 320;
    video2.width = 320;
    video3.width = 320;
    video4.width = 320;
} 

function makeNormal() { 
    videonormal.width = 420;
    videoContainer.width = 420;
    videoContainer.height = 236;
    video1.width = 420;
    video2.width = 420;
    video3.width = 420;
    video4.width = 420;
} 
 
function swapVideos(){

   if (videonormal.style.visibility == 'visible' && tiletable.style.visibility == 'hidden'){
       videonormal.style.visibility = 'hidden';
       tiletable.style.visibility = 'visible';
       return;
   } 

   if (videonormal.style.visibility == 'hidden' && tiletable.style.visibility == 'visible'){
       videonormal.style.visibility = 'visible';
       tiletable.style.visibility = 'hidden';
       return;
   }
}

