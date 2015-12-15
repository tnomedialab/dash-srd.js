/* 
 * Created bij Jorrit van den Berg on 07/12/15.
 * Copyright (c) 2015, TNO.
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

// Basic script to parse JSON extracted from incoming MPD file.

"use strict";

import ServiceBus from "./utils/ServiceBus.js";

var MPDParser = function() {
  ServiceBus.subscribe("MPD-incoming", this.parseMPD, "MPDParser");
};

MPDParser.prototype = {
  parseMPD: function (data) {
    
    //TODO: implement parsing routine and remove console.log
  
    var id = data.MPD.Period.AdaptationSet.Representation[0]._id;
    var codecs = data.MPD.Period.AdaptationSet.Representation[0]._codecs;
    var mimeType = data.MPD.Period.AdaptationSet.Representation[0]._mimeType;
    var startWithSAP = data.MPD.Period.AdaptationSet.Representation[0]._startWithSAP;
    var bandwidth = data.MPD.Period.AdaptationSet.Representation[0]._bandwidth;
    var duration = data.MPD.Period.AdaptationSet.Representation[0].SegmentList._duration;
  
    var initializationWidth = data.MPD.Period.AdaptationSet.Representation[0]._width;
    var initializationHeight = data.MPD.Period.AdaptationSet.Representation[0]._height;
    
    var baseURL = data.MPD.BaseURL;     
    var initializationSourceURL = data.MPD.Period.AdaptationSet.Representation[0].SegmentBase.Initialization._sourceURL;
    var segmentURLs = data.MPD.Period.AdaptationSet.Representation[0].SegmentList.SegmentURL;
      
    // var mediaURL = baseURL + initializationSourceURL;
    
    var message = {initializationWidth: initializationWidth, initializationHeight: initializationHeight, baseURL: baseURL, segmentURLs: segmentURLs};
    
    console.log(segmentURLs);
    ServiceBus.publish("Video-incoming", message);
    
  }
};

export default MPDParser;