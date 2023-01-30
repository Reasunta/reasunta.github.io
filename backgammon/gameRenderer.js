class GameRenderer {
    constructor(boardDOM, pieceClickHandler) {
        this.boardDOM = boardDOM;
        this.positions = [];
        this.positionTmpl = '<div class="position"></div>';
        this.markerTmpl = '<div class="left"></div><div class="right"></div>';
        this.whitePieceTmpl = '<div class="piece white-piece"></div>'
        this.blackPieceTmpl = '<div class="piece black-piece"></div>'

        this.pieceClickHandler = pieceClickHandler;

        this.stackSpace = 7;
    }

    renderNewGame = function(state) {
        this.positions = [];
        for (let i = 0; i < 24; i++) this.positions.push($(this.positionTmpl).append($(this.markerTmpl)));

        this.boardDOM.find(".semi-board.left .quarter.top").empty().append(this.positions.slice(0, 6));
        this.boardDOM.find(".semi-board.right .quarter.top").empty().append(this.positions.slice(6, 12));
        this.boardDOM.find(".semi-board.right .quarter.bottom").empty().append(this.positions.slice(12, 18).reverse());
        this.boardDOM.find(".semi-board.left .quarter.bottom").empty().append(this.positions.slice(18, 24).reverse());

        this.renderState(state);
    }

    renderState = function(state) {
        for(let i = 0; i < 24; i++) {
            this.positions[i].empty().append($(this.markerTmpl));
            if(state[i]) {
                for (let j = 0; j < Math.abs(state[i]); j++)
                    this.positions[i].append(this.renderPiece(Math.sign(state[i])))
            };
        }

        this.boardDOM.find(".quarter.top .piece").each(
            (n, el) => $(el).css("top", `${this.stackSpace * ($(el).index() - 2)}%`)
        );
        this.boardDOM.find(".quarter.bottom .piece").each(
            (n, el) => $(el).css("bottom", `${this.stackSpace * ($(el).index() - 2)}%`)
        )

    }

    renderPiece = function(color) {
        let result = (color > 0) ? $(this.whitePieceTmpl) : $(this.blackPieceTmpl);
        return result.on("click", this.pieceClickHandler);
    }

    getCurrentIndex = function(pieceEl) {
        return this.positions.findIndex(p => p.find(pieceEl).length);
    }

    movePiece = function(el, from, to, state) {
        let boardBorderW = parseInt($(".semi-board").css("border-width"), 10);

        let fromP = this.positions[from];
        let toP = this.positions[to];

        let offsetX = toP.offset().left - fromP.offset().left;

        let offsetY = Math.sign(toP.offset().top - fromP.offset().top);
        if(offsetY) offsetY *= (Math.abs(toP.offset().top - fromP.offset().top) + toP.height() - $(el).height() - 0.5 * boardBorderW);

        //add stack offset
        let sign = Math.sign(fromP.offset().top - this.boardDOM.height() / 2)

        let stackOffset = fromP.height() * (this.stackSpace / 100) * ($(el).index() - 2);
        console.log(stackOffset)
        console.log(sign)

        offsetY += stackOffset * sign;

        let keyFrames = new KeyframeEffect(
            el,
            [
              { transform: 'translate(0, 0)' },
              { transform: `translate(${offsetX}px, ${offsetY}px)` }
            ],
            { duration: 200, fill: 'forwards', easing: 'linear' }
          );

        let animation = new Animation(keyFrames, document.timeline);

        animation.onfinish = this.renderState.bind(this, state);
        animation.play();
    }


}
