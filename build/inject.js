var g = document.createElement('script');
g.src = chrome.extension.getURL('build/scripts/vendors.min.js');
(document.head || document.documentElement).appendChild(g);

setTimeout(function () {
    
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('build/scripts/app.min.js');
    (document.head || document.documentElement).appendChild(s);
    
}, 400);


