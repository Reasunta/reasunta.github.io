class Game {
    constructor(connector) {
        this.state = new GameState();
        this.view = new GameRenderer();
        this.connector = connector;
    }

    init = function(boardDOM, dataSender) {
        this.send = dataSender;

        this.state.init();
        this.view.init(boardDOM, this.pieceClickCallback.bind(this));

        this.render();
    }

    render = function(animations) {
        this.view.render(this.state, animations);
    }

    start = function(playerInfo) {
        let player = playerInfo.player;
        let color = player.type == "host" ? "white" : "black";

        this.state.init();
        this.state.setPositions({11: 15, 23: -15});
        this.state.setEndPositions({"white": 12, "black": 0});
        this.state.setWays({"white": -1, "black": -1});

        this.state.setPlayer(player.id, color);

        this.render();
    }

    update = function(data) {
        this.state.positions = data.positions;
        this.render(data.animations);

        console.log("here is game update");
    }

    pieceClickCallback = function(event) {
        let piece = event.target;
        let range = Math.floor(Math.random() * 6, 1) + 1;
        let from = this.view.getPosition(piece);

        if(!this.state.isMovable(from, range)) return;

        let to = this.state.getTo(from, range);
        let animations = [{"name": "movePiece", "from": from, "to": to}];

        let data = {
            "positions": this.state.getPositions(),
            "animations": animations
        };

        this.state.move(from, to);
        this.render(animations);

        console.log(data);
        this.send(data);
    }
}
