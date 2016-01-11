Office.initialize = function () {
}

function addBitlyReference(evnt) {
	var html = '<i>This mail contains shortened urls.</i>';

	Office.context.mailbox.item.body.setSelectedDataAsync(html, { coercionType: 'html' }, function (result) {
		if (result.status != Office.AsyncResultStatus.Succeeded) {
			Office.context.mailbox.item.notificationMessages.addAsync('addHtmlError', {
				type: 'errorMessage',
				message: 'Failed to insert \'' + html + '\': ' + result.error.message
			});
		}

		evnt.completed();
	});
}
