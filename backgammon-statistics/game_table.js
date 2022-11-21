class GameTable {
    constructor(parent_dom) {
        this.archive = [];
        this.history = [];

        this.saver = new GameSaver();

        this.template =
        `<h3>Игровая таблица</h3>
        <div class="game-table-scroll"><table class="table table-striped table-hover text-center" id="game_table">
        <thead class="head-center">
        <tr></tr></thead>
        <tbody></tbody></table></div>`;

        this.row_template =
        '<tr><td name="turn_id"><small class="text-muted"></small></td><td name="player_1_turn"></td><td name="player_2_turn"></td></tr>';

        this.edit_template = '<label class="label" '+
        'style="position: absolute;right: 5px;top: 0px;padding-inline: 15px;padding-block: 5px;"></label>'

        this.th_template = `<th data-toggle="popover" title="Помощь" data-content="
        <p><b>Esc, Enter, Ctrl+Shift+E</b> - выход</p>
        <p><b>Backspace</b> - удалить символ</p>
        <p><b>Shift+Backspace</b> - очистить поле</p>
        <p><b>Стрелки</b> - переместить редактируемую ячейку</p>
        <p><b>Ctrl+U</b> - поменять игроков местами</p>
        " data-html="true" data-animation="false" data-trigger="manual"></th>`

        this.parent_dom = parent_dom;
        this.players = ["Игрок 1", "Игрок 2"];

        this.startNewGame();
    }
    initGame = function() {
        this.history = [];
        this.edited_values = [];
        this.edit_index = 0;
        this.is_insert_mode = false;
        this.is_edit_mode = false;

        this.dom = $(this.template);
        this.edited_player = 0;

        this.parent_dom.empty();
        this.parent_dom.append(this.dom);
    }

    startNewGame = function() {
        if(this.history.length % 2 == 1) this.history.pop();
        if (this.history.length > 0) this.archive.push({players: this.getPlayers(), history: this.getHistory()});

        this.initGame();
    }

    insertValue = function(input) {
        if(this.isInsertMode()) {
            this.edited_values.push(input);
            if(this.edited_values.length == 2)
                this.history.splice(this.edit_index, 0, this.edited_values.pop(), this.edited_values.pop());
        }
        else if(this.isEditMode()) {
            this.edited_values.push(input);
            if(this.edited_values.length == 2)
                this.history.splice(this.edit_index, 2, this.edited_values.pop(), this.edited_values.pop());
        }
        else this.history.push(input);
    }

    removeValue = function() {
        if (this.isInsertMode() || this.isEditMode()) {
            if(this.edited_values[0]) this.edited_values.pop();
            else {
                this.history.splice(this.edit_index, 2);
                if (this.history.length == 0) this.exitModes()
                else if (this.edit_index >= this.history.length) this.moveEditedCell("left");
            }
        }
        else {
            this.history.pop();
            if(this.history.length % 2 == 1) this.history.pop();
        }
    }

    scrollToRow = function(row_index) {
        let scroll_position = Math.max(
            this.dom.find("tbody tr").height() * row_index + this.dom.find("th").offset().top - this.dom.last().height(), 0);
        this.dom.animate({
            scrollTop: scroll_position
        }, 50);
    }

    editPlayerName = function(eventKey) {
        if (47 < eventKey.keyCode && eventKey.keyCode < 91 || 180 < eventKey.keyCode && eventKey.keyCode < 221)
            this.players[this.edited_player - 1] += eventKey.key;
        if (eventKey.code == "Backspace" && !eventKey.shiftKey) {
            let lentgh = this.players[this.edited_player - 1].length;
            this.players[this.edited_player - 1] = this.players[this.edited_player - 1].slice(0, length - 1);
        }
        if (eventKey.code == "Backspace" && eventKey.shiftKey) this.players[this.edited_player - 1] = "";
    }

    renderHead = function() {
        let tr = this.dom.find("thead tr");
        tr.off("click", "span.glyphicon-refresh");
        tr.empty();

        let swap_th = $("<th><span data-toggle='popover' class='btn btn-default glyphicon glyphicon-refresh' style='padding-block:0px;'></span></th>");

        let handler = function(e) {
            this.swapPlayers();
            document.dispatchEvent(new Event("keydown"));
        }
        tr.append(swap_th).on("click", "span.glyphicon-refresh", handler.bind(this));

        this.players.forEach(player => tr.append($(this.th_template).text(player)));
        tr.find('[data-toggle ="popover"]').popover({placement: "bottom"});

        if(this.edited_player) tr.find(`th:nth-child(${this.edited_player + 1})`).addClass("success").popover("show");
    }

    renderTable = function() {
        let tbody = this.dom.find('tbody');
        tbody.empty();

        for(let i = 0; i < this.history.length; i += 4) {
            let row = $(this.row_template);

            row.find('[name="turn_id"] small').text(this.getRowIndex(i) + 1);
            row.find('[name="player_1_turn"]').text((this.history[i] || "") + " " + (this.history[i + 1] || ""));
            row.find('[name="player_2_turn"]').text((this.history[i + 2] || "") + " " + (this.history[i + 3] || ""));

            if ((this.isInsertMode() || this.isEditMode()) && (this.edit_index == i || this.edit_index == i + 2)) {
                let col = row.find(`td:nth-child(${2 + (this.edit_index - i) / 2})`);

                if (this.isInsertMode()) col.addClass("info");
                if (this.isEditMode()) col.addClass("success");

                if(this.edited_values.length == 1) {
                    if (this.isInsertMode()) col.append(this.renderEditField("label-info", this.edited_values[0]));
                    if (this.isEditMode()) col.append(this.renderEditField("label-success", this.edited_values[0]))
                }
            }

            tbody.append(row);
        }

        let row_to_scroll =  (this.isInsertMode() || this.isEditMode())
            ? this.getRowIndex(this.edit_index)
            : this.getRowIndex();

        this.scrollToRow(row_to_scroll);
    }

    renderEditField = function(_class, text) {
        let result = $(this.edit_template);
        result.addClass(_class);
        result.text(text);
        return result;
    }

    getHistory = function() {
        return Object.assign([], this.history);
    }

    getPlayers = function() {
        return Object.assign([], this.players);
    }

    getArchive = function() {
        return Object.assign([], this.archive);
    }

    switchInsertMode = function() {
        if (this.history.length == 0) return;
        let current = this.is_insert_mode;
        if (!this.is_edit_mode) this.edit_index = this.getLastIndex();

        this.exitModes();
        this.is_insert_mode = !current;
    }
    isInsertMode = function() { return this.is_insert_mode; }

    switchEditMode = function() {
        if (this.history.length == 0) return;
        let current = this.is_edit_mode;
        if (!this.is_insert_mode) this.edit_index = this.getLastIndex();

        this.exitModes();
        this.is_edit_mode = !current;

    }
    isEditMode = function() { return this.is_edit_mode; }

    switchEditPlayerMode = function() {
        let current = Math.sign(this.edited_player);
        this.exitModes();
        this.edited_player = 1 - current;
    }

    isEditPlayerMode = function() { return this.edited_player > 0; }
    swapPlayers = function() {
        let temp = this.players[0];
        this.players[0] = this.players[1];
        this.players[1] = temp;
    }
    getPlayers = function() {return this.players;}

    getLastIndex = function() { return (this.history.length - 1) - (this.history.length - 1) % 2; }

    getRowIndex = function(history_index) {
        let index = history_index == undefined ? this.getLastIndex() : history_index;
        return Math.floor(index / 4);
    }

    moveEditedCell = function(way) {
        if(this.edited_player) {
            if (way == "left") this.edited_player = 1;
            if (way == "right") this.edited_player = 2;
        }
        if (!this.isInsertMode() && !this.isEditMode()) return;

        if (way == "up") this.edit_index = Math.max(this.edit_index - 4, 0);
        if (way == "down") this.edit_index = Math.min(this.edit_index + 4, this.getLastIndex());
        if (way == "left") this.edit_index = Math.max(this.edit_index - 2, 0);;
        if (way == "right") this.edit_index = Math.min(this.edit_index + 2, this.getLastIndex());
    }

    exitModes = function(){
        this.is_insert_mode = false;
        this.is_edit_mode = false;
        this.edited_player = 0;
    }

    serializeSave = function() {
        let content = "";

        for (let game of this.archive)
            content += `${game.players.join(",")},${game.history.join(",")};\r\n`;

        content += `${this.players.join(",")},${this.history.join(",")}`;
        return content;
    }

    deserializeSave = function(content) {
        let games = content.split(";\r\n");
        let last_game = games.pop();

        for (let game of games) {
        let parsed_game = game.split(",");
        this.archive.push({players: [parsed_game[0], parsed_game[1]], history: parsed_game.slice(2).map(i => parseInt(i, 10))});
        }

        let parsed_game = last_game.split(",");
        this.players = [parsed_game[0], parsed_game[1]];
        this.history = parsed_game.slice(2).map(i => parseInt(i, 10));

        document.dispatchEvent(new Event("keydown"));
    }

    save = function(isForceNewFile) {
        isForceNewFile
            ? this.saver.saveToNewFile(this.serializeSave())
            : this.saver.saveToCurrentFile(this.serializeSave());
    }

    load = function(isJoinLoad) {
        if (isJoinLoad) {
            this.startNewGame();
        } else {
            this.archive = [];
            this.initGame();
        }
        this.saver.loadFromFile(this.deserializeSave.bind(this));
    }
}
