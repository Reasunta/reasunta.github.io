var peer = undefined;
var connection = undefined;

$(document).ready(function(){
    console.log("The app is started");

    //Host side
    peer = new Peer();

    peer.on("open", function(peerID){
        console.log("PeerJS id is received: " + peerID);
        $("#current-peer-id").val(generateConnectionLink(peerID));

        let partnerPeerId = window.location.hash.replace('#', '');
        if(partnerPeerId) tryToConnect(partnerPeerId);
    })

    peer.on('connection', function(conn) {
      if(connection) {
        console.log("Connection attempt will be declined. PeerJS id: " + conn.peer);
        conn.close();
        return;
      }

      connection = conn;
      handleOpenConnection(conn.peer);

      connection.on('data', handleData);
      connection.on("close", closeConnection);
    });

    // Client side
    $("#connect-btn").click(function() {
        let recipientPeerID = $("#recipient-peer-id").val();
        tryToConnect(recipientPeerID);
    })


    // Common
    $("#copy-link-btn").on("click", async function(){
        let link = $("#current-peer-id").val();
        await navigator.clipboard.writeText(link);
    })
});

tryToConnect = function(peerId) {
    if(connection) {
      console.log("Connection is established already. PeerJS id: " + connection.peer);
      return;
    }

    console.log("Try to connect with peerJS ID: " + peerId);
    let conn = peer.connect(peerId);

    conn.on('open', function() {
        connection = conn;
        handleOpenConnection(peerId);
    });

    conn.on('data', handleData);
    conn.on("close", closeConnection);
    conn.on("error", function(err){
        console.log("Connection error:");
        console.log(err);
    })
}

handleOpenConnection = function(peerId) {
    console.log("Connection is established with peerJS ID: " + peerId);
    window.location.hash = peerId;
    $("#recipient-peer-id").val(generateConnectionLink(peerId));
}

closeConnection = function(conn) {
    console.log("The connection is closed!");
    window.location.hash = '';
    $("#recipient-peer-id").val('');
    connection = undefined;
}

handleData = function(data) {
    console.log("Data are received!");
    console.log(data);
}

generateConnectionLink = function(peerID) {
    return window.location.origin + window.location.pathname + "#" + peerID;
}
