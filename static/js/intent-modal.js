/**
 * 기획의도 모달 공통 모듈
 * 기획의도 내용을 중앙화하여 관리하고, 여러 페이지에서 재사용 가능하도록 함
 * 탭 형식으로 현재생활권과 장래생활권 기획의도를 전환 가능
 */

// 기획의도 데이터
const INTENT_DATA = {
    intent: {
        title: '기획의도',
        content: `
            <div class="space-y-6">
                <!-- 1. 개요 -->
                <div>
                    <h4 class="text-xl font-bold text-sky-700 mb-3">1. 개요</h4>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            이 콘텐츠는 국토연구원에서 2025년 일반과제로 수행한 <strong>&lt;인구감소대응 콤팩트-네트워크 전략을 위한 생활권 변화 시뮬레이션 모형 개발 연구&gt;</strong>의 분석결과를 토대로 제작되었습니다. 콤팩트-네트워크 전략의 개념<sup>*</sup>을 기초로 인구감소를 겪고 있는 광역권의 중심지-생활권 구성을 파악하고, 콤팩트성/네트워크성/생활편리성 세 가지 측면에서 중심지-생활권의 공간구조 특성을 진단합니다. 그리고 2040년 격자단위 인구분포와 생활권 공간구조에 대한 계획목표에 따라 이 광역권의 장래 생활권이 어떻게 달라질 수 있는지 시뮬레이션합니다.
                        </p>
                        <p class="text-sm text-gray-600 italic pl-4 border-l-4 border-sky-200">
                            <sup>*</sup> 콤팩트-네트워크 전략이란 도시 기능과 서비스를 거점(중심지)에 집약시키고(콤팩트화), 거점-거점, 거점-주변 등 지역 간 연결을 강화하여(네트워크화) 도시 기능과 서비스를 효과적으로 전달하고자 하는 개념입니다.
                        </p>
                    </div>
                </div>

                <!-- 2. 분석 대상지 -->
                <div>
                    <h4 class="text-xl font-bold text-sky-700 mb-3">2. 분석 대상지</h4>
                    <div class="text-gray-700 leading-relaxed">
                        <p>
                            이 콘텐츠의 분석 대상지는 <strong>안동시</strong>와 주변 8개 시군(<strong>영주시, 상주시, 문경시, 예천군, 의성군, 청송군, 영양군, 봉화군</strong>)입니다. 이 콘텐츠에서는 이들 지역을 <strong>'안동권'</strong>으로 지칭합니다. 안동권은 수도권과 인접하지 않은 비수도권 지역을 최근 10년 이상 인구감소를 겪고 있는 대표적인 인구감소 지역입니다.
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    current: {
        title: '현재생활권 살펴보기',
        description: '현재생활권에 대한 기획의도 설명입니다.',
        content: `
            <div class="space-y-6">
                <!-- 설명 섹션 -->
                <div class="text-gray-700 leading-relaxed space-y-4">
                    <p>
                        이 콘텐츠에서는 분석 대상지인 안동권의 생활권을 행정구역이 아닌 중심지와 중심지의 실질적 전달 범위를 고려하여 구분하였습니다. 안동권의 중심지는 국토교통부의 국토모니터링 사업에서 제공하는 국토공간거점지도의 중심지 구분을 토대로 추출하였습니다. 중심지에 소재하는 도시 기능과 서비스의 전달 범위를 이 콘텐츠에서는 중심지-생활권으로 정의하였고, 이 중심지-생활권의 공간적 경계는 실제 도로망과 통행 데이터를 이용해서 추출하였습니다. 그 결과, 안동권을 <strong>62개의 기초생활권</strong>으로 세분화하고 이들 기초생활권을 묶어 <strong>11개 지역생활권</strong>으로 구분할 수 있었습니다. 이 콘텐츠의 지도에서 보여주는 생활권은 이 기초생활권과 지역생활권에 해당하며, 중심지-생활권의 구체적인 구분 방법은 <strong>&lt;인구감소대응 콤팩트-네트워크 전략을 위한 생활권 변화 시뮬레이션 모형 개발 연구&gt;</strong> 보고서를 참고하시기 바랍니다.
                    </p>
                    <p>
                        위의 기초생활권/지역생활권 구분을 바탕으로, 현재 생활권 살펴보기 페이지에서는 각 생활권이 콤팩트-네트워크 공간구조 측면에서 어떤 상태에 있는지 그 특성을 진단합니다. 공간구조 특성 지표는 아래 3가지 부문으로 구성되며, 여러분은 이 페이지의 지도와 차트를 통해 안동권 중심지-생활권이 각각 이 3가지 부문에서 어떤 위치에 있는지 시각적으로 살펴볼 수 있습니다.
                    </p>
                    <ul class="list-disc list-inside space-y-2 pl-4">
                        <li><strong>콤팩트성</strong>: 생활권 내에 인구와 도시 서비스가 어느 정도로 집중 혹은 집적되어 있는지를 측정하는 지표들</li>
                        <li><strong>네트워크성</strong>: 생활권 내부 및 생활권 간 연결성을 대중교통이나 도로망을 통해 측정하는 지표들</li>
                        <li><strong>생활편리성</strong>: 콤팩트-네트워크 공간구조와 연계하여 주민이 얼마나 편리한 생활을 영위하는지를 측정하는 지표들</li>
                    </ul>
                </div>

                <!-- 표 1: 생활권 공간구조 진단 지표 체계 -->
                <div class="mb-6">
                    <p class="text-sm font-semibold text-gray-700 mb-3">&lt;표 1&gt; 생활권 공간구조 진단 지표 체계</p>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-sky-200 text-sm">
                            <thead>
                                <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 10%;" rowspan="2">부문</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 18%;" rowspan="2">지표</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" colspan="3" style="width: 72%;">산식</th>
                                </tr>
                                <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 24%;">기초생활권</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 24%;">지역생활권</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 24%;">비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 콤팩트성 -->
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="4">콤팩트성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">중심지 인구 집중도</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">기초생활권 전체 거주인구 중 기초생활권의 생활중심지 거주인구 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">지역생활권 전체 거주인구 중 생활권 내부 모든 중심지의 거주인구 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs" rowspan="4">근린시설과 고차서비스시설은 &lt;표 2&gt; 참고</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">서비스 복합 집적도</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">근린시설 k개 유형의 커널밀도 합 × 밀도에 대한 Shnon 다양성 지수의 최대값</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">고차서비스시설 k개 유형의 커널밀도 합 × 밀도에 대한 Shnon 다양성 지수의 최대값</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">서비스 근접성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">거주격자 중심점에서 생활권 내 근린시설까지의 인구가중 도로이동거리 평균을 k종의 시설에 대해 산출 후 평균한 값; 생활권 내 시설이 없는 경우 병의원, 요양기관 등은 상위 지역중심지까지의 거리로, 어린이집은 이웃 기초생활권 중 시설이 있는 가장 가까운 중심지까지의 거리로 대체</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생활권 내 거주격자 중심점에서 생활권 내 고차서비스시설까지의 도로이동거리의 인구가중평균; 생활권 내 시설이 없는 경우, 해당 시설이 있는 최근린 지역중심지까지의 거리로 대체</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">서비스 충족도</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">근린시설 k개 유형 중 생활중심지 도보권에 존재하는 시설 유형 수의 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">고차서비스시설 k개 유형 중 지역중심지 도보권에 존재하는 시설 유형 수의 비율</td>
                                </tr>

                                <!-- 네트워크성 -->
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="3">네트워크성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">상위 중심지 연결성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">직속 지역중심지까지 통행시간</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">직속 특·광역시까지의 이동시간</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs" rowspan="3">도로이동과 대중교통 이동 함께 검토</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">동급 중심지 간 연결성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">1시간 이내 도달가능한, 즉 접근이 편리한 다른 생활중심지의 수</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">90분 이내 도달가능한, 즉 접근이 편리한 지역중심지의 수</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">중심지-주변 연결성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생생활권의 모든 거주격자 중 생활중심지에 30분 이내 도달할 수 있는, 즉 접근이 편리한 거주격자의 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생활권 내 모든 생활중심지 중 지역중심지에 1시간 이내 도달할 수 있는, 즉 접근이 편리한 생활중심지의 비율</td>
                                </tr>

                                <!-- 생활편리성 -->
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="3">생활편리성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">서비스 이용 자족성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생활권 거주 인구가 근린시설 업종에서 총 결제한 건수 중 해당 생활권에서 결제된 건수의 비율, 즉 근린시설 업종의 내부결제율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생활권 거주 인구가 근린시설 및 고차서비스시설 업종에서 결제한 총 건수 중 해당 생활권에서 결제된 건수의 비율, 즉 핵심 서비스 업종의 내부결제율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">근린시설 업종과 고차서비스시설 업종은 &lt;표 2&gt; 참고</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">중심지 간 기능 보완성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">k개 유형의 근린시설 및 고차서비스시설 중 해당 생활중심지 도보권에는 없으나 상위 지역중심지 도보권에서 이용가능한 시설 유형의 수</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">k개 유형의 고차서비스시설 중 해당 지역중심지 도보권에는 없으나, 90분 이내 도달할 수 있는 다른 지역중심지의 도보권에서 이용가능한 시설 유형의 수</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">근린시설과 고차서비스시설은 &lt;표 2&gt; 참고</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">중심지 접근의 형평성</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">생활중심지까지 이동하는데 30분 넘게 걸리는 거주인구의 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">지역중심지까지 이동하는데 1시간 넘게 걸리는 거주인구의 비율</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center text-xs">도로이동과 대중교통 이동 함께 검토</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 표 2: 공간구조 진단 지표에서 고려한 근린시설, 고차서비스시설 업종 -->
                <div class="mb-6">
                    <p class="text-sm font-semibold text-gray-700 mb-3">&lt;표 2&gt; 공간구조 진단 지표에서 고려한 근린시설, 고차서비스시설 업종</p>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-sky-200 text-sm">
                            <thead>
                                <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" colspan="3" style="width: 50%;">근린시설</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" colspan="3" style="width: 50%;">고차서비스 시설</th>
                                </tr>
                                <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">도시 기능</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">시설</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">신용카드 업종</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">도시 기능</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">시설</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 16.67%;">신용카드 업종</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">기초의료</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">병의원</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">의료기관</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">고차의료</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">응급의료시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">종합병원, 산후조리원</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">식료품점 및 상업</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">슈퍼마켓+편의점</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">편의점, 슈퍼마켓, 연쇄점, 복지매점</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">고차상업</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">일반백화점, 대형할인점</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">기초교육</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">초등학교</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">고등교육</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">대학(종합대학+전문대학, 캠퍼스 포함)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">대학등록금</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center" rowspan="2">돌봄</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">어린이집</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">복지</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">복지관(종합복지관+노인복지관)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">재가장기요양기관</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center" rowspan="2">문화</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국공립도서관</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">영화관, 티켓, 문화취미기타</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">문화기반시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">영화관, 티켓, 문화취미기타</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center"></td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">산업·생산기반</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">농기계 임대사업소</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">농업(내구재)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">주: 신용카드 업종은 2018년/2023년 BC카드 내국인 소비OD 데이터에 근거하여 선정하였으며, '-'는 매칭할 수 있는 업종이 없음을 의미.</p>
                </div>

                <!-- 표 3: 생활권 공간구조 진단 지표 산출에 필요한 데이터 -->
                <div class="mb-6">
                    <p class="text-sm font-semibold text-gray-700 mb-3">&lt;표 3&gt; 생활권 공간구조 진단 지표 산출에 필요한 데이터</p>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-sky-200 text-sm">
                            <thead>
                                <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 15%;">구분</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 30%;">데이터</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 40%;">원천자료</th>
                                    <th class="border border-sky-300 px-3 py-2 text-center font-semibold" style="width: 15%;">시점</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="5">근린 시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">병의원</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">슈퍼마켓+편의점</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">공공데이터포털, 소상공인시장진흥공단 상가업소정보</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2022년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">초등학교</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">어린이집</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">재가장기요양기관</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">보건복지부 노인복지시설현황 부록(지오코딩하여 활용)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2024년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="6">고차 서비스 시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">응급의료시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">대학(종합대학+전문대학)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">교육부 통계서비스, 고등교육기관 주소록</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">복지관(종합복지관+노인복지관)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국공립도서관</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">문화기반시설</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">농기계 임대사업소</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">공공데이터포털 전국농기계임대정보표준데이터</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2025년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700">소비</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">신용카드 데이터</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">BC카드 내국인 소비 OD 데이터</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년(4월분)</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" rowspan="3">인구</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">주민등록인구(500m 격자)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토조사</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년(10월)</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center">모바일 이동인구</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">총목적 기종점 데이터</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2022년 11월</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center">장래 인구(1km 격자)</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">임은선 외(2024); 1차년도 연구</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2040년</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" colspan="2">도로망</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">한국교통연구원 국가교통DB</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2022년<br>(배포시점: 2023년)</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" colspan="2">1km 격자 경계</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토지리정보원 국토정보플랫폼</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">-</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" colspan="2">대중교통 길찾기</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">ODsay 대중교통 길찾기 API</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                                <tr>
                                    <td class="border border-sky-200 px-3 py-2 text-center font-semibold text-sky-700" colspan="2">중심지</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">국토공간거점지도</td>
                                    <td class="border border-sky-200 px-3 py-2 text-center">2023년</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `
    },
    future: {
        title: '장래 생활권 시뮬레이션 하기',
        scenarios: [
            {
                id: 'SN1',
                name: '목표 시나리오 1 (SN1)',
                goal: '콤팩트성 확보',
                description: '생활권 주민이 지역중심지에 쉽게 접근하는 생활권',
                image: '/static/images/sn1_rev1.png',
                imageAlt: 'SN1 모식도'
            },
            {
                id: 'SN2',
                name: '목표 시나리오 2 (SN2)',
                goal: '콤팩트성 확보 및 배후 인구규모 확보',
                description: '생활권 주민이 지역중심지에 일정 수준 쉽게 접근하면서도, 생활권 인구는 지역생활권 평균의 70~80%는 확보할 수 있게',
                image: '/static/images/sn2_rev1.png',
                imageAlt: 'SN2 모식도'
            },
            {
                id: 'SN3',
                name: '기준 시점 (SN3)',
                goal: '콤팩트성 및 네트워크성 동시 확보',
                description: '생활권 주민이 지역중심지에 일정 수준 쉽게 접근하면서도, 모든 생활중심지에서 지역중심지까지 최대 2시간 내 접근할 수 있게',
                image: '/static/images/sn3_rev1.png',
                imageAlt: 'SN3 모식도'
            }
        ]
    }
};

/**
 * 장래생활권 기획의도 컨텐츠 HTML 생성 (설명 + 테이블)
 * @returns {string} HTML 문자열
 */
function generateFutureIntentTable() {
    const scenarios = INTENT_DATA.future.scenarios;

    // 설명 섹션
    const descriptionSection = `
        <div class="space-y-4 mb-6">
            <div class="text-gray-700 leading-relaxed space-y-3">
                <p>
                    장래 생활권 시뮬레이션 하기 페이지에서는 <strong>2040년 미래 시점의 격자단위 인구분포</strong> 하에서 지역생활권 공간구조에 대한 계획목표(시나리오)에 따라 지역생활권 공간 경계가 어떻게 바뀔지 시뮬레이션한 결과를 살펴볼 수 있습니다.
                </p>
                <p>
                    이때, 모든 시나리오는 인구 감소로 고차서비스가 전달되는 지역생활권의 공간적 범위가 광역화되어, 지역생활권의 수가 현재보다 줄어드는 상황을 가정하고 있습니다. 현재 시점의 지역생활권은 <strong>11개</strong>가 도출되었는데요, 계획목표 시나리오별로 지역생활권의 수가 <strong>5개</strong>로 줄어드는 경우와 <strong>6개</strong>로 줄어드는 경우 그 차이를 이 페이지에서 살펴볼 수 있습니다.
                </p>
                <p>
                    지역생활권의 공간구조에 대한 계획목표 시나리오별 차이점은 아래 모식도를 참고해주세요.
                </p>
            </div>
        </div>
    `;

    // 테이블 헤더 생성 (구분 열은 좁게, 시나리오 열은 동일하게)
    const headerRow = `
        <tr class="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
            <th class="border border-sky-300 px-4 py-3 text-center font-semibold" style="width: 18%;">구분</th>
            ${scenarios.map(s => `<th class="border border-sky-300 px-4 py-3 text-center font-semibold" style="width: 27.33%;">${s.name}</th>`).join('')}
        </tr>
    `;

    // 공간구조상 계획 목표 행
    const goalRow = `
        <tr class="bg-gray-50">
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700" style="width: 18%;">공간구조想 <br>계획 목표</td>
            ${scenarios.map(s => `<td class="border border-sky-200 px-4 py-3 text-center" style="width: 27.33%;">${s.goal}</td>`).join('')}
        </tr>
    `;

    // 계획 목표 설명 행
    const descriptionRow = `
        <tr>
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700" style="width: 18%;">계획 목표 설명</td>
            ${scenarios.map(s => `<td class="border border-sky-200 px-4 py-3 text-center" style="width: 27.33%;">${s.description}</td>`).join('')}
        </tr>
    `;

    // 모식도 행
    const diagramRow = `
        <tr class="bg-gray-50">
            <td class="border border-sky-200 px-4 py-3 text-center font-semibold text-sky-700 bg-gray-50" style="width: 18%;">모식도</td>
            ${scenarios.map(s => `
                <td class="border border-sky-200 px-4 py-3 text-center" style="width: 27.33%;">
                    <img src="${s.image}" alt="${s.imageAlt}" class="w-full h-auto rounded-lg shadow-sm mx-auto">
                </td>
            `).join('')}
        </tr>
    `;

    // 테이블 섹션
    const tableSection = `
        <div class="mb-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">&lt;표 4&gt; 장래 지역생활권 공간구조에 대한 계획목표 시나리오 비교</p>
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
    `;

    return descriptionSection + tableSection;
}

/**
 * 기획의도 모달 HTML 생성
 * @param {string} defaultTab - 기본으로 표시할 탭 ('intent', 'current', 또는 'future')
 * @returns {string} 모달 HTML 문자열
 */
function generateIntentModalHTML(defaultTab = 'intent') {
    const intentTabActive = defaultTab === 'intent' ? 'active' : '';
    const currentTabActive = defaultTab === 'current' ? 'active' : '';
    const futureTabActive = defaultTab === 'future' ? 'active' : '';
    const intentContentHidden = defaultTab === 'intent' ? '' : 'hidden';
    const currentContentHidden = defaultTab === 'current' ? '' : 'hidden';
    const futureContentHidden = defaultTab === 'future' ? '' : 'hidden';

    return `
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center hidden" id="intent-modal" style="z-index: 9999;">
            <div class="bg-white/95 backdrop-blur-lg border border-sky-200 rounded-lg shadow-2xl shadow-sky-100 w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent"></h3>
                        <button id="intent-modal-close" class="text-gray-500 hover:text-sky-500 text-2xl font-bold transition-colors duration-200">&times;</button>
                    </div>
                    
                    <!-- 탭 네비게이션 -->
                    <div class="flex border-b border-sky-200 mb-6">
                        <button class="intent-tab px-6 py-3 font-semibold text-gray-600 hover:text-sky-500 transition-colors duration-200 border-b-2 border-transparent hover:border-sky-300 ${intentTabActive ? 'text-sky-500 border-sky-500' : ''}" data-tab="intent">
                            기획의도
                        </button>
                        <button class="intent-tab px-6 py-3 font-semibold text-gray-600 hover:text-sky-500 transition-colors duration-200 border-b-2 border-transparent hover:border-sky-300 ${currentTabActive ? 'text-sky-500 border-sky-500' : ''}" data-tab="current">
                            현재 생활권 살펴보기
                        </button>
                        <button class="intent-tab px-6 py-3 font-semibold text-gray-600 hover:text-sky-500 transition-colors duration-200 border-b-2 border-transparent hover:border-sky-300 ${futureTabActive ? 'text-sky-500 border-sky-500' : ''}" data-tab="future">
                            장래 생활권 시뮬레이션 하기
                        </button>
                    </div>
                    
                    <!-- 탭 컨텐츠 -->
                    <div class="text-gray-700">
                        <!-- 기획의도 탭 컨텐츠 -->
                        <div id="intent-tab-intent" class="intent-tab-content ${intentContentHidden}">
                            ${INTENT_DATA.intent.content}
                        </div>
                        
                        <!-- 현재생활권 탭 컨텐츠 -->
                        <div id="intent-tab-current" class="intent-tab-content ${currentContentHidden}">
                            ${INTENT_DATA.current.content}
                        </div>
                        
                        <!-- 장래생활권 탭 컨텐츠 -->
                        <div id="intent-tab-future" class="intent-tab-content ${futureContentHidden}">
                            ${generateFutureIntentTable()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 탭 전환 함수
 * @param {string} tabName - 전환할 탭 이름 ('intent', 'current', 또는 'future')
 */
function switchTab(tabName) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.intent-tab').forEach(tab => {
        tab.classList.remove('text-sky-500', 'border-sky-500');
        tab.classList.add('text-gray-600', 'border-transparent');
    });

    // 모든 탭 컨텐츠 숨기기
    document.querySelectorAll('.intent-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 선택된 탭 버튼에 active 클래스 추가
    const selectedTab = document.querySelector(`.intent-tab[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.remove('text-gray-600', 'border-transparent');
        selectedTab.classList.add('text-sky-500', 'border-sky-500');
    }

    // 선택된 탭 컨텐츠 표시
    const selectedContent = document.getElementById(`intent-tab-${tabName}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
}

/**
 * 기획의도 모달 초기화
 * 페이지에 모달을 추가하고 이벤트 리스너를 설정
 * @param {string} defaultTab - 기본으로 표시할 탭 ('intent', 'current', 또는 'future')
 */
function initIntentModal(defaultTab = 'intent') {
    intentModalInitialized = true;
    // 모달이 이미 존재하는지 확인
    let modal = document.getElementById('intent-modal');

    if (!modal) {
        // 모달이 없으면 생성하여 body에 추가
        const modalHTML = generateIntentModalHTML(defaultTab);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('intent-modal');
    } else {
        // 모달이 이미 있으면 기본 탭 설정
        switchTab(defaultTab);
    }

    // 모달 열기 버튼 이벤트
    const openBtn = document.getElementById('intent-modal-btn');
    if (openBtn) {
        // 기존 이벤트 리스너 제거를 위해 클론
        const newOpenBtn = openBtn.cloneNode(true);
        openBtn.parentNode.replaceChild(newOpenBtn, openBtn);

        newOpenBtn.addEventListener('click', function () {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
            // 기본 탭으로 전환
            switchTab(defaultTab);
        });
    }

    // 모달 닫기 버튼 이벤트
    const closeBtn = document.getElementById('intent-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // 배경 스크롤 복원
        });
    }

    // 탭 전환 이벤트
    document.querySelectorAll('.intent-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// DOM이 로드되면 초기화 (기본값: 기획의도)
// 각 페이지에서 initIntentModal을 직접 호출하여 기본 탭을 설정할 수 있음
// 페이지별 스크립트가 호출하지 않으면 기본값으로 기획의도 탭 표시
let intentModalInitialized = false;

function autoInitIntentModal() {
    if (!intentModalInitialized) {
        initIntentModal('intent');
        intentModalInitialized = true;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitIntentModal);
} else {
    // 약간의 지연을 두어 페이지별 스크립트가 먼저 실행될 수 있도록 함
    setTimeout(autoInitIntentModal, 100);
}
