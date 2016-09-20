/// <reference path="/Scripts/FabricUI/MessageBanner.js" />

(function () {
	"use strict";

	var bitlyLogin = 'YOUR_LOGIN';    // bitly login name
	var bitlyKey = 'YOUR_KEY';   // bit.ly API Key; get key from https://bitly.com/a/your_api_key

	var messageBanner;

	// The Office initialize function must be run each time a new page is loaded.
	Office.initialize = function (reason) {
		$(document).ready(function () {
			var element = document.querySelector('.ms-MessageBanner');
			messageBanner = new fabric.MessageBanner(element);
			messageBanner.hideBanner();

			// init control
			$('#shorten-Link').on('click', shortenLink);
			$('#linkInfo #info').on('click', addLinkToText);
		});
	};

	function shortenLink(evnt) {
		// get link text
		var linkTextUrlEncoded = encodeURIComponent($('#longLinkUrl').val());

		// make request to bit.ly
		$.getJSON('https://api-ssl.bitly.com/v3/shorten?longUrl=' + linkTextUrlEncoded + '&login=' + bitlyLogin + '&apiKey=' + bitlyKey)
		    .then(function (data, status, jqxhr) {
		    	var originalLink = data.data.long_url;
		    	var shortenedLink = data.data.url;

		    	$('#linkInfo #info')
					.empty()
					.append($('<div class="ms-fontSize-m ms-fontColor-themeDarkAlt ms-fontWeight-semilight" id=\'linkData\' data-shortened=\'' + shortenedLink + '\'><span><b>Shortened link:</b><br/>' + shortenedLink + '<br/><br/><b>Original link:</b><br/>' + originalLink + '</div>'));
		    	$('#linkInfo').show();

		    }, function (jqxhr, status, errorThrown) {
		    	showNotification('Bitly error', status);
		    });
	}

	function addLinkToText(evnt) {
		// get data from link
		var jClone = $($(this).html());
		var link = jClone.data('shortened');
		var html = '<a href=\'' + link + '\'>' + link + '</a>';

		// set data to text
		Office.context.mailbox.item.body.setSelectedDataAsync(html, { coercionType: 'html' }, function (result) {
			if (result.status != Office.AsyncResultStatus.Succeeded) {
				showNotification('Error:', result.error.message);
			}
		});
	}

	// Helper function for displaying notifications
	function showNotification(header, content) {
		$("#notificationHeader").text(header);
		$("#notificationBody").text(content);
		messageBanner.showBanner();
		messageBanner.toggleExpansion();
	}
})();