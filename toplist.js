let players = []

/**
 * Initalize toplist includes...:
 * +clearing
 * +add player
 * +show top 3 players
 * +show player in the bottom
 */
function init_toplist() {
    clear_toplist_view();

    init_players();

    add_player_to_toplist();

    show_toplist_top_three_players();
    show_toplist_current_player();
}

/**
 * get Players from localStorage
 */
function init_players() {
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
function add_player_to_toplist() {
    let player_name = document.getElementById('input-mezo').value;
    if (player_name.length === 0) player_name = "guest";

    console.log("player neve: " + player_name)

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
    let player_name = document.getElementById('input-mezo').value;
    if (player_name.length === 0) player_name = "guest";

    let player_point = calculate_player_point();

    let player = new Player(player_name, player_point);

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