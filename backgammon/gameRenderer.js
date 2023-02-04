class GameRenderer {

    constructor() {
        this.positions = [];
        this.positionTmpl = '<div class="position"><div class="left"></div><div class="right"></div></div>';
        this.markerTmpl = '<div class="left"></div><div class="right"></div>';
        this.whitePieceTmpl = '<div class="piece white-piece"></div>'
        this.blackPieceTmpl = '<div class="piece black-piece"></div>'

        this.stackSpace = 7;
    }

    init = function(boardDOM, pieceClickCallback) {
        this.boardDOM = boardDOM;
        this.pieceClickHandler = pieceClickCallback;
    }

    render = function(state, animations) {
        if(!animations) return this.renderState(state);

        let nextAnimation = undefined

        while(animations.length) {
            let animation = this.getAnimation(animations.pop());
            animation.onfinish = nextAnimation ? nextAnimation.play : this.renderState.bind(this, state);
            nextAnimation = animation;
        }

        nextAnimation.play();
    }

    getAnimation = function(ctx) {
        if (ctx["name"] == "movePiece") return this.movePieceAnimation(ctx["from"], ctx["to"]);
    }

    renderState = function(state) {
        this.positions.forEach(el => el.remove());
        this.positions = []

        state.getPositions().forEach(val => this.positions.push(this.createPosition(val)));

        this.boardDOM.find(".semi-board.left .quarter.top").empty().append(this.positions.slice(0, 6));
        this.boardDOM.find(".semi-board.right .quarter.top").empty().append(this.positions.slice(6, 12));
        this.boardDOM.find(".semi-board.right .quarter.bottom").empty().append(this.positions.slice(12, 18).reverse());
        this.boardDOM.find(".semi-board.left .quarter.bottom").empty().append(this.positions.slice(18, 24).reverse());


        this.boardDOM.find(".quarter.top .piece").each(
            (n, el) => $(el).css("top", `${this.stackSpace * ($(el).index() - 2)}%`)
        );
        this.boardDOM.find(".quarter.bottom .piece").each(
            (n, el) => $(el).css("bottom", `${this.stackSpace * ($(el).index() - 2)}%`)
        )
    }

    createPosition = function(val) {
        let position = $(this.positionTmpl);

        if(!val) return position;

        for (let j = 0; j < Math.abs(val); j++)
            position.append(
                (Math.sign(val) > 0
                    ? $(this.whitePieceTmpl)
                    : $(this.blackPieceTmpl)
                )
                .on("click", this.pieceClickHandler)
            );

        return position;
    }


    getPosition = function(pieceEl) {
        return this.positions.findIndex(p => p.find(pieceEl).length);
    }

    movePieceAnimation = function(from, to) {
        let boardBorderW = parseInt($(".semi-board").css("border-width"), 10);
        let el = this.positions[from].find(".piece:last-child()")[0];

        let fromP = this.positions[from];
        let toP = this.positions[to];

        let offsetX = toP.offset().left - fromP.offset().left;

        let offsetY = Math.sign(toP.offset().top - fromP.offset().top);
        if(offsetY) offsetY *= (Math.abs(toP.offset().top - fromP.offset().top) + toP.height() - $(el).height() - 0.5 * boardBorderW);

        //add stack offset
        let sign = fromP.parent().hasClass("top") ? -1 : 1;
        
        let stackOffset = fromP.height() * (this.stackSpace / 100) * ($(el).index() - 2);

        offsetY += stackOffset * sign;

        let keyFrames = new KeyframeEffect(
            el,
            [
              { transform: 'translate(0, 0)' },
              { transform: `translate(${offsetX}px, ${offsetY}px)` }
            ],
            { duration: 200, fill: 'forwards', easing: 'linear' }
          );

        return new Animation(keyFrames, document.timeline);
    }
}
