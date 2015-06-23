"use strict";

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  // With a new rule ...
  chrome.declarativeContent.onPageChanged.addRules([
    {
      // And shows the extension's page action.
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }
  ]);
});


// Show page action
var activatePageAction = function() {
  chrome.pageAction.show();
};

// Wait for content to notify that page has search bars
chrome.runtime.onMessage.addListener(function(data, sender, callback) {
  if (data.hasSearchBars) {
    activatePageAction();
  }
});