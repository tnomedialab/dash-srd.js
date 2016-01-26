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

    var player = launchDashPlayer("fullBackLayer");
    player.attachSource(data);

    $.when(fullBackLayer.readyState === 4).then((function() {
        playPause();
    }));

  }
  
};

var tiledVideoAttacher = function() {
    
  ServiceBus.subscribe("SRD-MPD", this.fullBackLayerAttacher, "fullBackLayerAttacher");
  ServiceBus.subscribe("Zoom-level1", this.zoomLayer1Attacher, "zoomLayer1Attacher");
  ServiceBus.subscribe("Zoom-level2", this.zoomLayer2Attacher, "zoomLayer2Attacher");

};

tiledVideoAttacher.prototype = {
    
  fullBackLayerAttacher: function (data) {
    
    inMPD = data[1]; 
    var adaptationSets = inMPD.Period.AdaptationSet;
    var videoAdaptationSet = adaptationSets.slice(0, 1);
    var audioAdaptationSet =adaptationSets.slice(1, 2);
    var videoAndAudioAdaptationSet = [videoAdaptationSet[0], audioAdaptationSet[0]];
    
    frameRate = videoAdaptationSet[0].Representation.frameRate;
    contentWidth = videoAdaptationSet[0].Representation.width;
    contentHeight = videoAdaptationSet[0].Representation.height;
    contentAspectRatio = contentWidth / contentHeight;
    
    var fullBackLayerMPD = {"__cnt": inMPD.__cnt, 
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

    var player = launchDashPlayer("fullBackLayer");
    var source = [mpdURL, fullBackLayerMPD];
    player.attachSource(source);
    
    $.when(fullBackLayer.readyState === 4).then((function() {
        playPause();
    }));
    
    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
    
    var lastVideoIndex = adaptationSets.length;
    var lastVideo = adaptationSets.slice((lastVideoIndex - 1), lastVideoIndex);
    var essentialPropertyValueLength = lastVideo[0].EssentialProperty.value.length;
    maxZoomLevel = lastVideo[0].EssentialProperty.value.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);
      
  },
  
  zoomLayer1Attacher: function (data) {
 
    var adaptationSets = inMPD.Period.AdaptationSet; 
    var tileMPDs = [];
    var xPosition = data[0];
    var yPosition = data[1]; 
    var viewLayer = data[2];
      
    for (var i = 2; i < adaptationSets.length; i++) {
        
        var essentialPropertyValueLength = adaptationSets[i].EssentialProperty.value.length;
        var zoomLevel = adaptationSets[i].EssentialProperty.value.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);
          
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
     
    zoomLayer1PlayerObjects = [];
    
    for (var i = 0; i < zoomLayer1VideoElements.length; i++) { 
        var videoElement = "video" + (i + 1);
        var player = launchDashPlayer(videoElement);        
        zoomLayer1PlayerObjects.push(player);
    }  
     
    for (var i = 0; i < zoomLayer1PlayerObjects.length; i++) { 
        var player = zoomLayer1PlayerObjects[i];
        var source = [mpdURL, tileMPDs[i]];  
        player.attachSource(source);
        
        if (i == 0) {
            
            masterQuality = player.getQualityFor("video");
            
        } else if (i > 0) {
            
            player.setAutoSwitchQuality(false);
            player.setQualityFor("video", masterQuality);
        }
    }  
    
    fullBackLayer.addEventListener("timeupdate", initiatePlayBack(fullBackLayer, zoomLayer1VideoElements, browserType, frameRate));  
    updateViewLayerOnReadyState(zoomLayer1VideoElements, xPosition, yPosition, viewLayer);
     
    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
    
    zoomLayer1PlayerObjects[0].eventBus.addEventListener(MediaPlayer.events.METRIC_CHANGED, function(data) {
        
        // console.log(JSON.stringify(data, null, 4));

        
        if (typeof data !== undefined) {
            emitBitrateChange.bind(zoomLayer1PlayerObjects);
        }  
        
    });
    
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


