
(function() {
    'use strict';

    var browserSync = require('browser-sync').create();

    function refreshPage() {
        browserSync.watch([
            'main.html',
            'nrev.html'
        ]).on('change', browserSync.reload);
    }

	browserSync.init({
		port: 8000,
		browser: 'chrome',
		server: {
			baseDir: ["./"],
			index: 'main.html'
		}
	}, refreshPage);

})();
