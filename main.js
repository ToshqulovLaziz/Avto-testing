const question = document.querySelector(".js-avto-question");
const countQuestion = document.querySelector(".js-avto-desc");
const choices = Array.from(document.querySelectorAll(".js-avto-text"));
const elWinSect = document.querySelector(".js--section");
const elSavolSoni = document.querySelector(".js-savol-soni");
const elXatoSoni = document.querySelector(".js-xato-soni");
const elWinCount = document.querySelector(".js-win-count");
const imageContainer = document.querySelector(".box-2");

let currentQuestion = {}; //Joriy savol
let acceptingAnswers = false; //Javoblarni qabul qilish
let score = 0; 
let xato = 0;
let togri = 0;
let questionCounter = 0; //Savol hisoblagichi
let availableQuesions = []; //Mavjud savollar
let questions = [];


fetch(
        'output.json'
        )
        .then((res) => {
                return res.json();
        })
        .then((loadedQuestions) => {
                
                questions = loadedQuestions.roadSymbol.map((loadedQuestion) => {
                        
                        const formattedQuestion = {
                                question: loadedQuestion.symbol_img,
                        };
                        
                       
                        const answerChoices = [...loadedQuestion.incorrect_answers];
                        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
                        answerChoices.splice(
                                formattedQuestion.answer - 1,
                                0,
                                loadedQuestion.symbol_title
                                );
                                
                                answerChoices.forEach((choice, index) => {
                                        formattedQuestion['choice' + (index + 1)] = choice;
                                });
                                
                                return formattedQuestion;
                        });
                        startGame();
                })
                .catch((err) => {
                        console.error(err);
                });
                
                //CONSTANTS
                const CORRECT_BONUS = 10;
                const MAX_QUESTIONS = 10;
                
                startGame = () => {
                        questionCounter = 0;
                        score = 0;
                        availableQuesions = [...questions];
                        getNewQuestion();
                };
                
                getNewQuestion = () => {
                        if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
                                
                                if(score > 50 && countdownElement.textContent !== "Time's up!"){
                                        return window.location.assign('./winner.html');
                                } else { 
                                        return  window.location.assign('./game-over.html');
                                }
                        }
                        questionCounter++;
                        
                        const questionIndex = Math.floor(Math.random() * availableQuesions.length);
                        currentQuestion = availableQuesions[questionIndex];
                        question.src = currentQuestion.question;
                        
                        choices.forEach((choice) => {
                                const number = choice.dataset['number'];
                                choice.innerText = currentQuestion['choice' + number];
                        });
                        elSavolSoni.textContent = `Qolgan savvollar: ${questionCounter}/${MAX_QUESTIONS}`;
                        availableQuesions.splice(questionIndex, 1);
                        acceptingAnswers = true;
                };
                
                choices.forEach((choice) => {
                        choice.addEventListener('click', (evt) => {
                                if (!acceptingAnswers) return;
                                
                                acceptingAnswers = false;
                                
                                const selectedChoice = evt.target;
                                const selectedAnswer = selectedChoice.dataset['number'];
                                
                                const classToApply =
                                selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
                                
                                if (classToApply === 'correct') {
                                        selectedAnswer.disabled = true;
                                        correctSound();
                                        incrementScore(CORRECT_BONUS);
                                        togri++;
                                } else {
                                        inCorrectSound();
                                        xato++;
                                }
                                
                                if(xato === 5){ 
                                        return  window.location.assign('./game-over.html'); 
                                }
                                
                                elWinCount.textContent = `To'g'ri savollar: ${togri}`
                                elXatoSoni.textContent =  `Xato savollar: ${xato}/5`;
                                selectedChoice.parentElement.classList.add(classToApply);
                                
                                setTimeout(() => {
                                        selectedChoice.parentElement.classList.remove(classToApply);
                                        getNewQuestion();
                                }, 1000);
                        });
                });
                
                incrementScore = (num) => {
                        score += num;
                };
                
                correctSound = () => {
                        let winner = new Audio("./audio/correct.mp3")
                        winner.play();
                }
                
                inCorrectSound = () => {
                        let gameOver = new Audio("./audio/incorrect.mp3")
                        gameOver.play();
                }
                
                const countdownElement = document.getElementById("countdown");
                if (document.title === "Easy") {
                        startTime = 8;
                } else if (document.title === "Medium") {
                        startTime = 5; 
                } else if (document.title === "Hard"){
                        startTime = 3;
                }
                let timeLeft = startTime * 60; // Convert minutes to seconds
                
                
                const countdownInterval = setInterval(() => {
                        const minutesLeft = Math.floor(timeLeft / 60);
                        const secondsLeft = timeLeft % 60;
                        countdownElement.textContent = `Qolgan vaqt: ${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
                        
                        if (timeLeft <= 0) {
                                clearInterval(countdownInterval);
                                return  window.location.assign('./game-over.html');
                        } else {
                                timeLeft--;
                        }
                }, 1000);