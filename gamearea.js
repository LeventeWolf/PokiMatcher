/**
 * Név: WOLF LEVENTE
 * Neptun/hxxx azonosító: h053957
 */

let kartyak = [];

let kartyaszam = 4;
let matched = 0;

let timer_interval;
let seconds = 100;

let players = [];

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
    kartya_onclick();

    var aud = document.getElementById("background_music");
    aud.volume = 0.5;

    function kartya_onclick() {
        let felforditottak_db = 0;
        let felforditott_kartyak = [];

        for (let i = kartyak.length - 1; i >= 0; i--) {
            let kartya = kartyak[i];
            kartya.click(function () {
                if (felforditottak_db === 0) {
                    kartyat_felfordit(kartya);
                    kartya.css({cursor: 'url(kepek/half-open.png), auto'});
                    felforditottak_db++;
                    felforditott_kartyak.push(kartya);
                } else if (felforditottak_db === 1 && !is_sajat_maga(kartya, felforditott_kartyak[0])) {
                    kartyat_felfordit(kartya);
                    felforditottak_db++;
                    felforditott_kartyak.push(kartya);
                }

                if (felforditottak_db === 2) {
                    setTimeout(function () {
                        kartyat_lefordit(felforditott_kartyak[0]);
                        kartyat_lefordit(felforditott_kartyak[1]);

                        //ha a párját fordította meg
                        if (is_felforditott_match(felforditott_kartyak[0], felforditott_kartyak[1])) {
                            let kartyaszam = felforditott_kartyak[0].attr('szam');
                            matched_kartya_formazas(felforditott_kartyak[0]);
                            matched_kartya_formazas(felforditott_kartyak[1]);
                            $('#matched').text('Matched Pokies: ' + ++matched);
                            remove_kartyapar(kartyaszam);
                            felforditott_kartyak[0].css({cursor: 'url(kepek/closed.png), auto'})
                            felforditott_kartyak[1].css({cursor: 'url(kepek/closed.png), auto'})


                        }
                        felforditottak_db = 0;
                        felforditott_kartyak = [];
                    }, 1000);
                }
            });
        }


    }
}

function restart_game() {
    kartyak = [];
    kartyaszam = 4;
    matched = 0;

    clearInterval(timer_interval);
    timer_interval = null;
    seconds = 100;
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
    init_game_info();
    init_kartyak_tomb();

    flip_on_cards();
    flip_off_cards();

    kartyak_kirajzolasa();

    $('.kartya').click(function () {
        if (timer_interval == null) start_timer();
    });

    function init_kartyak_tomb() {
        let index = 0;

        var kartyaszamok = [];
        while (kartyaszamok.length !== kartyaszam / 2) {
            var random_kepszam = Math.floor(Math.random() * (20)) + 1;

            if (!kartyaszamok.includes(random_kepszam)) {
                kartyaszamok.push(random_kepszam);
            }
        }

        for (let i = 0; i < kartyaszamok.length; i++) {
            kartya = $('<img src="kepek/hatlap2.png" class="kartya">');
            kartya2 = $('<img src="kepek/hatlap2.png" class="kartya">');

            kartya.attr('szam', kartyaszamok[i]);
            kartya2.attr('szam', kartyaszamok[i]);

            kartyak[index++] = kartya;
            kartyak[index++] = kartya2;
        }

        //Az összes kártyához egyedi azonosító rendelése, oka: ellenőrzés hogy saját magára ne kattinstunk
        for (let i = 0; i < kartyak.length; i++) {
            kartyak[i].attr('id', i);
        }

        shuffle(kartyak);

        /**
         * Shuffle Cards Array with The Fisher-Yates algorithm
         */
        function shuffle() {
            for (var i = 0; i < kartyaszam / 2; i++) {
                // random tömbelem kiválasztása
                var index = i + Math.floor(Math.random() * (kartyak.length - i));
                // felcserélés az aktuális indexű elemmel
                var tmp = kartyak[i];
                kartyak[i] = kartyak[index];
                kartyak[index] = tmp;
            }
            return kartyak;
        }
    }

    function init_game_info() {
        $('#timer').text('Time left: ' + seconds)
        $('#matched').text('Matched Pokies: ' + matched)
    }

    function flip_on_cards() {
        for (let kartya of kartyak) {
            setTimeout(function () {
                kartyat_felfordit(kartya);
            }, 500);
        }
    }

    function flip_off_cards() {
        for (let kartya of kartyak) {
            setTimeout(function () {
                kartyat_lefordit(kartya);
            }, 2000);
        }
    }
}

function start_timer() {
    timer_interval = setInterval(function () {
        $('#timer').text('Time left: ' + --seconds);
        //If time is up
        if (seconds <= 0) {
            defeat();
            clearInterval(timer_interval);
        }

    }, 1000);
}

function defeat() {
    function show() {
        $('#timer').text('Time is over!');
        $('#input-wrapper').hide();
        $('#end-status-wrapper').show();
        $('#defeat').show();
        $('#victory').hide();
    }

    add_player_to_toplist();

    show();
}

function victory() {
    add_player_to_toplist();

    show();

    console.log(players)

    clearInterval(timer_interval);

    kartyak = [];

    function show() {
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

function is_sajat_maga(kartya1, kartya2) {
    return kartya1.attr('id') === kartya2.attr('id');
}

function remove_kartyapar(szam) {
    for (let i = kartyak.length - 1; i >= 0; i--) {
        let kartya = kartyak[i];
        let kartyaszam = kartya.attr('szam');
        if (kartyaszam === szam) {
            kartyat_felfordit(kartyak[i]);
            kartyak.splice(i, 1);
        }
    }

    if (kartyak.length === 0) victory();
}

function matched_kartya_formazas(kartya) {
    kartya.css({border: '3px solid #9ecaed'});
}

function is_felforditott_match(kartya1, kartya2) {
    return kartya1.attr('szam') === kartya2.attr('szam');
}

function kartyat_felfordit(kartya) {
    var kepszam = kartya.attr('szam');
    kartya.attr('src', 'kepek/pokimonok/kep' + kepszam + '.png');
    kartya.addClass('rotation');
    $('.kartya:hover').css({cursor: 'url(kepek/open.png), auto'})
}

function kartyat_lefordit(kartya) {
    kartya.attr('src', 'kepek/hatlap2.png');
    kartya.removeClass('rotation');
    $('.kartya:hover').css({cursor: 'url(kepek/half-open.png), auto'})
}

function kartyak_kirajzolasa() {
    for (let kartya of kartyak) {
        game_area.append(kartya);
    }
}

function add_player_to_toplist() {

    /**
     * Class that represents a Player
     * Which has: name, points
     */
    class Player {
        constructor(name, point) {
            this.name = player_name;
            this.point = point;
            // this.seconds_left = seconds_left;
            // this.matched_pokimons = matched_pokimons;
        }
    }

    let player_name = document.getElementById('input-mezo').value;
    let player_point = calculate_player_point();

    let player = new Player(player_name, player_point);
    players.push(player)

    function compare(player1, player2) {
        if (player1.point < player2.point) {
            return 1;
        } else if (player1.point > player2.point) {
            return -1
        } else {
            return 0;
        }
    }


    let table = $('#ranglista');

    table.empty();

    table.append(
        $('<tr>' +
            '<th>Rank</th>' +
            '<th>Name</th>' +
            '<th>Point</th>' +
          '</tr>')
    );

    players.sort(compare);

    for (let i = 0; i < players.length; i++) {
        if (i === 3) break;
        let player_rank = i + 1;
        let player = players[i];
        let row = $('<tr class="row"></tr>')
        let rank = $('<td class="rank"></td>').append(player_rank.toString() + ".");
        let name = $('<td class="name"></td>').append(player.name);
        let point = $('<td class="point"></td>').append(player.point);

        row.append(rank).append(name).append(point)
        $('#ranglista').append(row);
    }

    let player_rank = 0;
    for (let $player of players) {
        player_rank++;
        if ($player.name === player_name) break;
    }

    $('#player-point-table').empty();
    let row = $('<tr class="row"></tr>')
    let rank = $('<td class="rank"></td>').append(player_rank.toString() + ".");
    let name = $('<td class="name"></td>').append(player.name);
    let point = $('<td class="point"></td>').append(player.point);

    row.append(rank).append(name).append(point)
    $('#player-point-table').append(row)

}

/**
 * Calculates the player point
 * point = time_left * matched_pokimons
 * if the player runs out of time: time_left = 1
 * */
function calculate_player_point() {
    let second_left = seconds === 0 ? 1 : seconds;
    return second_left * matched;
}