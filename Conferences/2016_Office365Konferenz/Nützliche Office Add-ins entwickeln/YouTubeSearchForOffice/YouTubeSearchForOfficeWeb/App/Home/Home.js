/// <reference path="../App.js" />

(function () {
	"use strict";

	var youTubeApiKey = 'YOUR_KEY';		// get api key at https://developers.google.com/youtube/v3/
	var youTubeVideoUrl = 'https://www.youtube.com/watch?v=';

	// The initialize function must be run each time a new page is loaded
	Office.initialize = function (reason) {
		$(document).ready(function () {
			app.initialize();

			$('#get-data-from-selection').click(getDataFromSelection);
			$('.search-content').on('click', 'li', addVideoLinkToDocument);
			//$('.search-content').on('click', 'li', addVideoLinkToDocumentWithRequestContext);		// uncomment to use
		});
	};

	// Reads data from current document selection and displays a notification
	function getDataFromSelection() {
		Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
			function (result) {
				if (result.status == Office.AsyncResultStatus.Succeeded) {
					$.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + result.value + '&type=video&videoCaption=closedCaption&maxResults=50&key=' + youTubeApiKey).then(function (data, status, jqxhr) {
						var jUlSearchContent = $('.search-content').empty();
						$.each(data.items, function (idx, item) {
							var snippet = item.snippet;
							var title = snippet.title;
							var imgUrl = snippet.thumbnails.default.url;
							var highImgUrl = snippet.thumbnails.high.url;
							var videoId = item.id.videoId;

							$('<li><a href=\'' + youTubeVideoUrl + videoId + '\' title=\'' + title + '\' target=\'_blank\' data-highimg=\'' + highImgUrl + '\' data-videoid=\'' + videoId + '\'><img src=\'' + imgUrl + '\' alt=\'' + title + '\' /></a></li>').appendTo(jUlSearchContent);
						});
					}, function (jqxhr, status, errorThrown) {
						// everything works always ;)
					});
				} else {
					app.showNotification('Error:', result.error.message);
				}
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

		return html;
	}

	function addVideoLinkToDocument(evnt) {
		evnt.preventDefault();
		var html = createVideoContentHtml(this);

		Office.context.document.setSelectedDataAsync(html, { coercionType: 'html' }, function (result) {
			if (result.status != Office.AsyncResultStatus.Succeeded) {
				app.showNotification('Error:', result.error.message);
			}
		});
	}

	function addVideoLinkToDocumentWithRequestContext(evnt) {
		evnt.preventDefault();
		var html = createVideoContentHtml(this);

		var ctx = new Word.RequestContext();
		var range = ctx.document.getSelection();

		// insert
		range.insertHtml(html, Word.InsertLocation.end);

		// execute async
		ctx.sync()
			.then(function() {
				app.showNotification('Video Link added');
			})
			.catch(function(error) {
				app.showNotification('Error:', error);
			});
	}
})();