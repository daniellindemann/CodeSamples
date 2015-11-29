"use strict";
var SPDays = SPDays || {};

// register cdn paths
SPDays.CDN = SPDays.CDN || {};
SPDays.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';

(function(w) {	
	SPDays.init = function() {
		console.log('SPDays init');

		// load jQuery
		RegisterSod('jquery.js', SPDays.CDN.jQuery);
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			$spdays = {};
			$spdays.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
			NotifyEventAndExecuteWaitingJobs('jquery.js');
		});
		
		// load other scripts after jquery is loaded
		ExecuteOrDelayUntilScriptLoaded(function () {
			// Regiser SOD
			RegisterSod('favoritesjquery.debug.js', SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays01/js/favoritesjquery.debug.js');
			RegisterSodDep('favoritesjquery.debug.js', 'jquery.js');

			// Load Scripts
			EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
			EnsureScriptFunc('favoritesjquery.debug.js', 'SPDays.Controls.Favorites', function() {
				NotifyScriptLoadedAndExecuteWaitingJobs('favoritesjquery.debug.js');
			});
		}, 'jquery.js');
	};
	SPDays.init();
	
})(window);

SPDays.Url = SPDays.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
})(SPDays.Url);
