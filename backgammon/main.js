var connector = new PeerJSConnector();
var game = new Game(connector);

$(document).ready(function() {
    console.log("The app is started");

    ConnectRenderer.init(connector);
    game.init($(".board"), connector.send.bind(connector));
    connector.init(
        game.start.bind(game),
        game.update.bind(game)
    );

    connector.open();

});
