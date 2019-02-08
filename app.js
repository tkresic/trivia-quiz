// Variables
let first_player, second_player, number_of_players, user_answers = [], 
	highscore = 0, width = 0, question_counter = 0, submit_clicked = 0,
	round = 1, question_counter_for_title = 0, elem = $('#bar'),
	question_area = $('#question-area'); number_of_points_first = $('#first-player-score').html(),
	run = $('#round'), number_of_points_second = $('#second-player-score').html(),
	points = $('<p>'), helper_counter = -1; 

let questions = [];
let incorrect_answers = [];
let correct_answer = [];

localStorage.setItem('highscore', 0);

// Intro event handler depending how many players are selected
$('#next').on('click', function() {
	// Check how many players were selected
	if($('input[name=number-of-players]:checked').val() == 1) {
		number_of_players = 1;
		$('#quiz-title').fadeOut(450);	
		$('#number-of-players-section').fadeOut(450, function() {
			$('#number-of-players-section').remove(); 
			$('#player-name-section').fadeIn();	
			$('#quiz-title').html('Who\'s playing?');
			$('#quiz-title').fadeIn();	
		});
		// Hide error div
		hideErrorsDiv();
	} else if ($('input[name=number-of-players]:checked').val() == 2) {
		number_of_players = 2;
		$('#quiz-title').fadeOut(450);	
		$('#number-of-players-section').fadeOut(450, function() {
			$('#number-of-players-section').remove(); 
			$('#player-names-section').fadeIn();
			$('#quiz-title').html('Who\'s playing?');
			$('#quiz-title').fadeIn();	
		});
		// Hide error div
		hideErrorsDiv();
	} else {
		// Show error div
		$('.errors').html('You must select the number of players, goofy!');
		$('.errors').css('visibility', 'visible');
	}
});

// Start the quiz after name input
$('.start').on('click', function() {
	if(number_of_players == 1){
		if (!$('#one-player').val()) {
			// Show error div
			$('.errors').html('You haven\'t forgottone your name, have you, silly?');
			$('.errors').css('visibility', 'visible');	
		} else {
			hideErrorsDiv();
			first_player = $('#one-player').val();
			second_player = '';
			$('#intro').fadeOut(400, function() {
				$('#intro').remove(); 
				$('#quiz').fadeIn(); 
				getQuestions(); 
			});
		}
	} else {
		if (!$('#first-player').val() || !$('#second-player').val()) {
			$('.errors').html('Well, tell us who\'s playing versus who!');
			$('.errors').css('visibility', 'visible');		
		} else {
			hideErrorsDiv();
			$('#round-number').show();
			first_player = $('#first-player').val();
			second_player = $('#second-player').val();;
			$('#second-player-score').show();
			// Start the quiz first time with first API call
			$('#intro').fadeOut(400, function() {
				$('#intro').remove(); 
				$('#quiz').fadeIn(); 
				getQuestions(); 
			});
		}
	}
});

// Hide error display divs	
function hideErrorsDiv() {
	$('.errors').html('');
	$('.errors').css('visibility', 'hidden');
}
	
// Move progress bar
function progress() {
	width += 100/20;
	width > 0 ? $('#bar').css('color', '#fff') : $('#bar').css('color', '#000');
	$(elem).animate({width : width + '%'}, 100);
	elem.html(width.toFixed(2) * 1  + '%');
}

// Return 'point' or 'points'
function singularOrPluralString(x) {
	return x == 1 ? ' point' : ' points';
}

// Shuffle answers
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// API call
function getQuestions(){
	$.get(
		"https://opentdb.com/api.php?amount=20",
		function(data) {

			for(let i = 0; i < data.results.length; i++){
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
				
				shuffle(answers);
				
				let obj = {
					question: data.results[i].question,
					answers: answers,
				};
				
				questions.push(obj);
			}
			
			// Start the quiz
			quiz();
		}
	);
}
 
// Start quiz
function quiz() {	
	$('#player-turn').html(first_player);

	$('#player-one').html(first_player);
	$('#player-two').html(second_player);

	// Show first question
	prikaziSljedeceg();
  
  	// Submit handler
	$('#submit').on('click', function (e) {
  
		// Saves selected answer in user_answers array
		izaberi();
  
		if (isNaN(user_answers[question_counter])) {
			$('.errors').html('To get a question right, one must answer it!');
			$('.errors').css('visibility', 'visible');	
			return false;
		}
		 
		// If submitted return false
		if(submit_clicked == 1) return false;
		
		// Disable checkbox
		$('input[name=answer]').attr("disabled",true);
		$('.checkmark').css('background-color', '#bbbbbb');
		$('input[type="radio"], span.checkmark, label.container').css('cursor', 'default');

		$('#submit').css({'background-color' : '#bbbbbb', 'cursor' : 'not-allowed'});
		$('#submit').removeClass('button');
		$('#submit').html('Submitted');
		
		// Prevent form submit
		e.preventDefault();
		
		if(question_area.is(':animated')) return false;
		
		// If not selected
		if (isNaN(user_answers[question_counter])) {
			$('.errors').html('To get a question right, one must answer it!');
			$('.errors').css('visibility', 'visible');	
		} else {
			hideErrorsDiv();
			if (user_answers[question_counter]) {
				$('input[name="answer"]:checked ~ .checkmark').css('background-color', 'green');
				Number(number_of_points_first);
				Number(number_of_points_second);
				if(number_of_players == 1) {
					number_of_points_first++;
					$('#first-player-score').html(number_of_points_first);
				} else {
					if(round % 2 == 0) {
						number_of_points_second++;
						$('#second-player-score').html(number_of_points_second);
					} else {
						number_of_points_first++;
						$('#first-player-score').html(number_of_points_first);
					}
				}
				$('#answer-result').html('Correct answer. Good work!');
				$('#answer-result').fadeIn(100);
			} else {
				$('input[name="answer"]:checked ~ .checkmark').css('background-color', 'red');
				$('#answer-result').html('Incorrect answer. ');
				for(let i = 0; i < questions[question_counter].answers.length; i++) {
					if(questions[question_counter].answers[i].correct == 1) {
						$('#answer-result').append('The correct answer was ' + questions[question_counter].answers[i].answer + '.');
						let cor = $('input[name="answer"] ~ .checkmark')[i];
						$(cor).css('background-color', 'green');
					}
				}
				$('#answer-result').fadeIn(100);
			}
			submit_clicked = 1;
		}
	});
  
	// Next question handler
	$("#next-question").unbind("click").on('click', function (e) {
		  
		// If not submitted
		if (submit_clicked == 0) {	
			$('.errors').html('First tell us the answer to this, then we\'ll give you the next question 🙂');
			$('.errors').css('visibility', 'visible');	
			return false;
		}
		e.preventDefault();

		hideErrorsDiv();
		
		$('#submit').html('Submit');
		$('#submit').addClass('button');
		$('#submit').css({'background-color' : '#556ee2', 'cursor' : 'pointer'});
		$('input[type="radio"], span.checkmark, label.container').css('cursor', 'pointer');
		
		if(question_area.is(':animated'))
		  return false;

		$('#answer-result').fadeOut(100);
		submit_clicked = 0;
		progress();
		question_counter++;
		prikaziSljedeceg();
	});
	
	// Restart game handler
	$('#restart').unbind("click").on('click', function (e) {
		e.preventDefault();
		
		$('#highscore').hide();
		
		round++;
		
		// If game over
		if(round == 5) {
			score = $('<p>',{id: 'pitanje'});
			round = 1;
			$('#first-player-score').html(0);
			$('#second-player-score').html(0);
			$('#restart').hide();
			$('#next-question').show();
			$('#submit').show();
			$('#round').html('Round ' + round);
			$('#restart').html('Next question');
			if(number_of_players != 1) {
				if(round % 2 != 0)
					$('#player-turn').html(first_player);
				else   
					$('#player-turn').html(second_player);
			}
			// Start quiz with new API call
			getQuestions();
			return false;
		}
		$('#round').html('Round ' + round);
		
		if(number_of_players != 1){
			if(round % 2 != 0)
				$('#player-turn').html(first_player);
			else   
				$('#player-turn').html(second_player);
		}
		
		if(question_area.is(':animated'))
		  return false;
	
		prikaziSljedeceg();
		
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
	function stvoriPitanjeElement(index) {
		let qElement = $('<div>', {
		  id: 'pitanje'
		});

		question_counter_for_title++;
		
		let header = $('<h2>Question: ' + question_counter_for_title + '</h2>');
		qElement.append(header);
		let pitanje = $('<p>').append(questions[index].question);
		qElement.append(pitanje);
		let radioButtons = createRadios(index);
		qElement.append(radioButtons);
		
		return qElement;
	}
  
	// Create list of answers
	function createRadios(index) {
		let radioList = $('<ul>');
		let item, pitanja;
		let input = '';
		
		for (let i = 0; i < questions[index].answers.length; i++) {
			item = $('<li style="display: inline-block; position: relative;">');
			input = '<label class="container" style="position: absolute; left: 0; width: 100%;"><input type="radio" name="answer" style="position: absolute; left: 0; width: 100%;" value=' + questions[index].answers[i].correct + '><span class="checkmark"></span></label>';
			input += '<span style="display: inline-block; margin-top: 3px; padding-left: 35px;">' + questions[index].answers[i].answer + '</span>';
			item.append(input);
			radioList.append(item);
			radioList.append('<br>');
		}

		return radioList;
	}
  
	// Read user input and store it
	function izaberi() {
		user_answers[question_counter] = +$('input[name="answer"]:checked').val();
	}
  
	// Show next element
	function prikaziSljedeceg(){
		helper_counter++;
		question_area.fadeOut(100, function() {
			// Enable checkbox on next question
			$('input[name=answer]').attr("disabled",true);
			$('.checkmark').css('background-color', '#fff');
			$('#pitanje').remove();
			// If round not over, show next question
			if(helper_counter != 5){
				if(number_of_players == 2)
					$('#round-number').show();
				let sljedpitanje = stvoriPitanjeElement(question_counter);
				question_area.append(sljedpitanje).fadeIn(200);
				if (!(isNaN(user_answers[question_counter])))
				  $('input[value='+user_answers[question_counter]+']').prop('checked', true);
		
				$('#next-question').show();
				$('#submit').show();
				
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
		
		if(numCorrect > localStorage.getItem("highscore")){
			if (typeof(Storage) !== "undefined") 
				localStorage.setItem("highscore", numCorrect);
			else
				console.log("Sorry, your browser does not support Web Storage...");
		}
		
		let score = $('<p>',{id: 'pitanje'});
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
		if(number_of_players != 1){
			let appendName = (round % 2 == 1 ? second_player : second_player);
			points.append('<p>Round ' + round + ': ' + numCorrect + singularOrPluralString(numCorrect) + ' - ' + appendName + '</p>');
		} else
			points.append('<p>Round ' + round + ': ' + numCorrect + singularOrPluralString(numCorrect) + '</p>');
		score.append(points);	
		
		// Display highscore
		$('#highscore').show();
		$('#highscore').html('Highscore: ' + localStorage.getItem('highscore') + singularOrPluralString(localStorage.getItem('highscore')));
		
		question_counter_for_title = 0;
		
		// If game over
		if(question_counter == 20){
			$('#restart').html('New game');
			variable = 0;
			width = -5;
			progress();
			question_counter = 0;
			points = $('<p>');
			user_answers = [];
			questions = [];
			localStorage.removeItem('highscore');
			if(number_of_players != 1){
				if(number_of_points_first > number_of_points_second)
					score.append('<p>Game over. ' + second_player + ' won!');
				else if(number_of_points_first < number_of_points_second)
					score.append('<p>Game over. ' + second_player + ' won!');
				else
					score.append('<p>Game over. It\'s a tie!');
			} else
				score.append('<p>Game over!');
			
			highscore = 0;
			$('#pitanje').empty();
			number_of_points_second = 0;
			number_of_points_first = 0;
			$('.addToCartButton').unbind('click');
		}
		return score;
  }
};
