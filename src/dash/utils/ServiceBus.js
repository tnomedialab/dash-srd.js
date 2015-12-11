/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Script to enable server side Publishing/Subscribing.

"use strict";

var lastUid = -1;

var messenger = {
    
  topics: {},

  subscribe: function(topic, listener) {
      
    // Create the topic if not yet created
    if(!this.topics[topic]) this.topics[topic] = [];
    
    // Create unsubscribe token and add the listener  
    var token = (++lastUid).toString();

        this.topics[topic].push({listener: listener, token: token});

    // Return token for unsubscribing
    return token;
  },
  
  unsubscribe: function(topic, token) {
      
    for (var i = 0; i < this.topics[topic].length; i++) {

      if (this.topics[topic][i]['token'] === token){
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
      listener(data || {});
    }
   
  }

};

exports.messenger = messenger;
