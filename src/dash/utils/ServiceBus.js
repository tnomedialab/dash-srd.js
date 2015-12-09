/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Script to enable server side Publishing/Subscribing.

"use strict";

var messenger = {
  topics: {},

  subscribe: function(topic, listener) {
    // Create the topic if not yet created
    if(!this.topics[topic]) this.topics[topic] = [];

    // Add the listener
    this.topics[topic].push(listener);

  },

  // TODO: implement unsubscribe function if necessary
  // (for instance when the ServiceBus is used for a large scale of messages)
  unsubscribe: function(topic, listener) {     
  },

  publish: function(topic, data) {
    // Return if the topic doesn't exist, or there are no listeners
    if(!this.topics[topic] || this.topics[topic].length < 1) return;

    // Send the event to all listeners
    this.topics[topic].forEach(function(listener) {
      listener(data || {});

    });
  }

};

exports.messenger = messenger;
