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
}
