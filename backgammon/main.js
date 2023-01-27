var peer = undefined;
var connection = undefined;

$(document).ready(function(){
    console.log("The app is started");

    //Host side
    peer = new Peer();

    peer.on("open", function(peerID){
        console.log("PeerJS id is received: " + peerID);
        $("#current-peer-id").val(peerID);
        $("#my-chat-id").text(peerID);
    })

    peer.on('connection', function(conn) {
      connection = conn;
      handleOpenConnection(conn.peer);

      connection.on('data', handleData);
      connection.on("close", closeConnection);
    });

    // Client side
    $("#connect-btn").click(function() {
        let recipientPeerID = $("#recipient-peer-id").val();

        console.log("Try to connect with peerJS ID: " + recipientPeerID);
        let conn = peer.connect(recipientPeerID);

        conn.on('open', function() {
            connection = conn;
            handleOpenConnection(recipientPeerID);
        });

        conn.on('data', handleData);
        conn.on("close", closeConnection);
    })

    // Common

});

handleOpenConnection = function(peerId) {
    console.log("Connection is established with peerJS ID: " + peerId);
}

closeConnection = function(conn) {
    console.log("The connection is closed!");
    connection = undefined;
}

handleData = function(data) {
    console.log("Data are received!");
    console.log(data);
}
