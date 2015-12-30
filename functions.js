document.addEventListener('DOMContentLoaded', function(e) {
  var BASE_URL = "http://gitac.local:8000/";

  chrome.storage.sync.get('volume', function(result) {
    $('#volume').val(result.volume);
  });

  getCurrentTabUrl(function(url) {
    if (url.match("https://www.youtube.com/") === null) {
      window.close();
      return;
    }


    $('#start').click(function() {
      $.ajax({
        url: BASE_URL + "/api/start",
        type: "GET",
        data: {
          url: url
        }
      });
    });

    $('#stop').click(function() {
      $.ajax({
        url: BASE_URL + "/api/stop",
        type: "GET"
      });
    });


    $('#pause').click(function() {
      $.ajax({
        url: BASE_URL + "/api/pause",
        type: "GET"
      });
    });

    $('#volume').on("input change", function() {
      $.ajax({
        url: BASE_URL + "/api/volume",
        type: "POST",
        data: {
          value: this.value
        },
        success:function(response) {
          var volume = response.response.volume;
          chrome.storage.sync.set({'volume': volume}, function() {
            $('#volume').val(volume);
          });
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
