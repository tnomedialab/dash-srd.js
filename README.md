#Overview

Dash-srd.js is a reference implementation of the Spatial Relationship Description (SRD) amendment to MPEG-DASH (ISO/IEC 23009-1). It is developed to facilitate and promote adoption of MPEG DASH and SRD within the industry. This media player allows the playback of Spatially segmented content up to 3 resolution layers (including the non-tiled legacy content “fallback” layer). Coherent with MPEG-DASH, the content is described in a manifest, the Media Presentation Description (.mpd file). 

Dash-srd.js is designed as a wrapper around Dash.js (based upon version 1.5.0). It parses the spatial segments from a MPD file and feeds the relevant part for a segment as an object to a Dash.js instance. Therefor, Dash.js is slightly modified to be able to handle a MPD object as input. On top of the standard, the dash-srd.js player makes two assumptions. The first assumption is that the legacy content for the fallback layer is in the first AdaptationSet of the manifest file. And the second, that is there is a separate AdaptationSet for the audio of the fallback layer, this will be in de second AdaptationSet of the manifest file. 

## License
Please view the license in the LICENSE.md file. This software may be subject to other third party
and contributor rights, including patent rights, and no such rights are
granted under this license.

## Quick Start for Users

### Reference Player
git clone https://github.com/tnomedialab/dash-srd.js

### Install Dependencies
1.	A webserver instance

Whichever webserver that serves your needs, Apache, NGINX of just Python SimpleHTTPServer. 

An important notice, is that if the mpd file and content reside on a different host and/or port than the dash-srd.js player. Either an Allow Cross Origin Request header needs to be used on the content host, or the URL needs to be routed. With NGINX you can route incoming traffic on http://localhost/ to http://localhost/public  for the SRD player and http://localhost/content to http://contentserver for the content.

Python SimpleHTTPServer is easy to use for testing environments. Just go to your local repository directory with a command line tool and type python –m SimpleHTTPServer (or python 3 –m http.server when on Python 3). This will host the dash-srd.js player on http://localhost:8000/public/

Alternatively, host dash.all.js and dash-srd.min.js from the build directory on a different webserver and make sure that they are included in your HTML file with the appropriate URL. See index.html from the “public” directory as an example. The scripts are enclosed between the <head> and </head> tags. The dash.js script is modified to support manifest files as objects. Notice that there are two external libraries, jQuery and Popcorn.js. Those can be downloaded from the CDN URLs as in the index.html example.

The div’s and tables of the index.html file are the DOM elements of the player. Their id’s and classes are used within the dash-srd.min.js script, so they can only be changed if you modify the element id references in the Initializer.js script as well.

## Quick Start for Developers

### Reference Player
git clone https://github.com/tnomedialab/dash-srd.js

### Install Dependencies
1.	[install nodejs](http://nodejs.org/)
2.	[install grunt](http://gruntjs.com/getting-started)
* npm install -g grunt-cli

The source files are contained in the src directory. They consist of the player files, in subdirectory srdplayer and utilities for generic tasks in JavaScript. All the necessary source files are included Grunftile.js, such that you can build dash-srd.min.js from the command line with the command grunt. Provided that dash-srd is the current directory and grunt is correctly installed. If all went well (Grunt will tell you), the dash-srd.min.js script can be found in the build subdirectory.
