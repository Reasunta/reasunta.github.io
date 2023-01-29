var connector = new PeerJSConnector();

$(document).ready(function() {
    console.log("The app is started");

    ConnectRenderer.renderCloseConnection();

    connector.openPeer(
        link => ConnectRenderer.renderOpenPeer(link),
        link => ConnectRenderer.renderOpenConnection(link),
        () => ConnectRenderer.renderCloseConnection()
    )

    $("#copy-link-btn").on("click", async function() {
        let link = $("#current-peer-id").val();
        await navigator.clipboard.writeText(link);
    })

    $("#close-conn-btn").on("click", function() {
        connector.closeConnection();
    })

    $("#open-conn-btn").on("click", function() {
        let recipientPeerID = $("#recipient-peer-id").val().split("#")[1];
        if(recipientPeerID) connector.makeConnection(recipientPeerID);
    })
});
