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
			this.addSearchBar(sb);
		}
	},

	// Old school 'search' bars
	getPseudoSearchBars: function() {
		var pseudoSearchBars = document.querySelectorAll("input[type='text']");
		if (pseudoSearchBars == null) return;
		// Build the "pseudo search bars list" by looking for a relevant className
		for (var i = 0; i < pseudoSearchBars.length; i++) {
			var sb = pseudoSearchBars[i];
			var matchMaker = /search|q/gi;
			var sbAtttr = [];
			sbAtttr.push(sb.className);
			sbAtttr.push(sb.name);
			sbAtttr.push(sb.id);
			sbAtttr.push(sb.placeholder);
			sbAtttr.push(sb.value);
			if (sb.getAttribute("aria-label") != null) sbAtttr.push(sb.getAttribute("aria-label"));
			for (var i = 0; i < sbAtttr.length; i++) {
				var attribute = sbAtttr[i];
				if (attribute.match(matchMaker)) {
					this.addSearchBar(sb);
				}
			}
		}
	},

	// Adds a newly found search bar to the object store
	addSearchBar: function(searchBar) {
		var validSearchBar = true;
		// Find if the search bar already exists
		for (var i = 0; i < slearch.bars.length; i++) {
			var bar = slearch.bars[i]
			if (bar === searchBar) { validSearchBar = false; }
		}
		// Add the search bar
		if (validSearchBar) {
			slearch.bars.push(searchBar);
		}
	},

	// When a user pressed the '/' key we want to highlight a search bar
	mapActions: function() {
		window.onkeypress = function(e) {
			if (e.keyCode === 47 || e.charCode === 47 || e.key === "AKEYCODE_SLASH" || e.key === "VK_DIVIDE") {
				e.preventDefault();
				e.stopPropagation();
				// Focus on the first search bar found
				// (First search bar is always used as it's assumed the best)
				var bar = slearch.bars[0];
				if (bar === undefined) return false;
				bar.focus();
				// Move the window to the now focused input
				window.scroll(0, (bar.offsetTop - 50));
			}
		};
	},

	init: function() {
		// Run all initialization methods
		slearch.getHtmlSearchBars();
		slearch.getPseudoSearchBars();
		slearch.mapActions();
		// Show page icon if active
		if (slearch.bars.length > 0) {
			chrome.runtime.sendMessage({hasSearchBars: true});
		}
	}

};

slearch.init();

// Initialize
var startSlearch = function() {
	attemptsCurr++;
	if (document.readyState.match(/complete|loaded/gi) || attemptsCurr >= attemptsMax) {
		slearch.init();
		window.clearInterval(attemptsDo);
	}
};
// Prevent infinite loop by starting with a finite number of attempts
var attemptsMax = 10;
var attemptsCurr = 0;
var attemptsDo = window.setInterval(startSlearch, 400);
