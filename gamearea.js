/**
 * Név: WOLF LEVENTE
 * Neptun/hxxx azonosító: h053957
 */


let kartyaszam = 6; // restar_game()-ben is át kell írni
let matched = 0;

let timer_interval;
let seconds = 10; // restar_game()-ben is át kell írni

let game_area;

$(document).ready(function () {
    play_game()

    $('#restart').click(function () {
        restart_game();
        play_game();
    });
});

function play_game() {
    game_area = $('#gameArea');

    init_game_area();
}

function restart_game() {
    kartyak = [];
    kartyaszam = 6;
    matched = 0;

    clearInterval(timer_interval);
    timer_interval = null;
    seconds = 10;
    $('#timer').text('Time left: ' + seconds);

    game_area = $('#gameArea');
    game_area.empty($('img'))
    game_area.append('<div id="restart">Restart</div>')

    $('#end-status-wrapper').hide();
    $('#input-wrapper').show();

    $('#restart').click(function () {
        restart_game();
        play_game();
    });
}

function init_game_area() {
    init_timer();
    init_matched_pokies();

    init_background_music(); //TODO BUGFIX

    init_kartyak_tomb();
    show_cards();

    flip_on_cards();
    flip_off_cards();

    start_timer_if_clicked_on_card();

    function init_timer() {
        $('#timer').text('Time left: ' + seconds)
    }

    function init_matched_pokies() {
        $('#matched').text('Matched Pokies: ' + matched)

    }

    function init_background_music() {
        var aud = document.getElementById("background_music");
        aud.volume = 0.5;
    }
}

function start_timer_if_clicked_on_card() {
    $('.kartya').click(function () {
        if (timer_interval == null){
            timer_interval = setInterval(function () {
                $('#timer').text('Time left: ' + --seconds);
                //If time is up
                if (seconds <= 0) {
                    defeat();
                    clearInterval(timer_interval);
                }

            }, 1000);
        }
    });



}

function defeat() {
    show_defeat();

    init_toplist();

    remove_all_card_onClick();
    flip_on_cards();

    function show_defeat() {
        $('#timer').text('Time is over!');
        $('#input-wrapper').hide();
        $('#end-status-wrapper').show();
        $('#defeat').show();
        $('#victory').hide();
    }
}

function victory() {
    init_toplist();

    show_victory();

    clearInterval(timer_interval);

    kartyak = [];

    function show_victory() {
        $('#end-status-wrapper').show();
        $('#victory').show();
        setInterval(function () {
            $('#victory').animate({width: '50%'}, 500).animate({width: '40%'}, 500);
        }, 500);
        $('#defeat').hide();
        $('#input-wrapper').hide();
        $('#toplista').show();
    }
}

function check_victory() {
    if (matched === kartyaszam / 2) {
        victory();
    }
}

function increment_matched_pokies() {
    $('#matched').text('Matched Pokies: ' + ++matched);
}

/**
 * Class that represents a Player
 * Which has: name, points
 */
class Player {
    constructor(player_name, point) {
        this.name = player_name;
        this.point = point;
        // this.seconds_left = seconds_left;
        // this.matched_pokimons = matched_pokimons;
    }
}