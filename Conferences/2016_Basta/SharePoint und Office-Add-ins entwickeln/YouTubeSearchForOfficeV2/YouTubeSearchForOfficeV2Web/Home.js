/// <reference path="/Scripts/FabricUI/MessageBanner.js" />


(function () {
	"use strict";

	// configure
	var youTubeApiKey = 'YOUR_KEY';		// get api key at https://developers.google.com/youtube/v3/
	var youTubeVideoUrl = 'https://www.youtube.com/watch?v=';

	var messageBanner;

	// The initialize function must be run each time a new page is loaded.
	Office.initialize = function (reason) {
		$(document).ready(function () {
			// Initialize the FabricUI notification mechanism and hide it
			var element = document.querySelector('.ms-MessageBanner');
			messageBanner = new fabric.MessageBanner(element);
			messageBanner.hideBanner();

			loadSampleData();

			// Add a click event handler for the highlight button.
			$('#search-button').click(getDataFromSelection);
			// add a click event handler for adding video to document
			$('.results-content').on('click', 'li', addVideoLinkToDocument);
		});
	};

	function loadSampleData() {
		// Run a batch operation against the Word object model.
		Word.run(function (context) {
			// Create a proxy object for the document body.
			var body = context.document.body;

			// Queue a commmand to clear the contents of the body.
			body.clear();

			// Queue a command to insert text into the end of the Word document body.
			body.insertHtml("<p>AJAX</p><p>Angular 2</p><p>AngularJS</p><p>ASP.NET</p><p>Backbone JS</p><p>Twitter Bootstrap</p><p>CSS</p><p>CoffeeScript</p><p>Ember JS</p><p>Express JS</p><p>Grunt</p><p>Gulp</p><p>HTML</p><p>HTML5</p><p>HTTP</p><p>JasimeJS</p><p>Javascript</p><p>jQuery</p><p>KnockoutJS</p><p>LESS</p><p>ReactJS</p><p>Rails</p><p>SASS</p><p>REST</p><p>XHTML</p>",
				Word.InsertLocation.end);

			// Synchronize the document state by executing the queued commands, and return a promise to indicate task completion.
			return context.sync();
		})
        .catch(errorHandler);
	}

	function getDataFromSelection() {

		var jUlResultContent = $('.results-content').empty();

		Word.run(function (context) {
			// Queue a command to get the current selection and then
			// create a proxy range object with the results.
			var range = context.document.getSelection();

			// Queue a command to load the range selection result.
			context.load(range, 'text');

			// Synchronize the document state by executing the queued commands
			// and return a promise to indicate task completion.
			return context.sync()
				.then(function () {

					// Get the longest word from the selection.
					var selection = range.text.replace('\r', '');

					$.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + selection + '&type=video&videoCaption=closedCaption&maxResults=50&key=' + youTubeApiKey).then(function (data, status, jqxhr) {
						$.each(data.items, function (idx, item) {
							var snippet = item.snippet;
							var title = snippet.title;
							var imgUrl = snippet.thumbnails.default.url;
							var highImgUrl = snippet.thumbnails.high.url;
							var videoId = item.id.videoId;

							$('<li><a href=\'' + youTubeVideoUrl + videoId + '\' title=\'' + title + '\' target=\'_blank\' data-highimg=\'' + highImgUrl + '\' data-videoid=\'' + videoId + '\'><img src=\'' + imgUrl + '\' alt=\'' + title + '\' /></a></li>').appendTo(jUlResultContent);
						});
					}, function (jqxhr, status, errorThrown) {
						// everything works always ;)
					});
				})
				.then(context.sync);
		})
		.catch(errorHandler);
	}

	function addVideoLinkToDocument(evnt) {
		evnt.preventDefault();

		var contentHtml = createVideoContentHtml(this);

		Word.run(function (context) {
			var range = context.document.getSelection();
			range.clear();
			range.insertHtml(contentHtml, Word.InsertLocation.end);

			// exec changes async
			context.sync()
				.then(function() {
					showNotification('Success:', 'Video link added');
				})
				.catch(errorHandler);
		});
	}

	function createVideoContentHtml(addinElement) {
		var jElem = $(addinElement);

		// clone the object
		var jDocumentElement = $(jElem.html());
		// change image
		jDocumentElement.find('img').attr('src', jDocumentElement.data('highimg'));
		// add some description text
		jDocumentElement.append($('<br/><i>' + jDocumentElement.attr('title') + '</i>'));

		// it's demo only code
		var html = jDocumentElement.wrap('<div>').parent().html();

		return '<p>' + html + '</p><br/><br/>';
	}

	//$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
	function errorHandler(error) {
		// $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
		showNotification("Error:", error);
		console.log("Error: " + error);
		if (error instanceof OfficeExtension.Error) {
			console.log("Debug info: " + JSON.stringify(error.debugInfo));
		}
	}

	// Helper function for displaying notifications
	function showNotification(header, content) {
		$("#notificationHeader").text(header);
		$("#notificationBody").text(content);
		messageBanner.showBanner();
		messageBanner.toggleExpansion();
	}
})();
