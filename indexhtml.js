document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('isOpen', function(result){
      if (result && result.isOpen) {
          document.getElementById("onoffswitch").checked = true;
      }
      else {
        document.getElementById("onoffswitch").checked = false;
      }
  });
  document.getElementById("onoffswitch").addEventListener("click", clickSwitch);
  document.getElementById("feedback").addEventListener("click", feedback);
});

function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
 });
}

function feedback() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {"message": "feedback"});
 });
}

var clickSwitch = function() {
    if (document.getElementById("onoffswitch").checked) {
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id, {"message": "open"});
      });
    } else {
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id, {"message": "close"});
      });
    }
};
