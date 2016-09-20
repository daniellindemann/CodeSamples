var bitlyShortener = bitlyShortener || {};

(function (o, bls) {
	var htmlToInsert = '<i>This mail contains shortened urls.</i>';

	o.initialize = function (reason) {
		// If you need to initialize something you can do so here.
	};

	bls.addBitlyReference = function (evnt) {

		o.context.mailbox.item.body.setSelectedDataAsync(htmlToInsert, { coercionType: 'html' }, function (result) {
			if (result.status != Office.AsyncResultStatus.Succeeded) {
				o.context.mailbox.item.NotificationMessages.addAsync('addHtmlError', {
					type: 'errorMessage',
					message: 'Failed to insert \'' + html + '\': ' + result.error.message
				});
			}

			evnt.completed();
		});
	};
})(Office, bitlyShortener);