"use strict";
var Basta = Basta || {};

// register cdn paths
Basta.CDN = Basta.CDN || {};
Basta.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
Basta.CDN.knockout = '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js';

Basta.Url = Basta.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
})(Basta.Url);

(function(w) {	
	Basta.init = function() {
		console.log('Basta init');

		// Regiser SOD
		RegisterSod('jquery.js', Basta.CDN.jQuery);
		RegisterSod('knockout.js', Basta.CDN.knockout);
		RegisterSod('favoritesknockout.js', Basta.Url.serverRelativeSiteUrl + '/Style Library/basta02/js/favoritesknockout.debug.js');
		RegisterSodDep('favoritesknockout.js', 'jquery.js');
		RegisterSodDep('favoritesknockout.js', 'knockout.js');

		// Load Scripts
		EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			w.$basta = {};
			$basta.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
		});
		EnsureScriptFunc('favoritesknockout.js', 'Basta.Controls.Favorites', function() {
			NotifyScriptLoadedAndExecuteWaitingJobs('favoritesknockout.js');
		});
	};
	Basta.init();
	
})(window);
