var gameTable = undefined;
var gameStats = undefined;

init = function() {
    gameTable = new GameTable($('#game_table'));
    gameStats = new GameStatistics($('#stat_table'));

    render();

    initHelp();
}

$(document).ready(function(){
    let is_game_ended = 0;
    let directionKeys = {
        "ArrowUp": "up", "ArrowLeft": "left", "ArrowRight": "right", "ArrowDown": "down"
    };
    init();

    document.addEventListener("keydown", function(e) {
        console.log(e);

        if (e.code == "KeyH" && (e.ctrlKey || e.metaKey)) $(".glyphicon.glyphicon-info-sign").popover("toggle");
        if (e.code == "KeyU" && (e.ctrlKey || e.metaKey)) gameTable.swapPlayers();

        if (e.code == "KeyE" && (e.ctrlKey || e.metaKey) && e.shiftKey) gameTable.switchEditPlayerMode();
        if (e.code == "KeyI" && (e.ctrlKey || e.metaKey)) gameTable.switchInsertMode();
        if (e.code == "KeyE" && (e.ctrlKey || e.metaKey) && !e.shiftKey) gameTable.switchEditMode();

        if (e.code in directionKeys) gameTable.moveEditedCell(directionKeys[e.code]);
        if (e.code == "Escape" || e.code == "Enter") gameTable.exitModes();

        if (e.code == "KeyN" && (e.ctrlKey || e.metaKey) && e.shiftKey) gameTable.startNewGame();
        if (e.code == "KeyS" && (e.ctrlKey || e.metaKey) && e.shiftKey) { gameTable.save(true); e.preventDefault(); }
        if (e.code == "KeyS" && !(e.ctrlKey || e.metaKey) && e.shiftKey) { gameTable.save(false); e.preventDefault(); }
        if (e.code == "KeyL" && (e.ctrlKey || e.metaKey)) {gameTable.load(); return; }


        if(!gameTable.isEditPlayerMode()) {
            if (48 < e.keyCode && e.keyCode < 55) gameTable.insertValue(e.keyCode - 48);
            if (96 < e.keyCode && e.keyCode < 103) gameTable.insertValue(e.keyCode - 96);

            if (e.code == "Backspace") gameTable.removeValue();
        }
        else if (!e.ctrlKey && !e.metaKey){
            gameTable.editPlayerName(e);
        }

        render();

    }, false);
});

render = function() {
    gameTable.renderHead();
    gameTable.renderTable();
    gameStats.renderStatistics(gameTable.getPlayers(), gameTable.getHistory());
}

initHelp = function() {
    $(".glyphicon.glyphicon-info-sign").popover({
        trigger: "hover",
        title: "Помощь (<b>Сtrl+H</b>)",
        html: true,
        content: `<h5 class="text-center">Игра</h5>
        <p><b>Ctrl+L</b> - загрузить файл с партиями</p>
        <p><b>Ctrl+Shift+S</b> - сохранить новый файл с партиями</p>
        <p><b>Shift+S</b> - сохранить текущий файл с партиями</p>
        <p><b>Ctrl+Shift+N</b> - начать новую партию, сохранив текущую (в разработке)</p>
        <h5 class="text-center">Режимы</h5>
        <p><b>Ctrl+I</b> - вставка в любое место таблицы игры</p>
        <p><b>Ctrl+E</b> - редактирование таблицы игры</p>
        <p><b>Ctrl+Shift+E</b> - редактирование имен игроков</p>
        <p><b>Esc, Enter</b> - вставка и удаление из конца таблицы</p>
        `,
        placement: "bottom"
    });
}
