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
    $("#send-msg-input").on("keydown", function(e) {
        if(e.key == "Enter" && connection) {
            let input = $(e.target);

            addMyMessage(input.val());
            connection.send(input.val());

            input.val("");
        }
    })
});

handleOpenConnection = function(peerId) {
    console.log("Connection is established with peerJS ID: " + peerId);
    $("#partner-chat-id").text(peerId);
}

closeConnection = function(conn) {
    console.log("The connection is closed!");
    addOtherMessage("The connection is closed!");
    connection = undefined;
}

handleData = function(data) {
    addOtherMessage(data);

    console.log("Data are received!");
    console.log(data);
}

addOtherMessage = function(text) {
    let msg = $('<li class="clearfix"><div class="message other-message float-right"></div></li>')
    msg.find("div").text(text);
    $(".chat-history ul").append(msg);
}

addMyMessage = function(text) {
    let msg = $('<li class="clearfix"><div class="message my-message"></div></li>')
    msg.find("div").text(text);
    $(".chat-history ul").append(msg);
}
