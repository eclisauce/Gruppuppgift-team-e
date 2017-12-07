class Highscore {
    renderScore() {
        $.getJSON('/highscore/highscore.json', function (data) {
            let names = $("#hsNames");
            let scores = $("#hsScores");

            names.empty();
            scores.empty();

            names.append('<p class="m-0">Name</p>');
            scores.append('<p class="m-0">Score</p>');

            $.each(data.scores, function (index, value) {
                names.append('<p class="m-0">' + this.name + '</p>');
                scores.append('<p class="m-0">' + this.score + '</p>');
            })
        })
    }
}

const HS = new Highscore();
HS.renderScore();
