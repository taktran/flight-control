var http = require('http'),
    sockjs = require('sockjs'),
    node_static = require('node-static'),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    five = require("johnny-five"),
    board, nunchuck;

var URL_PREFIX = "/input";


// 0. Johnny five setup
//
// Connect the clock pin (`c` on adapter or labelled `SCL`) to
// `A5` or the `SCL` pin
// Connect the data pin (`d` on adapter or labelled `SDA`) to
// `A4` or the `SDA` pin
// board = new five.Board({
//   port: "/dev/cu.usbmodem621" // tmac top usb
//   // port: "/dev/cu.usbmodem411" // tmac bottom usb
// });

// board.on("ready", function() {
//   var a4 = new five.Pin("A4").low(),
//       a5 = new five.Pin("A5").low();

//   a4.low();
//   a5.low();

//   this.repl.inject({
//     a4: a4,
//     a5: a5
//   })

//   // Create a new `nunchuk` hardware instance.
//   nunchuk = new five.Wii.Nunchuk({
//     freq: 100
//   });

//   // Joystick changes
//   //
//   // Emits `nunchuck:joystick` event when change occurs
//   nunchuk.joystick.on( "change", function( err, event ) {
//     eventEmitter.emit("nunchuck:joystick", {
//       current: {
//         axis: event.axis,
//         value: event.target[event.axis],
//         direction: event.direction
//       },
//       position: {
//         x: event.target["x"],
//         y: event.target["y"]
//       }
//     });
//   });

//   // eventEmitter.on("nunchuck:joystick", function(data) {
//   //   console.log("joystick: " + JSON.stringify(data));
//   // });

//   // Accelerometer changes
//   //
//   // Emits `nunchuck:accelerometer` event when change occurs
//   nunchuk.accelerometer.on( "change", function( err, event ) {
//     eventEmitter.emit("nunchuck:accelerometer", {
//       current: {
//         axis: event.axis,
//         value: event.target[event.axis],
//         direction: event.direction
//       },
//       position: {
//         x: event.target["x"],
//         y: event.target["y"],
//         z: event.target["z"],
//       }
//     });
//   });

//   // eventEmitter.on("nunchuck:accelerometer", function(data) {
//   //   console.log("accelerometer: " + JSON.stringify(data));
//   // });

//   // Button changes
//   //
//   // Emits `nunchuck:button` event when change occurs
//   [ "down", "up", "hold" ].forEach(function( type ) {
//     nunchuk.on( type, function( err, event ) {
//       eventEmitter.emit("nunchuck:button", {
//         which: event.target.which,
//         type: type,
//         isUp: event.target.isUp,
//         isDown: event.target.isDown
//       });
//     });
//   });
// });

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {

  // // Send button presses
  // eventEmitter.on("nunchuck:button", function(data) {
  //   conn.write(JSON.stringify(data));
  // });

  conn.on('data', function(message) {
    console.log('Got data: ' + message);
  });

  conn.write("Connection");
});

// 2. Static files server
var static_directory = new node_static.Server(__dirname);

// 3. Usual http stuff
var server = http.createServer();
server.addListener('request', function(req, res) {
  static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
  res.end();
});

sockjs_echo.installHandlers(server, {prefix: URL_PREFIX});

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');