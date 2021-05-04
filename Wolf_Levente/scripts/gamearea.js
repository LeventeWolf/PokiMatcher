/**
 * Név: WOLF LEVENTE
 * Neptun/hxxx azonosító: h053957
 */


let kartyaszam;
let matched;

let timer_interval;
let seconds;

let game_area;

var victory_sound;
var click_sound;
var defeat_sound;
var background_sound;

let player_name;

var is_background_music_started = false;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function init_sound() {
    defeat_sound = new sound("media/defeat.mp4")
    victory_sound = new sound("media/victory.mp4")
}

$(document).ready(function () {
    play_game()
});

function play_game() {
    kartyaszam = 4;
    matched = 0;
    seconds = 15;
    cards = [];

    $('#restart').on('click', restartClick);
    game_area = $('#gameArea');

    init_game_area();

    init_sound();

    init_player_name();

    show(player_name);

    init_toplist();

    function show(player_name) {
        $('#player-name').text(player_name);
    }

    function init_toplist() {
        clear_toplist_view();

        init_players_from_localStorage_in_ascending_order();

        show_toplist_top_three_players();
    }
}

function init_player_name() {
    player_name = prompt("Adja meg a nevét:", "anonymus");
}

function restartClick() {
    victory_sound.stop();
    defeat_sound.stop();

    reset_timer();

    clear_game_area();

    $('#end-status-wrapper').hide(); //hide end-status (victory/defeat)

    $('#input-wrapper').show();      //show enter your name field
    play_game(); //start the game again

    background_sound.stop();

    is_background_music_started = false;

    /**
     * clear timer interval
     */
    function reset_timer() {
        clearInterval(timer_interval);
        timer_interval = null;
    }

    function clear_game_area() {
        game_area.empty($('img'))         //remove all img from the game
        game_area.append('<div id="restart">Restart</div>') //add restart again
    }
}

function init_game_area() {
    init_timer_label();
    init_matched_pokies_label();

    init_cards();

    show_cards();

    // flip_on_cards();
    // flip_off_cards();

    function init_timer_label() {
        $('#timer').text('Time left: ' + seconds)
    }

    function init_matched_pokies_label() {
        $('#matched').text('Matched Pokies: ' + matched)

    }
}

function defeat() {
    defeat_sound.play();
    background_sound.stop();
    is_background_music_started = false;

    init_toplist();

    remove_all_card_onClick();
    flip_on_cards();

    clearInterval(timer_interval);
    timer_interval = null;

    cards = [];

    show_defeat();

    function show_defeat() {
        $('#end-status-wrapper').show();
        $('#end-status-wrapper').empty();
        let defeat = $('<img src="kepek/defeat.png" id="defeat" alt="defeat.png"/>');
        $('#end-status-wrapper').append(defeat);
        setInterval(function () {
            $('#defeat').animate({width: '50%'}, 500).animate({width: '40%'}, 500);
        }, 500);

        $('#timer').text('Time is over!');
        $('#input-wrapper').hide();
    }
}

function check_defeat() {
    if (seconds <= 0) {
        clearInterval(timer_interval);
        defeat();
    }
}

function victory() {
    victory_sound.play();
    background_sound.stop();
    is_background_music_started = false;


    init_toplist();

    show_victory();

    clearInterval(timer_interval);
    timer_interval = null;

    cards = [];

    function show_victory() {
        $('#end-status-wrapper').show();
        $('#end-status-wrapper').empty();
        let victory = $('<img src="kepek/victroy.png" id="victory" alt="victroy.png"/>');
        $('#end-status-wrapper').append(victory);
        setInterval(function () {
            $('#victory').animate({width: '50%'}, 500).animate({width: '40%'}, 500);
        }, 500);
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