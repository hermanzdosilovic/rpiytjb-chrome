
document.addEventListener('DOMContentLoaded', function(e) {
  // chrome.storage.sync.clear();

  chrome.storage.sync.get('jukebox_url', function(result) {
    if (typeof result.jukebox_url === "undefined") {
      setup_dialog();
    } else {
      main_dialog(result.jukebox_url);
    }
  });
});

function setup_dialog() {
  $('.setup').show();
  $('.main').hide();

  chrome.storage.sync.get('jukebox_url', function(result) {
    if (typeof result.jukebox_url === "undefined") {
      $('#jukebox_url_input').val('');
    } else {
      $('#jukebox_url_input').val(result.jukebox_url);
    }
  });

  $('#save').click(function() {
    BASE_URL = $('#jukebox_url_input').val();
    chrome.storage.sync.set({'jukebox_url': BASE_URL}, null);
    main_dialog(BASE_URL);
  });
}

function main_dialog(BASE_URL) {
  $('.setup').hide();
  $('.main').show();

  chrome.storage.sync.get('volume', function(result) {
    var volume;
    if (typeof result.volume === "undefined") {
      volume = 50;
    } else {
      volume = result.volume;
    }
    $('#volume').val(volume);
    $('#volume_value').html(volume + "%");
  });

  getCurrentTabUrl(function(url) {
    if (url.match("^https://www.youtube.com/") === null) {
      $('#start').hide();
    }

    $('#start').click(function() {
      $(this).prop('disabled', true);
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/start",
        type: "GET",
        data: {
          url: url,
          volume: $('#volume').val()
        },
        success: function(response) {
          $('#start').prop('disabled', false);
          on_success(response);
        },
        error: function(jqXHR, exception) {
          $('#start').prop('disabled', false);
          on_error(jqXHR, exception);
        }
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

    $('#force_stop').click(function() {
      $('#status').attr('src', 'images/spinner.gif');
      $.ajax({
        url: BASE_URL + "/api/force_stop",
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

  // fetch now playing info
  $('#status').attr('src', 'images/spinner.gif');
  $.ajax({
    url: BASE_URL + "/api/now",
    type: "GET",
    success: function(response) { on_success(response) },
    error: function(jqXHR, exception) { on_error(jqXHR, exception) }
  });

  $('#settings').click(setup_dialog);
  $('#jukebox_url').html(BASE_URL);
}

function on_success(response) {
  console.log("Success:");
  console.log(response);
  if (response.response === null) {
    $('#now').html("nothing");
  } else {
    $('#now').html(
      "<a href=\"" + response.response.video_url + "\" target=\"blank\">"
      + response.response.title + "</a>"
    );
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
