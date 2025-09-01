// 전역 변수
let userData = {};
let studyPlan = null;
let matchedGroup = null;

// DOM 요소들 (DOMContentLoaded 이후에 초기화)
let onboardingSection, dashboardSection, goalForm, studyPlanDiv, groupInfoDiv;
let chatMessages, chatInput, sendBtn, findGroupBtn, createGroupBtn, resourcesDiv, loadingOverlay;

// DOM 요소 초기화 함수
function initializeElements() {
    onboardingSection = document.getElementById('onboarding');
    dashboardSection = document.getElementById('dashboard');
    goalForm = document.getElementById('goalForm');
    studyPlanDiv = document.getElementById('studyPlan');
    groupInfoDiv = document.getElementById('groupInfo');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('sendBtn');
    findGroupBtn = document.getElementById('findGroupBtn');
    createGroupBtn = document.getElementById('createGroupBtn');
    resourcesDiv = document.getElementById('resources');
    loadingOverlay = document.getElementById('loadingOverlay');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM이 로드되었습니다.');
    
    // DOM 요소 초기화
    initializeElements();
    
    // 요소들이 존재하는지 확인
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
        console.log('폼 이벤트 리스너 등록됨');
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleChatSend);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleChatSend();
        });
        console.log('챗봇 이벤트 리스너 등록됨');
    }
    
    if (findGroupBtn) {
        findGroupBtn.addEventListener('click', handleFindGroup);
        console.log('그룹 찾기 이벤트 리스너 등록됨');
    }
    
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', handleCreateGroup);
        console.log('그룹 만들기 이벤트 리스너 등록됨');
    }
    
    console.log('AI 스터디 멘토 챗봇이 시작되었습니다!');
});

// 목표 제출 처리
async function handleGoalSubmit(e) {
    e.preventDefault();
    console.log('폼 제출됨');
    
    // 폼 데이터 수집
    const subject = document.getElementById('subject')?.value || '';
    const targetGrade = document.getElementById('targetGrade')?.value || '';
    const currentLevel = document.getElementById('currentLevel')?.value || '';
    
    if (!subject || !targetGrade || !currentLevel) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    userData = {
        subject: subject,
        targetGrade: targetGrade,
        currentLevel: currentLevel
    };
    
    console.log('사용자 데이터:', userData);
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
    console.log('학습 플랜 생성 시작');
    
    try {
        // 폴백: 기본 플랜 생성
        studyPlan = generateFallbackPlan();
        displayStudyPlan(studyPlan);
        console.log('학습 플랜 생성 완료');
    } catch (error) {
        console.error('학습 플랜 생성 오류:', error);
        throw error;
    }
}

// 학습 플랜 표시
function displayStudyPlan(plan) {
    if (!studyPlanDiv) {
        console.error('studyPlanDiv를 찾을 수 없습니다.');
        return;
    }
    
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
    console.log('학습 플랜 표시 완료');
}

// 학습 자료 생성
async function generateResources() {
    console.log('학습 자료 생성 시작');
    
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
    console.log('학습 자료 생성 완료');
}

// 학습 자료 표시
function displayResources(resources) {
    if (!resourcesDiv) {
        console.error('resourcesDiv를 찾을 수 없습니다.');
        return;
    }
    
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
    console.log('학습 자료 표시 완료');
}

// 스터디 그룹 찾기
async function handleFindGroup() {
    console.log('그룹 찾기 시작');
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
        console.log('그룹 매칭 완료');
        
    } catch (error) {
        console.error('Error:', error);
        alert('그룹 매칭 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 매칭된 그룹 표시
function displayMatchedGroup(group) {
    if (!groupInfoDiv) {
        console.error('groupInfoDiv를 찾을 수 없습니다.');
        return;
    }
    
    const groupSubject = document.getElementById('groupSubject');
    const groupGoal = document.getElementById('groupGoal');
    const groupMembers = document.getElementById('groupMembers');
    const groupLink = document.getElementById('groupLink');
    
    if (groupSubject) groupSubject.textContent = group.subject;
    if (groupGoal) groupGoal.textContent = group.goal;
    if (groupMembers) groupMembers.textContent = group.members;
    if (groupLink) groupLink.href = group.link;
    
    groupInfoDiv.classList.remove('hidden');
    console.log('매칭된 그룹 표시 완료');
}

// 그룹 만들기
function handleCreateGroup() {
    console.log('그룹 만들기 시작');
    
    const link = `https://meet.google.com/${generateRandomString(3)}-${generateRandomString(3)}-${generateRandomString(3)}`;
    
    const newGroup = {
        subject: userData.subject,
        goal: `${userData.targetGrade} 목표`,
        members: "나 (1명) - 대기 중",
        link: link
    };
    
    displayMatchedGroup(newGroup);
    alert('새 그룹이 생성되었습니다! 다른 학생들이 참여할 때까지 기다려주세요.');
    console.log('그룹 생성 완료');
}

// 챗봇 메시지 전송
async function handleChatSend() {
    if (!chatInput || !chatMessages) {
        console.error('챗봇 요소를 찾을 수 없습니다.');
        return;
    }
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    console.log('챗봇 메시지 전송:', message);
    
    // 사용자 메시지 추가
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // AI 응답 생성
    const response = await generateAIResponse(message);
    addChatMessage(response, 'bot');
}

// 챗봇 메시지 추가
function addChatMessage(content, sender) {
    if (!chatMessages) {
        console.error('chatMessages를 찾을 수 없습니다.');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    console.log('챗봇 메시지 추가됨:', sender);
}

// AI 응답 생성
async function generateAIResponse(userMessage) {
    console.log('AI 응답 생성:', userMessage);
    
    const responses = [
        "좋은 질문이네요! 그 부분에 대해 더 자세히 설명해드릴게요.",
        "그 질문에 대한 답변을 찾아보고 있어요. 잠시만 기다려주세요!",
        "흥미로운 관점이에요. 다른 각도에서도 생각해보면 어떨까요?",
        "그 부분이 어려우시다면, 기초부터 차근차근 설명해드릴게요.",
        "실제 예시를 들어가며 설명해드리면 이해하기 쉬울 거예요."
    ];
    
    // 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('AI 응답 생성 완료:', response);
    return response;
}

// 대시보드 표시
function showDashboard() {
    if (!onboardingSection || !dashboardSection) {
        console.error('섹션 요소를 찾을 수 없습니다.');
        return;
    }
    
    onboardingSection.classList.remove('active');
    dashboardSection.classList.add('active');
    console.log('대시보드로 전환됨');
}

// 로딩 표시/숨김
function showLoading(show) {
    if (!loadingOverlay) {
        console.error('loadingOverlay를 찾을 수 없습니다.');
        return;
    }
    
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
    console.log('로딩 상태:', show);
}

// 폴백 학습 플랜 생성
function generateFallbackPlan() {
    const subject = userData.subject || '과목';
    const level = userData.currentLevel || '중급';
    
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

// 랜덤 문자열 생성
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
