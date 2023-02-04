class Game {
    constructor() {
        this.state = new GameState();
        this.view = new GameRenderer();
    }

    init = function(boardDOM) {
        this.state.init();
        this.view.init(boardDOM, this.pieceClickCallback.bind(this));

        this.render();
    }

    render = function(animations) {
        this.view.render(this.state, animations);
    }

    start = function() {
        this.state.setPositions({11: 15, 23: -15});
        this.state.setEndPositions({"white": 12, "black": 0});
        this.state.setWays({"white": -1, "black": -1});

        this.render();
    }

    pieceClickCallback = function(event) {
        let piece = event.target;
        let range = Math.floor(Math.random() * 6, 1) + 1;
        let from = this.view.getPosition(piece);

        if(!this.state.isMovable(from, range)) return;

        let to = this.state.getTo(from, range);
        this.state.move(from, to);

        this.render([{"name": "movePiece", "from": from, "to": to, "el": piece}]);
    }
}
