"use strict";
var Basta = Basta || {};

// register cdn paths
Basta.CDN = Basta.CDN || {};
Basta.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';

(function(w) {	
	Basta.init = function() {
		console.log('Basta init');

		// load jQuery
		RegisterSod('jquery.js', Basta.CDN.jQuery);
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			w.$basta = {};
			$basta.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
			NotifyEventAndExecuteWaitingJobs('jquery.js');
		});
		
		// load other scripts after jquery is loaded
		ExecuteOrDelayUntilScriptLoaded(function () {
			// Regiser SOD
			RegisterSod('favoritesjquery.debug.js', Basta.Url.serverRelativeSiteUrl + '/Style Library/basta01/js/favoritesjquery.debug.js');
			RegisterSodDep('favoritesjquery.debug.js', 'jquery.js');

			// Load Scripts
			EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
			EnsureScriptFunc('favoritesjquery.debug.js', 'Basta.Controls.Favorites', function() {
				NotifyScriptLoadedAndExecuteWaitingJobs('favoritesjquery.debug.js');
			});
		}, 'jquery.js');
	};
	Basta.init();
	
})(window);

Basta.Url = Basta.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
})(Basta.Url);
