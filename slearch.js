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
			var matchMaker = /search/;
			var sbAtttr = [];
			sbAtttr.push(sb.className);
			sbAtttr.push(sb.name);
			sbAtttr.push(sb.id);
			sbAtttr.push(sb.placeholder);
			if (sb.getAttribute("aria-label") != null) sbAtttr.push(sb.getAttribute("aria-label"));
			// sbAtttr.push(sb.ariaLabel);
			for (var i = 0; i < sbAtttr.length; i++) {
				var attribute = sbAtttr[i];
				if (attribute.match(matchMaker)) {
					this.bars.push(sb);
				}
			}
		}
	}

};

// Find all search bars
slearch.getHtmlSearchBars();
slearch.getPseudoSearchBars();

// TODO: map the "/" so that it toggles through all the search bars found on the page

// For debug. TOFO: delete
if (slearch.bars.length > 0) console.log("search bars on this page:", slearch.bars);