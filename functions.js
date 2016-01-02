document.addEventListener('DOMContentLoaded', function(e) {
  var BASE_URL = "http://localhost:3000";

  chrome.storage.sync.get('volume', function(result) {
    $('#volume').val(result.volume);
    $('#volume_value').html(result.volume + "%");
  });


  $('#status').attr('src', 'images/spinner.gif');
  $.ajax({
    url: BASE_URL + "/api/now",
    type: "GET",
    success: function(response) { on_success(response) },
    error: function(jqXHR, exception) { on_error(jqXHR, exception) }
  });

  getCurrentTabUrl(function(url) {
    if (url.match("https://www.youtube.com/") === null) {
      $('#start').hide();
    }

    $('#start').click(function() {
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/start",
        type: "GET",
        data: {
          url: url,
          volume: $('#volume').val()
        },
        success: function(response) { on_success(response) },
        error: function(jqXHR, exception) { on_error(jqXHR, exception) }
      });
    });

    $('#stop').click(function() {
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/stop",
        type: "GET",
        success: function(response) { on_success(response) },
        error: function(jqXHR, exception) { on_error(jqXHR, exception) }
      });
    });

    $('#pause').click(function() {
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/pause",
        type: "GET",
        success: function(response) { on_success(response) },
        error: function(jqXHR, exception) { on_error(jqXHR, exception) }
      });
    });

    $('#volume').on("input change", function() {
      $('#volume_value').html(this.value + "%");
      chrome.storage.sync.set({'volume': this.value}, null);
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/volume",
        type: "GET",
        data: {
          value: this.value
        },
        success: function(response) { on_success(response) },
        error: function(jqXHR, exception) { on_error(jqXHR, exception) }
      });
    });
  });
});

function on_success(response) {
  console.log("Success:");
  console.log(response);
  if (response.response === null) {
    $('#now').html("nothing");
  } else {
    $('#now').html(response.response.video.title);
  }
  $('#status').attr('src', 'images/success.png');
}

function on_error(jqXHR, exception) {
  console.log("Error:");
  console.log(jqXHR);
  console.log(exception);
  $('#now').html("nothing");
  $('#status').attr('src', 'images/fail.png');
}

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0].url);
  });
}
