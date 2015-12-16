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

"use strict";

var mpdUrl = "http://localhost:8000/BigBuckBunny_10s_isoffmain_DIS_23009_1_v_2_1c2_2011_08_30.mpd";
var mpdJSON = null;
var ServiceBus = require("./utils/ServiceBus.js");
var MPDRetriever = require("./DashMPDRetriever.js").MPDRetriever;
var MPDParser = require("./DashMPDParser.js").MPDParser;
 
//mpdJSON = DashMPDRetriever.getMPD(url);

var mpdParser = new MPDParser;
var mpdRetriever = new MPDRetriever({mpdUrl: mpdUrl});
mpdRetriever.getMPD();



// TODO: page with default mediaplayer served for testing, refactor

var videoLauncher = function () {
  ServiceBus.messenger.subscribe("Video-incoming", this.launchVideo, "Video launcher");
};

videoLauncher.prototype = {
  launchVideo: function (message) {

    var http = require("http");
    http.createServer(function(request, response) {  
      response.writeHead(200, {"Content-Type": "text/html"});  
      response.write('<video width="' + message.initializationWidth + '\" height=\"' + message.baseURL + message.segmentURLs[0]._media + '\" src=\"' + message.mediaURL + '" autoplay controls></video>');  
      response.end();
    }).listen(8080);
    console.log('Server is listening to http://localhost/ on port 8080…');   
  }
};

new videoLauncher;