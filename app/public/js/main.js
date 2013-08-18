/*global Raphael:true */
(function (){
  'use strict';
  var SOCK_JS_SERVER = "http://localhost:9999/input";

  var sock = new SockJS(SOCK_JS_SERVER);

  sock.onopen = function() {
    console.log('open');
  };

  sock.onmessage = function(e) {
    console.log('message', e.data);
  };

  sock.onclose = function() {
    console.log('close');
  };

  $("#test").click(function() {
    sock.send("HELLLLLLO!!");
  });

  // -------------------------------------
  // Sketchpad
  // -------------------------------------

  var editorEl = "#editor",
    sketchpad = Raphael.sketchpad("editor", {
      width: $(editorEl).width(),
      height: $(editorEl).height(),
      editing: true
    });

  // When the sketchpad changes, upload data
  sketchpad.change(function() {
    var data = sketchpad.json();
    console.log(JSON.parse(data));
  });


})();