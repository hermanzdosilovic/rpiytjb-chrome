document.addEventListener('DOMContentLoaded', function(e) {
  getCurrentTabUrl(function(url) {
    if (url.match("https://www.youtube.com/") === null) {
      window.close();
      return;
    }


    $('#start').click(function() {
      $.ajax({
        url: "http://gitac.local:8000/api/start",
        type: "GET",
        data: {
          url: url
        }
      });
    });

    $('#stop').click(function() {
      $.ajax({
        url: "http://gitac.local:8000/api/stop",
        type: "GET"
      });
    });


    $('#pause').click(function() {
      $.ajax({
        url: "http://gitac.local:8000/api/pause",
        type: "GET"
      });
    });

    $('#volume').on("input change", function() {
      $.ajax({
        url: "http://gitac.local:8000/api/volume",
        type: "GET",
        data: {
          value: this.value
        }
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
