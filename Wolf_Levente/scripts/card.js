let cards = [];
let faced_up_cards = [];
let number_of_faced_up_cards = 0;

function init_cards() {
    give_all_cards_background_image_number();

    give_all_cards_unique_id();

    enable_all_card_onClick();

    shuffle(cards);

    /**
     * Shuffle Cards Array with The Fisher-Yates algorithm
     */
    function shuffle() {
        for (var i = 0; i < number_of_cards / 2; i++) {
            var index = i + Math.floor(Math.random() * (cards.length - i));

            var tmp = cards[i];
            cards[i] = cards[index];
            cards[index] = tmp;
        }
        return cards;
    }
}

function give_all_cards_background_image_number() {
    let index = 0;

    let card_numbers = [];
    while (card_numbers.length !== number_of_cards / 2) {
        var random_kepszam = Math.floor(Math.random() * (20)) + 1;

        if (!card_numbers.includes(random_kepszam)) {
            card_numbers.push(random_kepszam);
        }
    }

    for (let i = 0; i < card_numbers.length; i++) {
        card = $('<img src="kepek/hatlap2.png" class="card">');
        card2 = $('<img src="kepek/hatlap2.png" class="card">');

        card.attr('szam', card_numbers[i]);
        card2.attr('szam', card_numbers[i]);

        cards[index++] = card;
        cards[index++] = card2;
    }
}

function give_all_cards_unique_id() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].attr('id', i + 1);
    }
}

function cardClick() {
    if (!check_victory() && !check_defeat()) {
        start_timer();
    }

    if (!is_background_music_started) {
        start_background_music();
    }

    let card = $(this);

    if (!is_this_card_already_facing_up(faced_up_cards)) {
        face_up_card(card);
        number_of_faced_up_cards += 1;
        faced_up_cards.push(card);

        play_click_sound();
    }

    if (number_of_faced_up_cards === 2) {
        remove_all_card_onClick();

        if (is_flipped_cards_match(faced_up_cards[0], faced_up_cards[1])) {
            play_matched_sound();
            remove_onClick_from_matched_cards(faced_up_cards);
            add_matched_cards_new_look(faced_up_cards);
            enable_all_card_onClick();
            increment_matched_pokies();
            check_victory();

            number_of_faced_up_cards = 0;
            faced_up_cards = [];
        } else {
            setTimeout(function () {
                face_down_not_matched_cards(faced_up_cards);
                number_of_faced_up_cards = 0;
                faced_up_cards = [];
                enable_all_card_onClick();
            }, 1000);
        }
    }

    function play_matched_sound() {
        click_sound = new sound("media/matched.mp3")
        click_sound.sound.volume = 0.3;
        click_sound.play();
    }

    /**
     * @returns true if the two flipped card match else false
     */
    function is_flipped_cards_match(card1, card2) {
        return card1.attr('szam') === card2.attr('szam');
    }


    function play_click_sound() {
        click_sound = new sound("media/click.mp3")
        click_sound.sound.volume = 0.3;
        click_sound.play();
    }

    function remove_onClick_from_matched_cards(matched_cards) {
        remove_onClick(matched_cards[0]);
        remove_onClick(matched_cards[1]);
    }

    function face_down_not_matched_cards(not_matched_cards) {
        face_down_card(not_matched_cards[0]);
        face_down_card(not_matched_cards[1]);
    }

    function is_this_card_already_facing_up(matched_cards) {
        if (matched_cards.length === 0) return false;

        return card.attr('id') === matched_cards[0].attr('id');
    }
}

function start_background_music() {
    background_sound = new sound("media/music.mp3");
    background_sound.play();
    is_background_music_started = true;
}

function start_timer() {
    if (timer_interval == null) {
        timer_interval = setInterval(function () {
            $('#timer').text('Time left: ' + --seconds);
            check_defeat();
        }, 1000);

    }
}

/**
 * Add blue border & Change cursor to closed pokemon ball
 * @param matched_cards
 */
function add_matched_cards_new_look(matched_cards) {
    matched_cards[0].css({border: '3px solid #9ecaed'});
    matched_cards[1].css({border: '3px solid #9ecaed'});

    matched_cards[0].css({cursor: 'url(kepek/closed.png), auto'})
    matched_cards[1].css({cursor: 'url(kepek/closed.png), auto'})
}

function is_card_facing_down(card) {
    return card.attr('src') === 'kepek/hatlap2.png';
}

function is_card_facing_up(card) {
    return card.attr('src') !== 'kepek/hatlap2.png';
}

function remove_all_card_onClick() {
    for (let card of cards) {
        remove_onClick(card);
    }
}

function enable_all_card_onClick() {
    for (let card of cards) {
        if (is_card_facing_down(card))
            enable_onClick(card);
    }
}

function enable_onClick(card) {
    card.on('click', cardClick);
}

function remove_onClick(card) {
    card.on("click", null).off("click");
}

/**
 * Display all the cards in the game_area
 */
function show_cards() {
    for (let card of cards) {
        game_area.append(card);
    }
}

function flip_on_cards() {
    for (let card of cards) {
        setTimeout(function () {
            face_up_card(card);
        }, 500);
    }
}

function flip_off_cards() {
    for (let card of cards) {
        setTimeout(function () {
            face_down_card(card);
        }, 2000);
    }
}

function face_down_card(card) {
    card.attr('src', 'kepek/hatlap2.png');
    card.removeClass('rotation');
    $('.card:hover').css({cursor: 'url(kepek/closed.png), auto'})
}

function face_up_card(card) {
    var cardID = card.attr('szam');
    card.attr('src', 'kepek/pokimonok/kep' + cardID + '.png');
    card.addClass('rotation');
    $('.card:hover').css({cursor: 'url(kepek/half-open.png), auto'})
}