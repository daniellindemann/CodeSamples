"use strict";
var SPDays = SPDays || {};

SPDays.Data = SPDays.Data || {};
SPDays.Data.ColorsList = SPDays.Data.ColorsList || {};
(function (colorList) {

    colorList.id = 'E3FA1BE0-2B6E-40CB-B553-4E2A3DE2A103';

    var loadColors = function (callback) {
        // load data
        ExecuteOrDelayUntilScriptLoaded(function () {
            var ctx = SP.ClientContext.get_current();
            var web = ctx.get_web();
            var list = web.get_lists().getById(colorList.id);

            var camlQuery = new SP.CamlQuery();
            var items = list.getItems(camlQuery);
            ctx.load(items, 'Include(Title, Color)');

            ctx.executeQueryAsync(function (sender, args) {
                var colors = [];

                var itemsEnumerator = items.getEnumerator();
                while (itemsEnumerator.moveNext()) {
                    var cItem = itemsEnumerator.get_current();
                    colors.push({
                        title: cItem.get_item('Title'),
                        hex: cItem.get_item('Color')
                    });
                }

                callback(colors);
            }, function (sender, args) {
                console.log('error');
            });
        }, 'sp.js');
    };

    colorList.getColors = function (callback) {
        var before = new Date().getTime();

        // load colors
        loadColors(function (colors) {
            var now = new Date().getTime();
            var data = {
                colors: colors,
                diff: now - before
            };
            callback(data);
        });
    };
    colorList.getColorsCached = function (callback) {
        var before = new Date().getTime();
        var cacheKey = 'cachedColors';
        var cachedData = SPDays.Cache.get(cacheKey);
        if (cachedData) {
            var now = new Date().getTime();
            cachedData.diff = now - before;
            callback(cachedData);
        }
        else {
            loadColors(function (colors) {
                var data = {
                    colors: colors,
                    diff: 0
                };
                SPDays.Cache.set(cacheKey, data, 1000 * 60 * 5); // 5min cache
                var now = new Date().getTime();
                data.diff = now - before;
                callback(data);
            });
        }
    };
})(SPDays.Data.ColorsList);

SPDays.Cache = SPDays.Cache || {};
(function (cache, $) {

    if (!store.enabled) {
        if (console && console.log) {
            console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        }
    }

    cache.enabled = store.enabled;
    cache.set = function (key, val, exp) {
        store.set(key, { val: val, exp: exp, time: new Date().getTime() });
    };
    cache.get = function (key) {
        var info = store.get(key);
        if (!info) {
            return null;
        }
        if (info.exp && new Date().getTime() - info.time > info.exp) {
            store.remove(key);
            return null;
        }
        return info.val;
    };
    cache.remove = function (key) {
        store.remove(key);
    };
})(SPDays.Cache);

var createColorSpan = function (title, hexColor) {
    var jColorSpan = $spdays.$('<span>', { 'style': 'background-color:' + hexColor + '; padding: 5px; margin: 0 5px 5px 5px;' }).text(title);
    return jColorSpan;
};

// get colors uncached
var jUncachedContainer = $spdays.$('<div>', { 'class': 'uncached' });
var uncachedData = SPDays.Data.ColorsList.getColors(function (data) {
    jUncachedContainer.append($spdays.$('<div>').html('Uncached'));
    jUncachedContainer.append($spdays.$('<div>').html('Time: ' + data.diff));
    //jUncachedContainer.append($spdays.$('<div>').html('Data:<br/>' + JSON.stringify(data.colors)));
    var jUnchachedInnerContainer = $spdays.$('<div>', { 'style': 'line-height:40px;' }).appendTo(jUncachedContainer);
    $spdays.$.each(data.colors, function (idx, itm) {
        jUnchachedInnerContainer.append(createColorSpan(itm.title, itm.hex));
    });
});
$spdays.$('._container').append(jUncachedContainer);

$spdays.$('._container').append($spdays.$('<span>').html('<br/>'));

// get colors cached
var jCachedContainer = $spdays.$('<div>', { 'class': 'cached' });
var uncachedData = SPDays.Data.ColorsList.getColorsCached(function (data) {
    jCachedContainer.append($spdays.$('<div>').html('Cached'));
    jCachedContainer.append($spdays.$('<div>').html('Time: ' + data.diff));
    //jCachedContainer.append($spdays.$('<div>').html('Data:<br/>' + JSON.stringify(data.colors)));
    var jCachedInnerContainer = $spdays.$('<div>', { 'style': 'line-height:40px;' }).appendTo(jCachedContainer);
    $spdays.$.each(data.colors, function (idx, itm) {
        jCachedInnerContainer.append(createColorSpan(itm.title, itm.hex));
    });
});
$spdays.$('._container').append(jCachedContainer);

var jBtnReload = $spdays.$('<input>', { 'type': 'button', 'value': 'Reload' }).on('click', function () {
    window.location.reload(true);
});

var jBtnClearCache = $spdays.$('<input>', { 'type': 'button', 'value': 'Clear cache and reload' }).on('click', function () {
    SPDays.Cache = SPDays.Cache.remove('cachedColors');
    window.location.reload(true);
});

$spdays.$('._container').append($spdays.$('<span>').html('<br/>'));
$spdays.$('._container').append(jBtnReload);
$spdays.$('._container').append(jBtnClearCache);
