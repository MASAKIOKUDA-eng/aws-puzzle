/**
 * AWS Architecture Puzzle Game
 * A game to test knowledge of AWS services and architecture patterns
 */

// Game questions data
const questions = [
    {
        id: 1,
        title: "静的ウェブサイトホスティング",
        description: "コスト効率の良い静的ウェブサイトをホスティングするソリューションを構築してください。",
        requirements: [
            "静的HTMLファイル、CSS、JavaScriptをホスティングする",
            "グローバルに高速なコンテンツ配信を実現する",
            "HTTPSによる安全な接続を提供する",
            "コスト効率の良いソリューションであること"
        ],
        dropZones: [
            { id: "storage", x: 30, y: 40, label: "ストレージ" },
            { id: "delivery", x: 60, y: 40, label: "配信" },
            { id: "security", x: 45, y: 70, label: "セキュリティ" }
        ],
        connections: [
            { from: "storage", to: "delivery" },
            { from: "delivery", to: "security" }
        ],
        services: [
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
        hint: "静的コンテンツのホスティングには、サーバーレスのストレージサービスが最適です。グローバルな配信には、エッジロケーションを活用したサービスを検討してください。"
    },
    {
        id: 2,
        title: "スケーラブルなウェブアプリケーション",
        description: "負荷に応じて自動的にスケールするウェブアプリケーションを構築してください。",
        requirements: [
            "Webサーバーを複数のアベイラビリティゾーンに配置する",
            "負荷に応じて自動的にスケールする仕組みを実装する",
            "トラフィックを複数のサーバーに分散する",
            "データを永続化するためのデータベースを設定する"
        ],
        dropZones: [
            { id: "loadbalancer", x: 45, y: 20, label: "負荷分散" },
            { id: "compute", x: 45, y: 50, label: "コンピューティング" },
            { id: "database", x: 45, y: 80, label: "データベース" }
        ],
        connections: [
            { from: "loadbalancer", to: "compute" },
            { from: "compute", to: "database" }
        ],
        services: [
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
        hint: "複数のサーバーにトラフィックを分散するには、ロードバランサーが必要です。需要に応じて自動的にサーバー数を調整するサービスを選びましょう。"
    },
    {
        id: 3,
        title: "サーバーレスバックエンド",
        description: "サーバーレスアーキテクチャを使用してモバイルアプリのバックエンドを構築してください。",
        requirements: [
            "サーバー管理なしでAPIエンドポイントを提供する",
            "認証と認可の仕組みを実装する",
            "データを永続化するためのデータベースを設定する",
            "ファイルアップロード機能を提供する"
        ],
        dropZones: [
            { id: "api", x: 45, y: 20, label: "API" },
            { id: "auth", x: 20, y: 50, label: "認証" },
            { id: "compute", x: 45, y: 50, label: "コンピューティング" },
            { id: "storage", x: 70, y: 50, label: "ストレージ" },
            { id: "database", x: 45, y: 80, label: "データベース" }
        ],
        connections: [
            { from: "api", to: "compute" },
            { from: "auth", to: "compute" },
            { from: "compute", to: "storage" },
            { from: "compute", to: "database" }
        ],
        services: [
            { id: "apigateway", name: "API Gateway", description: "APIの作成、公開、管理" },
            { id: "cognito", name: "Cognito", description: "ユーザー認証と認可" },
            { id: "lambda", name: "Lambda", description: "サーバーレスコンピューティング" },
            { id: "s3", name: "S3", description: "オブジェクトストレージサービス" },
            { id: "dynamodb", name: "DynamoDB", description: "NoSQLデータベース" },
            { id: "rds", name: "RDS", description: "リレーショナルデータベース" }
        ],
        solution: {
            "api": "apigateway",
            "auth": "cognito",
            "compute": "lambda",
            "storage": "s3",
            "database": "dynamodb"
        },
        hint: "サーバーレスアーキテクチャでは、イベント駆動型のコンピューティングサービスとマネージドサービスを組み合わせることで、インフラストラクチャ管理の負担を軽減できます。"
    },
    {
        id: 4,
        title: "マイクロサービスアーキテクチャ",
        description: "コンテナ化されたマイクロサービスアーキテクチャを構築してください。",
        requirements: [
            "複数のマイクロサービスをコンテナとして実行する",
            "サービス間の通信を管理する",
            "外部からのトラフィックをルーティングする",
            "サービスの自動スケーリングを実現する"
        ],
        dropZones: [
            { id: "loadbalancer", x: 45, y: 20, label: "負荷分散" },
            { id: "orchestration", x: 45, y: 50, label: "オーケストレーション" },
            { id: "messaging", x: 20, y: 50, label: "メッセージング" },
            { id: "registry", x: 70, y: 50, label: "コンテナレジストリ" },
            { id: "database", x: 45, y: 80, label: "データベース" }
        ],
        connections: [
            { from: "loadbalancer", to: "orchestration" },
            { from: "messaging", to: "orchestration" },
            { from: "registry", to: "orchestration" },
            { from: "orchestration", to: "database" }
        ],
        services: [
            { id: "elb", name: "ELB", description: "Elastic Load Balancing" },
            { id: "ecs", name: "ECS", description: "Elastic Container Service" },
            { id: "eks", name: "EKS", description: "Elastic Kubernetes Service" },
            { id: "sqs", name: "SQS", description: "Simple Queue Service" },
            { id: "ecr", name: "ECR", description: "Elastic Container Registry" },
            { id: "aurora", name: "Aurora", description: "マネージドリレーショナルデータベース" }
        ],
        solution: {
            "loadbalancer": "elb",
            "orchestration": "ecs",
            "messaging": "sqs",
            "registry": "ecr",
            "database": "aurora"
        },
        hint: "コンテナオーケストレーションサービスを使用して、複数のコンテナを管理・スケーリングします。サービス間の疎結合を実現するためにメッセージングサービスを検討してください。"
    },
    {
        id: 5,
        title: "ビッグデータ分析パイプライン",
        description: "大量のデータを収集、処理、分析するためのパイプラインを構築してください。",
        requirements: [
            "様々なソースからのデータを収集する",
            "リアルタイムでデータを処理する",
            "大規模なデータセットを分析する",
            "分析結果を可視化する"
        ],
        dropZones: [
            { id: "ingestion", x: 20, y: 30, label: "データ取り込み" },
            { id: "streaming", x: 45, y: 30, label: "ストリーミング処理" },
            { id: "storage", x: 70, y: 30, label: "ストレージ" },
            { id: "processing", x: 30, y: 70, label: "バッチ処理" },
            { id: "analytics", x: 60, y: 70, label: "分析・可視化" }
        ],
        connections: [
            { from: "ingestion", to: "streaming" },
            { from: "streaming", to: "storage" },
            { from: "storage", to: "processing" },
            { from: "processing", to: "analytics" }
        ],
        services: [
            { id: "kinesis", name: "Kinesis", description: "リアルタイムデータストリーミング" },
            { id: "firehose", name: "Firehose", description: "ストリーミングデータ配信" },
            { id: "s3", name: "S3", description: "オブジェクトストレージサービス" },
            { id: "emr", name: "EMR", description: "マネージドHadoopフレームワーク" },
            { id: "athena", name: "Athena", description: "インタラクティブなクエリサービス" },
            { id: "quicksight", name: "QuickSight", description: "ビジネスインテリジェンスサービス" }
        ],
        solution: {
            "ingestion": "firehose",
            "streaming": "kinesis",
            "storage": "s3",
            "processing": "emr",
            "analytics": "quicksight"
        },
        hint: "データパイプラインでは、データの取り込み、処理、保存、分析の各段階に適したサービスを選択することが重要です。ストリーミングデータにはリアルタイム処理サービスを検討してください。"
    }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let questionResults = [];
let placedServices = {};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    initGame();
});

function initGame() {
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    questionResults = [];
    placedServices = {};
    
    // Set up event listeners
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('check-answer-button').addEventListener('click', checkAnswer);
    document.getElementById('hint-button').addEventListener('click', showHint);
    document.getElementById('continue-button').addEventListener('click', nextQuestion);
    document.getElementById('restart-button').addEventListener('click', initGame);
    
    // Show welcome screen
    showScreen('welcome-screen');
}

function startGame() {
    // Load the first question
    loadQuestion(currentQuestionIndex);
    
    // Show game screen
    showScreen('game-screen');
}

function loadQuestion(index) {
    const question = questions[index];
    
    // Update progress
    document.getElementById('current-question').textContent = index + 1;
    document.getElementById('progress-fill').style.width = `${((index + 1) / questions.length) * 100}%`;
    
    // Set question title and requirements
    document.getElementById('question-title').textContent = question.title;
    
    const requirementsList = document.getElementById('requirements-list');
    requirementsList.innerHTML = '';
    question.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        requirementsList.appendChild(li);
    });
    
    // Set up architecture canvas
    const canvas = document.getElementById('architecture-canvas');
    canvas.innerHTML = '';
    
    // Create drop zones
    question.dropZones.forEach(zone => {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.id = `zone-${zone.id}`;
        dropZone.style.left = `${zone.x}%`;
        dropZone.style.top = `${zone.y}%`;
        
        const label = document.createElement('div');
        label.className = 'drop-zone-label';
        label.textContent = zone.label;
        
        dropZone.appendChild(label);
        canvas.appendChild(dropZone);
        
        // Add drop event listeners
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Create connections
    drawConnections(question);
    
    // Create service items
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';
    
    question.services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.draggable = true;
        serviceItem.dataset.serviceId = service.id;
        
        const icon = document.createElement('div');
        icon.className = 'service-icon';
        icon.textContent = service.name.charAt(0);
        
        const info = document.createElement('div');
        info.className = 'service-info';
        
        const name = document.createElement('div');
        name.className = 'service-name';
        name.textContent = service.name;
        
        const description = document.createElement('div');
        description.className = 'service-description';
        description.textContent = service.description;
        
        info.appendChild(name);
        info.appendChild(description);
        
        serviceItem.appendChild(icon);
        serviceItem.appendChild(info);
        servicesList.appendChild(serviceItem);
        
        // Add drag event listeners
        serviceItem.addEventListener('dragstart', handleDragStart);
        serviceItem.addEventListener('dragend', handleDragEnd);
    });
    
    // Reset placed services
    placedServices = {};
}

function drawConnections(question) {
    const canvas = document.getElementById('architecture-canvas');
    
    // Wait for drop zones to be rendered
    setTimeout(() => {
        question.connections.forEach(conn => {
            const fromZone = document.getElementById(`zone-${conn.from}`);
            const toZone = document.getElementById(`zone-${conn.to}`);
            
            if (!fromZone || !toZone) return;
            
            const fromRect = fromZone.getBoundingClientRect();
            const toRect = toZone.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate center points
            const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
            const toX = toRect.left + toRect.width / 2 - canvasRect.left;
            const toY = toRect.top + toRect.height / 2 - canvasRect.top;
            
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
            
            canvas.appendChild(connection);
        });
    }, 100);
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

function placeService(serviceId, zoneId) {
    const question = questions[currentQuestionIndex];
    const service = question.services.find(s => s.id === serviceId);
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
    
    const icon = document.createElement('div');
    icon.className = 'service-icon';
    icon.textContent = service.name.charAt(0);
    
    const name = document.createElement('div');
    name.className = 'service-name';
    name.textContent = service.name;
    
    placedService.appendChild(icon);
    placedService.appendChild(name);
    dropZone.appendChild(placedService);
    
    // Update placed services state
    placedServices[zoneId] = serviceId;
}

function checkAnswer() {
    const question = questions[currentQuestionIndex];
    const solution = question.solution;
    let correct = 0;
    let total = Object.keys(solution).length;
    let details = [];
    
    // Check each drop zone
    for (const zoneId in solution) {
        const expectedService = solution[zoneId];
        const actualService = placedServices[zoneId] || null;
        
        if (actualService === expectedService) {
            correct++;
            details.push({
                text: `✓ ${getZoneLabel(zoneId)}に${getServiceName(expectedService)}を正しく配置しました。`,
                correct: true
            });
        } else if (actualService) {
            details.push({
                text: `✗ ${getZoneLabel(zoneId)}には${getServiceName(expectedService)}が必要ですが、${getServiceName(actualService)}が配置されています。`,
                correct: false
            });
        } else {
            details.push({
                text: `✗ ${getZoneLabel(zoneId)}に${getServiceName(expectedService)}を配置する必要があります。`,
                correct: false
            });
        }
    }
    
    // Calculate question score (0-20 points per question)
    const questionScore = Math.round((correct / total) * 20);
    
    // Update total score
    score += questionScore;
    document.getElementById('score').textContent = score;
    
    // Save question result
    questionResults.push({
        questionId: question.id,
        title: question.title,
        score: questionScore,
        maxScore: 20
    });
    
    // Show feedback
    showFeedback(correct === total, questionScore, details);
}

function showFeedback(isCorrect, questionScore, details) {
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackDetails = document.getElementById('feedback-details');
    
    feedbackTitle.textContent = isCorrect ? '正解！' : '不正解';
    feedbackMessage.textContent = isCorrect 
        ? `素晴らしい！すべてのサービスを正しく配置しました。スコア: ${questionScore}/20点`
        : `いくつかのサービスが正しく配置されていません。スコア: ${questionScore}/20点`;
    
    feedbackDetails.innerHTML = '';
    details.forEach(detail => {
        const item = document.createElement('div');
        item.className = `feedback-item ${detail.correct ? 'correct' : 'incorrect'}`;
        item.textContent = detail.text;
        feedbackDetails.appendChild(item);
    });
    
    showScreen('feedback-screen');
}

function showHint() {
    const question = questions[currentQuestionIndex];
    alert(question.hint);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
        showScreen('game-screen');
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('final-score').textContent = score;
    
    // Display message based on score
    const resultMessage = document.getElementById('result-message');
    if (score >= 90) {
        resultMessage.textContent = 'すばらしい！あなたはAWSアーキテクチャの達人です！';
    } else if (score >= 70) {
        resultMessage.textContent = 'よくできました！AWSサービスについてよく理解しています。';
    } else if (score >= 50) {
        resultMessage.textContent = '良い結果です。さらにAWSサービスについて学びましょう。';
    } else {
        resultMessage.textContent = '頑張りました！AWSアーキテクチャの基本を復習してみましょう。';
    }
    
    // Display question results
    const questionResultsElement = document.getElementById('question-results');
    questionResultsElement.innerHTML = '';
    
    questionResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'question-result';
        resultItem.innerHTML = `
            <div>${result.title}</div>
            <div>${result.score}/${result.maxScore}点</div>
        `;
        questionResultsElement.appendChild(resultItem);
    });
    
    showScreen('results-screen');
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.remove('hidden');
}

// Helper functions
function getServiceName(serviceId) {
    const question = questions[currentQuestionIndex];
    const service = question.services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
}

function getZoneLabel(zoneId) {
    const question = questions[currentQuestionIndex];
    const zone = question.dropZones.find(z => z.id === zoneId);
    return zone ? zone.label : zoneId;
}
