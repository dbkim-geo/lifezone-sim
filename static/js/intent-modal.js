/**
 * 기획의도 모달 공통 모듈
 * 기획의도 내용을 중앙화하여 관리하고, 여러 페이지에서 재사용 가능하도록 함
 */

// 기획의도 데이터
const INTENT_DATA = {
    scenarios: [
        {
            id: 'SN1',
            name: '목표 시나리오 1 (SN1)',
            goal: '콤팩트성 확보',
            description: '생활권 주민이 지역중심지에 쉽게 접근하는 생활권',
            image: '/static/images/sn1.png',
            imageAlt: 'SN1 모식도'
        },
        {
            id: 'SN2',
            name: '목표 시나리오 2 (SN2)',
            goal: '콤팩트성 확보 및 배후 인구규모 확보',
            description: '생활권 주민이 지역중심지에 일정 수준 쉽게 접근하면서도, 생활권 인구는 지역생활권 평균의 70~80%는 확보할 수 있게',
            image: '/static/images/sn2.png',
            imageAlt: 'SN2 모식도'
        },
        {
            id: 'SN3',
            name: '기준 시점 (SN3)',
            goal: '콤팩트성 및 네트워크성 동시 확보',
            description: '생활권 주민이 지역중심지에 일정 수준 쉽게 접근하면서도, 모든 생활중심지에서 지역중심지까지 최대 2시간 내 접근할 수 있게',
            image: '/static/images/sn3.png',
            imageAlt: 'SN3 모식도'
        }
    ]
};

/**
 * 기획의도 모달 HTML 생성
 * @returns {string} 모달 HTML 문자열
 */
function generateIntentModalHTML() {
    const scenarios = INTENT_DATA.scenarios;
    
    // 테이블 헤더 생성 (구분 열은 좁게, 시나리오 열은 동일하게)
    // table-fixed를 사용하므로 각 열의 너비를 명시적으로 지정
    const headerRow = `
        <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
            <th class="border border-sky-300 px-4 py-3 text-center font-semibold" style="width: 18%;">구분</th>
            ${scenarios.map(s => `<th class="border border-sky-300 px-4 py-3 text-center font-semibold" style="width: 27.33%;">${s.name}</th>`).join('')}
        </tr>
    `;
    
    // 공간구조상 계획 목표 행
    const goalRow = `
        <tr class="bg-sky-50">
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700" style="width: 18%;">공간구조상 계획 목표</td>
            ${scenarios.map(s => `<td class="border border-sky-200 px-4 py-3 text-left" style="width: 27.33%;">${s.goal}</td>`).join('')}
        </tr>
    `;
    
    // 계획 목표 설명 행
    const descriptionRow = `
        <tr>
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700 bg-sky-50" style="width: 18%;">계획 목표 설명</td>
            ${scenarios.map(s => `<td class="border border-sky-200 px-4 py-3 text-left" style="width: 27.33%;">${s.description}</td>`).join('')}
        </tr>
    `;
    
    // 모식도 행
    const diagramRow = `
        <tr class="bg-gray-50">
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700 bg-sky-50" style="width: 18%;">모식도</td>
            ${scenarios.map(s => `
                <td class="border border-sky-200 px-4 py-3 text-center" style="width: 27.33%;">
                    <img src="${s.image}" alt="${s.imageAlt}" class="w-full h-auto rounded-lg shadow-sm mx-auto">
                </td>
            `).join('')}
        </tr>
    `;
    
    return `
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hidden" id="intent-modal" style="z-index: 9999;">
            <div class="bg-white/95 backdrop-blur-lg border border-sky-200 rounded-lg shadow-2xl shadow-sky-100 w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">기획 의도</h3>
                        <button id="intent-modal-close" class="text-gray-500 hover:text-sky-500 text-2xl font-bold transition-colors duration-200">&times;</button>
                    </div>
                    <div class="text-gray-700">
                        <!-- 시나리오 비교 표 -->
                        <div class="overflow-x-auto">
                            <table class="w-full table-fixed border-collapse border border-sky-200 rounded-lg overflow-hidden shadow-md">
                                <thead>
                                    ${headerRow}
                                </thead>
                                <tbody>
                                    ${goalRow}
                                    ${descriptionRow}
                                    ${diagramRow}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 기획의도 모달 초기화
 * 페이지에 모달을 추가하고 이벤트 리스너를 설정
 */
function initIntentModal() {
    // 모달이 이미 존재하는지 확인
    let modal = document.getElementById('intent-modal');
    
    if (!modal) {
        // 모달이 없으면 생성하여 body에 추가
        const modalHTML = generateIntentModalHTML();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('intent-modal');
    }
    
    // 모달 열기 버튼 이벤트
    const openBtn = document.getElementById('intent-modal-btn');
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
        });
    }
    
    // 모달 닫기 버튼 이벤트
    const closeBtn = document.getElementById('intent-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // 배경 스크롤 복원
        });
    }
    
    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// DOM이 로드되면 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntentModal);
} else {
    initIntentModal();
}

