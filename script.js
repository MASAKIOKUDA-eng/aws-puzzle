// AWS Services data
const awsServices = {
    "EC2": "クラウドで拡張可能なコンピューティング容量を提供する弾力的なコンピュートサービス",
    "S3": "業界をリードするスケーラビリティ、データ可用性、セキュリティ、およびパフォーマンスを提供するオブジェクトストレージサービス",
    "Lambda": "サーバーのプロビジョニングや管理なしでコードを実行できるサーバーレスコンピューティングサービス",
    "DynamoDB": "高速で予測可能なパフォーマンスとシームレスなスケーラビリティを提供するフルマネージドNoSQLデータベースサービス",
    "RDS": "リレーショナルデータベースのセットアップ、運用、スケーリングを容易にするマネージドリレーショナルデータベースサービス",
    "CloudFront": "データ、ビデオ、アプリケーション、APIをグローバルに安全に配信するコンテンツ配信ネットワークサービス",
    "IAM": "AWSリソースへのアクセスを安全に制御するのに役立つWebサービス",
    "VPC": "論理的に分離された仮想ネットワークでAWSリソースを起動できるサービス",
    "SNS": "アプリケーション間およびアプリケーションと人間の間の通信のためのフルマネージドメッセージングサービス",
    "SQS": "マイクロサービスの分離とスケーリングを可能にするフルマネージドメッセージキューイングサービス",
    "CloudWatch": "AWSリソースのデータと実用的なインサイトを提供する監視および可観測性サービス",
    "Route53": "高可用性でスケーラブルなクラウドドメインネームシステム（DNS）Webサービス",
    "ECS": "フルマネージドコンテナオーケストレーションサービス",
    "EKS": "AWSでKubernetesを簡単に実行できるマネージドKubernetesサービス",
    "Fargate": "ECSとEKSの両方で動作するコンテナ用のサーバーレスコンピューティングエンジン",
    "Glacier": "データアーカイブと長期バックアップのための安全で耐久性があり、非常に低コストのストレージサービス",
    "Redshift": "クラウドでのフルマネージドのペタバイト規模のデータウェアハウスサービス",
    "ElastiCache": "RedisとMemcachedエンジンをサポートするインメモリキャッシングサービス",
    "SageMaker": "開発者やデータサイエンティストが機械学習モデルを構築、トレーニング、デプロイできるフルマネージドサービス",
    "Athena": "標準SQLを使用してAmazon S3のデータを簡単に分析できるインタラクティブなクエリサービス"
};

// Game state
let currentRound = 0;
let totalRounds = 5;
let score = 0;
let currentChallenge = null;
let answered = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const challengeScreen = document.getElementById('challenge-screen');
const resultsScreen = document.getElementById('results-screen');
const challengeTitle = document.getElementById('challenge-title');
const challengeContent = document.getElementById('challenge-content');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const progressBar = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

// Event Listeners
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextChallenge);
restartBtn.addEventListener('click', startGame);

// Game Functions
function startGame() {
    welcomeScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    challengeScreen.classList.remove('hidden');
    
    currentRound = 0;
    score = 0;
    updateScore();
    nextChallenge();
}

function nextChallenge() {
    if (currentRound >= totalRounds) {
        showResults();
        return;
    }

    currentRound++;
    updateProgress();
    answered = false;
    nextBtn.disabled = true;
    feedbackElement.classList.add('hidden');

    // Randomly select a challenge type
    const challengeTypes = [
        guessServiceFromDescription,
        matchServiceToDescription,
        fillInTheBlanks,
        unscrambleService
    ];
    
    const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    randomChallenge();
}

function updateProgress() {
    const progressPercentage = (currentRound / totalRounds) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function updateScore() {
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
}

function showFeedback(isCorrect, message) {
    feedbackElement.textContent = message;
    feedbackElement.classList.remove('hidden', 'correct', 'incorrect');
    feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    nextBtn.disabled = false;
}

function showResults() {
    challengeScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    if (score >= 40) {
        resultMessage.textContent = "素晴らしい！あなたはAWSのエキスパートです！";
    } else if (score >= 25) {
        resultMessage.textContent = "よくできました！AWSサービスについてよく知っていますね！";
    } else {
        resultMessage.textContent = "頑張りました！これからもAWSサービスについて学び続けましょう！";
    }
}

// Challenge 1: Guess Service from Description
function guessServiceFromDescription() {
    challengeTitle.textContent = "チャレンジ: AWSサービス名を当てよう";
    
    // Select a random service
    const services = Object.keys(awsServices);
    const randomService = services[Math.floor(Math.random() * services.length)];
    const description = awsServices[randomService];
    
    currentChallenge = {
        type: 'guess',
        answer: randomService
    };
    
    // Create challenge content
    challengeContent.innerHTML = `
        <p>以下の説明に合うAWSサービスは何でしょうか？</p>
        <p><strong>${description}</strong></p>
        <div>
            <input type="text" id="guess-input" placeholder="サービス名を入力">
            <button id="submit-guess" class="btn">回答する</button>
        </div>
    `;
    
    // Add event listener
    document.getElementById('submit-guess').addEventListener('click', function() {
        if (answered) return;
        
        const userGuess = document.getElementById('guess-input').value.trim().toUpperCase();
        const correctAnswer = currentChallenge.answer.toUpperCase();
        
        if (userGuess === correctAnswer) {
            score += 10;
            updateScore();
            showFeedback(true, `正解です！${currentChallenge.answer}が正しいです。`);
        } else {
            showFeedback(false, `不正解です。正解は${currentChallenge.answer}でした。`);
        }
        
        answered = true;
    });
}

// Challenge 2: Match Service to Description
function matchServiceToDescription() {
    challengeTitle.textContent = "チャレンジ: サービスと説明をマッチングさせよう";
    
    // Select 4 random services
    const services = Object.keys(awsServices);
    const selectedServices = [];
    const usedIndices = new Set();
    
    while (selectedServices.length < 4) {
        const randomIndex = Math.floor(Math.random() * services.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            const service = services[randomIndex];
            selectedServices.push({
                name: service,
                description: awsServices[service]
            });
        }
    }
    
    // Shuffle descriptions
    const shuffledDescriptions = [...selectedServices].sort(() => Math.random() - 0.5);
    
    currentChallenge = {
        type: 'match',
        services: selectedServices,
        shuffledDescriptions: shuffledDescriptions,
        matches: {},
        correctMatches: 0
    };
    
    // Create challenge content
    let servicesHTML = '<div class="match-column"><h3>サービス</h3>';
    selectedServices.forEach((service, index) => {
        servicesHTML += `<div class="match-item service" data-index="${index}">${service.name}</div>`;
    });
    servicesHTML += '</div>';
    
    let descriptionsHTML = '<div class="match-column"><h3>説明</h3>';
    shuffledDescriptions.forEach((service, index) => {
        descriptionsHTML += `<div class="match-item description" data-index="${index}">${service.description}</div>`;
    });
    descriptionsHTML += '</div>';
    
    challengeContent.innerHTML = `
        <p>各サービスを正しい説明とマッチングさせてください。サービスをクリックしてから、対応する説明をクリックしてください。</p>
        <div class="match-game">
            ${servicesHTML}
            ${descriptionsHTML}
        </div>
        <button id="check-matches" class="btn">マッチングを確認</button>
    `;
    
    // Add event listeners
    let selectedService = null;
    
    document.querySelectorAll('.service').forEach(element => {
        element.addEventListener('click', function() {
            if (answered) return;
            
            // Deselect any previously selected service
            document.querySelectorAll('.service').forEach(el => el.classList.remove('selected'));
            
            // Select this service
            this.classList.add('selected');
            selectedService = parseInt(this.dataset.index);
        });
    });
    
    document.querySelectorAll('.description').forEach(element => {
        element.addEventListener('click', function() {
            if (answered || selectedService === null) return;
            
            const descriptionIndex = parseInt(this.dataset.index);
            
            // Remove previous match for this service if exists
            Object.keys(currentChallenge.matches).forEach(serviceIdx => {
                if (currentChallenge.matches[serviceIdx] === descriptionIndex) {
                    delete currentChallenge.matches[serviceIdx];
                }
            });
            
            // Create new match
            currentChallenge.matches[selectedService] = descriptionIndex;
            
            // Update UI
            document.querySelectorAll('.description').forEach(el => {
                if (parseInt(el.dataset.index) === descriptionIndex) {
                    el.classList.add('matched');
                }
            });
            
            // Deselect service
            document.querySelectorAll('.service').forEach(el => el.classList.remove('selected'));
            selectedService = null;
        });
    });
    
    document.getElementById('check-matches').addEventListener('click', function() {
        if (answered) return;
        
        // Check matches
        currentChallenge.correctMatches = 0;
        
        for (let i = 0; i < selectedServices.length; i++) {
            if (currentChallenge.matches[i] !== undefined) {
                const matchedDescription = shuffledDescriptions[currentChallenge.matches[i]];
                if (selectedServices[i].name === matchedDescription.name) {
                    currentChallenge.correctMatches++;
                }
            }
        }
        
        score += currentChallenge.correctMatches * 5;
        updateScore();
        
        showFeedback(
            currentChallenge.correctMatches === 4,
            `${currentChallenge.correctMatches}個の正しいマッチングがありました！`
        );
        
        answered = true;
    });
}

// Challenge 3: Fill in the Blanks
function fillInTheBlanks() {
    challengeTitle.textContent = "チャレンジ: 空欄を埋めよう";
    
    // Select a random service
    const services = Object.keys(awsServices);
    const randomService = services[Math.floor(Math.random() * services.length)];
    
    // Create a masked version with some letters replaced by underscores
    const serviceName = randomService.split('');
    const numToMask = Math.min(serviceName.length - 1, Math.max(2, Math.floor(serviceName.length / 2)));
    const maskPositions = [];
    
    while (maskPositions.length < numToMask) {
        const pos = Math.floor(Math.random() * serviceName.length);
        if (!maskPositions.includes(pos)) {
            maskPositions.push(pos);
        }
    }
    
    const maskedService = serviceName.map((char, index) => 
        maskPositions.includes(index) ? '_' : char
    ).join('');
    
    currentChallenge = {
        type: 'fill',
        answer: randomService
    };
    
    // Create challenge content
    challengeContent.innerHTML = `
        <p>空欄を埋めて、AWSサービス名を完成させてください：</p>
        <div class="fill-blanks">${maskedService}</div>
        <div>
            <input type="text" id="fill-input" placeholder="サービス名を入力">
            <button id="submit-fill" class="btn">回答する</button>
        </div>
    `;
    
    // Add event listener
    document.getElementById('submit-fill').addEventListener('click', function() {
        if (answered) return;
        
        const userGuess = document.getElementById('fill-input').value.trim().toUpperCase();
        const correctAnswer = currentChallenge.answer.toUpperCase();
        
        if (userGuess === correctAnswer) {
            score += 8;
            updateScore();
            showFeedback(true, `正解です！${currentChallenge.answer}が正しいです。`);
        } else {
            showFeedback(false, `不正解です。正解は${currentChallenge.answer}でした。`);
        }
        
        answered = true;
    });
}

// Challenge 4: Unscramble Service
function unscrambleService() {
    challengeTitle.textContent = "チャレンジ: 文字を並べ替えよう";
    
    // Select a service with at least 4 letters
    const services = Object.keys(awsServices).filter(service => service.length >= 4);
    const randomService = services[Math.floor(Math.random() * services.length)];
    
    // Scramble the letters
    const letters = randomService.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const scrambled = letters.join('');
    
    currentChallenge = {
        type: 'unscramble',
        answer: randomService,
        scrambled: scrambled
    };
    
    // Create challenge content
    challengeContent.innerHTML = `
        <p>文字を並べ替えて、AWSサービス名を完成させてください：</p>
        <div class="scrambled-letters">${scrambled}</div>
        <div>
            <input type="text" id="unscramble-input" placeholder="サービス名を入力">
            <button id="submit-unscramble" class="btn">回答する</button>
        </div>
    `;
    
    // Add event listener
    document.getElementById('submit-unscramble').addEventListener('click', function() {
        if (answered) return;
        
        const userGuess = document.getElementById('unscramble-input').value.trim().toUpperCase();
        const correctAnswer = currentChallenge.answer.toUpperCase();
        
        if (userGuess === correctAnswer) {
            score += 12;
            updateScore();
            showFeedback(true, `正解です！${currentChallenge.answer}が正しいです。`);
        } else {
            showFeedback(false, `不正解です。正解は${currentChallenge.answer}でした。`);
        }
        
        answered = true;
    });
}
