// 전역 변수
let userData = {};
let studyPlan = null;
let matchedGroup = null;

// DOM 요소들
const onboardingSection = document.getElementById('onboarding');
const dashboardSection = document.getElementById('dashboard');
const goalForm = document.getElementById('goalForm');
const studyPlanDiv = document.getElementById('studyPlan');
const groupInfoDiv = document.getElementById('groupInfo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const findGroupBtn = document.getElementById('findGroupBtn');
const createGroupBtn = document.getElementById('createGroupBtn');
const resourcesDiv = document.getElementById('resources');
const loadingOverlay = document.getElementById('loadingOverlay');

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    goalForm.addEventListener('submit', handleGoalSubmit);
    sendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleChatSend();
    });
    findGroupBtn.addEventListener('click', handleFindGroup);
    createGroupBtn.addEventListener('click', handleCreateGroup);
});

// 목표 제출 처리
async function handleGoalSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(goalForm);
    userData = {
        subject: formData.get('subject') || document.getElementById('subject').value,
        targetGrade: formData.get('targetGrade') || document.getElementById('targetGrade').value,
        currentLevel: formData.get('currentLevel') || document.getElementById('currentLevel').value
    };
    
    showLoading(true);
    
    try {
        // 학습 플랜 생성
        await generateStudyPlan();
        
        // 학습 자료 생성
        await generateResources();
        
        // 대시보드로 전환
        showDashboard();
        
    } catch (error) {
        console.error('Error:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        showLoading(false);
    }
}

// 학습 플랜 생성
async function generateStudyPlan() {
    const prompt = `
당신은 대학생을 위한 전문 학습 멘토입니다. 
다음 정보를 바탕으로 8주 학습 플랜을 생성해주세요:

과목: ${userData.subject}
목표 성적: ${userData.targetGrade}
현재 수준: ${userData.currentLevel}

다음 형식으로 JSON 응답해주세요:
{
  "weeks": [
    {
      "week": 1,
      "title": "주차 제목",
      "tasks": [
        "구체적인 학습 태스크 1",
        "구체적인 학습 태스크 2",
        "구체적인 학습 태스크 3"
      ],
      "focus": "이 주차의 핵심 포인트"
    }
  ],
  "tips": [
    "학습 팁 1",
    "학습 팁 2",
    "학습 팁 3"
  ]
}
`;

    try {
        // 실제 OpenAI API 호출 대신 시뮬레이션
        const response = await simulateOpenAIResponse(prompt);
        studyPlan = response;
        displayStudyPlan(response);
    } catch (error) {
        // 폴백: 기본 플랜 생성
        studyPlan = generateFallbackPlan();
        displayStudyPlan(studyPlan);
    }
}

// 학습 플랜 표시
function displayStudyPlan(plan) {
    let html = '<div class="plan-tips">';
    html += '<h4>📚 학습 팁</h4>';
    plan.tips.forEach(tip => {
        html += `<p>• ${tip}</p>`;
    });
    html += '</div>';
    
    plan.weeks.forEach(week => {
        html += `
        <div class="plan-week">
            <h4>📅 ${week.week}주차: ${week.title}</h4>
            <p><strong>핵심:</strong> ${week.focus}</p>
            <div class="plan-tasks">
        `;
        
        week.tasks.forEach(task => {
            html += `<div class="plan-task">✓ ${task}</div>`;
        });
        
        html += '</div></div>';
    });
    
    studyPlanDiv.innerHTML = html;
}

// 학습 자료 생성
async function generateResources() {
    const resources = [
        {
            title: "📖 교재 요약 노트",
            description: `${userData.subject} 핵심 개념 정리 및 요약 자료`,
            type: "요약"
        },
        {
            title: "🎯 시험 대비 문제집",
            description: "목표 성적 달성을 위한 연습 문제 모음",
            type: "문제"
        },
        {
            title: "📝 학습 체크리스트",
            description: "주차별 학습 진도 확인 체크리스트",
            type: "체크리스트"
        },
        {
            title: "💡 학습 전략 가이드",
            description: "효과적인 학습 방법과 시간 관리 팁",
            type: "가이드"
        }
    ];
    
    displayResources(resources);
}

// 학습 자료 표시
function displayResources(resources) {
    let html = '';
    resources.forEach(resource => {
        html += `
        <div class="resource-item">
            <h4>${resource.title}</h4>
            <p>${resource.description}</p>
            <small>유형: ${resource.type}</small>
        </div>
        `;
    });
    resourcesDiv.innerHTML = html;
}

// 스터디 그룹 찾기
async function handleFindGroup() {
    showLoading(true);
    
    try {
        // 랜덤 매칭 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const groups = [
            {
                subject: userData.subject,
                goal: `${userData.targetGrade} 목표`,
                members: "김민지, 박현우, 이지은 (3명)",
                link: "https://meet.google.com/abc-defg-hij"
            },
            {
                subject: "유사 과목",
                goal: "A+ 목표",
                members: "최준호, 정수진 (2명)",
                link: "https://meet.google.com/xyz-uvw-rst"
            }
        ];
        
        const matchedGroup = groups[Math.floor(Math.random() * groups.length)];
        displayMatchedGroup(matchedGroup);
        
    } catch (error) {
        console.error('Error:', error);
        alert('그룹 매칭 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 매칭된 그룹 표시
function displayMatchedGroup(group) {
    document.getElementById('groupSubject').textContent = group.subject;
    document.getElementById('groupGoal').textContent = group.goal;
    document.getElementById('groupMembers').textContent = group.members;
    document.getElementById('groupLink').href = group.link;
    
    groupInfoDiv.classList.remove('hidden');
}

// 그룹 만들기
function handleCreateGroup() {
    const link = `https://meet.google.com/${generateRandomString(3)}-${generateRandomString(3)}-${generateRandomString(3)}`;
    
    const newGroup = {
        subject: userData.subject,
        goal: `${userData.targetGrade} 목표`,
        members: "나 (1명) - 대기 중",
        link: link
    };
    
    displayMatchedGroup(newGroup);
    alert('새 그룹이 생성되었습니다! 다른 학생들이 참여할 때까지 기다려주세요.');
}

// 챗봇 메시지 전송
async function handleChatSend() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // 사용자 메시지 추가
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // AI 응답 생성
    const response = await generateAIResponse(message);
    addChatMessage(response, 'bot');
}

// 챗봇 메시지 추가
function addChatMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI 응답 생성
async function generateAIResponse(userMessage) {
    const context = `
당신은 대학생을 위한 전문 학습 멘토입니다.
현재 사용자 정보:
- 과목: ${userData.subject}
- 목표 성적: ${userData.targetGrade}
- 현재 수준: ${userData.currentLevel}

사용자의 질문에 대해 친근하고 도움이 되는 답변을 해주세요.
답변은 2-3문장으로 간결하게 작성해주세요.
`;

    try {
        // 실제 OpenAI API 호출 대신 시뮬레이션
        const response = await simulateOpenAIResponse(context + "\n\n질문: " + userMessage);
        return response;
    } catch (error) {
        return generateFallbackResponse(userMessage);
    }
}

// 대시보드 표시
function showDashboard() {
    onboardingSection.classList.remove('active');
    dashboardSection.classList.add('active');
}

// 로딩 표시/숨김
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

// OpenAI API 응답 시뮬레이션
async function simulateOpenAIResponse(prompt) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 프롬프트에 따라 다른 응답 생성
    if (prompt.includes('학습 플랜')) {
        return generateFallbackPlan();
    } else if (prompt.includes('질문:')) {
        return generateFallbackResponse(prompt.split('질문:')[1]);
    }
    
    return "죄송합니다. 응답을 생성할 수 없습니다.";
}

// 폴백 학습 플랜 생성
function generateFallbackPlan() {
    const subject = userData.subject;
    const level = userData.currentLevel;
    
    return {
        weeks: [
            {
                week: 1,
                title: "기초 개념 이해",
                tasks: [
                    `${subject} 기본 용어 정리하기`,
                    "교재 1-2장 읽고 요약하기",
                    "개념 정리 노트 작성하기"
                ],
                focus: "과목의 기본 개념과 용어를 확실히 이해하기"
            },
            {
                week: 2,
                title: "핵심 이론 학습",
                tasks: [
                    "주요 이론과 원리 학습하기",
                    "예제 문제 풀이 연습하기",
                    "이론 간 연결점 파악하기"
                ],
                focus: "핵심 이론을 체계적으로 정리하고 이해하기"
            },
            {
                week: 3,
                title: "실전 문제 연습",
                tasks: [
                    "기출문제 유형 분석하기",
                    "유사 문제 반복 풀이하기",
                    "오답 노트 작성하기"
                ],
                focus: "문제 풀이 능력 향상과 실전 감각 기르기"
            },
            {
                week: 4,
                title: "심화 학습",
                tasks: [
                    "고난도 문제 도전하기",
                    "관련 논문이나 자료 추가 학습하기",
                    "개인 프로젝트 또는 과제 수행하기"
                ],
                focus: "심화 지식 습득과 창의적 사고력 개발"
            }
        ],
        tips: [
            "매일 30분씩 꾸준히 학습하는 것이 효과적입니다.",
            "복습은 학습한 지 24시간 이내에 하는 것이 좋습니다.",
            "스터디 그룹과 함께 학습하면 동기부여가 됩니다.",
            "정기적으로 학습 진도를 점검하고 계획을 조정하세요."
        ]
    };
}

// 폴백 챗봇 응답 생성
function generateFallbackResponse(userMessage) {
    const responses = [
        "좋은 질문이네요! 그 부분에 대해 더 자세히 설명해드릴게요.",
        "그 질문에 대한 답변을 찾아보고 있어요. 잠시만 기다려주세요!",
        "흥미로운 관점이에요. 다른 각도에서도 생각해보면 어떨까요?",
        "그 부분이 어려우시다면, 기초부터 차근차근 설명해드릴게요.",
        "실제 예시를 들어가며 설명해드리면 이해하기 쉬울 거예요."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// 랜덤 문자열 생성
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI 스터디 멘토 챗봇이 시작되었습니다!');
});
