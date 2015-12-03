"use strict";
var SPDays = SPDays || {};

// register cdn paths
SPDays.CDN = SPDays.CDN || {};
SPDays.CDN.jQuery = '//code.jquery.com/jquery-2.1.4.min.js';
SPDays.CDN.angular = '//ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js';
SPDays.CDN.angularRoute = '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.0/angular-route.min.js';
SPDays.CDN.bootstrapCss = '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css';

SPDays.Url = SPDays.Url || {};
(function(url) {
	url.serverRelativeSiteUrl = _spPageContextInfo.siteServerRelativeUrl.replace(/\/$/, '');
	url.serverRelativeWebUrl = _spPageContextInfo.webServerRelativeUrl.replace(/\/$/, '');
})(SPDays.Url);

(function(w) {	
	SPDays.init = function() {
		console.log('SPDays init');

		// Regiser SOD
		RegisterSod('jquery.js', SPDays.CDN.jQuery);
		RegisterSod('angular.js', SPDays.CDN.angular);
		RegisterSod('angular-route.js', SPDays.CDN.angularRoute);
		RegisterSodDep('angular-route.js', 'angular.js');
		RegisterSod('app.js', SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays05/js/app.debug.js');
		RegisterSodDep('app.js', 'jquery.js');
		RegisterSodDep('app.js', 'angular.js');
		RegisterSodDep('app.js', 'angular-route.js');

		// Load Scripts
		EnsureScriptFunc('sp.js', 'SP.ClientContext');	// ensure sp.js for SP.ClientContext
		EnsureScriptFunc('jquery.js', 'jQuery', function () {
			w.$spdays = {};
			w.$spdays.$ = jQuery.noConflict();

			// notify loaded!
			NotifyScriptLoadedAndExecuteWaitingJobs('jquery.js');
		});
		EnsureScriptFunc('app.js', '', function() {
			NotifyScriptLoadedAndExecuteWaitingJobs('app.js');
		});
	};
	SPDays.init();
	
})(window);

// Ececute something after jquery is ready
ExecuteOrDelayUntilScriptLoaded(function() {
	// add css
	$spdays.$('head').append('<link rel="stylesheet" href="' + SPDays.CDN.bootstrapCss + '" type="text/css" />');
}, 'jquery.js');
