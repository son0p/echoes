define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
   
    var AppRouter = Backbone.Router.extend({

		routes: {
			'': 'explore',
			'explore': 'explore',
			'history': 'history',
			'myPlaylists': 'myPlaylists',

			'filter/:feedType': 'filter',
			'playlist/:playlistId': 'showPlaylistInfo',
			'searches/:query': 'search',
			// 'play/:type/:mediaId': 'playMedia',
			'play/video/:mediaId': 'playVideoItem',
			'play/playlist/:playlistId/:index': 'playPlaylistItem'
		},

		initialize: function(attributes) {
			this.model = attributes.model;
			this.model.on('change:currentIndex', this.updatePlaylistUrl, this);
			this.model.start();
			Backbone.history.start();
		},

		explore: function() {
			// this.model.route('explore');
			this.markNav('explore');
			this.model.youtube.attributes.data.items = 0;
			this.model.route(this.model.get('filter'));
		},

		history: function() {
			this.markNav('history');
			this.model.route('history');
		},

		myPlaylists: function(){
			this.markNav('myPlaylists');
			this.model.route('myPlaylists')
		},

		search: function(query) {
			this.model.set({ 'query': query }, { silent: true });
		},

		filter: function(feedType) {
			this.model.set('filter', feedType);
			this.model.set('layout', feedType);
		},

		showPlaylistInfo: function(playlistId){
			this.model.youtube.set({ showPlaylistId: playlistId });
			this.model.route('playlistInfo');
		},
		/**
		 * plays media url by type
		 * @param  {string} type    - supports: 'video', 'playlist'
		 * @param  {string} mediaId - supplied by system
		 */
		playMedia: function(type, mediaId) {
			this.model.playMedia(mediaId, { type: type });
		},

		playVideoItem: function(mediaId) {
			this.model.playMedia({ 
				type: 'video',
				mediaId: mediaId
			});
		},

		playPlaylistItem: function(playlistId, index) {
			this.model.playMedia({ 
				type: 'playlist',
				mediaId: playlistId,
				index: index
			});
		},

		updatePlaylistUrl: function(model, index) {
			var playlistId = this.model.get('play') || '';
			if (_.isNumber(index) && playlistId !== "") {
				this.navigate('play/playlist/' + playlistId + '/' + index, { trigger: false });
			}
		},

		// TODO: should be from a View
		markNav: function(route) {
			$("#library-nav").find('li').removeClass('active')
				.end()
				.find("a[href^='#" + route + "']").parent().addClass('active');
		}
	});
   
    return AppRouter;
});