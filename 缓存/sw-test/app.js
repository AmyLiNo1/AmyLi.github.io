// register service worker

if ('serviceWorker' in navigator) {
  // scope 参数是选填的，可以被用来指定你想让 service worker 控制的内容的子目录。 在这个例子例，我们指定了 '/sw-test/'，表示 app 的 origin 下的所有内容。如果你留空的话，默认值也是这个值， 我们在指定只是作为例子。
  navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function(reg) {
    var serviceWorker;
    if(reg.installing) {
      serviceWorker = reg.installing
      console.log('Service worker installing');
    } else if(reg.waiting) {
      serviceWorker = reg.waiting
      console.log('Service worker installed');
    } else if(reg.active) {
      serviceWorker = reg.active
      console.log('Service worker active');
    }
    if (serviceWorker) {
      console.log('serviceWorker.state:::::', serviceWorker.state);
      serviceWorker.addEventListener('statechange', function (e) {
          console.log('e.target.state::::', e.target.state);
      });
  }
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// function for loading each image via XHR

function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');

window.onload = function() {

  // load each set of image, alt text, name and caption
  for(var i = 0; i<=Gallery.images.length-1; i++) {
    imgLoad(Gallery.images[i]).then(function(arrayResponse) {

      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');
      var imageURL = window.URL.createObjectURL(arrayResponse[0]);

      myImage.src = imageURL;
      myImage.setAttribute('alt', arrayResponse[1].alt);
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

    }, function(Error) {
      console.log(Error);
    });
  }
};
