define(["jquery","underscore","backbone","fb","text!templates/facebook_like_tag.html"],function(e,t,i,l,n){var r=i.View.extend({el:"#facebook-like",template:t.template(n),initialize:function(){this.listenTo(this.model.youtube.info,"change:id",this.render)},render:function(){var e=this.model.player.getShareUrl();return this.$el.html(this.template({url:e})),FB&&FB.XFBML.parse(this.el),this}});return r});