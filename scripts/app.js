let first_player, second_player, number_of_players, category, category_name, difficulty, user_answers = [],
    correct_answer_messages = [], incorrect_answer_messages = [],
    highscore = 0, width = 0, question_counter = 0, submit_clicked = 0,
    round = 1, question_counter_for_title = 0, elem = $('#bar'),
    question_area = $('#question-area');
number_of_points_first = $('#first-player-score').html(),
    run = $('#round'), number_of_points_second = $('#second-player-score').html(),
    points = $('<p>'), helper_counter = -1, questions = [], incorrect_answers = [],
    correct_answer = [], answer_selected = 0;

localStorage.setItem('highscore', 0);

$('input[name="number-of-players"]').change(function () {
    addAndRemoveClass('select-the-number-of-players', 'not-allowed', 'button');
});

$('input[name="category"]').change(function () {
    addAndRemoveClass('choose-category', 'not-allowed', 'button');
});

$('input[name="difficulty"]').change(function () {
    addAndRemoveClass('choose-difficulty', 'not-allowed', 'button');
});

$('input[name="name"]').on('keyup', function () {
    if (number_of_players == 1)
        $('#first-player').val().length > 0 ? addAndRemoveClass('enter-player-names', 'not-allowed', 'button') : addAndRemoveClass('enter-player-names', 'button', 'not-allowed');
    else
        ($('#first-player').val().length !== 0 && $('#second-player').val().length !== 0) ? addAndRemoveClass('enter-player-names', 'not-allowed', 'button') : addAndRemoveClass('enter-player-names', 'button', 'not-allowed');
});

$('#select-the-number-of-players').on('click', function () {
    let parent_width = $('#number-of-players-section').parent().width();
    let width = $('#number-of-players-section').width();
    let left_width_to_parent = (parent_width - width) / 2;
    if ($('input[name=number-of-players]:checked').val() == 1) {
        number_of_players = 1;
        $('#number-of-players-section').animate({
            opacity: 'hide',
            right: left_width_to_parent + 'px',
        }, left_width_to_parent, 'linear', function () {
            $(this).remove();
            $('#player-names-section').fadeIn();
        });
        hideErrorsDiv();
    } else if ($('input[name=number-of-players]:checked').val() == 2) {
        number_of_players = 2;
        $('#number-of-players-section').animate({
            opacity: 'hide',
            right: left_width_to_parent + 'px',
        }, left_width_to_parent, 'linear', function () {
            $(this).remove();
            $('#player-names-section').fadeIn();
            $('#second-player-section').show();
        });
        hideErrorsDiv();
    } else {
        $('.errors').html('You must select the number of players, goofy!');
        $('.errors').css('visibility', 'visible');
    }
});

$('#player-names-form').on('submit', function (e) {
    e.preventDefault();
    let parent_width = $('#player-names-section').parent().width();
    let width = $('#player-names-section').width();
    let left_width_to_parent = (parent_width - width) / 2;
    if (number_of_players == 1) {
        if (!$('#first-player').val()) {
            $('.errors').html('You haven\'t forgottone your name, have you, silly?');
            $('.errors').css('visibility', 'visible');
        } else {
            hideErrorsDiv();
            first_player = $('#first-player').val();
            second_player = '';
            $('#player-names-section').animate({
                opacity: 'hide',
                right: left_width_to_parent + 'px',
            }, left_width_to_parent, 'linear', function () {
                $(this).remove();
                $('#category').fadeIn();
            });
            hideErrorsDiv();
        }
    } else {
        if (!$('#first-player').val() || !$('#second-player').val()) {
            $('.errors').html('Well, tell us who\'s playing versus who!');
            $('.errors').css('visibility', 'visible');
        } else {
            hideErrorsDiv();
            $('#second-player-section').show();
            first_player = $('#first-player').val();
            second_player = $('#second-player').val();
            $('#player-names-section').animate({
                opacity: 'hide',
                right: left_width_to_parent + 'px',
            }, left_width_to_parent, 'linear', function () {
                $(this).remove();
                $('#category').fadeIn();
            });
        }
    }
});

$('#choose-category').on('click', function () {
    let parent_width = $('#category').parent().width();
    let width = $('#category').width();
    let left_width_to_parent = (parent_width - width) / 2;
    category = $('input[name=category]:checked').val();
    if (category || category === '') {
        hideErrorsDiv();
        category_name = $('input[name=category]:checked').parent().next().html();
        $('#category').animate({
            opacity: 'hide',
            right: left_width_to_parent + 'px',
        }, left_width_to_parent, 'linear', function () {
            $(this).remove();
            $('#difficulty').fadeIn();
        });
    } else {
        $('.errors').html('Well, at least be courageous enough to select a category!');
        $('.errors').css('visibility', 'visible');
    }
});

$('#choose-difficulty').on('click', function () {
    difficulty = $('input[name=difficulty]:checked').val();
    if (difficulty) {
        hideErrorsDiv();
        getQuestions();
        $('#difficulty').animate({
            opacity: 'hide',
            right: '400px',
        }, 400, 'linear', function () {
            $(this).remove();
            if (second_player) {
                $('#second-player-score').show();
                $('#player-turn').show();
            }
            $('#player-turn').html('Player turn: ' + first_player);
            $('#player-one-name').html(first_player);
            $('#player-two-name').html(second_player);
            $('#category-section').html('Category: ' + category_name);
            $('#difficulty-section').html('Difficulty: ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
            $('#category-section').show();
            $('#difficulty-section').show();
            $('#quiz').fadeIn();
        });
    } else {
        $('.errors').html('Well, you cannot play on a non-existent difficulty!');
        $('.errors').css('visibility', 'visible');
    }
});

function hideErrorsDiv() {
    $('.errors').html('');
    $('.errors').css('visibility', 'hidden');
}

function moveProgressBar() {
    width += 100 / 20;
    width > 0 ? $('#bar').css('color', '#fff') : $('#bar').css('color', '#000');
    $(elem).animate({width: width + '%'}, 100);
    elem.html(width.toFixed(2) * 1 + '%');
}

function singularOrPluralString(x) {
    return x == 1 ? ' point' : ' points';
}

function shuffleAnswers(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function addAndRemoveClass(item, remove_class, add_class) {
    $('#' + item).removeClass(remove_class);
    $('#' + item).addClass(add_class);
}

function getQuestions() {
    let url = category == 19 ? 'https://opentdb.com/api.php?amount=20&category=' + category : 'https://opentdb.com/api.php?amount=20&category=' + category + '&difficulty=' + difficulty;
    $.get(
        // Mathematics category has total of 41 questions (easy: 11, medium: 19, hard: 11)
        url,
        function (data) {
            for (let i = 0; i < data.results.length; i++) {
                let answers = [];
                for (let y = 0; y < data.results[i].incorrect_answers.length; y++) {
                    answers.push({
                        answer: data.results[i].incorrect_answers[y],
                        correct: 0
                    });
                }
                answers.push({
                    answer: data.results[i].correct_answer,
                    correct: 1
                });
                shuffleAnswers(answers);
                let obj = {
                    question: data.results[i].question,
                    answers: answers,
                };
                questions.push(obj);
            }
            quiz();
        }
    );
}

function quiz() {

    showNext();

    $('#container').on('change', 'input[name="answer"]', function () {
        if (!answer_selected) {
            $('#submit').removeClass('not-allowed');
            $('#submit').addClass('button');
            answer_selected = 1;
        }
    });

    $('#submit').on('click', function (e) {

        // Saves selected answer in user_answers array
        choose();

        if (isNaN(user_answers[question_counter])) {
            $('.errors').html('To get a question right, one must answer it!');
            $('.errors').css('visibility', 'visible');
            return false;
        }

        // If submitted return false
        if (submit_clicked == 1) return false;

        // Disable checkbox
        $('input[name=answer]').attr("disabled", true);
        $('.checkmark').css('background-color', '#bbbbbb');
        $('input[type="radio"], span.checkmark, label.container').css('cursor', 'default');

        $('#submit').addClass('not-allowed');
        $('#submit').removeClass('button');
        $('#submit').html('Submitted');

        // Prevent form submit
        e.preventDefault();

        if (question_area.is(':animated')) return false;

        // If not selected
        if (isNaN(user_answers[question_counter])) {
            $('.errors').html('To get a question right, one must answer it!');
            $('.errors').css('visibility', 'visible');
        } else {
            hideErrorsDiv();
            // If correct
            if (user_answers[question_counter]) {
                $('input[name="answer"]:checked ~ .checkmark').css('background-color', '#196b19');
                Number(number_of_points_first);
                Number(number_of_points_second);
                if (number_of_players == 1) {
                    number_of_points_first++;
                    $('#first-player-score').html(number_of_points_first);
                } else {
                    if (round % 2 == 0) {
                        number_of_points_second++;
                        $('#second-player-score').html(number_of_points_second);
                    } else {
                        number_of_points_first++;
                        $('#first-player-score').html(number_of_points_first);
                    }
                }
                $('#answer-result').css('background', '#196b19');
                $('#answer-result').html('Correct answer. Good work!');
                $('#answer-result').fadeIn(100);
            } else {
                $('#answer-result').css('background', '#c11c1c');
                $('input[name="answer"]:checked ~ .checkmark').css('background-color', 'rgb(193, 28, 28)');
                $('#answer-result').html('Incorrect answer. ');
                for (let i = 0; i < questions[question_counter].answers.length; i++) {
                    if (questions[question_counter].answers[i].correct == 1) {
                        $('#answer-result').append('The correct answer was ' + questions[question_counter].answers[i].answer + '.');
                        let cor = $('input[name="answer"] ~ .checkmark')[i];
                        $(cor).addClass('correct-answer');
                        $(cor).css('background-color', '#196b19');
                    }
                }
                $('#answer-result').fadeIn(100);
            }
            submit_clicked = 1;
            $('#next-question').removeClass('not-allowed');
            $('#next-question').addClass('button');
        }
    });

    // Next question handler
    $("#next-question").unbind('click').on('click', function (e) {

        // If not submitted
        if (submit_clicked == 0) {
            $('.errors').html('First tell us the answer to this, then we\'ll give you the next question 🙂');
            $('.errors').css('visibility', 'visible');
            return false;
        }
        e.preventDefault();

        hideErrorsDiv();

        $('#submit').html('Submit');
        $('input[type="radio"], span.checkmark, label.container').css('cursor', 'pointer');

        if (question_area.is(':animated'))
            return false;

        $('#answer-result').fadeOut(100);
        answer_selected = 0;
        submit_clicked = 0;
        moveProgressBar();
        question_counter++;
        showNext();
    });

    // Restart game handler
    $('#restart').unbind("click").on('click', function (e) {

        e.preventDefault();
        $('#highscore').hide();
        round++;

        // If game over
        if (round == 5) {
            score = $('<p>', {id: 'pitanje'});
            round = 1;
            $('#first-player-score').html(0);
            $('#second-player-score').html(0);
            $('#restart').hide();
            $('#next-question').show();
            $('#submit').show();
            $('#round').html('Round ' + round + '/4');
            $('#restart').html('Next question');
            if (number_of_players != 1)
                round % 2 ? $('#player-turn').html('Player Turn: ' + first_player) : $('#player-turn').html('Player Turn: ' + second_player);

            // Start quiz with new API call
            getQuestions();
            return false;
        }

        $('#round').html('Round ' + round + '/4');

        if (number_of_players != 1)
            round % 2 ? $('#player-turn').html('Player Turn: ' + first_player) : $('#player-turn').html('Player Turn: ' + second_player);

        if (question_area.is(':animated'))
            return false;

        showNext();

        $('#restart').hide();
        $('#next-question').show();
        $('#submit').show();
    });

    // Animate buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Create and return div containing answers
    function createQuestionElement(index) {
        let qElement = $('<div>', {
            id: 'question'
        });

        question_counter_for_title++;

        let header = $('<h2>Question ' + question_counter_for_title + '/5:</h2>');
        qElement.append(header);
        let question = $('<p>').append(questions[index].question);
        qElement.append(question);
        let radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Create list of answers
    function createRadios(index) {
        let radioList = $('<ul>');
        let item;
        let input = '';

        for (let i = 0; i < questions[index].answers.length; i++) {
            item = $('<li>');
            input = '<label class="container"><input type="radio" name="answer" value=' + questions[index].answers[i].correct + '><span class="checkmark"></span></label>';
            input += '<span>' + questions[index].answers[i].answer + '</span>';
            item.append(input);
            radioList.append(item);
            radioList.append('<br>');
        }

        return radioList;
    }

    // Read user input and store it
    function choose() {
        user_answers[question_counter] = +$('input[name="answer"]:checked').val();
    }

    // Show next element
    function showNext() {
        helper_counter++;
        question_area.fadeOut(100, function () {
            // Enable checkbox on next question
            $('input[name=answer]').attr('disabled', false);
            $('.checkmark').css('background-color', '#fff');
            $('#question').remove();
            // If round not over, show next question
            if (helper_counter != 5) {
                if (number_of_players == 2)
                    $('#round-number').show();
                let next_question = createQuestionElement(question_counter);
                question_area.append(next_question).fadeIn(200);
                if (!(isNaN(user_answers[question_counter])))
                    $('input[value=' + user_answers[question_counter] + ']').prop('checked', true);

                $('#next-question').show();
                $('#submit').show();

                $('#next-question').removeClass('button');
                $('#next-question').addClass('not-allowed');
                $('#submit').removeClass('button');
                $('#submit').addClass('not-allowed');
            }
            // Else show round end
            else {
                helper_counter = -1;
                question_area.append(displayScore()).fadeIn(200);
                $('#next-question').hide();
                $('#submit').hide();
                $('#restart').show();
            }
        });
    }

    // Calculate scores
    function displayScore() {
        $('#round-number').hide();
        let numCorrect = 0;
        for (let i = (user_answers.length) - 5; i < user_answers.length; i++)
            if (user_answers[i] == 1)
                numCorrect++;

        if (numCorrect > localStorage.getItem("highscore")) {
            if (typeof(Storage) !== "undefined")
                localStorage.setItem("highscore", numCorrect);
            else
                console.log("Sorry, your browser does not support Web Storage! 😞");
        }

        let score = $('<p>', {id: 'question'});
        score.append('You\'ve got ' + numCorrect + ' corrent questions out of 5!');

        // Custom messages
        switch (numCorrect) {
            case 0:
                score.append('<p>Unfortunate. 😞<br>');
                break;
            case 1:
                score.append('<p>Better something than nothing.<br>');
                break;
            case 2:
                score.append('<p>Not bad.<br>');
                break;
            case 3:
                score.append('<p>Good round!<br>');
                break;
            case 4:
                score.append('<p>Very nice!<br>');
                break;
            case 5:
                score.append('<p>Well played! :-))<br>');
                break;
        }

        // Return history results
        score.append('<p>History:<br>');

        // Return which round was played by who
        if (number_of_players != 1) {
            let appendName = (round % 2 ? first_player : second_player);
            points.append('<p>Round ' + round + ': ' + numCorrect + singularOrPluralString(numCorrect) + ' - ' + appendName + '</p>');
        } else
            points.append('<p>Round ' + round + ': ' + numCorrect + singularOrPluralString(numCorrect) + '</p>');
        score.append(points);

        // Display highscore
        $('#highscore').show();
        $('#highscore').html('Highscore: ' + localStorage.getItem('highscore') + singularOrPluralString(localStorage.getItem('highscore')));

        question_counter_for_title = 0;

        // If game over
        if (question_counter == 20) {
            $('#restart').html('New game');
            variable = 0;
            width = -5;
            moveProgressBar();
            question_counter = 0;
            points = $('<p>');
            user_answers = [];
            questions = [];
            localStorage.removeItem('highscore');
            if (number_of_players != 1) {
                if (number_of_points_first > number_of_points_second)
                    score.append('<p>Game over. ' + second_player + ' won!');
                else if (number_of_points_first < number_of_points_second)
                    score.append('<p>Game over. ' + second_player + ' won!');
                else
                    score.append('<p>Game over. It\'s a tie!');
            } else
                score.append('<p>Game over!');

            highscore = 0;
            $('#question').empty();
            number_of_points_second = 0;
            number_of_points_first = 0;
        }
        return score;
    }
};