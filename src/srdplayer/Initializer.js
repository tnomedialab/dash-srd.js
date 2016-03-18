/* 
* The copyright in this software is being made available under the license below. 
* This software may be subject to other third party and TNO rights, 
* including patent rights, and no such rights are granted under this license.
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

// Declaration of global variables

var SRDPlayer,
    videoContainer,
    bannerbox,
    frameRate,
    fallBackLayer,
    zoomLayer1,
    zoomLayer2,
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
    zoomLayer1VideoElements,
    zoomLayer2VideoElements,
    visibleElement,
    zoomLayer1PlayerObjects,
    zoomLayer2PlayerObjects,
    videoController,
    getClickPositionEnabled,
    mpdURL,
    inMPD,
    currentZoomLevel,
    maxZoomLevel,
    fullScreenFlag,
    browserWindowZoomedTo,
    fullScreenZoomedTo,
    browserType,
    duration,
    timeUpdateIntervals,
    initialWidth,
    initialHeight,
    initialAspectRatio,
    fallBackLayerContentWidth,
    fallBackLayerContentHeight,
    fallBackLayerContentAspectRatio,   
    zoomLayer1ContentWidth,
    zoomLayer1ContentHeight,
    zoomLayer1ContentAspectRatio,
    zoomLayer2ContentWidth,
    zoomLayer2ContentHeight,
    zoomLayer2ContentAspectRatio,        
    screenAspectRatio,
    contentHasAudio,
    contentAspectRatio,
    lastVolumeValue,
    masterQuality,
    videoControllerClone,
    viewState,
    zoomLayer1VideoHeight,
    zoomLayer1VideoWidth,
    zoomLayer2VideoHeight,
    zoomLayer2VideoWidth,
    tileUnitType,
    spatialOrderingZoomLevel1,
    spatialOrderingZoomLevel2,
    spatialOrderingDimensionsZoomLevel1,
    spatialOrderingDimensionsZoomLevel2,
    zoomLevel1TilesHorizontal,
    zoomLevel2TilesHorizontal,
    zoomLevel1TilesVertical,
    zoomLevel2TilesVertical,
    zoomLayer1Hammer,
    zoomLayer2Hammer;

/* Variable assignments to be executed when DOM loading is finished.
 * This is needed to get hooks to DOM elements and do some settings.
 * If you want to change the id of DOM elements in your HTML file (e.g. zoomLayer1 or video1),
 * be sure to change them here as well in each occurence: 
 * document.getElementById("<yourElementId>") 
 */

$(document).ready(function() {
    SRDPlayer = document.getElementById("SRDPlayer");
    videoContainer = document.getElementById("videoContainer");
    bannerbox = document.getElementById("bannerbox");
    fallBackLayer = document.getElementById("fallBackLayer");
    zoomLayer1 = document.getElementById("zoomLayer1");
    zoomLayer2 = document.getElementById("zoomLayer2");
    zoomLayer1Hammer = new Hammer(zoomLayer1);
    zoomLayer2Hammer = new Hammer(zoomLayer2);
    video1 = document.getElementById("video1");
    video2 = document.getElementById("video2");
    video3 = document.getElementById("video3");
    video4 = document.getElementById("video4");
    video5 = document.getElementById("video5");
    video6 = document.getElementById("video6");
    video7 = document.getElementById("video7");
    video8 = document.getElementById("video8");
    videoController = document.getElementById("videoController");

    zoomLayer1VideoElements = [video1, video2, video3, video4];
    zoomLayer2VideoElements = [video5, video6, video7, video8];  
    zoomLayer1PlayerObjects = [];
    zoomLayer2PlayerObjects = [];
    spatialOrderingZoomLevel1 = [];
    spatialOrderingZoomLevel2 = [];
    
    fallBackLayer.style.visibility = 'visible';
    zoomLayer1.style.visibility = 'hidden';
    zoomLayer2.style.visibility = 'hidden';    
    
    video1.muted = true;
    video2.muted = true;
    video3.muted = true;
    video4.muted = true;
    video5.muted = true;
    video6.muted = true;
    video7.muted = true;
    video8.muted = true;
    getClickPositionEnabled = false;
    fullScreenFlag = false;
    timeUpdateIntervals = {Chrome:250, Safari:250, Opera: 250, IE:250, Edge:250, Other:250};
    browserType = detectBrowser();
    
});
