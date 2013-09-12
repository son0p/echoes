// a playlists service to create new playlists
define(['underscore', 'backbone', '../gapi'], function(_, Backbone, Gapi) {

	var YoutubePlaylistsService = Gapi.extend({

		url: function() {
			return gapi.client.youtube.playlists;
		},

		// for autorization
		scopes: "https://www.googleapis.com/auth/youtube",

		// for client api to be loaded after autorization
		client: {
			api: 'youtube',
			version: 'v3'
		},

		initialize: function() {
			//this.on('auth:success', _.bind(this.auth, this));
			this.connect();
		},

		defaults: {
			part: 'snippet,status',
			resource: {
				snippet: {
					title: '',
					description: ''
				},
				status: {
					privacyStatus: 'public'
				}
			}
		}

	});

	return YoutubePlaylistsService;
});