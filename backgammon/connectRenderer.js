class ConnectRenderer {
    static renderOpenConnection = function(link) {
        if(link) $("#recipient-peer-id").val(link);

        $("#recipient-peer-id").prop("disabled", true);
        $("#close-conn-btn").prop("disabled", false);
        $("#open-conn-btn").prop("disabled", true);
    }

    static renderCloseConnection = function() {
        $("#recipient-peer-id").val('');
        $("#recipient-peer-id").prop("disabled", false);
        $("#close-conn-btn").prop("disabled", true);
        $("#open-conn-btn").prop("disabled", false);
    }

    static renderOpenPeer = function(link) {
        $("#current-peer-id").val(link);
    }

    static initHandlers = function(connector) {
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
    }
}
