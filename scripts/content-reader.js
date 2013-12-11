$().ready(function() {
  // Keep track of last song played in order to determine when to send message
  var last_nowplayingtext = "";
  
  // Connect to Rainwave Notifications script
  var port = chrome.runtime.connect({name: "rainwave-notifications"});

  // Send now playing data via runtime connection
  var sendNotificationData = function() {
  
    // Get song title
    var nowplayingtext = $(".nowplaying_song_title").text();
    
    // If the song title has changed, collect and send the data
    if (nowplayingtext != last_nowplayingtext) {
      last_nowplayingtext = nowplayingtext;
      
      // Get the current user, use this to check if the current request was made by this user
      var currentUser = $(".menu_username").text();
      // Get the table for the current election
      var currentElection = $(".timeline_table").has(".timeline_vote_hover[style*='pointer']");
      // Determine the requester in the current election
      var requester = currentElection.find(".timeline_song_requestor_wrap").text().split("Requested by ")[1];

      var msg = {
        // song title
        title: nowplayingtext,
        // song artist
        artist: $(".nowplaying_artist_name").text(),
        // song album
        album: $(".nowplaying_album_name").text(),
        // absolute URL to the album art
        albumart: location.protocol + "//" + location.host + "/" + $(".nowplaying_album_art_img").attr("src"),
        // current user's song rating
        songrating: $(".nowplaying_song_rating").text(),
        // current user's album rating
        albumrating: $(".nowplaying_album_rating").text(),
        // true if the currently requested song in election was made by the current user
        electionUserRequest: currentUser === requester
      };
      
      // Send the message
      port.postMessage(msg);
    }
  };
  
  // Whenever a DOM change occurs in the now playing part of the site, attempt to send now playing data
  $(".nowplaying_wrapper").on("DOMNodeInserted", function(event) {
    setTimeout(sendNotificationData, 100);
  });
});
