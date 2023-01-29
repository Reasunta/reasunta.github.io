var connector = new PeerJSConnector();
var gameRenderer = undefined;
var gameState = new GameState();

$(document).ready(function() {
    console.log("The app is started");

    ConnectRenderer.renderCloseConnection();
    ConnectRenderer.initHandlers(connector);

    connector.openPeer(
        link => ConnectRenderer.renderOpenPeer(link),
        link => ConnectRenderer.renderOpenConnection(link),
        () => ConnectRenderer.renderCloseConnection()
    )
    gameState.startNewGame();
    gameRenderer = new GameRenderer($(".board"), pieceClickHandler);

    gameRenderer.renderNewGame(gameState.getState());
});

pieceClickHandler = function(e) {
    let range = Math.floor(Math.random() * 6, 1) + 1;

    let currentIndex = gameRenderer.getCurrentIndex(e.target);
    let newIndex = (currentIndex + range) % 24;

    gameState.movePiece(currentIndex, newIndex);
    gameRenderer.movePiece(e.target, currentIndex, newIndex, gameState.getState());
}
