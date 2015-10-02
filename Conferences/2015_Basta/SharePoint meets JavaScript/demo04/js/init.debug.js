"use strict";
var Basta = Basta || {};

// register cdn paths
Basta.CDN = Basta.CDN || {};
Basta.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
Basta.CDN.StoreJs = '//cdnjs.cloudflare.com/ajax/libs/store.js/1.3.17/store.min.js';

Basta.Url = Basta.Url || {};
(function (url) {
    url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
    url.serverRelativeWebUrl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/, '');
})(Basta.Url);

(function (w) {
    Basta.init = function () {
        console.log('Basta init');

        // Regiser SOD
        RegisterSod('jquery.js', Basta.CDN.jQuery);
        RegisterSod('store.js', Basta.CDN.StoreJs);
        RegisterSod('common.js', Basta.Url.serverRelativeSiteUrl + '/Style Library/basta04/js/common.debug.js');
        RegisterSodDep('common.js', 'jquery.js');
        RegisterSodDep('common.js', 'store.js');

        // Load Scripts
        EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
        EnsureScriptFunc('jquery.js', 'jQuery', function () {
            w.$basta = {};
            w.$basta.$ = jQuery.noConflict();

            // notify loaded!
            NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
        });
        EnsureScriptFunc('common.js', '', function () {
            NotifyScriptLoadedAndExecuteWaitingJobs('common.js');
        });
    };
    Basta.init();

})(window);
