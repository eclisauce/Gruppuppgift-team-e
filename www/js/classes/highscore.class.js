class Highscore {
    constructor() {
        this.scores = [];

        //temp values
        this.scoreLength = 20;
        this.renderScoreLength = 30;

        this.loadJSON();
        this.renderScore();
    }

    //expects a object $.name and $.score like {name: "", score 0}
    addScore(data) {
        //check if we're better than the last, if so just add and sort
        if (this.scores[this.scores.length - 1].score > data.score || this.scores.length < this.scoreLength) {
            this.scores.push(data);
            this.sortScores();
            this.scores = this.scores.splice(0, this.scoreLength)
            this.saveJSON();
            console.log("saving new hs");
        }
    }

    sortScores() {
        this.scores = this.scores.sort(function (a, b) {
            return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
        })
    }

    loadJSON() {
        let that = this;

        //we can't go async on this, since we need it before rendering
        $.ajaxSetup({
            async: false
        });

        $.getJSON('/json/highscore.json', function (data) {
            that.scores = data.scores;
        });

        //turn it on again
        $.ajaxSetup({
            async: true
        });
    }

    saveJSON() {
        JSON._save('highscore', {
            scores: this.scores
        });
    }

    renderScore() {
        let highscoreArea = $("#highscore");
        let html = "";
        highscoreArea.empty();
        //create "columns"
        highscoreArea.append('<div id="hsPosCol" class="col-2 p-0"><p class="text-right m-0">Position</p></div>')
        highscoreArea.append('<div id="hsBlankCol" class="col-1 p-0"><p class="m-0">&nbsp;</p></div>')
        highscoreArea.append('<div id="hsNameCol" class="col-6 p-0"><p class="m-0">Name</p></div>')
        highscoreArea.append('<div id="hsScoreCol" class="col-3 p-0"><p class="m-0">Score</p></div>')
        for (let i = 0; i < this.renderScoreLength; i++) {
            if (typeof this.scores[i] != 'undefined') {
                $("#hsPosCol").append(`<p class="text-right m-0">${i+1}</p>`);
                $("#hsBlankCol").append('<p class="m-0">&nbsp;</p>');
                $("#hsNameCol").append(`<p class="m-0">${this.scores[i].name}</p>`);
                $("#hsScoreCol").append(`<p class="m-0">${this.scores[i].score}</p>`);
            }
        }
    }
}
const HS = new Highscore();

//TEST AND DEBUG AREA
function reloadAndRender() {
    HS.loadJSON();
    HS.renderScore();
}

function save() {
    HS.saveJSON();
}