var connector = new PeerJSConnector();
var game = new Game();

$(document).ready(function() {
    console.log("The app is started");

    ConnectRenderer.renderCloseConnection();
    ConnectRenderer.initHandlers(connector);

    game.init($(".board"));

    connector.openPeer(game.start.bind(game));

});
