class Highscore {
    constructor() {
        this.scores = [];
        //temp values for length of highscore and rendering
        this.maxScoreLength = 20;
        this.maxrenderHighscoreLength = 30;
    }

    //expects a object $.name and $.score like {name: "", score 0}
    //check if the new score can be added
    checkIfNewHighscore(data) {
      this.loadJSON();
        let worstScore = 0
        this.scores.length != 0 ? worstScore = this.scores[this.scores.length - 1].score : null;
        if (worstScore > data.score || this.scores.length < this.maxScoreLength) {
            this.addNewScore(data);
            return true;
        }
    }

    //add the new score
    addNewScore(data) {
        this.scores.push(data);
        delete data.color;
        this.sortScores();
        this.scores = this.scores.splice(0, this.maxScoreLength)
        this.saveJSON();
    }

    sortScores() {
        this.scores = this.scores.sort(function (a, b) {
            return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
        })
    }

    loadJSON(callbackFunc) {
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
        this.renderHighscore();

    }

    renderHighscore() {
        let highscoreArea = $("#highscore");
        let html = "";
        highscoreArea.empty();
        //create "columns"
        highscoreArea.append('<div id="hsPosCol" class="col-2 p-0"><p class="text-right m-0">Position</p></div>')
        highscoreArea.append('<div id="hsBlankCol" class="col-1 p-0"><p class="m-0">&nbsp;</p></div>')
        highscoreArea.append('<div id="hsNameCol" class="col-6 p-0"><p class="m-0">Name</p></div>')
        highscoreArea.append('<div id="hsScoreCol" class="col-3 p-0"><p class="m-0">Score</p></div>')
        for (let i = 0; i < this.maxrenderHighscoreLength; i++) {
            if (typeof this.scores[i] != 'undefined') {
                $("#hsPosCol").append(`<p class="text-right m-0">${i+1}</p>`);
                $("#hsBlankCol").append('<p class="m-0">&nbsp;</p>');
                $("#hsNameCol").append(`<p class="m-0">${this.scores[i].name}</p>`);
                $("#hsScoreCol").append(`<p class="m-0">${this.scores[i].score}</p>`);
            }
        }

    }
}
const highscore = new Highscore();

//TEST AND DEBUG AREA
function loadAndRender() {
    highscore.loadJSON();
    highscore.renderScore();
}

function newScore(object) {
    highscore.checkIfNewHighscore(object)
    loadAndRender();
}

loadAndRender();
