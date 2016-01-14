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

// Attaches MPD or part of it to Dash player

var normalVideoAttacher = function() {
    
  ServiceBus.subscribe("Non-SRD-MPD", this.attacher, "normalVideoAttacher");

};

normalVideoAttacher.prototype = {
  attacher: function (data) {

    if (getClickPositionEnabled === true) {

        videoContainer.removeEventListener("dblclick", getClickPosition);
    }     

    var player = launchDashPlayer("frontBackLayer");
    player.attachSource(data);

    $.when(frontBackLayer.readyState === 4).then((function() {playPause();
    }));

  }
  
};

var tiledVideoAttacher = function() {
    
  ServiceBus.subscribe("SRD-MPD", this.frontBackLayerAttacher, "frontBackLayerAttacher");
  ServiceBus.subscribe("Zoom-level1", this.zoomLayer1Attacher, "zoomLayer1Attacher");
  ServiceBus.subscribe("Zoom-level2", this.zoomLayer2Attacher, "zoomLayer2Attacher");

};

tiledVideoAttacher.prototype = {
    
  frontBackLayerAttacher: function (data) {
    
    inMPD = data[1]; 
    var adaptationSets = inMPD.Period.AdaptationSet;
    var videoAdaptationSet = adaptationSets.slice(0, 1);
    var audioAdaptationSet =adaptationSets.slice(1, 2);
    
    frameRate = videoAdaptationSet[0].Representation.frameRate;
    
    var frontBackLayerVideoAdaptationSet = {"__cnt": videoAdaptationSet[0].__cnt, 
                                            "#comment": videoAdaptationSet[0]["#comment"], 
                                            "#comment_asArray": videoAdaptationSet[0]["#comment_asArray"], 
                                            SegmentTemplate: videoAdaptationSet[0].SegmentTemplate[0],
                                            SegmentTemplate_asArray: [videoAdaptationSet[0].SegmentTemplate_asArray[0]],
                                            Role: videoAdaptationSet[0].Role[0],
                                            Role_asArray: [videoAdaptationSet[0].Role_asArray[0]],
                                            SupplementalProperty: videoAdaptationSet[0].SupplementalProperty[0],
                                            SupplementalProperty_asArray: [videoAdaptationSet[0].SupplementalProperty_asArray[0]],
                                            Representation: videoAdaptationSet[0].Representation[0],
                                            Representation_asArray: [videoAdaptationSet[0].Representation_asArray[0]],
                                            __children: videoAdaptationSet[0].__children,
                                            mimeType: videoAdaptationSet[0].mimeType,
                                            segmentAlignment: videoAdaptationSet[0].segmentAlignment,
                                            startWithSAP: videoAdaptationSet[0].startWithSAP,
                                            __text: videoAdaptationSet[0].__text 
                                            };
    
    var videoAndAudioAdaptationSet = [videoAdaptationSet[0], audioAdaptationSet[0]];
    
    var frontBackLayerMPD = {"__cnt": inMPD.__cnt, 
                            "#comment": inMPD["#comment"], 
                            "#comment_asArray": inMPD["#comment_asArray"], 
                            BaseURL:inMPD.BaseURL, 
                            BaseURL_asArray: inMPD.BaseURL_asArray, 
                            Period: {"__cnt": inMPD.Period.__cnt, AdaptationSet: videoAndAudioAdaptationSet, AdaptationSet_asArray: videoAndAudioAdaptationSet, __children: videoAndAudioAdaptationSet}, 
                            Period_asArray: [{AdaptationSet: videoAndAudioAdaptationSet, AdaptationSet_asArray: videoAndAudioAdaptationSet, __children: videoAndAudioAdaptationSet}],
                            xmlns: inMPD.xmlns,
                            mediaPresentationDuration: inMPD.mediaPresentationDuration,
                            minBufferTime: inMPD.minBufferTime,
                            profiles: inMPD.profiles,
                            type: inMPD.type,
                            __text: inMPD.__text
                            };     

    var player = launchDashPlayer("frontBackLayer");
    var source = [mpdURL, frontBackLayerMPD];
    player.attachSource(source);
    
    $.when(frontBackLayer.readyState === 4).then((function() {playPause();
    }));
    
    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
    
    var lastVideoIndex = adaptationSets.length;
    var lastVideo = adaptationSets.slice((lastVideoIndex - 1), lastVideoIndex);
    var lastVideoBaseURL = lastVideo[0].Representation.BaseURL;
    maxZoomLevel = lastVideoBaseURL.substring(lastVideoBaseURL.lastIndexOf("Level_")+6,lastVideoBaseURL.lastIndexOf("/Tile_"));
      
  },
  
  zoomLayer1Attacher: function (data) {
 
    var adaptationSets = inMPD.Period.AdaptationSet; 
    var tileMPDs = [];
    var xPosition = data[0];
    var yPosition = data[1]; 
    var zoomLayer = data[2];
      
    for (var i = 2; i < adaptationSets.length; i++) {
        
        var tileBaseURL = adaptationSets[i].Representation.BaseURL;
        var zoomLevel = tileBaseURL.substring(tileBaseURL.lastIndexOf("Level_")+6,tileBaseURL.lastIndexOf("/Tile_"));
          
        if (zoomLevel == currentZoomLevel){
           
            var arrayIndex = i - 2;            
            tileMPDs[arrayIndex] = {"__cnt": inMPD.__cnt, 
                                    "#comment": inMPD["#comment"], 
                                    "#comment_asArray": inMPD["#comment_asArray"], 
                                    BaseURL:inMPD.BaseURL, 
                                    BaseURL_asArray: inMPD.BaseURL_asArray, 
                                    Period: {"__cnt": inMPD.Period.__cnt, AdaptationSet: adaptationSets[i], AdaptationSet_asArray: [adaptationSets[i]], __children: adaptationSets[i]}, 
                                    Period_asArray: [{AdaptationSet: adaptationSets[i], AdaptationSet_asArray: [adaptationSets[i]], __children: adaptationSets[i]}],
                                    xmlns: inMPD.xmlns,
                                    mediaPresentationDuration: inMPD.mediaPresentationDuration,
                                    minBufferTime: inMPD.minBufferTime,
                                    profiles: inMPD.profiles,
                                    type: inMPD.type,
                                    __text: inMPD.__text
                                    };
            
        } else if (zoomLevel > currentZoomLevel) {
            break;
        }
        
    }
     
    for (var i = 0; i < zoomLayer1VideoElements.length; i++) { 
        var videoElement = zoomLayer1VideoElements[i];
        var player = launchDashPlayer(videoElement);
        zoomLayer1PlayerObjects.push(player);
    }     
     
    for (var i = 0; i < zoomLayer1PlayerObjects.length; i++) { 
        var player = zoomLayer1PlayerObjects[i];
        var source = [mpdURL, tileMPDs[i]];  
        player.attachSource(source);
    }  

      
    frontBackLayer.addEventListener("timeupdate", initiatePlayBack());  
  
    function initiatePlayBack() { 
        
        var initialTimeOffset = 0.001;
        var loopPassedTime;
        var loopEndTime;
        var loopStartTime = new Date().getMilliseconds();
  
        var currentTime = frontBackLayer.currentTime;  

        for (var i = 0; i < zoomLayer1VideoElements.length; i++) {

            var videoElement = zoomLayer1VideoElements[i];

            loopEndTime = new Date().getMilliseconds();
            loopPassedTime = (loopEndTime - loopStartTime)  / 1000.00000;
         
            document.getElementById(videoElement).currentTime = currentTime + initialTimeOffset;
            document.getElementById(videoElement).play();
            document.getElementById(videoElement).pause();         

        } 
        
        setTimeout(
                (function(){
                    video1.play();
                    video2.play();
                    video3.play();
                    video4.play();
                    // playPause();
                }
        ), 800);
               
    }

    updateVideoContainer(xPosition, yPosition, zoomLayer, 1000);
     
    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
    
    var lastVideoIndex = adaptationSets.length;
    var lastVideo = adaptationSets.slice((lastVideoIndex - 1), lastVideoIndex);
    var lastVideoBaseURL = lastVideo[0].Representation.BaseURL;
    maxZoomLevel = lastVideoBaseURL.substring(lastVideoBaseURL.lastIndexOf("Level_")+6,lastVideoBaseURL.lastIndexOf("/Tile_"));
    
  },
  
  zoomLayer2Attacher: function (data) {
    var xPosition = data[0];
    var yPosition = data[1];
    
    var adaptationSets = inMPD.Period.AdaptationSet; 
    var tileMPDs = [];
      
    for (var i = 2; i < adaptationSets.length; i++) {
        
        var tileBaseURL = adaptationSets[i].Representation.BaseURL;
        var zoomLevel = tileBaseURL.substring(tileBaseURL.lastIndexOf("Level_")+6,tileBaseURL.lastIndexOf("/Tile_"));
          
        if (zoomLevel == currentZoomLevel){
            
            var tileMPD = new Object(inMPD);
            var tileAdaptationSet = adaptationSets.slice(i, (i + 1));
    
            tileMPD.Period.AdaptationSet = tileAdaptationSet;
            tileMPD.Period.AdaptationSet_asArray = tileAdaptationSet;
            tileMPD.Period.__children = tileAdaptationSet;

            tileMPD.Period_asArray[0].AdaptationSet = tileAdaptationSet;
            tileMPD.Period_asArray[0].AdaptationSet_asArray = tileAdaptationSet;
            tileMPD.Period_asArray[0].__children = tileAdaptationSet;
            
            tileMPDs.push(tileMPD);            
            
        } else if (zoomLevel > currentZoomLevel) {
            break;
        }
        
    }
    
    for (var i = 0; i < playerObjects.length; i++) { 
        var player = playerObjects[i];
        player.attachSource([mpdURL, tileMPDs[i]]);
    }  
    
    //TODO: enable support for more zoom levels
    
    for (var i = 0; i < zoomLayerVideoElements.length; i++) {
        var videoElement = zoomLayerVideoElements[i];
        $.when(videoElement.readyState === 4).then(setTimeout(function() {playPause();}, 1));
    
      }  
    
  }
};


