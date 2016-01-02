document.addEventListener('DOMContentLoaded', function(e) {
  var BASE_URL = "http://gitac.local:8000";

  chrome.storage.sync.get('volume', function(result) {
    $('#volume').val(result.volume);
    $('#volume_value').html(result.volume + "%");
  });


  getCurrentTabUrl(function(url) {
    if (url.match("https://www.youtube.com/") === null) {
      $('#start').hide();
    }

    debugger;
    $('#start').click(function() {
      $.ajax({
        url: BASE_URL + "/api/start",
        type: "GET",
        data: {
          url: url,
          volume: $('#volume').val()
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
      $('#volume_value').html(this.value + "%");
      chrome.storage.sync.set({'volume': this.value}, null);
      $.ajax({
        url: BASE_URL + "/api/volume",
        type: "POST",
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
