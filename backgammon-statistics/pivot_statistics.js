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

        this.isStackedMode = false;
        this.chart = this.initRollFreqChart('rollFrequencyChart');
    }

    initRollFreqChart = function(canvas_id) {
        this.dom.find("div[name='rollFrequency'] span.glyphicon").on("click", function(e){
            this.isStackedMode = !this.isStackedMode;
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
        let labels = [];

        if (this.isStackedMode) {
            return [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24];
        }
        else {
            for (let i = 1; i < 7; i++)
                for(let j = i; j < 7; j++)
                    labels.push(`${i} ${j}`)
        }

        return labels;
    }

    countRollFrequencies = function() {
        let result = new Array(21).fill(0);
        let expected = new Array(21).fill(0);
        let doubles_indices = [0,6,11,15,18,20];
        let total_roll_count = 0;

        this.data.forEach(function(game) {
            for(let i = 0; i < game.history.length; i += 2) {
                let a = game.history[i];
                let b = game.history[i + 1] || 0;
                let m = Math.min(a, b);
                let M = Math.max(a, b);

                result[M + (12 - m)*(m - 1) / 2 - 1]++;
                total_roll_count++;
            }
        })

        for(let i = 0; i < 21; i++)
            expected[i] = doubles_indices.includes(i) ? total_roll_count / 36 : total_roll_count / 18;

        return [result, expected];
    }

    countStackedRollFrequencies = function() {
        let result = new Array(13).fill(0);
        let expected = [2, 3, 4, 4, 6, 5, 4, 2, 2, 1, 1, 1, 1];
        let doubles_indices = [0,6,11,15,18,20];
        let total_roll_count = 0;

        this.data.forEach(function(game) {
            for(let i = 0; i < game.history.length; i += 2) {
                let s = game.history[i] + (game.history[i + 1] || 0);
                if(game.history[i] == game.history[i + 1]) s = 2 * s;

                result[s - 3 * Math.max(s / 4 - 2, 1)]++;
                total_roll_count++;
            }
        })

        for(let i = 0; i < 13; i++)
            expected[i] = total_roll_count * expected[i] / 36;

        return [result, expected];
    }

    render = function(data) {
        if(data) this.data = data;
        let [result, expected] = this.isStackedMode
            ? this.countStackedRollFrequencies()
            : this.countRollFrequencies();

        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets[1].data = result;
        this.chart.data.datasets[0].data = expected;
        this.chart.update();

        this.dom.find("span.mode_title").text(this.isStackedMode ? "по сумме броска" : "по цифрам броска")
    }

    resize = function(e) {
        this.chart.resize();
    }
}
