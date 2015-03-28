"use strict";

// TODO: Make sure there are no key mappings to "/" already, if so quit.

// Our awesome Object
var slearch = {

	// Store all the search bars we find in here
	bars: [],

	// HTML5 search inputs
	getHtmlSearchBars: function() {
		var Html5SearchBars = document.querySelectorAll("[type='search']");
		if (Html5SearchBars == null) return;
		// Add search bars to list
		for (var i = 0; i < Html5SearchBars.length; i++) {
			var sb = Html5SearchBars[i];
			this.bars.push(sb);
		}
	},

	// Old school 'search' bars
	getPseudoSearchBars: function() {
		var pseudoSearchBars = document.querySelectorAll("input[type='text']");
		if (pseudoSearchBars == null) return;
		// Build the "pseudo search bars list" by looking for a relevant className
		for (var i = 0; i < pseudoSearchBars.length; i++) {
			var sb = pseudoSearchBars[i];
			var sbAtttr = sb.className;
			console.log(sbAtttr);
			if (sbAtttr.match(/search/)) {
				this.bars.push(sb);
			}
		}
	}

};

// Find all search bars
slearch.getHtmlSearchBars();
slearch.getPseudoSearchBars();

// TODO: map the "/" so that it toggles through all the search bars found on the page

// For debug. TOFO: delete
console.log(slearch.bars);