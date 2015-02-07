
console.log('App initialized');



function generateRandomString(l) {
    if (l == null) {
        l = 64;
    }
    
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < l; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    
    return randomstring;
}



$(document).ready(function () {
    
    console.log('Hello,', gmail.get.user_email());
    
    //
    gmail.observe.on("compose", function (compose, type) {
        // type can be compose, reply or forward
        console.log('api.dom.compose object:', compose, 'type is:', type);  // gmail.dom.compose object
    });
    
    // Observe compose or reply action
    gmail.observe.before('send_message', function (url, body, data, xhr) {
        var body_params = xhr.xhrParams.body_params;
        
        var id = generateRandomString(32);
        
        // Inject tracking pixel
        body_params.body = body_params.body + '<img src="http://tracker.sebastiaanluca.dev/track/' + id + '" alt="" />';
        
        console.log('From', data.from);
        console.log('To', data.to);
        console.log('CC', data.cc);
        console.log('BCC', data.bcc);
        console.log('Subject', data.subject);
        console.log('Message', data.body);
        console.log('Is HTML?', data.ishtml);
        console.log('Request read receipt?', data.readreceipt);
        console.log('Gmail message id', data.composeid);
        
        // TODO: POST id, critical data, and metadata to API
    });
    
});