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

// Script to enable server side Publishing/Subscribing.

"use strict";

var lastUid = -1;
var ServiceBus = {

  topics: {},

  subscribe: function(topic, listener, subscriber) {

    // Create the topic if not yet created
    if(!this.topics[topic]) this.topics[topic] = [];

    // Create unsubscribe token and add the listener  
    var token = (++lastUid).toString();

        this.topics[topic].push({listener: listener, token: token, subscriber: subscriber});

        var subscriber = subscriber;
        console.log("Subscribing " + subscriber + " to topic " + topic);      

    // Return token for unsubscribing
    return token;
  },

  unsubscribe: function(topic, token) {

    for (var i = 0; i < this.topics[topic].length; i++) {

      if (this.topics[topic][i]['token'] === token){
        console.log("Unsubscribing " + this.topics[topic][i]['subscriber'] + " from topic" + topic);  
        this.topics[topic].splice(i, 1);        
      }
    }

  },

  publish: function(topic, data) {
    // Return if the topic doesn't exist, or there are no listeners
    var numberOfListeners = this.topics[topic].length; 
    if(!this.topics[topic] || numberOfListeners < 1) return;

    for (var i = 0; i < numberOfListeners; i++) {
      var listener = this.topics[topic][i]['listener'];
            console.log("Publishing topic " + topic + " to subscriber " + this.topics[topic][i]['subscriber']);
      listener(data || {});
    }

  }

};

