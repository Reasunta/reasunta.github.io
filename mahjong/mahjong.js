const generateRandomString = (length) => {
    let result = '';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

var model = {};
var keyboards = [$("#bamboo-keyboard"), $("#dot-keyboard"), $("#symbol-keyboard"), $("#wd-keyboard")];
var winds = ["wind-ost", "wind-south", "wind-west", "wind-north"];
var currBoard = 0;

var showBoard = function() {
    for(b in keyboards) { if (currBoard == b) {keyboards[b].show();} else {keyboards[b].hide();}}
}

var getLeftKeyboard = function() {
    currBoard = (currBoard + keyboards.length - 1) % keyboards.length
    showBoard();
}

var getRightKeyboard = function() {
    currBoard = (currBoard + 1) % keyboards.length
    showBoard();
}

var renderModel = function() {
    $(".screen").empty();
    $(".calculation-screen .lines").empty();
    lines = {};
    lines[model.currentLine] = [];

    for(item of model.items) {
        if(!lines.hasOwnProperty(item.line)) lines[item.line] = [];
        lines[item.line].push(item);
    }

    for(i in lines) {
        renderLine(lines[i], i==model.currentLine, model.isClosed[i], i);
        renderLineForCalculation(lines[i], model.isClosed[i]);
    };

    checkModel();
}

renderLine = function(line, isCurrent, isClosed, lineNumber) {
    let lineDOM = $('<div class="line"></div>').attr("line-number", lineNumber);
    if(isCurrent) lineDOM.addClass("current");
    for(el in line) {
        let itemDOM = $('<img class="imaged"/>');
        itemDOM.addClass(line[el].value);
        itemDOM.attr("data-id", line[el].id);
        itemDOM.on("click", removeTile);
        lineDOM.append(itemDOM);
    }

    let closeBtn = $('<button class="btn btn-default imaged closing" type="button" data-toggle="button"></button>')
    closeBtn.attr("line-number", lineNumber);
    if(isClosed) {
        closeBtn.append($('<span class="glyphicon glyphicon-eye-close"></span>'));
        closeBtn.addClass("active");
        closeBtn.attr("aria-pressed", "true");
    }
    else closeBtn.append($('<span class="glyphicon glyphicon-eye-open"></span>'));
    closeBtn.on("click", switchLineClosing);

    lineDOM.append(closeBtn);
    lineDOM.on("click", (el) => {
        model.currentLine = $(el.target).attr("line-number");
        renderModel();
    });

    $(".screen").append(lineDOM);
}

renderLineForCalculation = function(line, isClosed) {
    let lineDOM = $('<div class="calculated-line"></div>');
    for(el in line) {
        let itemDOM = $('<img class="imaged"/>');
        itemDOM.addClass(line[el].value);
        lineDOM.append(itemDOM);
    }

    $(".calculation-screen .lines").append(lineDOM);
}

checkModel = function() {
    $("button.calculate").prop("disabled", model.items.length < 13 || model.items.length > 18);
}

addTile = function(btn) {
    let value = btn.target.value;
    model.items.push({"value": value, "line": model.currentLine, "id":generateRandomString(7)});
    renderModel();
}

removeTile = function(img) {
    let itemId = $(img.target).attr("data-id");
    let removedItem = model.items.filter(el => el.id == itemId)[0];
    model.currentLine = removedItem.line;

    model.items = model.items.filter(el => el.id != itemId);

    renderModel();
}

switchLineClosing = function(el) {
    let lineNumber = parseInt($(el.target).attr("line-number"));
    model.isClosed[lineNumber] = !model.isClosed[lineNumber];

    renderModel();
}

saveLine = function() {
    let newLine = Math.max(...model.items.map(el => el.line)) + 1;
    if(newLine > 4) return;

    model.currentLine = model.items.length > 0 ? Math.max(...model.items.map(el => el.line)) + 1 : 0;
    model.isClosed[model.currentLine] = false;
    renderModel();
}

restart = function() {
    model = {items: [], currentLine: 0, isClosed: {0: false}};
    $(".calculation-screen").hide();
    $(".adding-screen").show();
    renderModel();
}

changeWind = function(el) {
    let currValue = el.target.value;
    let currIndex = winds.indexOf(currValue);
    let newValue = winds[(currIndex + 1) % winds.length];
    el.target.value = newValue;

    $(el.target).removeClass(currValue);
    $(el.target).addClass(newValue);

    calculateResults();
}

renderLineResults = function(result) {
    $(".calculation-screen .results").empty();
    $(".calculation-screen .line-scores").empty();
    for(i in result) {
        let span = result[i].isClosed
            ? '<span class="glyphicon glyphicon-eye-close"></span>'
            : '<span class="glyphicon glyphicon-eye-open"></span>';

        let closed = result[i].isPeng || result[i].isGang ? result[i].isClosed ? "Закрытый" : "Открытый" : "";
        let figure = result[i].isChou ? "Чоу" :
                    result[i].isPeng ? "Панг" :
                    result[i].isGang ? "Конг" :
                    result[i].isCouple ? "Пара" : "";

        let type = result[i].isOne ? "Единиц" :
                   result[i].isNine ? "Девяток" :
                   result[i].isDragon ? "Драконов" :
                   result[i].isOwnWind ? "Собственных Ветров" :
                   result[i].isSupremeWind ? "Преим. Ветров" :
                   result[i].isWind ? "Ветров" : ""                   ;

        let resultDOM = $(`<div class="line-result"><label>${span} ${closed} ${figure} ${type}</label></div>`);
        $(".calculation-screen .results").append(resultDOM);

        $(".calculation-screen .line-scores").append($(`<div class="line-score"><label>${result[i].score}</label></div>`))
    }
}

calculateResults = function() {
    let result = {lines: {}, total: {}};

    lines = {};
    for(item of model.items) {
        if(!lines.hasOwnProperty(item.line)) lines[item.line] = [];
        lines[item.line].push(item);
    }
    for(lineNum in lines) {
        result.lines[lineNum] = calculateLineResult(lines[lineNum], model.isClosed[lineNum]);
    }

    result.total.isPureSuite = model.items
        .map(i => i.value.split("-")[0])
        .filter(t => t != "dragon" && t != "wind")
        .every((t, i, arr) => t == arr[0]);
    result.total.hasOnlyDragonsOrWinds = model.items
        .map(i => i.value.split("-")[0])
        .every(t => t == "dragon" || t == "wind");
    result.total.hasDragonsOrWinds = model.items
         .map(i => i.value.split("-")[0])
         .some(t => t == "dragon" || t == "wind");

    renderLineResults(result.lines);
    calculateOptions(result);
    return result;
}

calculateOptions = function(results) {
    let resultList = Object.values(results.lines);
    let figuresCount = resultList.filter(r => {return r.isChou || r.isPeng || r.isGang}).length;
    let coupleCount = resultList.filter(r => {return r.isCouple}).length;
    let hasMahjong = figuresCount == 4 && coupleCount == 1;

    let options = {
        hasMahjong: hasMahjong,
        lastTileIsWall: $("input#lastTileIsWall")[0].checked,
        lastTileIsOnly: $("input#lastTileIsOnly")[0].checked,
        hasDragonFigure: resultList.filter(r => {return r.isDragon && (r.isPeng || r.isGang)}).length,
        hasWindFigure: resultList.filter(r => {return (r.isSupremeWind || r.isOwnWind) && (r.isPeng || r.isGang)}).length,
        hasClearTypeDW: results.total.isPureSuite && results.total.hasDragonsOrWinds && !results.total.hasOnlyDragonsOrWinds,
        hasClearType: results.total.isPureSuite && !results.total.hasDragonsOrWinds,
        hasNoCommons: resultList.every(r => (r.isOne || r.isNine || r.isDragon || r.isWind)) && resultList.some(r => (r.isOne || r.isNine)),
        hasNoSuites: resultList.every(r => (r.isDragon || r.isWind)),
        // for mahjong owner
        hasNoChou: hasMahjong && resultList.every(r => !r.isChou),
        hasNoScores: $("input#hasNoScores")[0].checked,
        finishWithFreeTile: $("input#finishWithFreeTile")[0].checked,
        finishWithLastTile: $("input#finishWithLastTile")[0].checked,
        stealOpenGang: $("input#stealOpenGang")[0].checked,
        hasThreeWinds: hasMahjong && resultList.filter(r => (r.isPeng || r.isGang) && r.isWind).length == 3 && resultList.filter(r => r.isCouple && r.isWind).length == 1,
        hasTwoDragons: hasMahjong && resultList.filter(r => (r.isPeng || r.isGang) && r.isDragon).length == 2 && resultList.filter(r => r.isCouple && r.isDragon).length == 1,
        oneStepToWin: $("input#oneStepToWin")[0].checked
    }

    let totalScore = resultList.reduce((sum, r) => sum + r.score, 0);
    renderOptions(options, totalScore);
}

var optionScores = {
   hasMahjong: 20,
   lastTileIsWall: 2,
   lastTileIsOnly: 2,
   hasDragonFigure: "x2",
   hasWindFigure: "x2",
   hasClearTypeDW: "x2",
   hasClearType: "x8",
   hasNoCommons: "x2",
   hasNoSuites: "x8",
   // for mahjong owner
   hasNoChou: "x2",
   hasNoScores: "x2",
   finishWithFreeTile: "x2",
   finishWithLastTile: "x2",
   stealOpenGang: "x2",
   hasThreeWinds: "x2",
   hasTwoDragons: "x2",
   oneStepToWin: "x2"
}

renderOptions = function(options, total) {
    if(options.hasMahjong) $(".mahjong-only").show(); else $(".mahjong-only").hide();

    for(key in options) {
        $(`input#${key}`).prop("checked", options[key] > 0);

        let score = options[key] > 0
            ?  /x\d+/.test(optionScores[key]) ? `x${+options[key] * +optionScores[key].replace("x", "")}` : optionScores[key]
            : "";

        $(`.calculation-screen label[for="${key}"]`).empty().append(score);

        if(/x\d+/.test(score)) total = total * +score.replace("x", "");
        else if (/\d+/.test(score)) total = total + score;
    }
    $("#totalScore").empty().append(total);
    return total;
}

calculateLineResult = function(line, isClosed) {
    let values = line.map(i => {
        let patterns = i.value.split("-");
        return {type: patterns[0], value: patterns[1]}
    });

    let isSameType = values.every(i => i.type == values[0].type);
    let isSameValue = values.every(i => i.value == values[0].value);
    let isSame = isSameValue && isSameType;
    let isNumericValue = values.every(i => i.value.match(/\d/));
    let isOrderedValue = isNumericValue &&
        values.every((item, index) => !values[index-1] || item.value - values[index-1].value == 1);

    let ownWind = $("button.own-wind").attr("value");
    let supremeWind = $("button.supreme-wind").attr("value");

    let result = {
        isSuite: isSameType && values[0].type in ["bamboo", "symbol", "dot"],
        type: isSameType && values[0].type,
        isCouple: isSame && values.length == 2,
        isPeng: isSame && values.length == 3,
        isGang: isSame && values.length == 4,
        isChou: isSameType && isOrderedValue && values.length == 3,
        isClosed: isClosed,
        isOne: isSame && (values[0].value == "1"),
        isNine: isSame && (values[0].value == "9"),
        isDragon: isSame && values[0].type == "dragon",
        isWind: isSame && values[0].type == "wind",
        isOwnWind: isSame && line[0].value == ownWind,
        isSupremeWind: isSame && line[0].value == supremeWind
    };

    let score =
        result.isCouple && (result.isOwnWind || result.isSupremeWind || result.isDragon) ? 2 :
        result.isClosed && result.isGang && (result.isWind || result.isDragon || result.isOne || result.isNine) ? 32 :
        result.isClosed && result.isGang ? 16 :
        !result.isClosed && result.isGang && (result.isWind || result.isDragon || result.isOne || result.isNine) ? 16 :
        !result.isClosed && result.isGang ? 8 :
        result.isClosed && result.isPeng && (result.isWind || result.isDragon || result.isOne || result.isNine) ? 8 :
        result.isClosed && result.isPeng ? 4 :
        !result.isClosed && result.isPeng && (result.isWind || result.isDragon || result.isOne || result.isNine) ? 4 :
        !result.isClosed && result.isPeng ? 2 :
        0;

    result.score = score;

    return result;
}
var test = {};

$(".add").on("click", addTile);
$(".save").on("click", saveLine);
$(".move-left").on("click", getLeftKeyboard);
$(".move-right").on("click", getRightKeyboard);
$(".own-wind").on("click", changeWind);
$(".supreme-wind").on("click", changeWind);

$(document).ready(restart);
$(".control-panel button.restart").on("click", restart);
$(".control-panel button.calculate").on("click", (el)=>{
    test = calculateResults();
    $(".calculation-screen").toggle();
    $(".adding-screen").toggle();

});
$(".calculation-screen div.checkbox").on("click", calculateResults);
