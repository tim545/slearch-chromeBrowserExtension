"use strict";

// DEBUG ONLY: Set to `true` to log info
var DEBUG_MODE = false;

var slearch = {

  // Store all the search bars we find in here
  bars: [],

  // Position of the scroll height the last time user typed the shortcut key
  lastScrollHeight: 0,

  // Support page owners adding a [slearch] attribute to inputs
  getSlearchBar: function() {
    var slearchBar = document.querySelectorAll("[slearch]");
    if (slearchBar.length > 0) {
      if (slearchBar[0].tagName.match(/INPUT/) && slearch.isVisible(slearchBar)) {
        slearch.bars.unshift(slearchBar[0]);
      }
    }
  },

  // Find input fields on the page which appear to be site search bars
  getSearchBars: function() {
    var searchBars = document.querySelectorAll("[type='search'], input[type='text'], input:not([type])");
    if (DEBUG_MODE) console.log("queried input fields: ", searchBars);
    if (searchBars == null) return;
    // Build the "pseudo search bars list" by looking for relevant attribute values
    for (var i = 0; i < searchBars.length; i++) {
      // `sb` is the current search bar
      var sb = searchBars[i];

      // The match maker tests each attribute
      var include = /search|keyword|query|^s$|^k$|^q$/gi;
      var ignore = /mobile/gi;

      // Build a string of attributes in the html element to test for keywords
      var sbAttrs = '';
      sbAttrs+= sb.className+'-';
      sbAttrs+= sb.name+'-';
      sbAttrs+= sb.id+'-';
      sbAttrs+= sb.placeholder+'-';
      sbAttrs+= sb.value+'-';
      sbAttrs+= sb.type;
      if (sb.getAttribute("aria-label")) sbAttrs+= '-'+sb.getAttribute("aria-label");

      if (DEBUG_MODE) console.log("search bar ", i, " attributes: ", sbAttrs);

      if (DEBUG_MODE) {
        console.log('sbAttrs match include -', sbAttrs.match(include));
        console.log('sbAttrs match ignore -', sbAttrs.match(ignore));
      }

      // Add HTML5 search bars
      if (sb.type === "search" && !sbAttrs.match(ignore)) {
        this.addSearchBar(sb);
        if (DEBUG_MODE) console.log("added html5 search bar: ", sb);

      // Add HTML text inputs found as search bars
      } else if (sbAttrs.match(include) && !sbAttrs.match(ignore)) {
        this.addSearchBar(sb);
        if (DEBUG_MODE) console.log("added search bar: ", sb);
      }
    }
  },

  // Check that a search bar is actually visible on the screen
  isVisible: function(element) {
    var el = element;
    var visible = true;

    // Check if the element physically resides within the windows dimensions
    if (el.clientHeight <= 0 && el.clientWidth <= 0 && el.clientTop <= 0 && el.clientLeft <= 0)
      visible = false;

    // Check computed CSS in case the input is not visible to the user
    if (window.getComputedStyle(el).display === 'none') visible = false;
    if (['hidden','collapse'].indexOf(window.getComputedStyle(el).visibility) >= 0) visible = false;
    if (window.getComputedStyle(el).opacity == '0') visible = false;

    return visible;
  },

  // Adds a newly found search bar to the object store
  addSearchBar: function(searchBar) {
    var validSearchBar = true;
    // Find if the search bar already exists
    for (var i = 0; i < slearch.bars.length; i++) {
      var bar = slearch.bars[i]
      if (bar === searchBar) validSearchBar = false;
    }
    // Check the search bar is visible to the user
    if (!slearch.isVisible(searchBar)) validSearchBar = false;
    // Add the search bar
    if (validSearchBar) {
      slearch.bars.push(searchBar);
      searchBar.onfocus = slearch.mapActions.searchBarFocusIn();
    }
  },

  // Validations as a service
  validate: {
    // Keys the user has pressed
    key: {
      // Check an event object to make sure it is a user clicking '/' key
      slash: function(e) {
        if ( e.keyCode === 47 || e.charCode === 47 || e.key === "AKEYCODE_SLASH" || e.key === "VK_DIVIDE" ) return true;
        else return false;
      },
      // Test for the 'esc' key
      esc: function(e) {
        if ( e.keyCode === 27 ) return true;
        else return false;
      }
    },
    // Event targets
    target: {
      // Test if the target is an element the user could be typing into in order to search
      editable: function(e) {
        var isContentEditable = e.target.contentEditable === "true";
        if (e.target.nodeName.match(/INPUT|DIV|TEXTAREA|SELECET/gi) || isContentEditable) return true;
        else return false;
      }
    }
  },

  // Handle the keyPress listener set in the init function
  mapActions: {
    window: function() {
      return function(e) {
        // When a user pressed the '/' key we want to highlight a search bar
        if ( slearch.validate.key.slash(e) && !slearch.validate.target.editable(e) ) {
          if (DEBUG_MODE) console.log("key event target: ", e);
          // Prevent default
          e.preventDefault();
          e.stopPropagation();

          // Find available search bars
          slearch.getSearchBars();
          slearch.getSlearchBar(); // Do this last, so if one is found it is added to the top

          // Focus on the first search bar found
          if (DEBUG_MODE) console.log("found ", slearch.bars.length, " search bars: ", slearch.bars);
          if (slearch.bars.length > 0) {
            // (First search bar is always used as it's assumed the best)
            var bar = slearch.bars[0];
            // Exit if there are no search bars
            if (bar === undefined) return false;
            // Focus on the search bar
            bar.focus();
            // Move the window to the now focused input
            window.scroll(0, (bar.offsetTop - 50));
            // Attach search bar listener
            slearch.bars[0].onkeydown = slearch.mapActions.searchbarKeyDown();
          }
        }
      };
    },
    searchbarKeyDown: function() {
      return function(e) {
        // When user presses the esc key, a focused input should un-focus
        if (slearch.validate.key.esc(e) && slearch.validate.target.editable(e)) {
          if (DEBUG_MODE) console.log("Esc from the current search bar");
          e.target.blur();
          // Move the window to the now focused input
          window.scroll(0, slearch.lastScrollHeight);
        }
      };
    },
    searchBarFocusIn() {
      return function(e) {
        if (DEBUG_MODE) console.log("search bar focused: ", e);
        if (DEBUG_MODE) console.log("window.scrollY at focus: ", window.scrollY);
        slearch.lastScrollHeight = window.scrollY;
      }
    }
  },

  init: function() {
    if (DEBUG_MODE) console.log("Slearch start initialize");
    if (listener) {
      window.removeEventListener('onkeypress', listener);
    }
    // Map slearch actions
    if (DEBUG_MODE) console.log("Map Slearch actions");
    var listener = slearch.mapActions.window();
    window.onkeypress = listener;
    if (DEBUG_MODE) console.log("Slearch initialized");
  }

};

// Start
slearch.init();
