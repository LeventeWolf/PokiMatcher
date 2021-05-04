let kartyak = [];
let felforditottak = [];

let felforditottak_db = 0;

function init_kartyak_tomb() {
    let index = 0;

    let kartyaszamok = [];
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
        kartyak[i].attr('id', i + 1);
    }

    enable_all_card_onClick();

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


function cardClick() {
    if (!check_victory() && !check_defeat()) {
        start_timer();
    }

    let card = $(this)

    if (!is_this_card_already_facing_up(felforditottak)) {
        face_up_card(card);
        felforditottak_db += 1;
        felforditottak.push(card);

        play_click_sound();
    }

    if (felforditottak_db === 2) {
        remove_all_card_onClick();

        if (is_flipped_cards_match(felforditottak[0], felforditottak[1])) {
            play_matched_sound();
            remove_onClick_from_matched_cards(felforditottak);
            add_matched_cards_new_look(felforditottak);
            enable_all_card_onClick();
            increment_matched_pokies();
            check_victory();

            felforditottak_db = 0;
            felforditottak = [];
        } else {
            setTimeout(function () {
                face_down_not_matched_cards(felforditottak);
                felforditottak_db = 0;
                felforditottak = [];
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

function start_timer() {
    if (timer_interval == null){
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

function is_card_facing_up(card){
    return card.attr('src') !== 'kepek/hatlap2.png';
}

function remove_all_card_onClick() {
    for (let card of kartyak) {
        remove_onClick(card);
    }
}

function enable_all_card_onClick(){
    for (let card of kartyak) {
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
    for (let kartya of kartyak) {
        game_area.append(kartya);
    }
}

function flip_on_cards() {
    for (let kartya of kartyak) {
        setTimeout(function () {
            face_up_card(kartya);
        }, 500);
    }
}

function flip_off_cards() {
    for (let kartya of kartyak) {
        setTimeout(function () {
            face_down_card(kartya);
        }, 2000);
    }
}

function face_down_card(card) {
    card.attr('src', 'kepek/hatlap2.png');
    card.removeClass('rotation');
    $('.card:hover').css({cursor: 'url(kepek/closed.png), auto'})
}

function face_up_card(card){
    var cardID = card.attr('szam');
    card.attr('src', 'kepek/pokimonok/kep' + cardID + '.png');
    card.addClass('rotation');
    $('.card:hover').css({cursor: 'url(kepek/half-open.png), auto'})
}