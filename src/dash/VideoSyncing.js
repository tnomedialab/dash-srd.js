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


var videos = {
    a: Popcorn("#a"),
    b: Popcorn("#b"),
  },
  scrub = $("#scrub"),
  loadCount = 0,
  events = "play pause timeupdate seeking".split(/\s+/g);

// iterate both media sources
Popcorn.forEach(videos, function(media, type) {

  // when each is ready... 
  media.on("canplayall", function() {

    // trigger a custom "sync" event
    this.emit("sync");

    // set the max value of the "scrubber"
    scrub.attr("max", this.duration());

    // Listen for the custom sync event...    
  }).on("sync", function() {

    // Once both items are loaded, sync events
    if (++loadCount == 2) {

      // Iterate all events and trigger them on the video B
      // whenever they occur on the video A
      events.forEach(function(event) {

        videos.a.on(event, function() {

          // Avoid overkill events, trigger timeupdate manually
          if (event === "timeupdate") {

            if (!this.media.paused) {
              return;
            }
            videos.b.emit("timeupdate");

            // update scrubber
            scrub.val(this.currentTime());

            return;
          }

          if (event === "seeking") {
            videos.b.currentTime(this.currentTime());
          }

          if (event === "play" || event === "pause") {
            videos.b[event]();
          }
        });
      });
    }
  });
});

scrub.bind("change", function() {
  var val = this.value;
  videos.a.currentTime(val);
  videos.b.currentTime(val);
});

// With requestAnimationFrame, we can ensure that as 
// frequently as the browser would allow, 
// the video is resync'ed.
function sync() {
  if (videos.b.media.readyState === 4) {
    videos.b.currentTime(
      videos.a.currentTime()
    );
  }
  requestAnimationFrame(sync);
}

sync();

