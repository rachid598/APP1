// État du jeu
const gameState = {
    operation: 'addition',
    difficulty: 'easy',
    questionNumber: 0,
    totalQuestions: 10,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    currentAnswer: null,
    timeLeft: 120,
    timerId: null,
    startTime: null,
    isGameActive: false
};

// Configuration des difficultés par opération
// Temps : Facile = 120s, Moyen = 90s, Difficile = 60s, Expert = 45s
const difficultyConfig = {
    addition: {
        easy: { min1: 1, max1: 20, min2: 1, max2: 20, time: 120, description: "1 à 20" },
        medium: { min1: 10, max1: 100, min2: 10, max2: 100, time: 90, description: "10 à 100" },
        hard: { min1: 100, max1: 500, min2: 100, max2: 500, time: 60, description: "100 à 500" },
        expert: { min1: 500, max1: 1000, min2: 500, max2: 1000, time: 45, description: "500 à 1000" }
    },
    subtraction: {
        easy: { min1: 5, max1: 20, min2: 1, max2: 10, time: 120, description: "5 à 20" },
        medium: { min1: 20, max1: 100, min2: 10, max2: 50, time: 90, description: "20 à 100" },
        hard: { min1: 100, max1: 500, min2: 50, max2: 200, time: 60, description: "100 à 500" },
        expert: { min1: 500, max1: 1000, min2: 100, max2: 500, time: 45, description: "500 à 1000" }
    },
    multiplication: {
        easy: { min1: 2, max1: 5, min2: 2, max2: 10, time: 120, description: "Tables 2 à 5" },
        medium: { min1: 2, max1: 10, min2: 2, max2: 10, time: 90, description: "Tables 2 à 10" },
        hard: { min1: 5, max1: 12, min2: 5, max2: 12, time: 60, description: "Tables 5 à 12" },
        expert: { min1: 10, max1: 15, min2: 10, max2: 15, time: 45, description: "Tables 10 à 15" }
    },
    division: {
        easy: { min1: 2, max1: 5, min2: 2, max2: 10, time: 120, description: "Diviseurs 2 à 5" },
        medium: { min1: 2, max1: 10, min2: 2, max2: 10, time: 90, description: "Diviseurs 2 à 10" },
        hard: { min1: 5, max1: 12, min2: 5, max2: 12, time: 60, description: "Diviseurs 5 à 12" },
        expert: { min1: 10, max1: 15, min2: 5, max2: 15, time: 45, description: "Diviseurs 10 à 15" }
    },
    mix: {
        easy: { time: 120, description: "Mélange facile" },
        medium: { time: 90, description: "Mélange moyen" },
        hard: { time: 60, description: "Mélange difficile" },
        expert: { time: 45, description: "Mélange expert" }
    }
};

// Noms des opérations
const operationNames = {
    addition: { name: 'Addition', icon: '➕' },
    subtraction: { name: 'Soustraction', icon: '➖' },
    multiplication: { name: 'Multiplication', icon: '✖️' },
    division: { name: 'Division', icon: '➗' },
    mix: { name: 'Mélange', icon: '🎲' }
};

// Éléments du DOM
const screens = {
    home: document.getElementById('home-screen'),
    difficulty: document.getElementById('difficulty-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    // Accueil
    operationButtons: document.querySelectorAll('.btn-operation'),
    bestScore: document.getElementById('best-score'),
    currentStreak: document.getElementById('current-streak'),

    // Sélection de difficulté
    backToHomeBtn: document.getElementById('back-to-home-btn'),
    selectedOpIcon: document.getElementById('selected-op-icon'),
    selectedOpName: document.getElementById('selected-op-name'),
    difficultyCards: document.querySelectorAll('.difficulty-card'),
    easyNumbers: document.getElementById('easy-numbers'),
    mediumNumbers: document.getElementById('medium-numbers'),
    hardNumbers: document.getElementById('hard-numbers'),
    expertNumbers: document.getElementById('expert-numbers'),

    // Jeu
    backBtn: document.getElementById('back-btn'),
    correctCount: document.getElementById('correct-count'),
    wrongCount: document.getElementById('wrong-count'),
    timer: document.getElementById('timer'),
    progress: document.getElementById('progress'),
    questionNum: document.getElementById('question-num'),
    question: document.getElementById('question'),
    feedback: document.getElementById('feedback'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    gameStreak: document.getElementById('game-streak'),
    streakDisplay: document.querySelector('.streak-display'),

    // Résultats
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    finalCorrect: document.getElementById('final-correct'),
    finalWrong: document.getElementById('final-wrong'),
    finalPercentage: document.getElementById('final-percentage'),
    timeUsed: document.getElementById('time-used'),
    bestStreakResult: document.getElementById('best-streak'),
    retryBtn: document.getElementById('retry-btn'),
    homeBtn: document.getElementById('home-btn')
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    setupEventListeners();
});

// Configuration des événements
function setupEventListeners() {
    // Boutons d'opération -> Écran de sélection de difficulté
    elements.operationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.operation = btn.dataset.operation;
            showDifficultyScreen();
        });
    });

    // Bouton retour vers accueil
    elements.backToHomeBtn.addEventListener('click', () => {
        showScreen('home');
    });

    // Cartes de difficulté -> Démarrer le jeu
    elements.difficultyCards.forEach(card => {
        card.addEventListener('click', () => {
            gameState.difficulty = card.dataset.difficulty;
            startGame();
        });
    });

    // Bouton retour depuis le jeu
    elements.backBtn.addEventListener('click', endGame);

    // Validation de la réponse
    elements.submitBtn.addEventListener('click', checkAnswer);
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Boutons de résultat
    elements.retryBtn.addEventListener('click', () => {
        startGame();
    });

    elements.homeBtn.addEventListener('click', () => {
        showScreen('home');
    });
}

// Afficher un écran
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Afficher l'écran de sélection de difficulté
function showDifficultyScreen() {
    const op = operationNames[gameState.operation];
    elements.selectedOpIcon.textContent = op.icon;
    elements.selectedOpName.textContent = op.name;

    // Mettre à jour les descriptions des niveaux
    const config = difficultyConfig[gameState.operation];
    elements.easyNumbers.textContent = config.easy.description;
    elements.mediumNumbers.textContent = config.medium.description;
    elements.hardNumbers.textContent = config.hard.description;
    elements.expertNumbers.textContent = config.expert.description;

    showScreen('difficulty');
}

// Démarrer le jeu
function startGame() {
    // Réinitialiser l'état
    gameState.questionNumber = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.isGameActive = true;
    gameState.startTime = Date.now();

    // Configurer le temps selon la difficulté
    const config = getConfig();
    gameState.timeLeft = config.time;

    // Réinitialiser l'interface
    elements.correctCount.textContent = '0';
    elements.wrongCount.textContent = '0';
    elements.gameStreak.textContent = '0';
    elements.progress.style.width = '0%';
    elements.feedback.classList.remove('show', 'correct', 'wrong');
    elements.answerInput.classList.remove('correct', 'wrong');
    elements.answerInput.value = '';
    elements.streakDisplay.classList.remove('hot');

    // Afficher l'écran de jeu
    showScreen('game');

    // Générer la première question
    generateQuestion();

    // Démarrer le timer
    updateTimerDisplay();
    gameState.timerId = setInterval(updateTimer, 1000);

    // Focus sur l'input
    setTimeout(() => elements.answerInput.focus(), 100);
}

// Obtenir la configuration actuelle
function getConfig() {
    if (gameState.operation === 'mix') {
        return difficultyConfig.mix[gameState.difficulty];
    }
    return difficultyConfig[gameState.operation][gameState.difficulty];
}

// Terminer le jeu
function endGame() {
    gameState.isGameActive = false;

    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }

    showScreen('difficulty');
}

// Générer une question
function generateQuestion() {
    gameState.questionNumber++;

    if (gameState.questionNumber > gameState.totalQuestions) {
        showResults();
        return;
    }

    // Mettre à jour le numéro de question
    elements.questionNum.textContent = gameState.questionNumber;
    elements.progress.style.width = `${((gameState.questionNumber - 1) / gameState.totalQuestions) * 100}%`;

    // Choisir l'opération
    let operation = gameState.operation;
    if (operation === 'mix') {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        operation = operations[Math.floor(Math.random() * operations.length)];
    }

    // Générer les nombres selon la difficulté
    const config = difficultyConfig[operation][gameState.difficulty];
    let num1, num2, answer, questionText;

    switch (operation) {
        case 'addition':
            num1 = randomInt(config.min1, config.max1);
            num2 = randomInt(config.min2, config.max2);
            answer = num1 + num2;
            questionText = `${num1} + ${num2} = ?`;
            break;

        case 'subtraction':
            num1 = randomInt(config.min1, config.max1);
            num2 = randomInt(config.min2, Math.min(num1, config.max2));
            answer = num1 - num2;
            questionText = `${num1} − ${num2} = ?`;
            break;

        case 'multiplication':
            num1 = randomInt(config.min1, config.max1);
            num2 = randomInt(config.min2, config.max2);
            answer = num1 * num2;
            questionText = `${num1} × ${num2} = ?`;
            break;

        case 'division':
            num2 = randomInt(config.min1, config.max1);
            answer = randomInt(config.min2, config.max2);
            num1 = num2 * answer; // Assure une division exacte
            questionText = `${num1} ÷ ${num2} = ?`;
            break;
    }

    gameState.currentAnswer = answer;
    elements.question.textContent = questionText;

    // Réinitialiser l'input
    elements.answerInput.value = '';
    elements.answerInput.classList.remove('correct', 'wrong');
    elements.feedback.classList.remove('show');
    elements.answerInput.focus();
}

// Vérifier la réponse
function checkAnswer() {
    if (!gameState.isGameActive) return;

    const userAnswer = parseInt(elements.answerInput.value);

    if (isNaN(userAnswer)) {
        elements.answerInput.classList.add('wrong');
        setTimeout(() => elements.answerInput.classList.remove('wrong'), 500);
        return;
    }

    const isCorrect = userAnswer === gameState.currentAnswer;

    // Mettre à jour les compteurs
    if (isCorrect) {
        gameState.correctCount++;
        gameState.streak++;
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        elements.correctCount.textContent = gameState.correctCount;
        elements.answerInput.classList.add('correct');
        showFeedback('Bravo ! 🎉', 'correct');
    } else {
        gameState.wrongCount++;
        gameState.streak = 0;
        elements.wrongCount.textContent = gameState.wrongCount;
        elements.answerInput.classList.add('wrong');
        showFeedback(`Oups ! La réponse était ${gameState.currentAnswer}`, 'wrong');
    }

    // Mettre à jour la série
    elements.gameStreak.textContent = gameState.streak;
    if (gameState.streak >= 3) {
        elements.streakDisplay.classList.add('hot');
    } else {
        elements.streakDisplay.classList.remove('hot');
    }

    // Passer à la question suivante après un délai
    setTimeout(() => {
        generateQuestion();
    }, isCorrect ? 800 : 1500);
}

// Afficher le feedback
function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback show ${type}`;
}

// Mettre à jour le timer
function updateTimer() {
    if (!gameState.isGameActive) return;

    gameState.timeLeft--;
    updateTimerDisplay();

    if (gameState.timeLeft <= 0) {
        showResults();
    }
}

// Afficher le timer
function updateTimerDisplay() {
    elements.timer.textContent = gameState.timeLeft;

    const timerContainer = elements.timer.parentElement;
    timerContainer.classList.remove('warning', 'danger');

    if (gameState.timeLeft <= 10) {
        timerContainer.classList.add('danger');
    } else if (gameState.timeLeft <= 20) {
        timerContainer.classList.add('warning');
    }
}

// Afficher les résultats
function showResults() {
    gameState.isGameActive = false;

    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }

    // Calculer les statistiques
    const totalAnswered = gameState.correctCount + gameState.wrongCount;
    const percentage = totalAnswered > 0
        ? Math.round((gameState.correctCount / totalAnswered) * 100)
        : 0;
    const timeUsed = Math.round((Date.now() - gameState.startTime) / 1000);

    // Déterminer le message selon le score
    let emoji, title, message;
    if (percentage >= 90) {
        emoji = '🏆';
        title = 'Excellent !';
        message = 'Tu es un champion du calcul mental !';
    } else if (percentage >= 70) {
        emoji = '🎉';
        title = 'Très bien !';
        message = 'Continue comme ça !';
    } else if (percentage >= 50) {
        emoji = '👍';
        title = 'Pas mal !';
        message = 'Encore un peu d\'entraînement !';
    } else {
        emoji = '💪';
        title = 'Courage !';
        message = 'Entraîne-toi encore, tu vas y arriver !';
    }

    // Mettre à jour l'interface
    elements.resultEmoji.textContent = emoji;
    elements.resultTitle.textContent = title;
    elements.resultMessage.textContent = message;
    elements.finalCorrect.textContent = gameState.correctCount;
    elements.finalWrong.textContent = gameState.wrongCount;
    elements.finalPercentage.textContent = `${percentage}%`;
    elements.timeUsed.textContent = `${timeUsed}s`;
    elements.bestStreakResult.textContent = gameState.bestStreak;

    // Sauvegarder les stats
    saveStats(gameState.correctCount, gameState.bestStreak);

    // Afficher l'écran de résultats
    showScreen('result');
}

// Sauvegarder les statistiques
function saveStats(score, streak) {
    const stats = JSON.parse(localStorage.getItem('calculMentalStats') || '{}');

    if (!stats.bestScore || score > stats.bestScore) {
        stats.bestScore = score;
    }

    if (!stats.bestStreak || streak > stats.bestStreak) {
        stats.bestStreak = streak;
    }

    localStorage.setItem('calculMentalStats', JSON.stringify(stats));
    loadStats();
}

// Charger les statistiques
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('calculMentalStats') || '{}');
    elements.bestScore.textContent = stats.bestScore || 0;
    elements.currentStreak.textContent = stats.bestStreak || 0;
}

// Générer un nombre aléatoire
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Service Worker pour mode hors-ligne (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker non disponible, pas de problème
        });
    });
}
