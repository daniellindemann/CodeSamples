"use strict";
var Basta = Basta || {};

Basta.Data = Basta.Data || {};
Basta.Data.ColorsList = Basta.Data.ColorsList || {};
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
        var cachedData = Basta.Cache.get(cacheKey);
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
                Basta.Cache.set(cacheKey, data, 1000 * 60 * 5); // 5min cache
                var now = new Date().getTime();
                data.diff = now - before;
                callback(data);
            });
        }
    };
})(Basta.Data.ColorsList);

Basta.Cache = Basta.Cache || {};
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
})(Basta.Cache);

var createColorSpan = function (title, hexColor) {
    var jColorSpan = $basta.$('<span>', { 'style': 'background-color:' + hexColor + '; padding: 5px; margin: 0 5px 5px 5px;' }).text(title);
    return jColorSpan;
};

// get colors uncached
var jUncachedContainer = $basta.$('<div>', { 'class': 'uncached' });
var uncachedData = Basta.Data.ColorsList.getColors(function (data) {
    jUncachedContainer.append($basta.$('<div>').html('Uncached'));
    jUncachedContainer.append($basta.$('<div>').html('Time: ' + data.diff));
    //jUncachedContainer.append($basta.$('<div>').html('Data:<br/>' + JSON.stringify(data.colors)));
    var jUnchachedInnerContainer = $basta.$('<div>', { 'style': 'line-height:40px;' }).appendTo(jUncachedContainer);
    $basta.$.each(data.colors, function (idx, itm) {
        jUnchachedInnerContainer.append(createColorSpan(itm.title, itm.hex));
    });
});
$basta.$('._container').append(jUncachedContainer);

$basta.$('._container').append($basta.$('<span>').html('<br/>'));

// get colors cached
var jCachedContainer = $basta.$('<div>', { 'class': 'cached' });
var uncachedData = Basta.Data.ColorsList.getColorsCached(function (data) {
    jCachedContainer.append($basta.$('<div>').html('Cached'));
    jCachedContainer.append($basta.$('<div>').html('Time: ' + data.diff));
    //jCachedContainer.append($basta.$('<div>').html('Data:<br/>' + JSON.stringify(data.colors)));
    var jCachedInnerContainer = $basta.$('<div>', { 'style': 'line-height:40px;' }).appendTo(jCachedContainer);
    $basta.$.each(data.colors, function (idx, itm) {
        jCachedInnerContainer.append(createColorSpan(itm.title, itm.hex));
    });
});
$basta.$('._container').append(jCachedContainer);

var jBtnReload = $basta.$('<input>', { 'type': 'button', 'value': 'Reload' }).on('click', function () {
    window.location.reload(true);
});

var jBtnClearCache = $basta.$('<input>', { 'type': 'button', 'value': 'Clear cache and reload' }).on('click', function () {
    Basta.Cache = Basta.Cache.remove('cachedColors');
    window.location.reload(true);
});

$basta.$('._container').append($basta.$('<span>').html('<br/>'));
$basta.$('._container').append(jBtnReload);
$basta.$('._container').append(jBtnClearCache);
