document.addEventListener('DOMContentLoaded', function(e) {
  getCurrentTabUrl(function(url) {
    if (url.match("https://www.youtube.com/") === null) {
      window.close();
      return;
    }


    $('#play').click(function() {
      $.ajax({
        url: "http://localhost:3000/api/play",
        type: "GET",
        data: {
          url: url
        }
      });
    });

    $('#stop').click(function() {
      $.ajax({
        url: "http://localhost:3000/api/stop",
        type: "GET"
      });
    });
  });
});

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0].url);
  });
}
