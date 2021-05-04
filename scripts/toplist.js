let players = []

/**
 * Class that represents a Player
 * A player has: name, points
 */
class Player {
    constructor(player_name, point) {
        this.name = player_name;
        this.point = point;
    }
}

function init_toplist() {
    clear_toplist_view();

    add_player_to_localStorage();

    init_players_from_localStorage_in_ascending_order();

    show_toplist_top_three_players();
    show_toplist_current_player();

    function init_players_from_localStorage_in_ascending_order() {
        for (let i = 0; i < localStorage.length; i++) {
            let player = new Player(localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i))));
            players[i] = player;
        }
        players.sort(compare);

        function compare(player1, player2) {
            if (player1.point < player2.point) {
                return 1;
            } else if (player1.point > player2.point) {
                return -1
            } else {
                return 0;
            }
        }
    }
}

/**
 * Remove all child element from toplist (table)
 */
function clear_toplist_view() {
    let table = $('#ranglista');

    table.empty();

    table.append(
        $('<tr>' +
            '<th>Rank</th>' +
            '<th>Name</th>' +
            '<th>Point</th>' +
            '</tr>')
    );
}

/**
 * Store the player in localStorage
 * Overrides old points
 * */
function add_player_to_localStorage() {
    console.log(player_name);

    if (player_name.length === 0) player_name = "anonymus";

    let player_point = calculate_player_point();

    localStorage.setItem(player_name, player_point);
}

/**
 * Display the top 3 player in the toplist
 * */
function show_toplist_top_three_players() {
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
}

/**
 * Display the player point in the bottom of the toplist
 * */
function show_toplist_current_player() {
    if (player_name.length === 0) player_name = "guest";

    let player_point = calculate_player_point();

    let player = new Player(player_name, player_point);

    let player_rank = calculate_player_rank(player);

    $('#player-point-table').empty();
    let row = $('<tr class="row"></tr>')
    let rank = $('<td class="rank"></td>').append(player_rank + ".");
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

function calculate_player_rank(my_player) {
    let player_rank = 0;
    for (let other_player of players) {
        player_rank++;
        if (other_player.name === my_player.name) break;
    }

    return player_rank;
}