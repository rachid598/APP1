// ========================================
// SYSTÈME DE SONS (Web Audio API)
// ========================================

const soundSystem = {
    enabled: true,
    audioContext: null,

    init() {
        // Charger la préférence
        const saved = localStorage.getItem('soundEnabled');
        this.enabled = saved !== 'false';
        this.updateButton();
    },

    getContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        this.updateButton();
        if (this.enabled) {
            this.playClick();
        }
    },

    updateButton() {
        const btn = document.getElementById('sound-toggle');
        if (btn) {
            btn.textContent = this.enabled ? '🔊' : '🔇';
            btn.classList.toggle('muted', !this.enabled);
        }
    },

    // Son de bonne réponse (note joyeuse ascendante)
    playCorrect() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        // Deux notes ascendantes
        [440, 554.37, 659.25].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, now + i * 0.1);
            gain.gain.exponentialDecayTo ? gain.gain.exponentialDecayTo(0.01, now + i * 0.1 + 0.2) : gain.gain.setValueAtTime(0.01, now + i * 0.1 + 0.2);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
    },

    // Son de mauvaise réponse (buzz grave)
    playWrong() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 150;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    },

    // Son de clic
    playClick() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    },

    // Son de badge débloqué (fanfare)
    playBadge() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do Mi Sol Do
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.25, now + i * 0.15);
            gain.gain.setValueAtTime(0.01, now + i * 0.15 + 0.3);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    },

    // Son de fin de partie (victoire ou défaite)
    playGameEnd(success) {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        if (success) {
            // Victoire : arpège majeur
            const notes = [261.63, 329.63, 392, 523.25];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, now + i * 0.12);
                gain.gain.setValueAtTime(0.01, now + i * 0.12 + 0.4);
                osc.start(now + i * 0.12);
                osc.stop(now + i * 0.12 + 0.4);
            });
        } else {
            // Moins bon score : notes descendantes
            const notes = [392, 349.23, 329.63, 261.63];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.15, now + i * 0.2);
                gain.gain.setValueAtTime(0.01, now + i * 0.2 + 0.3);
                osc.start(now + i * 0.2);
                osc.stop(now + i * 0.2 + 0.3);
            });
        }
    },

    // Son de série en feu
    playStreak() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    },

    // Son de compte à rebours urgent
    playTick() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    }
};

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
    currentQuestion: '',
    timeLeft: 120,
    timerId: null,
    startTime: null,
    isGameActive: false,
    zenMode: false,
    wrongAnswers: [] // Stocke les erreurs pour le récapitulatif
};

// Système de badges
const badgesConfig = {
    firstGame: { id: 'firstGame', name: 'Premier pas', icon: '🎯', description: 'Terminer ta première partie', condition: (stats) => stats.totalGames >= 1 },
    tenGames: { id: 'tenGames', name: 'Habitué', icon: '🎮', description: 'Jouer 10 parties', condition: (stats) => stats.totalGames >= 10 },
    fiftyGames: { id: 'fiftyGames', name: 'Accro', icon: '🕹️', description: 'Jouer 50 parties', condition: (stats) => stats.totalGames >= 50 },
    perfect: { id: 'perfect', name: 'Parfait !', icon: '💯', description: 'Obtenir 100% de bonnes réponses', condition: (stats) => stats.perfectGames >= 1 },
    fivePerfect: { id: 'fivePerfect', name: 'Excellence', icon: '🌟', description: 'Obtenir 5 parties parfaites', condition: (stats) => stats.perfectGames >= 5 },
    streak5: { id: 'streak5', name: 'En feu !', icon: '🔥', description: 'Faire une série de 5 bonnes réponses', condition: (stats) => stats.bestStreak >= 5 },
    streak10: { id: 'streak10', name: 'Inarrêtable', icon: '⚡', description: 'Faire une série de 10 bonnes réponses', condition: (stats) => stats.bestStreak >= 10 },
    additionMaster: { id: 'additionMaster', name: 'Maître Addition', icon: '➕', description: '100% en Addition (niveau Difficile+)', condition: (stats) => stats.masteredOperations?.addition },
    subtractionMaster: { id: 'subtractionMaster', name: 'Maître Soustraction', icon: '➖', description: '100% en Soustraction (niveau Difficile+)', condition: (stats) => stats.masteredOperations?.subtraction },
    multiplicationMaster: { id: 'multiplicationMaster', name: 'Maître Multiplication', icon: '✖️', description: '100% en Multiplication (niveau Difficile+)', condition: (stats) => stats.masteredOperations?.multiplication },
    divisionMaster: { id: 'divisionMaster', name: 'Maître Division', icon: '➗', description: '100% en Division (niveau Difficile+)', condition: (stats) => stats.masteredOperations?.division },
    zenMaster: { id: 'zenMaster', name: 'Zen Master', icon: '🧘', description: 'Terminer 5 parties en mode Zen', condition: (stats) => stats.zenGames >= 5 },
    speedDemon: { id: 'speedDemon', name: 'Éclair', icon: '⚡', description: 'Terminer en mode Expert avec 80%+', condition: (stats) => stats.expertWins >= 1 }
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
    result: document.getElementById('result-screen'),
    badges: document.getElementById('badges-screen')
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
    homeBtn: document.getElementById('home-btn'),
    errorsRecap: document.getElementById('errors-recap'),
    errorsList: document.getElementById('errors-list'),

    // Mode Zen
    zenToggle: document.getElementById('zen-toggle'),
    zenLabel: document.getElementById('zen-label'),
    timerContainer: document.querySelector('.timer'),

    // Badges
    badgesBtn: document.getElementById('badges-btn'),
    badgesScreen: document.getElementById('badges-screen'),
    badgesGrid: document.getElementById('badges-grid'),
    backFromBadgesBtn: document.getElementById('back-from-badges-btn'),
    badgeCount: document.getElementById('badge-count'),
    newBadgePopup: document.getElementById('new-badge-popup'),
    newBadgeIcon: document.getElementById('new-badge-icon'),
    newBadgeName: document.getElementById('new-badge-name')
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    setupEventListeners();
    soundSystem.init();

    // Bouton son
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => soundSystem.toggle());
    }
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

    // Mode Zen toggle
    if (elements.zenToggle) {
        elements.zenToggle.addEventListener('change', (e) => {
            gameState.zenMode = e.target.checked;
            updateZenLabel();
        });
    }

    // Badges
    if (elements.badgesBtn) {
        elements.badgesBtn.addEventListener('click', () => {
            showBadgesScreen();
        });
    }

    if (elements.backFromBadgesBtn) {
        elements.backFromBadgesBtn.addEventListener('click', () => {
            showScreen('home');
        });
    }

    // Fermer popup badge
    if (elements.newBadgePopup) {
        elements.newBadgePopup.addEventListener('click', () => {
            elements.newBadgePopup.classList.remove('show');
        });
    }
}

// Mettre à jour le label du mode Zen
function updateZenLabel() {
    if (elements.zenLabel) {
        elements.zenLabel.textContent = gameState.zenMode ? 'Mode Zen activé' : 'Mode chronométré';
    }
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
    gameState.wrongAnswers = []; // Réinitialiser les erreurs

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

    // Gérer l'affichage du timer selon le mode Zen
    if (elements.timerContainer) {
        if (gameState.zenMode) {
            elements.timerContainer.classList.add('zen-mode');
            elements.timerContainer.innerHTML = '<span class="timer-icon">🧘</span><span>Zen</span>';
        } else {
            elements.timerContainer.classList.remove('zen-mode');
            elements.timerContainer.innerHTML = '<span class="timer-icon">⏱️</span><span id="timer">60</span>s';
            // Re-sélectionner l'élément timer après modification du DOM
            elements.timer = document.getElementById('timer');
        }
    }

    // Afficher l'écran de jeu
    showScreen('game');

    // Générer la première question
    generateQuestion();

    // Démarrer le timer seulement si pas en mode Zen
    if (!gameState.zenMode) {
        updateTimerDisplay();
        gameState.timerId = setInterval(updateTimer, 1000);
    }

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
    gameState.currentQuestion = questionText; // Sauvegarder pour le récapitulatif
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
        soundSystem.playCorrect();
    } else {
        gameState.wrongCount++;
        gameState.streak = 0;
        elements.wrongCount.textContent = gameState.wrongCount;
        elements.answerInput.classList.add('wrong');
        showFeedback(`Oups ! La réponse était ${gameState.currentAnswer}`, 'wrong');
        soundSystem.playWrong();

        // Sauvegarder l'erreur pour le récapitulatif
        gameState.wrongAnswers.push({
            question: gameState.currentQuestion,
            userAnswer: userAnswer,
            correctAnswer: gameState.currentAnswer
        });
    }

    // Mettre à jour la série
    elements.gameStreak.textContent = gameState.streak;
    if (gameState.streak >= 3) {
        elements.streakDisplay.classList.add('hot');
        if (gameState.streak === 3 || gameState.streak === 5 || gameState.streak === 10) {
            soundSystem.playStreak();
        }
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

    // Son de tick quand il reste peu de temps
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
        soundSystem.playTick();
    }

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
    elements.timeUsed.textContent = gameState.zenMode ? 'Mode Zen' : `${timeUsed}s`;
    elements.bestStreakResult.textContent = gameState.bestStreak;

    // Afficher le récapitulatif des erreurs
    displayErrorsRecap();

    // Jouer le son de fin de partie
    soundSystem.playGameEnd(percentage >= 70);

    // Sauvegarder les stats et vérifier les badges
    saveStats(gameState.correctCount, gameState.bestStreak, percentage);

    // Afficher l'écran de résultats
    showScreen('result');
}

// Afficher le récapitulatif des erreurs
function displayErrorsRecap() {
    if (!elements.errorsRecap || !elements.errorsList) return;

    if (gameState.wrongAnswers.length === 0) {
        elements.errorsRecap.classList.add('hidden');
        return;
    }

    elements.errorsRecap.classList.remove('hidden');
    elements.errorsList.innerHTML = '';

    gameState.wrongAnswers.forEach((error, index) => {
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        errorItem.innerHTML = `
            <span class="error-question">${error.question.replace(' = ?', '')}</span>
            <span class="error-answers">
                <span class="user-answer">Ta réponse : ${error.userAnswer}</span>
                <span class="correct-answer">Bonne réponse : ${error.correctAnswer}</span>
            </span>
        `;
        elements.errorsList.appendChild(errorItem);
    });
}

// Sauvegarder les statistiques
function saveStats(score, streak, percentage) {
    const stats = JSON.parse(localStorage.getItem('calculMentalStats') || '{}');

    // Stats de base
    if (!stats.bestScore || score > stats.bestScore) {
        stats.bestScore = score;
    }

    if (!stats.bestStreak || streak > stats.bestStreak) {
        stats.bestStreak = streak;
    }

    // Stats pour les badges
    stats.totalGames = (stats.totalGames || 0) + 1;

    if (percentage === 100) {
        stats.perfectGames = (stats.perfectGames || 0) + 1;

        // Vérifier maîtrise d'opération (niveau difficile ou expert)
        if ((gameState.difficulty === 'hard' || gameState.difficulty === 'expert') && gameState.operation !== 'mix') {
            stats.masteredOperations = stats.masteredOperations || {};
            stats.masteredOperations[gameState.operation] = true;
        }
    }

    if (gameState.zenMode) {
        stats.zenGames = (stats.zenGames || 0) + 1;
    }

    if (gameState.difficulty === 'expert' && percentage >= 80) {
        stats.expertWins = (stats.expertWins || 0) + 1;
    }

    // Badges débloqués
    stats.unlockedBadges = stats.unlockedBadges || [];

    // Vérifier les nouveaux badges
    const newBadges = checkNewBadges(stats);
    if (newBadges.length > 0) {
        stats.unlockedBadges = [...new Set([...stats.unlockedBadges, ...newBadges])];
        // Afficher le popup pour le premier nouveau badge
        showNewBadgePopup(newBadges[0]);
    }

    localStorage.setItem('calculMentalStats', JSON.stringify(stats));
    loadStats();
}

// Vérifier les nouveaux badges débloqués
function checkNewBadges(stats) {
    const newBadges = [];
    const unlockedBadges = stats.unlockedBadges || [];

    for (const [id, badge] of Object.entries(badgesConfig)) {
        if (!unlockedBadges.includes(id) && badge.condition(stats)) {
            newBadges.push(id);
        }
    }

    return newBadges;
}

// Afficher le popup de nouveau badge
function showNewBadgePopup(badgeId) {
    const badge = badgesConfig[badgeId];
    if (!badge || !elements.newBadgePopup) return;

    elements.newBadgeIcon.textContent = badge.icon;
    elements.newBadgeName.textContent = badge.name;
    elements.newBadgePopup.classList.add('show');

    // Jouer le son de badge
    setTimeout(() => soundSystem.playBadge(), 300);

    // Cacher automatiquement après 3 secondes
    setTimeout(() => {
        elements.newBadgePopup.classList.remove('show');
    }, 3000);
}

// Afficher l'écran des badges
function showBadgesScreen() {
    const stats = JSON.parse(localStorage.getItem('calculMentalStats') || '{}');
    const unlockedBadges = stats.unlockedBadges || [];

    if (!elements.badgesGrid) return;

    elements.badgesGrid.innerHTML = '';

    for (const [id, badge] of Object.entries(badgesConfig)) {
        const isUnlocked = unlockedBadges.includes(id);
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        badgeCard.innerHTML = `
            <span class="badge-icon">${isUnlocked ? badge.icon : '🔒'}</span>
            <span class="badge-name">${badge.name}</span>
            <span class="badge-desc">${badge.description}</span>
        `;
        elements.badgesGrid.appendChild(badgeCard);
    }

    showScreen('badges');
}

// Charger les statistiques
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('calculMentalStats') || '{}');
    elements.bestScore.textContent = stats.bestScore || 0;
    elements.currentStreak.textContent = stats.bestStreak || 0;

    // Mettre à jour le compteur de badges
    if (elements.badgeCount) {
        const unlockedCount = (stats.unlockedBadges || []).length;
        const totalCount = Object.keys(badgesConfig).length;
        elements.badgeCount.textContent = `${unlockedCount}/${totalCount}`;
    }
}

// Générer un nombre aléatoire
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================
// PWA : Service Worker + Installation
// ========================================

let deferredPrompt = null;

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Service Worker enregistré', reg.scope);
                // Vérifier les mises à jour
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'activated') {
                            console.log('Nouvelle version disponible');
                        }
                    });
                });
            })
            .catch(err => {
                console.log('Erreur Service Worker:', err);
            });
    });
}

// Intercepter l'événement d'installation
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Vérifier si l'utilisateur n'a pas déjà fermé la bannière
    const dismissed = localStorage.getItem('installDismissed');
    if (!dismissed) {
        showInstallBanner();
    }
});

// Afficher la bannière d'installation
function showInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (!banner) return;

    setTimeout(() => {
        banner.classList.add('show');
    }, 2000); // Attendre 2s avant d'afficher
}

// Bouton installer
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('install-btn');
    const dismissBtn = document.getElementById('install-dismiss');
    const banner = document.getElementById('install-banner');

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                console.log('App installée');
            }

            deferredPrompt = null;
            if (banner) banner.classList.remove('show');
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (banner) banner.classList.remove('show');
            localStorage.setItem('installDismissed', 'true');
        });
    }
});

// Détecter si l'app est déjà installée
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.remove('show');
    console.log('Application installée avec succès');
});
