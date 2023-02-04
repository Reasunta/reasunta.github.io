class ConnectRenderer {

    static render = function(state) {
        $("#current-peer-id").val(state["myLink"] ?? "");
        $("#recipient-peer-id").val(state["partnerLink"] ?? "");

        let isConnOpen = Boolean(state["partnerLink"]);

        $("#recipient-peer-id").prop("disabled", isConnOpen);
        $("#close-conn-btn").prop("disabled", !isConnOpen);
        $("#open-conn-btn").prop("disabled", isConnOpen);

    }

    static init = function(connector) {
        $("#copy-link-btn").on("click", async function() {
            let link = $("#current-peer-id").val();
            await navigator.clipboard.writeText(link);
        })

        $("#close-conn-btn").on("click", function() {
            connector.closeConnection();
        })

        $("#open-conn-btn").on("click", function() {
            let recipientPeerID = $("#recipient-peer-id").val().split("#")[1];
            if(recipientPeerID) connector.connect(recipientPeerID);
        })
    }
}
