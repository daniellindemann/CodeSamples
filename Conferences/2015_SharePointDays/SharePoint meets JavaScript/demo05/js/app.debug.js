"use strict";
angular
	.module('sampleWizard', ['ngRoute'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/1', {
				controller: 'SampleWizardCtrl',
				templateUrl: SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays05/js/nameView.html'
			})
			.when('/2', {
				controller: 'SampleWizardCtrl',
				templateUrl: SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays05/js/questionsView.html'
			})
			.when('/3', {
				controller: 'SampleWizardCtrl',
				templateUrl: SPDays.Url.serverRelativeSiteUrl + '/Style Library/spdays05/js/summeryView.html'
			})
			.otherwise({
				redirectTo: '/1'
			});
	}])
	.factory('sampleFactory', ['$document', '$q', '$http', function ($document, $q, $http) {
		var factory = {};
		factory._parseLanguages = function (languagesObj) {
			var selectedLanguages = [];
			if (!languagesObj)
				return '';
			for (var v in languagesObj) {
				if (languagesObj[v]) {
					selectedLanguages.push(v);
				}
			}
			return selectedLanguages;
		};
		factory.saveToList = function (data) {
			// consts
			var listId = 'fc8b85ee-23bd-4485-a2a1-69a2e604b96b';
			var itemType = 'SP.Data.SurveyListItem'

			// api items url
			var listUrl = SPDays.Url.serverRelativeWebUrl + '/_api/web/lists(guid\'' + listId + '\')/Items';

			// new item json
			var newItemJson = {
				'__metadata': { 'type': itemType },
				'Title': new Date().format('yyyy-MM-dd-HH-mm-ss'),
				'FirstName': data.firstName,
				'LastName': data.lastName,
				'Twitter': data.twitter,
				'Languages': {
					'__metadata': {
						'type': 'Collection(Edm.String)'
					},
					'results': factory._parseLanguages(data.languages)
				},
				'Else': data['else'] || ''
			};

			// get request digest
			var requestDigest = $document[0].getElementById('__REQUESTDIGEST').value;

			return $http({
				'method': 'POST',
				'url': listUrl,
				'data': newItemJson,
				'headers': {
					'Accept': 'application/json; odata=verbose',
					'content-type': 'application/json; odata=verbose',
					'X-RequestDigest': requestDigest
				}
			});
		};
		return factory;
	}])
	.controller('SampleWizardCtrl', ['$scope', '$rootScope', 'sampleFactory', function ($scope, $rootScope, sampleFactory) {
		$rootScope.availableLanguages = ['js', 'c#', 'java', 'c++'];

		$scope.getSelectedLanguage = function () {
			var selectedLanguages = [];
			if (!$rootScope.languages)
				return selectedLanguages;
			for (var v in $rootScope.languages) {
				if ($rootScope.languages[v]) {
					selectedLanguages.push(v);
				}
			}
			return selectedLanguages;
		};
		$scope.save = function () {

			var httpPromise = sampleFactory.saveToList($rootScope);
			httpPromise.then(function () {
				alert('Thx!');
			}, function () {
				alert('Error');
			});
		};
	}]);


// bootstrap the app
angular.bootstrap($spdays.$('#sampleWizard')[0], ['sampleWizard']);
