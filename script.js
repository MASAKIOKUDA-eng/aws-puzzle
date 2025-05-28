// AWS Architecture Puzzle Game

// Game data
const levels = [
    {
        id: 1,
        title: "静的ウェブサイトホスティング",
        description: "コスト効率の良い静的ウェブサイトをホスティングするソリューションを構築してください。",
        difficulty: "簡単",
        requirements: [
            "静的HTMLファイル、CSS、JavaScriptをホスティングする",
            "グローバルに高速なコンテンツ配信を実現する",
            "HTTPSによる安全な接続を提供する",
            "コスト効率の良いソリューションであること"
        ],
        dropZones: [
            { id: "storage", x: 150, y: 150, label: "ストレージ" },
            { id: "delivery", x: 400, y: 150, label: "配信" },
            { id: "security", x: 275, y: 300, label: "セキュリティ" }
        ],
        connections: [
            { from: "storage", to: "delivery" },
            { from: "delivery", to: "security" }
        ],
        availableServices: [
            { id: "s3", name: "S3", description: "オブジェクトストレージサービス" },
            { id: "ec2", name: "EC2", description: "仮想サーバー" },
            { id: "cloudfront", name: "CloudFront", description: "コンテンツ配信ネットワーク" },
            { id: "rds", name: "RDS", description: "リレーショナルデータベース" },
            { id: "route53", name: "Route 53", description: "DNSサービス" },
            { id: "acm", name: "ACM", description: "SSL/TLS証明書管理" }
        ],
        solution: {
            "storage": "s3",
            "delivery": "cloudfront",
            "security": "acm"
        },
        hints: [
            "静的コンテンツのホスティングには、サーバーレスのストレージサービスが最適です。",
            "グローバルな配信には、エッジロケーションを活用したサービスを検討してください。",
            "安全な接続には、SSL/TLS証明書が必要です。"
        ]
    },
    {
        id: 2,
        title: "スケーラブルなウェブアプリケーション",
        description: "負荷に応じて自動的にスケールするウェブアプリケーションを構築してください。",
        difficulty: "普通",
        requirements: [
            "Webサーバーを複数のアベイラビリティゾーンに配置する",
            "負荷に応じて自動的にスケールする仕組みを実装する",
            "トラフィックを複数のサーバーに分散する",
            "データを永続化するためのデータベースを設定する"
        ],
        dropZones: [
            { id: "loadbalancer", x: 275, y: 100, label: "負荷分散" },
            { id: "compute", x: 275, y: 250, label: "コンピューティング" },
            { id: "database", x: 275, y: 400, label: "データベース" }
        ],
        connections: [
            { from: "loadbalancer", to: "compute" },
            { from: "compute", to: "database" }
        ],
        availableServices: [
            { id: "ec2", name: "EC2", description: "仮想サーバー" },
            { id: "elb", name: "ELB", description: "Elastic Load Balancing" },
            { id: "asg", name: "Auto Scaling", description: "Auto Scaling Group" },
            { id: "rds", name: "RDS", description: "リレーショナルデータベース" },
            { id: "dynamodb", name: "DynamoDB", description: "NoSQLデータベース" },
            { id: "lambda", name: "Lambda", description: "サーバーレスコンピューティング" }
        ],
        solution: {
            "loadbalancer": "elb",
            "compute": "asg",
            "database": "rds"
        },
        hints: [
            "複数のサーバーにトラフィックを分散するには、ロードバランサーが必要です。",
            "需要に応じて自動的にサーバー数を調整するサービスを選びましょう。",
            "リレーショナルデータベースが必要な場合は、マネージドサービスを検討してください。"
        ]
    }
];

// Game state
let currentLevel = null;
let score = 0;
let completedLevels = {};
let placedServices = {};
let timerInterval = null;
let remainingTime = 0;

// DOM Elements
let welcomeScreen, levelSelectScreen, puzzleScreen, resultsScreen, puzzleTitle, 
    requirementsList, dropZonesContainer, connectionsContainer, availableServicesContainer,
    scoreElement, finalScoreElement, resultMessage, completedLevelsElement, timerElement,
    feedbackModal, feedbackTitle, feedbackMessage, feedbackDetails;

// Initialize DOM elements when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    welcomeScreen = document.getElementById('welcome-screen');
    levelSelectScreen = document.getElementById('level-select-screen');
    puzzleScreen = document.getElementById('puzzle-screen');
    resultsScreen = document.getElementById('results-screen');
    puzzleTitle = document.getElementById('puzzle-title');
    requirementsList = document.getElementById('requirements-list');
    dropZonesContainer = document.getElementById('drop-zones');
    connectionsContainer = document.getElementById('connections');
    availableServicesContainer = document.getElementById('available-services');
    scoreElement = document.getElementById('score');
    finalScoreElement = document.getElementById('final-score');
    resultMessage = document.getElementById('result-message');
    completedLevelsElement = document.getElementById('completed-levels');
    timerElement = document.getElementById('timer');
    feedbackModal = document.getElementById('feedback-modal');
    feedbackTitle = document.getElementById('feedback-title');
    feedbackMessage = document.getElementById('feedback-message');
    feedbackDetails = document.getElementById('feedback-details');
    
    // Set up event listeners
    document.getElementById('start-btn').addEventListener('click', showLevelSelect);
    document.getElementById('check-solution-btn').addEventListener('click', checkSolution);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('back-to-levels-btn').addEventListener('click', showLevelSelect);
    document.getElementById('continue-btn').addEventListener('click', closeFeedbackModal);
    document.getElementById('restart-btn').addEventListener('click', showLevelSelect);
    
    // Add event listener to close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeFeedbackModal);
    }
    
    // Add event listeners to level cards
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            const levelId = parseInt(card.dataset.level);
            startLevel(levelId);
        });
    });
    
    // Initialize game
    initializeGame();
});

// Initialize the game
function initializeGame() {
    // Start at welcome screen
    welcomeScreen.classList.remove('hidden');
    levelSelectScreen.classList.add('hidden');
    puzzleScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    
    // Make sure feedback modal is hidden
    if (feedbackModal) {
        feedbackModal.classList.add('hidden');
    }
}

// Initialize level selection
function showLevelSelect() {
    welcomeScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    puzzleScreen.classList.add('hidden');
    levelSelectScreen.classList.remove('hidden');
}

// Start a level
function startLevel(levelId) {
    // Find the level data
    currentLevel = levels.find(level => level.id === levelId);
    if (!currentLevel) return;
    
    // Reset level state
    placedServices = {};
    
    // Show puzzle screen
    levelSelectScreen.classList.add('hidden');
    puzzleScreen.classList.remove('hidden');
    
    // Set up the level
    puzzleTitle.textContent = `レベル ${currentLevel.id}: ${currentLevel.title}`;
    
    // Set up requirements
    requirementsList.innerHTML = '';
    currentLevel.requirements.forEach(req => {
        const reqItem = document.createElement('div');
        reqItem.className = 'requirement-item';
        reqItem.textContent = req;
        requirementsList.appendChild(reqItem);
    });
    
    // Set up drop zones
    dropZonesContainer.innerHTML = '';
    currentLevel.dropZones.forEach(zone => {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.id = `zone-${zone.id}`;
        dropZone.style.left = `${zone.x}px`;
        dropZone.style.top = `${zone.y}px`;
        
        const zoneLabel = document.createElement('div');
        zoneLabel.className = 'zone-label';
        zoneLabel.textContent = zone.label;
        
        dropZone.appendChild(zoneLabel);
        dropZonesContainer.appendChild(dropZone);
        
        // Add drop event listeners
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Set up connections
    drawConnections();
    
    // Set up available services
    availableServicesContainer.innerHTML = '';
    currentLevel.availableServices.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.draggable = true;
        serviceItem.dataset.serviceId = service.id;
        
        // Use a placeholder for the icon
        const serviceIcon = document.createElement('div');
        serviceIcon.className = 'service-icon';
        serviceIcon.textContent = service.name.charAt(0);
        
        const serviceName = document.createElement('div');
        serviceName.textContent = service.name;
        
        const serviceDesc = document.createElement('div');
        serviceDesc.className = 'service-description';
        serviceDesc.textContent = service.description;
        
        serviceItem.appendChild(serviceIcon);
        serviceItem.appendChild(serviceName);
        serviceItem.appendChild(serviceDesc);
        availableServicesContainer.appendChild(serviceItem);
        
        // Add drag event listeners
        serviceItem.addEventListener('dragstart', handleDragStart);
        serviceItem.addEventListener('dragend', handleDragEnd);
    });
    
    // Set up timer
    remainingTime = 300; // 5 minutes
    updateTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Draw connections between drop zones
function drawConnections() {
    connectionsContainer.innerHTML = '';
    
    if (!currentLevel || !currentLevel.connections) return;
    
    currentLevel.connections.forEach(conn => {
        const fromZone = document.getElementById(`zone-${conn.from}`);
        const toZone = document.getElementById(`zone-${conn.to}`);
        
        if (!fromZone || !toZone) return;
        
        const fromRect = fromZone.getBoundingClientRect();
        const toRect = toZone.getBoundingClientRect();
        const boardRect = dropZonesContainer.getBoundingClientRect();
        
        // Calculate center points
        const fromX = fromRect.left + fromRect.width / 2 - boardRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - boardRect.top;
        const toX = toRect.left + toRect.width / 2 - boardRect.left;
        const toY = toRect.top + toRect.height / 2 - boardRect.top;
        
        // Calculate distance and angle
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create connection line
        const connection = document.createElement('div');
        connection.className = 'connection';
        connection.style.width = `${distance}px`;
        connection.style.left = `${fromX}px`;
        connection.style.top = `${fromY}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        connectionsContainer.appendChild(connection);
    });
}

// Drag and drop handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.serviceId);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('highlight');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('highlight');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('highlight');
    
    const serviceId = e.dataTransfer.getData('text/plain');
    const zoneId = dropZone.id.replace('zone-', '');
    
    // Place the service in the drop zone
    placeService(serviceId, zoneId);
}

// Place a service in a drop zone
function placeService(serviceId, zoneId) {
    const service = currentLevel.availableServices.find(s => s.id === serviceId);
    const dropZone = document.getElementById(`zone-${zoneId}`);
    
    if (!service || !dropZone) return;
    
    // Remove any existing service in this zone
    const existingService = dropZone.querySelector('.placed-service');
    if (existingService) {
        existingService.remove();
    }
    
    // Create placed service element
    const placedService = document.createElement('div');
    placedService.className = 'placed-service';
    placedService.dataset.serviceId = serviceId;
    
    // Use a placeholder for the icon
    const serviceIcon = document.createElement('div');
    serviceIcon.className = 'service-icon';
    serviceIcon.textContent = service.name.charAt(0);
    
    const serviceName = document.createElement('div');
    serviceName.className = 'service-name';
    serviceName.textContent = service.name;
    
    placedService.appendChild(serviceIcon);
    placedService.appendChild(serviceName);
    dropZone.appendChild(placedService);
    
    // Update placed services state
    placedServices[zoneId] = serviceId;
}

// Check the solution
function checkSolution() {
    if (!currentLevel) return;
    
    const solution = currentLevel.solution;
    let correct = 0;
    let total = Object.keys(solution).length;
    let details = [];
    
    // Check each drop zone
    for (const zoneId in solution) {
        const expectedService = solution[zoneId];
        const actualService = placedServices[zoneId] || null;
        
        if (actualService === expectedService) {
            correct++;
            details.push(`✓ ${zoneId}に${getServiceName(expectedService)}を正しく配置しました。`);
        } else if (actualService) {
            details.push(`✗ ${zoneId}には${getServiceName(expectedService)}が必要ですが、${getServiceName(actualService)}が配置されています。`);
        } else {
            details.push(`✗ ${zoneId}に${getServiceName(expectedService)}を配置する必要があります。`);
        }
    }
    
    // Calculate score
    const levelScore = Math.round((correct / total) * 100);
    
    // Update completed levels
    completedLevels[currentLevel.id] = levelScore;
    
    // Update total score
    score = Object.values(completedLevels).reduce((sum, score) => sum + score, 0);
    scoreElement.textContent = score;
    
    // Show feedback
    showFeedback(correct === total, levelScore, details);
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Show hint
function showHint() {
    if (!currentLevel || !currentLevel.hints || currentLevel.hints.length === 0) return;
    
    // Get a random hint
    const randomHint = currentLevel.hints[Math.floor(Math.random() * currentLevel.hints.length)];
    
    // Show hint in feedback modal
    feedbackTitle.textContent = 'ヒント';
    feedbackMessage.textContent = randomHint;
    feedbackDetails.innerHTML = '';
    
    // Show the modal
    if (feedbackModal) {
        feedbackModal.classList.remove('hidden');
    }
}

// Show feedback modal
function showFeedback(isCorrect, levelScore, details) {
    if (!feedbackModal) return;
    
    feedbackTitle.textContent = isCorrect ? '正解！' : '不正解';
    feedbackMessage.textContent = isCorrect 
        ? `素晴らしい！すべてのサービスを正しく配置しました。スコア: ${levelScore}点`
        : `いくつかのサービスが正しく配置されていません。スコア: ${levelScore}点`;
    
    feedbackDetails.innerHTML = details.map(detail => `<p>${detail}</p>`).join('');
    feedbackModal.classList.remove('hidden');
}

// Close feedback modal
function closeFeedbackModal() {
    if (!feedbackModal) return;
    
    feedbackModal.classList.add('hidden');
    
    // If all levels are completed, show results
    const allLevelsCompleted = levels.every(level => completedLevels[level.id] !== undefined);
    if (allLevelsCompleted) {
        showResults();
    }
}

// Show results screen
function showResults() {
    puzzleScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    finalScoreElement.textContent = score;
    
    // Display message based on score
    const maxScore = levels.length * 100;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) {
        resultMessage.textContent = 'すばらしい！あなたはAWSアーキテクチャの達人です！';
    } else if (percentage >= 70) {
        resultMessage.textContent = 'よくできました！AWSサービスについてよく理解しています。';
    } else {
        resultMessage.textContent = '頑張りました！さらにAWSサービスについて学びましょう。';
    }
    
    // Display completed levels
    completedLevelsElement.innerHTML = '';
    levels.forEach(level => {
        const levelScore = completedLevels[level.id] || 0;
        const levelResult = document.createElement('div');
        levelResult.className = 'level-result';
        levelResult.innerHTML = `
            <div>レベル ${level.id}: ${level.title}</div>
            <div class="level-score">${levelScore}点</div>
        `;
        completedLevelsElement.appendChild(levelResult);
    });
}

// Update timer
function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        checkSolution();
        return;
    }
    
    remainingTime--;
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to get service name by ID
function getServiceName(serviceId) {
    const service = currentLevel.availableServices.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
}
