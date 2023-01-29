class GameState {
    constructor() {
        this.state = new Array(24).fill(0);
    }

    startNewGame = function() {
        for (let i = 0; i < 24; i++) this.state[i] = 0;
        this.state[23] = -1;
        this.state[22] = -1;
    }

    getState = function() {
        return this.state;
    }

    movePiece = function(from, to) {
        let fromV = this.state[from];
        let toV = this.state[to];

        if(fromV == 0) return;
        if(fromV * toV < 0) return;

        this.state[from] = Math.sign(fromV) * (Math.abs(fromV) - 1);
        this.state[to] = Math.sign(fromV) * (Math.abs(toV) + 1);
    }
}
