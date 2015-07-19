"use strict";

// DEBUG ONLY: Set to `true` to log info
const DEBUG_MODE = false;

// TODO: Make sure there are no key mappings to "/" already, if so quit.

// Our awesome Object
var slearch = {

	// Store all the search bars we find in here
	bars: [],

	// HTML5 search inputs
	getHtmlSearchBars: function() {
		var Html5SearchBars = document.querySelectorAll("[type='search']");
		if (DEBUG_MODE) console.log("queried HTML5 search fields: ", typeof Html5SearchBars, Html5SearchBars);
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
		if (DEBUG_MODE) console.log("queried text fields: ", typeof pseudoSearchBars, pseudoSearchBars);
		if (pseudoSearchBars == null) return;
		// Build the "pseudo search bars list" by looking for relevant attribute values
		for (var i = 0; i < pseudoSearchBars.length; i++) {
			// `sb` is the current search bar
			var sb = pseudoSearchBars.item(i);
			// The match maker tests each attribute
			var matchMaker = /search|q/gi;
			// Array of attributes to test, and determine if it is a search bar or not
			var sbAtttr = [];
			sbAtttr.push(sb.className);
			sbAtttr.push(sb.name);
			sbAtttr.push(sb.id);
			sbAtttr.push(sb.placeholder);
			sbAtttr.push(sb.value);
			sbAtttr.push(sb.type);
			if (sb.getAttribute("aria-label") != null) sbAtttr.push(sb.getAttribute("aria-label"));
			if (DEBUG_MODE) console.log("search bar ", i, " attributes: ", sbAtttr);
			// If an attribute is matched by the match maker, add it to the list
			for (var a = 0; a < sbAtttr.length; a++) {
				var attribute = sbAtttr[a];
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

	// Check an event object to make sure it is a user clicking '/' key
	keyCheck: function(e) {
		if (
			e.keyCode === 47
			|| e.charCode === 47
			|| e.key === "AKEYCODE_SLASH"
			|| e.key === "VK_DIVIDE"
		) {
			return true;
		} else {
			return false;
		}
	},

	// When a user pressed the '/' key we want to highlight a search bar
	mapActions: function(e) {
		return function(e) {
			if ( slearch.keyCheck(e) && !e.target.nodeName.match(/INPUT|DIV|TEXTAREA|SELECET/gi) ) {
					if (DEBUG_MODE) console.log("key event target: ", e);
					// Prevent default
					e.preventDefault();
					e.stopPropagation();
					// Focus on the first search bar found
					// (First search bar is always used as it's assumed the best)
					var bar = slearch.bars[0];
					// Exit if there are no search bars
					if (bar === undefined) return false;
					// Focus on the search bar
					bar.focus();
					// Move the window to the now focused input
					window.scroll(0, (bar.offsetTop - 50));
			}
		};
	},

	init: function() {
		if (DEBUG_MODE) console.log("Slearch start initialize");
		if (listener) {
			window.removeEventListener('onkeypress', listener);
		}
		// Run all initialization methods
		slearch.getHtmlSearchBars();
		slearch.getPseudoSearchBars();
		// Activate listeners only if search bars are found
		if (DEBUG_MODE) console.log("found ", slearch.bars.length, " search bars");
		if (slearch.bars.length > 0) {
			if (DEBUG_MODE) console.log("map slearch actions");
			// window.addEventListener('onkeypress', slearch.mapActions());
			var listener = slearch.mapActions();
			window.onkeypress = listener;
		}
		if (DEBUG_MODE) console.log("Slearch initialized: ", slearch.bars);
	}

};

// Start
slearch.init();
