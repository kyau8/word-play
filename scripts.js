// Create an object to store our themed words in
const game = {};

// Create an array to store the length of the word
game.questionLength = [];

// Create an array to store the randomized word from the API
game.questionString = [];

// Define a variable that will hold the original wordstring
game.originalString;

// Define a variable that will hold the user's response string
game.newResponse;

// Define a variable to keep track of points - each user begins with six points
game.points = 6;

// Write a function to keep track of the user's points
game.pointsCounter = function() {
    $('.pointsNum').text(game.points);
    $('.hintButton').on('click', function() {
        game.points = game.points - 2;
        // console.log(game.points);
        $('.pointsNum').text(game.points);
        game.winOrLose(game.points);
    });
    $('.skipButton').on('click', function() {
        game.points = game.points - 3;
        // console.log(game.points);
        $('.pointsNum').text(game.points);
        game.winOrLose(game.points);
    })
    $('.mainForm').on('submit', function() {
        if (game.newResponse === game.originalString) {
            game.points = game.points + 6;
            $('.pointsNum').text(game.points);
            $('.nextButton').css('visibility', 'visible');
            // console.log(game.points);
            $('.hintButton').css('visibility', 'hidden');
            $('#hintText').css('visibility', 'visible');
            $('.skipButton').css('visibility', 'hidden');
            $('.quizAnswer').css('display', 'block');
            game.winOrLose(game.points);
            $('.quizQuestion').css('display', 'none');
            $('.submit').css('visibility', 'hidden');
        }
    })
    // console.log(game.points);
    game.winOrLose(game.points);
}

// Create a variable for the OED API id and key
game.appId = 'd49a587f';
game.appKey = '289f65526feb5275045c091cd0cf2512';

// Make a request to the OED API to get a specific wordlist
game.getQuestion = function (domain) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `https://od-api.oxforddictionaries.com/api/v1/wordlist/en/domains%3D${domain}`,
            proxyHeaders: {
                'Accept': "application/json",
                'app_id': 'e238a87f',
                'app_key': '825c93de3af1b89a01edadcde2da805e'
            },
            xmlToJSON: false
        }
    }).then(function (questionReturn) {
        const questionArray = questionReturn.results;
        game.randomQuestion(questionArray);
        game.nextQuestion(questionArray);
    });
};

// Calculate a random number, and then use that number to select a random themed word from the questionArray
game.randomQuestion = function(returnArray) {
    const randomNum = Math.floor(Math.random() * returnArray.length);
    const playQuestion = returnArray[randomNum].word;
    console.log(playQuestion);
    $('.quizAnswer').html(`<h2>${playQuestion}</h2>`);
    game.defineWord(playQuestion);
    game.splitWord(playQuestion);
}


// Write an event method that uses the randomQuestion function to generate a random question on the page when the 'Next' button is clicked
game.nextQuestion = function(newArray) {
    $('.nextButton').on('click', function(e){
        $('.quizQuestion').empty();
        e.preventDefault();
        game.randomQuestion(newArray);
        $('.quizAnswer').css('display','none');
        $('.nextButton').css('visibility', 'hidden');
        $('#hintText').css('visibility', 'hidden');
        $('.hintButton').css('visibility', 'visible');
        $('.skipButton').css('visibility', 'visible');
        $('.quizQuestion').css('display','block');
        $('.submit').css('visibility', 'visible');
    });
}

// Make a request to the OED API to get the definition of the randomly generated word
game.defineWord = function (getQuestion) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${getQuestion}`,
            proxyHeaders: {
                'Accept': "application/json",
                'app_id': 'e238a87f',
                'app_key': '825c93de3af1b89a01edadcde2da805e'
            },
            xmlToJSON: false
        }
    }).then(function (wordDefinition) {
        game.wordDefinition(wordDefinition);
    });
};

// Pull the specific definition for the selected word from the returned object from the OED API, and print it to the page
game.wordDefinition = function (wordObject){
    const wordDefined = wordObject.results['0'].lexicalEntries['0'].entries['0'].senses['0'].definitions['0'];
    // console.log(wordDefined);
    $('#hintText').html(`DEFINITION<br/>1. ${wordDefined}`);
}

// Write a function that takes the pulled word, and turn it into an array of characters. Store the length of the array.
game.splitWord = function(itemToSplit){
    game.questionString = itemToSplit.split('');
    game.questionLength = game.questionString.length - 1;
    // Go through all the characters in the array, and print the characters into input boxes on the page
    for(let i = 0; i <= game.questionLength; i = i + 1) {
        // Use an if statement to print out every third character in the array, and the blank spaces, in disabled inputs. Else, print an empty input.
        if (game.questionString[i] === " ") {
            let wordSpace = $('<input>').attr({
                type: 'text',
                value: game.questionString[i],
                maxlength: 1,
                placeholder: game.questionString[i],
                disabled: 'disabled',
                id: `answerInput${i}`,
                class: 'wordSpace'
            });
            $('.quizQuestion').append(wordSpace);
        } else if (i % 3 === 0 || game.questionString[i] === "-" || game.questionString[i] === "'" || game.questionString[i] === "è" || game.questionString[i] === "é") {
        let wordLetter = $('<input>').attr({
            type: 'text',
            value: game.questionString[i],
            maxlength: 1,
            placeholder: game.questionString[i],
            disabled: 'disabled',
            id: `answerInput${i}`
            });
            $('.quizQuestion').append(wordLetter);
        } else {
            let wordHiddenLetter = $('<input>').attr({
                type: 'text',
                maxlength: 1,
                id: `answerInput${i}`
            });
            $('.quizQuestion').append(wordHiddenLetter);
        }
        $(`answerInput${i}`).keyup(function () {
            if (`answerInput${i}` === `answerInput${i}.maxlength`) {
            }
        });
    }
    $('input').autotab({ maxlength: 1 });
}

// Create an event method that evaluates the user input when the form is submitted.
game.mainEvent = function() {
    $('.mainForm').on('submit', function(e){
        e.preventDefault();
        game.storeWord();
    });
};

// Write a function to loop through and store the values of the inputs. Store those values in a new array.
game.storeWord = function() {
    let responseArray = [];
    for (let n = 0; n <= game.questionLength; n = n + 1) {
        let charValue = $(`#answerInput${n}`).val();
        responseArray.push(charValue);
    }
    // console.log(responseArray);
    game.newResponse = responseArray.join('');
    game.originalString = game.questionString.join('');
}

// Create an event method that subtracts points (and displays the hidden definition) when clicked
game.hintEvent = function() {
    $('.hintButton').on('click', function(e) {
        e.preventDefault();
        $('#hintText').css('visibility', 'visible');
        $('.hintButton').css('visibility', 'hidden');
    });
}

game.skipEvent = function() {
    $('.skipButton').on('click', function(e) {
        e.preventDefault();
        $('.quizAnswer').css('display','block');
        // Display the 'next' button if the skip button is pressed, and display the correct word
        $('.nextButton').css('visibility', 'visible');
        $('.hintButton').css('visibility', 'hidden');
        $('.skipButton').css('visibility', 'hidden');
        $('.quizQuestion').css('display','none');
        $('#hintText').css('visibility', 'visible');
        $('.submit').css('visibility', 'hidden');
    });
}

// Write a method that lets the user know they've won or lost the game, based on their points.
game.winOrLose = function(userPoints) {
    if (userPoints < 0) {
        $('.results').html(`<h1>Better luck next time.</h1>`);
        $('.resultsSection').css('display', 'block');
    } else if (userPoints >= 60) {
        $('.results').html(`<h1>Bottoms up, you won!</h1>`);
        $('.resultsSection').css('display', 'block');
    }
}

game.init = function() {
    game.getQuestion('drink');
    game.mainEvent();
    game.hintEvent();
    game.skipEvent();
    game.pointsCounter();
}

$(function() {
    game.init();
});