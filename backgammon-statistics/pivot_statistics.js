class PivotStatistics {
    constructor(parent_dom) {
        this.data = [];

        this.template =
        `<div class="row">
        <h3>Сводная статистика</h3>
        <div class="col-sm-6" name="rollFrequency">
        <h4>Распределение бросков (<span class="mode_title"></span>) <span class='btn btn-default glyphicon glyphicon-equalizer' style='padding-block:0px;'></span></h4>
        <canvas id="rollFrequencyChart"></canvas>
        </div>
        </div>`;


        this.dom = $(this.template);

        parent_dom.empty();
        parent_dom.append(this.dom);

        this.current_mode = 0;
        this.chart = this.initRollFreqChart('rollFrequencyChart');
    }

    initRollFreqChart = function(canvas_id) {
        this.dom.find("div[name='rollFrequency'] span.glyphicon").on("click", function(e){
            this.current_mode = (this.current_mode + 1) % 3;
            this.render();
        }.bind(this))

        let ctx = document.getElementById(canvas_id).getContext('2d');

        return new Chart(ctx, {
            data: {
                labels: this.getLabels(),
                datasets: [{
                    type: 'line',
                    label: 'Ожидание',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: []
                },{
                    type: 'bar',
                    label: 'Факт',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: []
                }]
            },

            options: {plugins: {legend: {display: true}}}
        });
    }

    getLabels = function() {
        return this.current_mode == 0
            ? [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24]
            : this.current_mode == 1
                ? ["1 1", "1 2", "1 3", "1 4", "1 5", "1 6", "2 2", "2 3", "2 4", "2 5", "2 6", "3 3", "3 4", "3 5", "3 6", "4 4", "4 5", "4 6", "5 5",  "5 6", " 6 6"]
                : [1, 2, 3, 4, 5, 6];
    }
    getTitle = function() {
        return this.current_mode == 0
            ? "по сумме броска"
            : this.current_mode == 1
                ? "по цифрам броска"
                : "по числам 1-6";
    }
    getExpected = function() {
        return this.current_mode == 0
            ? [2, 3, 4, 4, 6, 5, 4, 2, 2, 1, 1, 1, 1]
            : this.current_mode == 1
                ? [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 1]
                : [7, 7, 7, 7, 7, 7];
    }
    getGameHandler = function() {
        return this.current_mode == 0  ? this.countGameByRollSum
             : this.current_mode == 1  ? this.countGameByRoll
             : this.countGameByDice
    }

    countRollFrequencies = function(expected, game_handler) {
        let result = new Array(expected.length).fill(0)

        this.data.forEach(game => game_handler(game, result))
        let total_roll_count = result.reduce((a, b) => a + b, 0);

        for(let i = 0; i < expected.length; i++)
            expected[i] = total_roll_count * expected[i] / 36;

        return [result, expected];
    }

    countGameByRoll = function(game, result) {
        for(let i = 0; i < game.history.length; i += 2) {
            let m = Math.min(game.history[i], game.history[i + 1]);
            let M = Math.max(game.history[i], game.history[i + 1]);

            result[M + (12 - m)*(m - 1) / 2 - 1]++;
        }
    }

    countGameByRollSum = function(game, result) {
        for(let i = 0; i < game.history.length; i += 2) {
            let s = game.history[i] + game.history[i + 1];
            if(game.history[i] == game.history[i + 1]) s = 2 * s;

            result[s - 3 * Math.max(s / 4 - 2, 1)]++;
        }
    }

    countGameByDice = function(game, result) {
        game.history.forEach(i => result[i - 1]++)
    }

    render = function(data) {
        if(data) this.data = data;
        let [result, expected] = this.countRollFrequencies(this.getExpected(), this.getGameHandler());

        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets[1].data = result;
        this.chart.data.datasets[0].data = expected;
        this.chart.update();

        this.dom.find("span.mode_title").text(this.getTitle())
    }

    resize = function(e) {
        this.chart.resize();
    }
}
