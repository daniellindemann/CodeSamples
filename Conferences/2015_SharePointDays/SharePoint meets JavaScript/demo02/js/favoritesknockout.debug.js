"use strict";
var SPDays = SPDays || {};

// view models
SPDays.ViewModels = SPDays.ViewModels || {};
SPDays.ViewModels.Favorites = function() {
	this.links = ko.observableArray([]);
	this.loaded = ko.observable(0);

	// scope variable
	var self = this;

	// functions
	this.load = function() {
		SPDays.Data.FavoriteList.getItems(function(data) {
			// remap
			self.links.removeAll();
			var items = $spdays.$.each(data.items, function(idx, itm) {
				self.links.push({
					id: itm.id,
					url: itm.url.url,
					title: itm.url.description
				});
			});
			self.loaded(1);
		});
	};
	this.addSPDays = function() {
		SPDays.Data.FavoriteList.saveItem('SharePoint Days', 'http://www.sharepoint-day.de', function(data) {
			self.links.push(data);	// pushing the response to the observable array list
		});
	};
	this.delete = function(link) {
		SPDays.Data.FavoriteList.removeItem(link.id, function() {
			self.load();	// easiest way!
		});
	};

	// load initial data
	this.load();
}

// data
SPDays.Data = SPDays.Data || {};
SPDays.Data.FavoriteList = SPDays.Data.FavoriteList || {};
(function(favoriteList) {

	favoriteList.id = '7FD730F2-3DB5-4D8C-9A3C-7284DFA82884';

	var getList = function(ctx) {
		var web =  ctx.get_web();
		var list = web.get_lists().getById(favoriteList.id);
		return list;
	};

	favoriteList.saveItem = function (title, url, callback) {
		ExecuteOrDelayUntilScriptLoaded(function() {
			var ctx = SP.ClientContext.get_current();
			var list = getList(ctx);

			// create item
			var linkItemInfo = new SP.ListItemCreationInformation();
			var listItem = list.addItem(linkItemInfo);
			var urlValue = new SP.FieldUrlValue();
			urlValue.set_url(url);
			urlValue.set_description(title);
			listItem.set_item('URL', urlValue);
			listItem.update();
			ctx.load(listItem);

			// throw data back
			var callbackData = {};
			ctx.executeQueryAsync(function(sender, args) {
				callbackData.id = listItem.get_id();
				callbackData.title = title;
				callbackData.url = url;
				callback(callbackData);
			}, function(sender, args) {
				console.log('error');
			});
		}, 'sp.js');
	};

	favoriteList.removeItem = function(itemId, callback) {
		ExecuteOrDelayUntilScriptLoaded(function() {
			var ctx = SP.ClientContext.get_current();
			var list = getList(ctx);

			var item = list.getItemById(itemId);
			item.deleteObject();

			var callbackData = { id : itemId };
			ctx.executeQueryAsync(function(sender, args) {
				callbackData.deleted = true;
				callback(callbackData);
			}, function(sender, args) {
				console.log('error');
			});

		}, 'sp.js');
	};

	favoriteList.getItems = function(callback) {
		ExecuteOrDelayUntilScriptLoaded(function() {
			var ctx = SP.ClientContext.get_current();
			var list = getList(ctx);

			// get list items
			var camlQuery = new SP.CamlQuery();
			var items = list.getItems(camlQuery);
			ctx.load(items);

			var callbackData = {};
			ctx.executeQueryAsync(function(sender, args) {
				callbackData.items = [];

				var itemsEnumerator = items.getEnumerator();
				while(itemsEnumerator.moveNext()) {
					var cItem = itemsEnumerator.get_current();

					// create dump nice object
					var urlFieldValue = cItem.get_item('URL');
					callbackData.items.push({
						id: cItem.get_id(),
						url: {
							url: urlFieldValue.get_url(),
							description: urlFieldValue.get_description()
						}
					});
				}

				callback(callbackData);
			}, function(sender, args) {
				console.log('error');
			});
		}, 'sp.js');
	};

})(SPDays.Data.FavoriteList);

// start binding
ko.applyBindings(new SPDays.ViewModels.Favorites(), $spdays.$('._templateContainer')[0]);