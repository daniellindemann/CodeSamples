"use strict";
var SPDays = SPDays || {};

// register cdn paths
SPDays.CDN = SPDays.CDN || {};
SPDays.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
SPDays.CDN.knockout = '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js';

SPDays.Url = SPDays.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
})(SPDays.Url);

(function(w) {	
	SPDays.init = function() {
		console.log('SPDays init');

		// Regiser SOD
		RegisterSod('jquery.js', SPDays.CDN.jQuery);
		RegisterSod('knockout.js', SPDays.CDN.knockout);
		RegisterSod('favoritesknockout.js', SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays02/js/favoritesknockout.debug.js');
		RegisterSodDep('favoritesknockout.js', 'jquery.js');
		RegisterSodDep('favoritesknockout.js', 'knockout.js');

		// Load Scripts
		EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			w.$spdays = {};
			$spdays.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
		});
		EnsureScriptFunc('favoritesknockout.js', 'SPDays.Controls.Favorites', function() {
			NotifyScriptLoadedAndExecuteWaitingJobs('favoritesknockout.js');
		});
	};
	SPDays.init();
	
})(window);
