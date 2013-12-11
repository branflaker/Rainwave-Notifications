var nowPlayingNotification;

// Listen for a rainwave-notifications connection from a content script
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "rainwave-notifications");
  
  // When a notification is clicked, open Rainwave
  var notificationClick = function() {
    var tabId = port.sender.tab.id;
    var windowId = port.sender.tab.windowId;
    
    chrome.tabs.update(tabId, {active: true});
    chrome.windows.update(windowId, {focused: true});
  };
  
  
  // Listen to messages from the content script
  port.onMessage.addListener(function(msg) {
    // == NOW PLAYING == 
    // If we have an open "now playing" notification, cancel it
    if (typeof nowPlayingNotification !== "undefined") {
      nowPlayingNotification.cancel();
    }
    
    // Format song rating and album rating
    var songrating = msg.songrating.length === 0 ? "NR" : msg.songrating;
    var albumrating = msg.albumrating.length === 0 ? "NR" : msg.albumrating;
    
    // Create a Now Playing notification
    nowPlayingNotification = webkitNotifications.createNotification(
      msg.albumart,
      msg.title + " [" + songrating + "]",
      msg.album + " - " + msg.artist
    );
    nowPlayingNotification.onclick = notificationClick;
    
    // Show the notification
    nowPlayingNotification.show();
    
    // == CURRENT USER REQUEST IN ELECTION == 
    if (msg.electionUserRequest) {
    
      // Create an Election notification
      var electionNotification = webkitNotifications.createNotification(
        "",
        "Requested Song in Election",
        "One of your requested songs is ready for voting!  Click here to open Rainwave."
      );
      electionNotification.onclick = notificationClick;
      
      // Show the notification
      electionNotification.show();
      
      // After 30 seconds, close the Election notification
      setTimeout(function() {
        electionNotification.cancel();
      }, 30000);
    }
  });
});
