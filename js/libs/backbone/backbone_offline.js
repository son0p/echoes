(function(){window.Offline={VERSION:"0.3.0.beta",localSync:function(e,t,n,r){var i;return i=function(){switch(e){case"read":return _.isUndefined(t.id)?r.findAll(n):r.find(t,n);case"create":return r.create(t,n);case"update":return r.update(t,n);case"delete":return r.destroy(t,n)}}(),i?n.success(i):n.error("Record not found")},sync:function(e,t,n){var r,i;return r=t.storage||((i=t.collection)!=null?i.storage:void 0),r&&(r!=null?r.support:void 0)?Offline.localSync(e,t,n,r):Backbone.ajaxSync(e,t,n)},onLine:function(){return navigator.onLine!==!1}},Backbone.ajaxSync=Backbone.sync,Backbone.sync=Offline.sync,Offline.Storage=function(){function e(e,t,n){this.name=e,this.collection=t,n==null&&(n={}),this.support=this.isLocalStorageSupport(),this.allIds=new Offline.Index(this.name,this),this.destroyIds=new Offline.Index(""+this.name+"-destroy",this),this.sync=new Offline.Sync(this.collection,this),this.keys=n.keys||{},this.autoPush=n.autoPush||!1}return e.prototype.isLocalStorageSupport=function(){try{return localStorage.setItem("isLocalStorageSupport","1"),localStorage.removeItem("isLocalStorageSupport"),!0}catch(e){return!1}},e.prototype.setItem=function(e,t){try{return localStorage.setItem(e,t)}catch(n){return n.name==="QUOTA_EXCEEDED_ERR"?this.collection.trigger("quota_exceed"):this.support=!1}},e.prototype.removeItem=function(e){return localStorage.removeItem(e)},e.prototype.getItem=function(e){return localStorage.getItem(e)},e.prototype.create=function(e,t){return t==null&&(t={}),t.regenerateId=!0,this.save(e,t)},e.prototype.update=function(e,t){return t==null&&(t={}),this.save(e,t)},e.prototype.destroy=function(e,t){var n;return t==null&&(t={}),!t.local&&(n=e.get("sid"))!=="new"&&this.destroyIds.add(n),this.remove(e)},e.prototype.find=function(e,t){return t==null&&(t={}),JSON.parse(this.getItem(""+this.name+"-"+e.id))},e.prototype.findAll=function(e){var t,n,r,i,s;e==null&&(e={}),e.local||(this.isEmpty()?this.sync.full():this.sync.incremental()),i=this.allIds.values,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],s.push(JSON.parse(this.getItem(""+this.name+"-"+t)));return s},e.prototype.s4=function(){return((1+Math.random())*65536|0).toString(16).substring(1)},e.prototype.guid=function(){return this.s4()+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+this.s4()+this.s4()},e.prototype.save=function(e,t){var n,r;return t==null&&(t={}),t.regenerateId&&e.set({sid:((n=e.attributes)!=null?n.sid:void 0)||((r=e.attributes)!=null?r.id:void 0)||"new",id:this.guid()}),t.local||e.set({updated_at:(new Date).toJSON(),dirty:!0}),this.replaceKeyFields(e,"local"),this.setItem(""+this.name+"-"+e.id,JSON.stringify(e)),this.allIds.add(e.id),this.autoPush&&!t.local&&this.sync.pushItem(e),e},e.prototype.remove=function(e){var t;return this.removeItem(""+this.name+"-"+e.id),this.allIds.remove(e.id),t=e.get("sid"),this.autoPush&&t!=="new"&&this.sync.flushItem(t),e},e.prototype.isEmpty=function(){return this.getItem(this.name)===null},e.prototype.clear=function(){var e,t,n,r,i,s,o,u,a,f,l=this;n=Object.keys(localStorage),e=_.filter(n,function(e){return(new RegExp(l.name)).test(e)});for(i=0,o=e.length;i<o;i++)t=e[i],this.removeItem(t);this.setItem(this.name,""),a=[this.allIds,this.destroyIds],f=[];for(s=0,u=a.length;s<u;s++)r=a[s],f.push(r.reset());return f},e.prototype.replaceKeyFields=function(e,t){var n,r,i,s,o,u,a,f;if(Offline.onLine()){e.attributes&&(e=e.attributes),u=this.keys;for(r in u){n=u[r],s=e[r];if(!/^\w{8}-\w{4}-\w{4}/.test(s)||t!=="local")i=t==="local"?(o=new Offline.Collection(n),(a=o.get(s))!=null?a.id:void 0):(f=n.get(s))!=null?f.get("sid"):void 0,_.isUndefined(i)||(e[r]=i)}}return e},e}(),Offline.Sync=function(){function e(e,t){this.collection=new Offline.Collection(e),this.storage=t}return e.prototype.ajax=function(e,t,n){return Offline.onLine()?(this.prepareOptions(n),Backbone.ajaxSync(e,t,n)):this.storage.setItem("offline","true")},e.prototype.full=function(e){var t=this;return e==null&&(e={}),this.ajax("read",this.collection.items,{success:function(n,r,i){var s,o,u;t.storage.clear(),t.collection.items.reset([],{silent:!0});for(o=0,u=n.length;o<u;o++)s=n[o],t.collection.items.create(s,{silent:!0,local:!0,regenerateId:!0});e.silent||t.collection.items.trigger("reset");if(e.success)return e.success(n)}})},e.prototype.incremental=function(){var e=this;return this.pull({success:function(){return e.push()}})},e.prototype.prepareOptions=function(e){var t,n=this;if(this.storage.getItem("offline"))return this.storage.removeItem("offline"),t=e.success,e.success=function(e,r,i){return t(e,r,i),n.incremental()}},e.prototype.pull=function(e){var t=this;return e==null&&(e={}),this.ajax("read",this.collection.items,{success:function(n,r,i){var s,o,u;t.collection.destroyDiff(n);for(o=0,u=n.length;o<u;o++)s=n[o],t.pullItem(s);if(e.success)return e.success()}})},e.prototype.pullItem=function(e){var t;return t=this.collection.get(e.id),t?this.updateItem(e,t):this.createItem(e)},e.prototype.createItem=function(e){if(!_.include(this.storage.destroyIds.values,e.id.toString()))return e.sid=e.id,delete e.id,this.collection.items.create(e,{local:!0})},e.prototype.updateItem=function(e,t){if(new Date(t.get("updated_at"))<new Date(e.updated_at))return delete e.id,t.save(e,{local:!0})},e.prototype.push=function(){var e,t,n,r,i,s,o,u,a;o=this.collection.dirty();for(n=0,i=o.length;n<i;n++)e=o[n],this.pushItem(e);u=this.storage.destroyIds.values,a=[];for(r=0,s=u.length;r<s;r++)t=u[r],a.push(this.flushItem(t));return a},e.prototype.pushItem=function(e){var t,n,r,i=this;return this.storage.replaceKeyFields(e,"server"),t=e.id,delete e.attributes.id,r=e.get("sid")==="new"?["create",null]:["update",e.attributes.sid],n=r[0],e.id=r[1],this.ajax(n,e,{success:function(t,r,i){return n==="create"&&e.set({sid:t.id}),e.save({dirty:!1},{local:!0})}}),e.attributes.id=t,e.id=t},e.prototype.flushItem=function(e){var t,n=this;return t=this.collection.fakeModel(e),this.ajax("delete",t,{success:function(t,r,i){return n.storage.destroyIds.remove(e)}})},e}(),Offline.Index=function(){function e(e,t){var n;this.name=e,this.storage=t,n=this.storage.getItem(this.name),this.values=n&&n.split(",")||[]}return e.prototype.add=function(e){return _.include(this.values,e.toString())||this.values.push(e.toString()),this.save()},e.prototype.remove=function(e){return this.values=_.without(this.values,e.toString()),this.save()},e.prototype.save=function(){return this.storage.setItem(this.name,this.values.join(","))},e.prototype.reset=function(){return this.values=[],this.save()},e}(),Offline.Collection=function(){function e(e){this.items=e}return e.prototype.dirty=function(){return this.items.where({dirty:!0})},e.prototype.get=function(e){return this.items.find(function(t){return t.get("sid")===e})},e.prototype.destroyDiff=function(e){var t,n,r,i,s,o;t=_.difference(_.without(this.items.pluck("sid"),"new"),_.pluck(e,"id")),o=[];for(r=0,i=t.length;r<i;r++)n=t[r],o.push((s=this.get(n))!=null?s.destroy({local:!0}):void 0);return o},e.prototype.fakeModel=function(e){var t;return t=new Backbone.Model,t.id=e,t.urlRoot=this.items.url,t},e}()}).call(this)