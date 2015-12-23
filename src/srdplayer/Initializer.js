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

// Global variables
var bannerbox;
var videonormal;
var tiletable;
var video1;
var video2;
var video3;
var video4;
var videoElements;
    
$(document).ready(function() {
    bannerbox = document.getElementById("bannerbox");
    videonormal = document.getElementById("videonormal");
    tiletable = document.getElementById("tiletable");
    video1 = document.getElementById("video1");
    video2 = document.getElementById("video2");
    video3 = document.getElementById("video3");
    video4 = document.getElementById("video4");

    videoElements = ['videonormal', 'video1', 'video2', 'video3', 'video4'];
    
    videonormal.style.visibility = 'visible';
    tiletable.style.visibility = 'hidden';   
    
    video1.muted = true;
    video2.muted = true;
    video3.muted = true;
    video4.muted = true;
    
    SynchroniseVideos();
});
