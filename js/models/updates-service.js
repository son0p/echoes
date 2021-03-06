define([
	'underscore',
	'backbone'
], function(_, Backbone) {
   
    var Updates = Backbone.Model.extend({

		url: '/updates/latest.json',

		defaults: {
			// format: yyyymmdd(-hhmm)
			// (hhmm) is optional
			version: "<%= grunt.template.today('yyyymmddHHMM') %>",
			description: '',
			manualCheck: false
		},

		safe: 'echoes-updates',

		time: {
			minute: 1000 * 60,
			minutesForInterval: 60 * 2
		},

		// in minutes
		interval: function(){
			var value = this.time.minute * this.time.minutesForInterval;
			return value;
		},

		initialize: function() {
			this.on('sync', this.handleCheck, this);
			this.intervalId = setInterval(function(){
				this.set('manualCheck', false);
				this.fetch();
			}.bind(this), this.interval());
		},

		// for external use
		check: function() {
			this.set('manualCheck', true);
			this.fetch();
		},

		handleCheck: function (updates) {
			var isVersionChanged = updates.changed && updates.changed.version;
			var isManualCheck = this.attributes.manualCheck;

			if (isVersionChanged){
				this.trigger('check:version-update', updates);
				return;
			}
			if (isManualCheck && !isVersionChanged) {
				this.trigger('manual:no-update', updates);
			}
		},

		versionChanged: function(){
			return this.changed && this.changed.version;
		}
	});
   
    return Updates;
});