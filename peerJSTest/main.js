var peer = undefined;
var connection = undefined;

$(document).ready(function(){
    console.log("The app is started");

    peer = new Peer();

    peer.on("open", function(peerID){
        console.log("PeerJS id is received: " + peerID);
        $("#current-peer-id").val(peerID);
    })

    peer.on('connection', function(conn) {
      console.log("Connection is received and established with peerJS ID: " + conn.peer)
      connection = conn;

      connection.on('data', function(data){
        console.log("Data are received!")
        console.log(data);
      });

      connection.on("close", closeConnection);
    });

    $("#connect-btn").click(function() {
        let recipientPeerID = $("#recipient-peer-id").val();

        console.log("Try to connect with peerJS ID: " + recipientPeerID);
        connection = peer.connect(recipientPeerID);

        connection.on('open', function() {
            console.log("Connection is established with peerJS ID: " + recipientPeerID);

            connection.send('hi!');
        });

        connection.on("close", closeConnection);
    })
});

closeConnection = function(conn) {
    console.log("The connection is closed!");
}
