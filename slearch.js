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
			var matchMaker = /search/gi;
			var sbAtttr = [];
			sbAtttr.push(sb.className);
			sbAtttr.push(sb.name);
			sbAtttr.push(sb.id);
			sbAtttr.push(sb.placeholder);
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
		for (var i = 0; i < this.bars.length; i++) {
			var bar = this.bars[i]
			if (bar === searchBar) { validSearchBar = false; }
		}
		// Add the search bar
		if (validSearchBar) {
			this.bars.push(searchBar);
		}
		// For debug. TODO: delete
		// if (slearch.bars.length > 0) {
		// 	console.log("Slearch says: there are "+ slearch.bars.length +" search bars on this page:", slearch.bars);
		// } else {
		// 	console.log("no search bars found");
		// }
	},

	// When a user pressed the '/' key we want to highlight a search bar
	mapActions: function() {
		window.onkeypress = function(e) {
			if (e.keyCode === 47 || e.charCode === 47 || e.key === "AKEYCODE_SLASH" || e.key === "VK_DIVIDE") {
				// TODO: Update this to somehow toggle through search bars if focusing fails
				slearch.bars[0].focus();
				slearch.bars[0].scrollIntoView();
				// TODO: remove the slash which gets added into input value
			}
		};
	},

	init: function() {
		slearch.getHtmlSearchBars();
		slearch.getPseudoSearchBars();
		slearch.mapActions();
	}

};

// Initialize
slearch.init();
