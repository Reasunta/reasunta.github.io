class GameState {
    constructor() {
        this.state = new Array(24).fill(0);
    }

    startNewGame = function() {
        for (let i = 0; i < 24; i++) this.state[i] = 0;
        this.state[23] = -15;
        this.state[11] = 15;
    }

    getState = function() {
        return this.state;
    }

    movePiece = function(from, to) {
        let fromV = this.state[from];
        let toV = this.state[to];

        if(fromV == 0) return 0;
        if(fromV * toV < 0) return 0;

        this.state[from] = Math.sign(fromV) * (Math.abs(fromV) - 1);
        this.state[to] = Math.sign(fromV) * (Math.abs(toV) + 1);

        return 1;
    }
}
