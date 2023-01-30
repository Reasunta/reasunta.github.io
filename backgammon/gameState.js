class GameState {
    constructor() {
        this.positions = new Array(24).fill(0);
    }

    startNewGame = function() {
        for (let i = 0; i < 24; i++) this.positions[i] = 0;
        this.positions[11] = 15;
        this.positions[23] = -15;

        this.endPositions = {"white": 12, "black": 0};
        this.ways = {"white": -1, "black": -1};
    }

    getState = function() {
        return this.positions;
    }

    movePiece = function(from, range) {
        let fromV = this.positions[from];
        if(fromV == 0) return -1;

        let color = Math.sign(fromV) > 0 ? "white" : "black";

        let rangeToEnd = this.endPositions[color] - from;
        if(!rangeToEnd) return -1;

        if(Math.sign(rangeToEnd) != this.ways[color]) rangeToEnd += this.ways[color] * 24;
        if (range > Math.abs(rangeToEnd)) return -1;

        let to = (24 + from + this.ways[color] * range) % 24;
        let toV = this.positions[to];

        if(fromV * toV < 0) return -1;

        this.positions[from] = Math.sign(fromV) * (Math.abs(fromV) - 1);
        this.positions[to] = Math.sign(fromV) * (Math.abs(toV) + 1);

        return to;
    }
}
