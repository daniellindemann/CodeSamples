"use strict";
var SPDays = SPDays || {};

// register cdn paths
SPDays.CDN = SPDays.CDN || {};
SPDays.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
SPDays.CDN.StoreJs = '//cdnjs.cloudflare.com/ajax/libs/store.js/1.3.17/store.min.js';

SPDays.Url = SPDays.Url || {};
(function (url) {
    url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
    url.serverRelativeWebUrl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/, '');
})(SPDays.Url);

(function (w) {
    SPDays.init = function () {
        console.log('SPDays init');

        // Regiser SOD
        RegisterSod('jquery.js', SPDays.CDN.jQuery);
        RegisterSod('store.js', SPDays.CDN.StoreJs);
        RegisterSod('common.js', SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays04/js/common.debug.js');
        RegisterSodDep('common.js', 'jquery.js');
        RegisterSodDep('common.js', 'store.js');

        // Load Scripts
        EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
        EnsureScriptFunc('jquery.js', 'jQuery', function () {
            w.$spdays = {};
            w.$spdays.$ = jQuery.noConflict();

            // notify loaded!
            NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
        });
        EnsureScriptFunc('common.js', '', function () {
            NotifyScriptLoadedAndExecuteWaitingJobs('common.js');
        });
    };
    SPDays.init();

})(window);
