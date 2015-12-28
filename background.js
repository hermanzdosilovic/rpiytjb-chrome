chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.match("https://www.youtube.com/.*") === null) {
    return;
  }

  $.ajax({
    url: "http://gitac.local:8000/api/play",
    type: "GET",
    data: {
      url: tab.url
    }
  });
});
