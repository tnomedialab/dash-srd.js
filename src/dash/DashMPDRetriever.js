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

// Basic script to retrieve MPD files and convert them to JSON.

"use strict";

var http = require("http");
var parseString = require("xml2js").parseString;
var serviceBus = require("./utils/ServiceBus.js");

var MPDRetriever = function (params) {
    this.params = params;
};

MPDRetriever.prototype = {
  retrieveAndConvert: function (mpdUrl, callback) {
    var req = http.get(mpdUrl, function(res) {
    var xml = " ";
    
    res.on("data", function(chunk) {
      xml += chunk;
    });

    res.on("error", function(e) {
      callback(e, null);
    }); 

    res.on("timeout", function(e) {
      callback(e, null);
    }); 

    res.on("end", function() { 
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
},

  getMPD: function () {
    
    this.retrieveAndConvert (this.params.mpdUrl, function(err, data) {
  
      if (err) {
      
    return console.err(err);
    }
      
    serviceBus.messenger.publish("MPD-incoming", data);
 
});}
};

exports.MPDRetriever = MPDRetriever;