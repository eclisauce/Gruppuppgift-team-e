class Highscore {
    constructor() {
        this.scores = [];

        this.loadJSON();
    }
    loadJSON() {
        let that = this;
        $.getJSON('/json/highscore.json', function (data) {
            that.scores = data.scores;
        });
    }
    saveJSON() {
        JSON._save('highscore', {
            scores:this.scores.sort(function (a, b) {
                return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
            })
        });
    }
    renderScore() {
        let highscoreArea = $("#highscore");
        let html = "";
        highscoreArea.empty();
        //create "columns"
        highscoreArea.append('<div id="hsPosCol" class="col-2 p-0"><p class="text-right m-0">Position</p></div>')
        highscoreArea.append('<div id="hsBlankCol" class="col-1 p-0"></div>')
        highscoreArea.append('<div id="hsNameCol" class="col-6 p-0"><p class="m-0">Name</p></div>')
        highscoreArea.append('<div id="hsScoreCol" class="col-3 p-0"><p class="m-0">Score</p></div>')
        for (let i = 0; i < this.scores.length; i++) {
            $("#hsPosCol").append(`<p class="text-right m-0">${i+1}</p>`);
            $("#hsBlankCol").append('<p class="m-0">&nbsp;</p>');
            $("#hsNameCol").append(`<p class="m-0">${this.scores[i].name}</p>`);
            $("#hsScoreCol").append(`<p class="m-0">${this.scores[i].score}</p>`);
        }
    }
}

const HS = new Highscore();


function reloadAndRender(){
    HS.loadJSON();
    HS.renderScore();
}