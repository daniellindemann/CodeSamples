var ytSearch = ytSearch || {};

// The initialize function must be run each time a new page is loaded.
(function (yts) {
    Office.initialize = function (reason) {
    	// If you need to initialize something you can do so here.
    };

    yts.loadOtherSampleData = function () {
    	// Run a batch operation against the Word object model.
    	Word.run(function (context) {
    		// Create a proxy object for the document body.
    		var body = context.document.body;

    		// Queue a commmand to clear the contents of the body.
    		body.clear();

    		// Queue a command to insert text into the end of the Word document body.
    		body.insertHtml("<p>A</p><p>B</p><p>C</p>",
				Word.InsertLocation.end);

    		// Synchronize the document state by executing the queued commands, and return a promise to indicate task completion.
    		return context.sync();
    	})
		.catch(function (error) {

		});
    }
	
})(ytSearch);

