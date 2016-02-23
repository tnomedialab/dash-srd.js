/* 
* The copyright in this software is being made available under the BSD
* License, included below. This software may be subject to other third party
* and contributor rights, including patent rights, and no such rights are
* granted under this license.
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
*  * Neither the name of TNO nor the names of its contributors may
*    be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS
* BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
* THE POSSIBILITY OF SUCH DAMAGE.
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

    var player = launchDashPlayer("fallBackLayer");
    player.attachSource(data);

    $.when(fallBackLayer.readyState === 4).then((function() {
        playPause();
    }));

  }
  
};

var tiledVideoAttacher = function() {
    
  ServiceBus.subscribe("SRD-MPD", this.fallBackLayerAttacher, "fallBackLayerAttacher");
  ServiceBus.subscribe("Zoom-level1", this.zoomLayer1Attacher, "zoomLayer1Attacher");
  ServiceBus.subscribe("Zoom-level2", this.zoomLayer2Attacher, "zoomLayer2Attacher");

};

tiledVideoAttacher.prototype = {
    
  fallBackLayerAttacher: function (data) {
    
    var fallBackLayerAdaptationSet;
    inMPD = data[1]; 
    var adaptationSets = inMPD.Period.AdaptationSet;
    var videoAdaptationSet = adaptationSets.slice(0, 1);
    var secondAdaptationSet = adaptationSets.slice(1, 2);
    
    if (secondAdaptationSet[0].mimeType == "audio/mp4") {
        fallBackLayerAdaptationSet = [videoAdaptationSet[0], secondAdaptationSet[0]];
        contentHasAudio = true;
    } else {
        fallBackLayerAdaptationSet = videoAdaptationSet;
        contentHasAudio = false;
    }
    
    frameRate = videoAdaptationSet[0].Representation.frameRate;
    fallBackLayerContentWidth = videoAdaptationSet[0].Representation.width;
    fallBackLayerContentHeight = videoAdaptationSet[0].Representation.height;
    fallBackLayerContentAspectRatio = fallBackLayerContentWidth / fallBackLayerContentHeight;
    
    if (fallBackLayerContentAspectRatio != initialAspectRatio) {

        updateAspectRatio(fallBackLayer, fallBackLayerContentAspectRatio);

    }    
      
    var fallBackLayerMPD = {"__cnt": inMPD.__cnt, 
                            "#comment": inMPD["#comment"], 
                            "#comment_asArray": inMPD["#comment_asArray"], 
                            BaseURL:inMPD.BaseURL, 
                            BaseURL_asArray: inMPD.BaseURL_asArray, 
                            Period: {"__cnt": inMPD.Period.__cnt, AdaptationSet: fallBackLayerAdaptationSet, AdaptationSet_asArray: fallBackLayerAdaptationSet, __children: fallBackLayerAdaptationSet}, 
                            Period_asArray: [{AdaptationSet: fallBackLayerAdaptationSet, AdaptationSet_asArray: fallBackLayerAdaptationSet, __children: fallBackLayerAdaptationSet}],
                            xmlns: inMPD.xmlns,
                            mediaPresentationDuration: inMPD.mediaPresentationDuration,
                            minBufferTime: inMPD.minBufferTime,
                            profiles: inMPD.profiles,
                            type: inMPD.type,
                            __text: inMPD.__text
                            };     

    var player = launchDashPlayer("fallBackLayer");
    var source = [mpdURL, fallBackLayerMPD];
    player.attachSource(source);

    $("#fallBackLayer").one("canplay", function(){

        if (fallBackLayer.paused) {
            fallBackLayer.play();
            
            if ($("#iconPlayPause").hasClass("icon-play")) { 
                $("#iconPlayPause").removeClass("icon-play"); 
            }
            
            if (!$("#iconPlayPause").hasClass("icon-pause")) {
                $("#iconPlayPause").toggleClass("icon-pause");
            }
        }

         // Set the video duration
        duration = fallBackLayer.duration;
        document.getElementById("videoDuration").innerHTML = secondsToTimeString(duration);

        // Set the videotimer    
        var timerInterval = duration / 2;  
        
        
        // Add pseudo class to seekbar if user is moving the scrubber,
        // otherwise it can not be moved
        var seekbar = document.getElementById("seekbar");
        seekbar.setAttribute('onmousedown', '$("#seekbar").toggleClass("user-seek");');
        seekbar.setAttribute('onmouseup', '$("#seekbar").removeClass("user-seek");');

        var videoTimer = setInterval(function(){
            document.getElementById("videoTime").innerHTML = secondsToTimeString(fallBackLayer.currentTime);
            
            if (!$("#seekbar").hasClass("user-seek")) {
                $("#seekbar").val(fallBackLayer.currentTime);
            }
            
            if (fallBackLayer.currentTime == duration) {
                clearInterval(videoTimer);
            }
            
        }, timerInterval);

        SynchroniseVideos();

        $("#volumebar").bind("change", function() {
          var val = this.value;
          fallBackLayer.volume = val;
        });
    });
  
    var supplementalPropertyValue = adaptationSets[0].SupplementalProperty.value;
    currentZoomLevel = supplementalPropertyValue.substr(supplementalPropertyValue.length - 1);  

    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
  
    var lastVideoIndex = adaptationSets.length;
    var lastVideo = adaptationSets.slice((lastVideoIndex - 1), lastVideoIndex);
    var essentialPropertyValueLength = lastVideo[0].EssentialProperty.value.length;
    maxZoomLevel = lastVideo[0].EssentialProperty.value.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);

    var orderedAdaptationSets = fallBackLayerAdaptationSet; 
    
    if (contentHasAudio == false) { 
        var o = 0;
        var orderedAdaptationSets = [fallBackLayerAdaptationSet[0]]; 
    } else {
        var o = 1;
        var orderedAdaptationSets = fallBackLayerAdaptationSet;  
    }   
              
    for (var i = 1 + o; i < adaptationSets.length; i++) {
        
        var essentialPropertyValue = adaptationSets[i].EssentialProperty.value; 
        var essentialPropertyValueAsArray = essentialPropertyValue.split(",");
        var essentialPropertyValueLength = essentialPropertyValueAsArray.length;
        var zoomLevel = essentialPropertyValueAsArray.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);
          
        if (zoomLevel == 1){
                                    
            if (i == 1 + o) {

                if ($.isArray(adaptationSets[i].Representation)){ 

                    zoomLayer1ContentWidth = adaptationSets[i].Representation[0].width;
                    zoomLayer1ContentHeight = adaptationSets[i].Representation[0].height;

                } else {
                    
                    zoomLayer1ContentWidth = adaptationSets[i].Representation.width;
                    zoomLayer1ContentHeight = adaptationSets[i].Representation.height;
                    
                }
                
                zoomLayer1ContentAspectRatio = zoomLayer1ContentWidth / zoomLayer1ContentHeight;              
             
                if (essentialPropertyValueAsArray[3] == 1 && essentialPropertyValueAsArray[4] == 1) {
                    
                    tileUnitType = "arbitrary units";
                    
                } else {
                    
                    tileUnitType = "pixel units";
 
                }

            }             
 
            spatialOrderingZoomLevel1.push({index: i, x: essentialPropertyValueAsArray[1], y: essentialPropertyValueAsArray[2]});      
   
            
        } else if (zoomLevel == 2) {
            
            var firstIterationFlag = true;
            
            if (firstIterationFlag) {

                if ($.isArray(adaptationSets[i].Representation)){ 

                    zoomLayer2ContentWidth = adaptationSets[i].Representation[0].width;
                    zoomLayer2ContentHeight = adaptationSets[i].Representation[0].height;

                } else {
                    
                    zoomLayer2ContentWidth = adaptationSets[i].Representation.width;
                    zoomLayer2ContentHeight = adaptationSets[i].Representation.height;
                    
                }
                
                zoomLayer2ContentAspectRatio = zoomLayer2ContentWidth / zoomLayer2ContentHeight;
                firstIterationFlag = false;
            }   
            
        spatialOrderingZoomLevel2.push({index: i, x: essentialPropertyValueAsArray[1], y: essentialPropertyValueAsArray[2]});    
            
        }        
    }
    
    if (spatialOrderingZoomLevel1.length > 0) {
        spatialOrderingZoomLevel1 = spatialOrderingZoomLevel1.sort(orderByProperty('x', 'y'));
        
        for (var i = 0; i < spatialOrderingZoomLevel1.length; i++) {
            var index = spatialOrderingZoomLevel1[i]['index'];
            orderedAdaptationSets.push(adaptationSets[index]);
        }
        
        spatialOrderingDimensionsZoomLevel1 = countUniques(spatialOrderingZoomLevel1);       
        zoomLevel1TilesHorizontal = spatialOrderingDimensionsZoomLevel1[1].slice(0, 1);
        zoomLevel1TilesVertical = spatialOrderingDimensionsZoomLevel1[0].length;

    }
    
    if (spatialOrderingZoomLevel2.length > 0) {
        spatialOrderingZoomLevel2 = spatialOrderingZoomLevel2.sort(orderByProperty('x', 'y'));

        for (var i = 0; i < spatialOrderingZoomLevel2.length; i++) {
            var index = spatialOrderingZoomLevel2[i]['index'];
            orderedAdaptationSets.push(adaptationSets[index]);
        }
        
        spatialOrderingDimensionsZoomLevel2 = countUniques(spatialOrderingZoomLevel2);       
        zoomLevel2TilesHorizontal = spatialOrderingDimensionsZoomLevel2[1].slice(0, 1);
        zoomLevel2TilesVertical = spatialOrderingDimensionsZoomLevel2[0].length;

    }
      
    inMPD.Period.AdaptationSet = orderedAdaptationSets;
   
  },
  
  zoomLayer1Attacher: function (data) {
 
    var adaptationSets = inMPD.Period.AdaptationSet; 
    var tileMPDs = [];
    var xPosition = data[0];
    var yPosition = data[1]; 
    var viewLayer = data[2];
    
    if (contentHasAudio == false) { 
        var o = 0;
    } else {
        var o = 1;
    }  
      
    for (var i = 1 + o; i < adaptationSets.length; i++) {
        
        var essentialPropertyValueLength = adaptationSets[i].EssentialProperty.value.length;
        var zoomLevel = adaptationSets[i].EssentialProperty.value.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);
          
        if (zoomLevel == currentZoomLevel){
           
            var arrayIndex = i - (1 + o);            
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
                                    
            if (i == 1 + o) {
                
                if ($.isArray(adaptationSets[i].Representation)){ 

                    zoomLayer1ContentWidth = adaptationSets[i].Representation[0].width;
                    zoomLayer1ContentHeight = adaptationSets[i].Representation[0].height;

                } else {
                    
                    zoomLayer1ContentWidth = adaptationSets[i].Representation.width;
                    zoomLayer1ContentHeight = adaptationSets[i].Representation.height;
                    
                }
                
                zoomLayer1ContentAspectRatio = zoomLayer1ContentWidth / zoomLayer1ContentHeight;

                
            }
            
        } else if (zoomLevel > currentZoomLevel) {
            break;
        }
        
    }
     
    zoomLayer1PlayerObjects = [];
    
    for (var i = 0; i < zoomLayer1VideoElements.length; i++) { 
        var videoElement = "video" + (i + 1);
        var player = launchDashPlayer(videoElement);  
        player.setAutoSwitchQuality(false);
        zoomLayer1PlayerObjects.push(player);
    }  
     
    for (var i = 0; i < zoomLayer1PlayerObjects.length; i++) { 
        var player = zoomLayer1PlayerObjects[i];
        var source = [mpdURL, tileMPDs[i]];  
        player.attachSource(source);
    }  
    
    initiatePlayBack(fallBackLayer, zoomLayer1VideoElements, browserType, frameRate, viewLayer);  
    updateViewLayerOnReadyState(zoomLayer1VideoElements, xPosition, yPosition, viewLayer); 
    
    if (getClickPositionEnabled === false) {
        
        videoContainer.addEventListener("dblclick", onClickEvent, false);
        getClickPositionEnabled = true;
        
    }
    
  },
  
  zoomLayer2Attacher: function (data) {
      
    var tile1,
        tile2,
        tile3,
        tile4;

    var adaptationSets = inMPD.Period.AdaptationSet; 
    var tileMPDs = [];
          
    var xPosition = data[0];
    var yPosition = data[1]; 
    var viewLayer = data[2];
    
    var videoContainerWidth = parseInt(videoContainer.offsetWidth, 10);
    var videoContainerHeight = parseInt(videoContainer.offsetHeight, 10);

    var selectedTiles = [];
    var numberOfTilesZoomLayer1 = zoomLevel1TilesHorizontal * zoomLevel1TilesVertical;

    var selectedTileX = Math.ceil(Math.abs(xPosition) / (videoContainerWidth / zoomLevel2TilesHorizontal));
    var selectedTileY = Math.ceil(Math.abs(yPosition) / (videoContainerHeight / zoomLevel2TilesVertical));
    var selectedTile1D = (selectedTileY - 1) * zoomLevel2TilesHorizontal + selectedTileX;
       
    if (selectedTileX < zoomLevel2TilesHorizontal && selectedTileY < zoomLevel2TilesVertical) {
        
        tile1 = selectedTile1D;
        tile2 = selectedTile1D + 1;
        tile3 = selectedTile1D + parseInt(zoomLevel2TilesHorizontal);
        tile4 = selectedTile1D + parseInt(zoomLevel2TilesHorizontal) + 1;
        
    } else if (selectedTileX == zoomLevel2TilesHorizontal && selectedTileY < zoomLevel2TilesVertical) { 
        
        tile1 = selectedTile1D - 1;
        tile2 = selectedTile1D;
        tile3 = selectedTile1D + parseInt(zoomLevel2TilesHorizontal) - 1;
        tile4 = selectedTile1D + parseInt(zoomLevel2TilesHorizontal);
        
    } else if (selectedTileX < zoomLevel2TilesHorizontal && selectedTileY == zoomLevel2TilesVertical) {
 
        tile1 = selectedTile1D - parseInt(zoomLevel2TilesHorizontal);
        tile2 = (selectedTile1D - parseInt(zoomLevel2TilesHorizontal)) + 1;
        tile3 = selectedTile1D;
        tile4 = selectedTile1D + 1;
        
    } else if (selectedTileX == zoomLevel2TilesHorizontal && selectedTileY == zoomLevel2TilesVertical) {
        
        tile1 = selectedTile1D - parseInt(zoomLevel2TilesHorizontal) - 1;
        tile2 = selectedTile1D - parseInt(zoomLevel2TilesHorizontal);
        tile3 = selectedTile1D - 1;
        tile4 = selectedTile1D;
    }  
    
    selectedTiles = [tile1, tile2, tile3, tile4];
        
 
    if (contentHasAudio == false) { 
        var o = 0;
    } else {
        var o = 1;
    }  
      
    for (var i = 1 + o; i < adaptationSets.length; i++) {
        
        var essentialPropertyValueLength = adaptationSets[i].EssentialProperty.value.length;
        var zoomLevel = adaptationSets[i].EssentialProperty.value.slice((essentialPropertyValueLength - 1), essentialPropertyValueLength);
        
        if (i == 1 + o) {

            var n = 0;
            var tileNumber = selectedTiles[n];
            
            if ($.isArray(adaptationSets[i].Representation)){ 

                zoomLayer2ContentWidth = adaptationSets[i].Representation[0].width;
                zoomLayer2ContentHeight = adaptationSets[i].Representation[0].height;

            } else {

                zoomLayer2ContentWidth = adaptationSets[i].Representation.width;
                zoomLayer2ContentHeight = adaptationSets[i].Representation.height;

            }

            zoomLayer2ContentAspectRatio = zoomLayer2ContentWidth / zoomLayer2ContentHeight;
                
        }
        
        
        if (i == (tileNumber + o + numberOfTilesZoomLayer1)) {
 
            var arrayIndex = n;            
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
                                    
            n += 1;
            tileNumber = selectedTiles[n];
            
        }
    }
     
    zoomLayer2PlayerObjects = [];
    
    for (var i = 0; i < zoomLayer2VideoElements.length; i++) { 
        var videoElement = "video" + (i + 5);
        var player = launchDashPlayer(videoElement);  
        player.setAutoSwitchQuality(false);
        zoomLayer2PlayerObjects.push(player);
    }  

    for (var i = 0; i < zoomLayer2PlayerObjects.length; i++) { 
        var player = zoomLayer2PlayerObjects[i];
        var source = [mpdURL, tileMPDs[i]];  
        player.attachSource(source);
    }  
    
    initiatePlayBack(fallBackLayer, zoomLayer2VideoElements, browserType, frameRate, viewLayer);  
    updateViewLayerOnReadyState(zoomLayer2VideoElements, xPosition, yPosition, viewLayer); 
    
  }
};


