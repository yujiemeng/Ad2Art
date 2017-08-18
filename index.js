var url = location.host + location.pathname;
console.log(url);
var GetAdsarea = function(url) {
  var returnArr = [];
  for (var key in adsarea) {
    if (key.indexOf('*') != -1 && url.indexOf(key.replace('*', '')) != -1) {
      returnArr = [];
      returnArr.push(adsarea[key]);
      break;
    } else if (url == key) {
      returnArr = [];
      returnArr.push(adsarea[key]);
      break;
    } else {
      returnArr = arts;
    }
  };
  return returnArr;
};

//event
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open" ) {
     open();
    }
    if( request.message === "close" ) {
     close();
    }
    if( request.message === "feedback" ) {
      feedback();
    }
  }
);
function open(){
    chrome.storage.local.set({'isOpen': true});
}
function close(){
    chrome.storage.local.set({'isOpen': false});
}

function feedback(){
  var feedbackUrl = "https://yawpart.com:8762/feedback";
  $.ajax({
    type: "POST",
    url: feedbackUrl,
    data: {url:url},
    success: function (data) {
      if (data){
        alert('反馈成功');
      }
    },
    error: function (a, b, c) {
    }
  });
}
var GetWhitelist = function(url) {
  var returnArr = [];
  for (var key in whitelist) {
    if (key.indexOf('*') != -1 && url.indexOf(key.replace('*', '')) != -1) {
      returnArr = [];
      returnArr.push(whitelist[key]);
    } else if (url == key) {
      returnArr = [];
      returnArr.push(whitelist[key]);
    }
  };
  return returnArr;
};

var selectors = GetAdsarea(url);
var whitelists = GetWhitelist(url);

var generateArt = function(_width, artData) {
  var art = artData;

  var template = [
    '<a href="{url}" target="blank">',
    '<img class="adstoart-img" style="width:' + _width + 'px;height:auto;display:block;" src="{img}" />',
    '<div class="hover_ads" style="display: block;"><span class="bg"><div class="div_border"><br /><p class="art_name">{name}</p>'+
        '<p>{year}</p>'+
        '<p class="lovers">{author}</p>'+
        '<p>{metiral}</p><br />'+
        '<p class="readp"><span class="readdetail">点击查看<span></p>'+
        '</div></span></div>',
    '</a>',
  ];


  return template.join('').replace(/{(\w+)}/g, function(str, key) {
    return art[key];
  });
};

var replaceIndex = 0;

selectors.forEach(function(selector) {
  setTimeout(function() {
    document.querySelectorAll(selector).forEach(function(element, index) {
      //console.log(index + selector);
      //过滤长条广告
      if (element.offsetWidth > 360 || element.offsetWidth < 200 || element.offsetHeight <= 50) {
        element.style.display = "none";
        element.style.width = "0px";
        return;
      }

      //过滤白名单
      if (whitelists.length > 0) {
        for (var i = whitelists[0].length - 1; i >= 0; i--) {
          if (whitelists[0][i] === index){
            element.className = "index_" + index;
            return;
          }
        }
      }

      var parent = element.parentNode;

      //添加 div　
      var div = document.createElement("div");

      //设置 div 属性，如 id　
      div.setAttribute("id", "newDiv");
      div.setAttribute("class", "artclass");
      div.setAttribute("div_index", "index_" + index);
      var ad_width = element.offsetWidth
      div.style.width = ad_width + "px";
      //div.style.height = element.offsetHeight + "px";
      div.style.position = "relative";



      chrome.storage.local.get('isOpen', function(result){
          if (result && result.isOpen) {
            $.ajax({
              type: "POST",
              url: "https://yawpart.com:8762/info",
              data: {token:'d25f9007c288f2e3'},
              success: function (data) {
                  if (data) {
                    chrome.storage.local.get('isOpen', function(result){
                        if (result) {
                            data.data.img = 'https://yawpart.com:8762/img?width=' + element.offsetWidth + '&height=250&fid=' + data.data.fid
                            if (replaceIndex++ < 3) {
                              div.innerHTML = generateArt(element.offsetWidth, data.data);
                            }
                            //div.innerHTML = generateArt(ad_width);
                            element.style.display = "none";
                            element.style.width = "0px";
                            div.setAttribute('class', element.getAttribute('class') + ' artclass');
                        }
                    });
                  }
                  else {

                  }
              },
              error: function (a, b, c) {
              }
            });

          }
      });

      if (element.nextSibling) {
        element.parentNode.insertBefore(div, element.nextSibling);
      } else {
        element.parentNode.appendChild(div);
      }


    })
  }, 1000)
});
document.querySelectorAll('.art_name').forEach(function(element, index){
  if (element.innerText.startWith('《')){
    element.css('margin-left', '-9px');
  }
})
