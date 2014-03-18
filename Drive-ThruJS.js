/*
 * Copyright 2014 by Intellectual Reserve, Inc.
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author:        Adam Carson
 * Dependencies:  jquery.js (1.8.3+)
 *
 * Name: DRIVE-THRUJS Lite / DRIVE-THRU.JS Lite
 * Description: Very simple carousel image lazy-loader.
 * Options: Change the current percent and the time it takes to complete
 */

// Drive-Thru is a super simple image carousel lazy loader. Why call it "Drive-Thru?" Well, I'm tired--so that's the 1st reason. The 2nd, is because the server at the drive-thru window watches for when you pull up and then serves you the food you wanted. Likewise, lazy-loading watches for the next needed image and loads that before it slides/fades into view!

// DRIVE_THRU WINDOW OBJECT
var DRIVE_THRU = {
  // Get all of the images with a data attribute of "drive-thru".
  images : $('[data-drive-thru]'),
  // This is the image loader.
  load : function(num) {
    // Get the last image index.
    var last = this.images.length - 1;
    // Declare an empty variable (will be an array later).
    var load_images;
    // If first slide, i.e. index "0", then store that first in the array, then the next one and the preceding one depending on which direction the user or animation moves to next.
    if (num === 0) {
      load_images = [0,1,last];
    }
    // If last slide, then store this in the array, the next one (the first one), and the preceding one.
    else if (num === last) {
      load_images = [last, 0, last - 1];
    }
    // If not the first or last slide, store it in the array, the next one and the preceding one.
    else {
      load_images = [num, num + 1, num - 1];
    }
    // Load the actual images as indicated by the new array
    for(var i = 0, length = load_images.length; i < length; i++) {
      var data_src = this.images.eq(load_images[i]).data('drive-thru'),
          src = this.images.eq(load_images[i]).attr('src');
      // Don't reload images that have already been loaded, so if the data-drive-thru and src are the same, skip loading and move on to the next; otherwise load the data-drive-thru value into the actual src...and wah-bam!, lazy loading!
      if (data_src !== src) {
        this.images.eq(load_images[i]).attr('src', data_src);
      }
    }
  },

  init : function() {
    this.load(0); // Opening slide
  }
}; // End DRIVE_THRU object

DRIVE_THRU.init();




// 1x1px data gif from: http://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
// WHITE: <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
// BLACK: <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="/>




// This simple slider part was learned from: "Prototypal Inheritance and Refactoring the Slider" (https://tutsplus.com/lesson/prototypal-inheritance-and-refactoring-the-slider)
function SimpleSlider( container, nav ) {
	this.container = container;
	this.nav = nav;
	this.allImages = this.container.find('img');
	this.imagesWidth = this.allImages[0].width + parseInt(this.allImages.css('border-left-width')) * 2;
	this.imagesLength = this.allImages.length;
	this.currentLocale = 0;
}
SimpleSlider.prototype.setLocation = function( direction ) {
	var position = this.currentLocale;
	position  += ( ~~( direction === 'right') || - 1);
	this.currentLocale = ( position < 0) ? this.imagesLength - 1 : position % this.imagesLength;
	return position;
};

SimpleSlider.prototype.transition = function( location ) {
  DRIVE_THRU.load(this.currentLocale); // This sends the slides current position to the load function in the DRIVE_THRU plugin.
	this.container.animate({
    'margin-left': location || -( this.currentLocale * this.imagesWidth )
  });
};

(function() {
	$('.slideshow').css('overflow', 'hidden');
	$('.sliderNav').show();
	var ss = new SimpleSlider( $('.slideshow ul'), $('.sliderNav') );
	ss.nav.find('a').on('click', function(e) {
		e.preventDefault();
    ss.setLocation( $(this).data('direction') );
		ss.transition();
	});
})();
