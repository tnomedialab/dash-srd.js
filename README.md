# dash-srd.js

dash-srd.js is a DASH player implementing the tiled
streaming. It allows the user to freely navigate
in a high resolution video panorama while downloading just what
is needed to render the user's viewpoint,

## Getting started

The player can be tested in the online demo [here](http://url-of-the-demo.com).

## Background

### Standardisation

The dash-srd.js player is a reference DASH player
implementation allowing the user to navigate in a video panorama.
It relies on the Spatial Relationship Description (SRD) feature
recently published in MPEG-DASH part 1, [ISO/IEC 23009-1](http://www.iso.org/iso/home/store/catalogue_tc/catalogue_detail.htm?csnumber=66486).
SRD allows to describe the relationship in space of independent
videos contained in AdapatationSets. More
information on the standard and its application can be found in the
[SRD MPEG white paper](http://mpeg.chiariglione.org/sites/default/files/files/standards/docs/w15819.zip)

### Implementation

The dash-srd.js player allows the playback of spatially segmented
content provided in up to 2 resolution layers in addition to the
non-tiled content, also called "fallback" layer. As specified by
MPEG DASH, the content is described in a manifest file called the Media
Presentation Description whose file extension is commonly `.mpd`.

The player is designed as wrapper around [dash.js](https://github.com/Dash-Industry-Forum/dash.js) version 1.5.0.
It determines the spatial segments needed for the current user's
viewpoint. From the original MPD, it only retains the selected spatial
segments and generates as many MPD as selected Representations.
Then, the player feeds each individual MPD as an object
to a dash.js instance. Therefore, dash.js is slightly modified to be
able to handle an MPD object as input instead of an MPD URL.

In addition, the sash-srd.js player assumes two things. The first
assumption is that the first AdaptationSet of the MPD contains
the legacy content which is also the fallback layer of the
dash-srd.js player. Having such legacy content enables backward
compatibility of the MPD regarding non-SRD aware DASH players. And the
second is that the audio of the fallback layer is not multiplexed.

**TOASK ?**
This will be in the second AdaptationSet of the manifest file.

## License
Please view the license in the LICENSE.md file.

## Deployment

1. git clone https://github.com/tnomedialab/dash-srd.js
2. Install an HTTP server instance

Whichever webserver that serves your needs, Apache, NGINX or just
Python SimpleHTTPServer.

Python SimpleHTTPServer is easy to use for testing environments. Just go
to your local repository directory with a command line tool and type
python –m SimpleHTTPServer (or python 3 –m http.server when on
Python 3). This will host the dash-srd.js player on
http://localhost:8000/public/

Alternatively, host dash.all.js and dash-srd.min.js from the build
directory on a different webserver and make sure that they are included
in your HTML file with the appropriate URL. See `index.html` from the `public`
directory as an example. The scripts are enclosed between the
<head> and </head> tags. The dash.js script is modified to support
manifest files as objects. Notice that there are two external libraries,
jQuery and Popcorn.js. Those can be downloaded from the CDN URLs as in
the index.html example.

The div’s and tables of the `index.html` file are the DOM elements
of the player. Their id’s and classes are used within the
dash-srd.min.js script, so they can only be changed if you modify
the element id references in the Initializer.js script as well.

## Development

### Source code and dependencies

1. git clone https://github.com/tnomedialab/dash-srd.js
2. [install nodejs](http://nodejs.org/)
3. [install grunt](http://gruntjs.com/getting-started)
 * npm install -g grunt-cli
4. grunt

The source files are contained in the `src` directory. They consist
of the player files, in subdirectory `srdplayer`, and utilities for
generic tasks in JavaScript. All the necessary source files are
included in `Gruntfile.js`, such that you can build dash-srd.min.js
with the grunt command line. Note that you muse the command in the
dash-srd directory and grunt must be correctly installed.
If all went well (Grunt will tell you), the dash-srd.min.js script
can be found in the `build` directory.

### SRD test content

For your convenience, we have test content available :

|Content|Source|MPD URL|
|-------|------|-------|
|Dancers|Netflix|http://www.tnomedialab.nl/mmsys16/dash-srd/non-overlapping/|
