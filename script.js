// 지도 초기화
let map;
let markers = [];
let currentData = [];

// 은평구 중심 좌표
const EUNPYEONG_CENTER = [37.6026, 126.9291];

// 데이터 타입별 설정
const dataConfig = {
    'women-safety': {
        name: '여성안심지킴이집',
        color: '#ff6b6b',
        icon: '🛡️'
    },
    'child-meal': {
        name: '아동복지급식',
        color: '#4ecdc4',
        icon: '🍽️'
    },
    'performance': {
        name: '공연행사정보',
        color: '#45b7d1',
        icon: '🎭'
    },
    'recycling': {
        name: '재활용센터',
        color: '#96ceb4',
        icon: '♻️'
    },
    'fire-water': {
        name: '소방용수시설',
        color: '#feca57',
        icon: '🚒'
    },
    'free-meal': {
        name: '무료급식소',
        color: '#ff9ff3',
        icon: '🍲'
    },
    'snow-box': {
        name: '제설함',
        color: '#54a0ff',
        icon: '❄️'
    },
    'dog-poop': {
        name: '반려견 배변봉투함',
        color: '#a3cb38',
        icon: '🐶'
    }
};

// 지도 초기화 함수
function initMap() {
    map = L.map('map').setView(EUNPYEONG_CENTER, 13);
    
    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // 한국어 지도 타일 (카카오맵 스타일)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// 마커 생성 함수
function createMarker(lat, lng, data, dataType) {
    const config = dataConfig[dataType];
    
    // 커스텀 아이콘 생성
    const customIcon = L.divIcon({
        className: `custom-marker marker-${dataType}`,
        html: `<div style="
            background-color: ${config.color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${config.icon}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // 팝업 내용 생성
    let popupContent = `<h3>${config.name}</h3>`;
    
    if (dataType === 'women-safety') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[4]}</p>
            <p>📞 ${data[7]}</p>
            <p>🏢 ${data[9]}</p>
        `;
    } else if (dataType === 'child-meal') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[5]}</p>
            <p>📞 ${data[9]}</p>
            <p>🕐 ${data[10]} - ${data[11]}</p>
        `;
    } else if (dataType === 'performance') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[12]}</p>
            <p>📅 ${data[3]} - ${data[4]}</p>
            <p>💰 ${data[5]}</p>
        `;
    } else if (dataType === 'recycling') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[1]}</p>
        `;
    } else if (dataType === 'fire-water') {
        popupContent += `
            <p><strong>${data[2]}</strong></p>
            <p class="address">📍 ${data[3]}</p>
            <p>📞 ${data[4]}</p>
        `;
    } else if (dataType === 'free-meal') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[2]}</p>
            <p>📞 ${data[4]}</p>
            <p>🕐 ${data[7]}</p>
            <p>📅 ${data[8]}</p>
        `;
    } else if (dataType === 'snow-box') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[1]}</p>
            <p>📏 ${data[5]}</p>
            <p>📦 ${data[6]}개</p>
        `;
    } else if (dataType === 'dog-poop') {
        popupContent += `
            <p><strong>${data[0]}</strong></p>
            <p class="address">📍 ${data[1]}</p>
        `;
    }
    
    marker.bindPopup(popupContent);
    return marker;
}

// CSV 데이터 파싱 함수
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            // 다양한 구분자 처리
            let values;
            
            // 탭으로 구분된 경우
            if (lines[i].includes('\t')) {
                values = lines[i].split('\t');
            }
            // 세미콜론으로 구분된 경우
            else if (lines[i].includes(';')) {
                values = lines[i].split(';');
            }
            // 쉼표로 구분된 경우
            else {
                values = lines[i].split(',');
            }
            
            // 각 값에서 깨진 문자 정리 및 정규화
            values = values.map(value => {
                let cleanValue = value
                    .replace(/[\uFFFD\uFFFE\uFFFF]/g, '') // 깨진 문자 제거
                    .replace(/[""]/g, '"') // 따옴표 정규화
                    .replace(/['']/g, "'") // 작은따옴표 정규화
                    .trim();
                
                // 따옴표로 감싸진 값 처리
                if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                    cleanValue = cleanValue.slice(1, -1);
                }
                
                return cleanValue;
            });
            
            // 빈 값이 아닌 경우만 추가
            if (values.some(v => v.length > 0)) {
                data.push(values);
            }
        }
    }
    
    console.log(`파싱된 데이터: ${data.length}개 행`);
    return data;
}

// 데이터 로드 함수
async function loadData(dataType) {
    try {
        // 다양한 파일명 패턴으로 시도
        const filePatterns = {
            'women-safety': [
                'women-safety.csv',
                '서울특별시_은평구_여성안심지킴이집_20250318.csv',
                '여성안심지킴이집.csv',
                'women.csv'
            ],
            'child-meal': [
                'child-meal.csv',
                '서울특별시_은평구_아동복지급식정보_20241209.csv',
                '아동복지급식.csv',
                'child.csv'
            ],
            'performance': [
                'performance.csv',
                '서울특별시_은평구_공연행사정보_20250626.csv',
                '공연행사정보.csv',
                'event.csv'
            ],
            'recycling': [
                'recycling.csv',
                '서울특별시_은평구_재활용센터_20240101.csv',
                '재활용센터.csv',
                'recycle.csv'
            ],
            'fire-water': [
                'fire-water.csv',
                '서울특별시_은평구_소방용수시설_20250408.csv',
                '소방용수시설.csv',
                'fire.csv'
            ],
            'free-meal': [
                'free-meal.csv',
                '서울특별시_은평구_무료급식소_20250203.csv',
                '무료급식소.csv',
                'meal.csv'
            ],
            'snow-box': [
                'snow-box.csv',
                '서울특별시_은평구_제설함_20250326.csv',
                '제설함.csv',
                'snow.csv'
            ],
            'dog-poop': [
                'dog-poop.csv',
                '반려견 배변봉투함 위치.csv',
                '반려견 배변봉투함 위치(은평구).csv',
                'dog.csv',
                'ġ.csv' // 깨진 파일명도 포함
            ]
        };
        
        const patterns = filePatterns[dataType] || [];
        let csvFile = null;
        
        // 여러 파일명 패턴을 시도
        for (const pattern of patterns) {
            try {
                const testResponse = await fetch(pattern);
                if (testResponse.ok) {
                    csvFile = pattern;
                    console.log(`파일을 찾았습니다: ${pattern}`);
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!csvFile) {
            console.error('CSV 파일을 찾을 수 없습니다:', dataType);
            return [];
        }
        
        const response = await fetch(csvFile);
        const csvText = await response.text();
        
        // 인코딩 문제 해결을 위한 텍스트 정리
        const cleanText = csvText
            .replace(/[\uFFFD\uFFFE\uFFFF]/g, '') // 깨진 문자 제거
            .replace(/[^\x00-\x7F\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, ''); // 한글, 영문만 유지
        
        const data = parseCSV(cleanText);
        
        return data;
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        return [];
    }
}

// 마커 표시 함수
function displayMarkers(data, dataType) {
    // 기존 마커 제거
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    let validData = 0;
    
    data.forEach(row => {
        let lat, lng;
        
        if (dataType === 'women-safety') {
            lat = parseFloat(row[7]);
            lng = parseFloat(row[8]);
        } else if (dataType === 'child-meal') {
            lat = parseFloat(row[8]);
            lng = parseFloat(row[9]);
        } else if (dataType === 'performance') {
            lat = parseFloat(row[13]);
            lng = parseFloat(row[14]);
        } else if (dataType === 'recycling') {
            // 재활용센터는 좌표가 없으므로 주소로 검색
            return;
        } else if (dataType === 'fire-water') {
            lat = parseFloat(row[5]);
            lng = parseFloat(row[6]);
        } else if (dataType === 'free-meal') {
            lat = parseFloat(row[11]);
            lng = parseFloat(row[12]);
        } else if (dataType === 'snow-box') {
            lat = parseFloat(row[3]);
            lng = parseFloat(row[4]);
        } else if (dataType === 'dog-poop') {
            // 다양한 컬럼 위치에서 좌표 찾기
            lat = parseFloat(row[2]) || parseFloat(row[3]) || parseFloat(row[4]);
            lng = parseFloat(row[3]) || parseFloat(row[4]) || parseFloat(row[5]);
            
            // 좌표가 없으면 주소에서 추출 시도
            if (!lat || !lng) {
                const address = row[1] || row[2] || '';
                console.log('좌표가 없습니다. 주소:', address);
            }
        }
        
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            const marker = createMarker(lat, lng, row, dataType);
            markers.push(marker);
            validData++;
        }
    });
    
    // 통계 업데이트
    document.getElementById('totalCount').textContent = validData;
    
    // 데이터 정보 업데이트
    const config = dataConfig[dataType];
    document.getElementById('dataInfo').innerHTML = `
        <p><strong>${config.name}</strong></p>
        <p>총 ${validData}개의 시설이 지도에 표시됩니다.</p>
        <p>마커를 클릭하면 상세 정보를 확인할 수 있습니다.</p>
    `;
    
    // 모든 마커가 보이도록 지도 범위 조정
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// 검색 기능
function searchLocations(query) {
    if (!query.trim()) return;
    
    const searchResults = currentData.filter(row => {
        const searchText = row.join(' ').toLowerCase();
        return searchText.includes(query.toLowerCase());
    });
    
    if (searchResults.length > 0) {
        displayMarkers(searchResults, document.getElementById('dataType').value);
    } else {
        alert('검색 결과가 없습니다.');
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', async () => {
    // 지도 초기화
    initMap();
    
    // 데이터 타입 변경 이벤트
    document.getElementById('dataType').addEventListener('change', async (e) => {
        const dataType = e.target.value;
        currentData = await loadData(dataType);
        displayMarkers(currentData, dataType);
    });
    
    // 검색 버튼 이벤트
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        searchLocations(query);
    });
    
    // 검색 입력 필드 엔터 키 이벤트
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            searchLocations(query);
        }
    });
    
    // 초기 데이터 로드 (여성안심지킴이집)
    currentData = await loadData('women-safety');
    displayMarkers(currentData, 'women-safety');
});

// 지도 컨트롤 추가
function addMapControls() {
    // 줌 컨트롤
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    
    // 스케일 바
    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);
}

// 지도 로드 완료 후 컨트롤 추가
setTimeout(addMapControls, 1000); 