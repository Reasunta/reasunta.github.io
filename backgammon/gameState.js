class GameState {
    constructor() {
        this.positions = undefined;
        this.endPositions = {"white": null, "black": null};
        this.ways = {"white": null, "black": null};
    }

    init = function() {
        this.positions = new Array(24).fill(0);
    }

    setPositions = function(position_dict) {
        for(let i in position_dict)
            this.positions[i] = position_dict[i];
    }

    setEndPositions = function(end_positions) {
        for(let i in end_positions)
            this.endPositions[i] = end_positions[i];
    }

    setWays = function(ways) {
        for(let i in ways)
            this.ways[i] = ways[i];
    }

    getPositions = function() {
        return this.positions;
    }

    getTo = function(from, range) {
        let fromV = this.positions[from];
        let color = Math.sign(fromV) > 0 ? "white" : "black";

        return (24 + from + this.ways[color] * range) % 24;
    }

    isMovable = function(from, range) {
        let fromV = this.positions[from];
        if(fromV == 0) return false;

        let color = Math.sign(fromV) > 0 ? "white" : "black";

        //Check the edge of the board
        let rangeToEnd = this.endPositions[color] - from;
        if(rangeToEnd == 0) return false;

        if(Math.sign(rangeToEnd) != this.ways[color]) rangeToEnd += this.ways[color] * 24;
        if (range > Math.abs(rangeToEnd)) return false;

        //Ckeck opposite pieces
        let to = this.getTo(from, range);
        let toV = this.positions[to];

        if(fromV * toV < 0) return false;

        return true;
    }

    move = function(from, to) {
        let fromV = this.positions[from];
        let toV = this.positions[to];

        this.positions[from] = Math.sign(fromV) * (Math.abs(fromV) - 1);
        this.positions[to] = Math.sign(fromV) * (Math.abs(toV) + 1);
    }
}
