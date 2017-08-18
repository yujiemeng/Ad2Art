var isOpen = true;

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendRequest(tab.id, {method: 'init'}, function(response) {
    console.log('init');
  });
});
