"use strict";
var Basta = Basta || {};

// register cdn paths
Basta.CDN = Basta.CDN || {};
Basta.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
Basta.CDN.angular = '//ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js';
Basta.CDN.angularRoute = '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.0/angular-route.min.js';
Basta.CDN.bootstrapCss = '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css';

Basta.Url = Basta.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
	url.serverRelativeWebUrl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/, '');
})(Basta.Url);

(function(w) {	
	Basta.init = function() {
		console.log('Basta init');

		// Regiser SOD
		RegisterSod('jquery.js', Basta.CDN.jQuery);
		RegisterSod('angular.js', Basta.CDN.angular);
		RegisterSod('angular-route.js', Basta.CDN.angularRoute);
		RegisterSodDep('angular-route.js', 'angular.js');
		RegisterSod('app.js', Basta.Url.serverRelativeSiteUrl + '/Style Library/basta03/js/app.debug.js');
		RegisterSodDep('app.js', 'jquery.js');
		RegisterSodDep('app.js', 'angular.js');
		RegisterSodDep('app.js', 'angular-route.js');

		// Load Scripts
		EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			w.$basta = {};
			w.$basta.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
		});
		EnsureScriptFunc('app.js', '', function() {
			NotifyScriptLoadedAndExecuteWaitingJobs('app.js');
		});
	};
	Basta.init();
	
})(window);

// Ececute something after jquery is ready
ExecuteOrDelayUntilScriptLoaded(function() {
	// add css
	$basta.$('head').append('<link rel="stylesheet" href="' + Basta.CDN.bootstrapCss + '" type="text/css" />');
}, 'jquery.js');
