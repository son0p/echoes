define([
	'jquery',
	'underscore'
], function($, _) {
   
	var Utils = {
		formatNumberWithComma: function(num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},

		/**
		 * convert 'd' seconds to a h:mm:ss display
		 * credits to http://snipplr.com/view.php?codeview&id=20348
		 * @param  {number} d number of seconds
		 * @return {string}
		 */
		secondsToHms: function(d) {
			d = Number(d);
			var h = Math.floor(d / 3600);
			var m = Math.floor(d % 3600 / 60);
			var s = Math.floor(d % 3600 % 60);
			return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
		},

		// excludes {array} - values of elements to exclude in calculation
		getPortviewSize: function(excludes) {
			var hasExcludes = excludes && excludes.length ? excludes : false;
				sidebar = hasExcludes && excludes.indexOf('sidebar') === -1 ? $('.sidebar').outerWidth() : 0,
				height = window.innerHeight - $('.navbar').outerHeight() - $('.youtube-player').outerHeight(),
				width = window.innerWidth - sidebar;
			return _.clone({ height: height, width: width });
		}
	};
   
	
	return Utils;
});