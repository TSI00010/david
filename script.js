// 지도 초기화
let map;
let markers = [];
let currentData = [];

// 은평구 중심 좌표 (더 정확한 위치)
const EUNPYEONG_CENTER = [37.6026, 126.9291];
const EUNPYEONG_BOUNDS = [
    [37.5800, 126.8900], // 남서쪽 경계
    [37.6500, 126.9700]  // 북동쪽 경계
];

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
    
    // 은평구 경계 설정 (지도 이동 제한)
    map.setMaxBounds(EUNPYEONG_BOUNDS);
    
    // 은평구 경계 표시 (선택사항)
    L.rectangle(EUNPYEONG_BOUNDS, {
        color: "#ff7800",
        weight: 2,
        fillOpacity: 0.1
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

// CSV 파일 자동 감지 함수
async function detectCSVFiles() {
    const commonCSVNames = [
        '*.csv',
        'data.csv',
        'locations.csv',
        'points.csv',
        'facilities.csv',
        'women-safety.csv',
        'child-meal.csv',
        'performance.csv',
        'recycling.csv',
        'fire-water.csv',
        'free-meal.csv',
        'snow-box.csv',
        'dog-poop.csv',
        '반려견 배변봉투함 위치.csv',
        '서울특별시_은평구_여성안심지킴이집_20250318.csv',
        '서울특별시_은평구_아동복지급식정보_20241209.csv',
        '서울특별시_은평구_공연행사정보_20250626.csv',
        '서울특별시_은평구_재활용센터_20240101.csv',
        '서울특별시_은평구_소방용수시설_20250408.csv',
        '서울특별시_은평구_무료급식소_20250203.csv',
        '서울특별시_은평구_제설함_20250326.csv'
    ];
    
    const foundFiles = [];
    
    for (const fileName of commonCSVNames) {
        try {
            const response = await fetch(fileName);
            if (response.ok) {
                foundFiles.push(fileName);
                console.log(`CSV 파일 발견: ${fileName}`);
            }
        } catch (e) {
            // 파일이 없으면 무시
        }
    }
    
    return foundFiles;
}

// 데이터 타입에 맞는 CSV 파일 찾기
async function findMatchingCSVFile(dataType, csvFiles) {
    const dataTypeKeywords = {
        'women-safety': ['여성', '안심', 'women', 'safety'],
        'child-meal': ['아동', '급식', 'child', 'meal'],
        'performance': ['공연', '행사', 'performance', 'event'],
        'recycling': ['재활용', 'recycling', 'recycle'],
        'fire-water': ['소방', '용수', 'fire', 'water'],
        'free-meal': ['무료', '급식', 'free', 'meal'],
        'snow-box': ['제설', 'snow', 'box'],
        'dog-poop': ['반려견', '배변', 'dog', 'poop', 'ġ']
    };
    
    const keywords = dataTypeKeywords[dataType] || [];
    
    // 키워드 기반 매칭
    for (const file of csvFiles) {
        const fileName = file.toLowerCase();
        for (const keyword of keywords) {
            if (fileName.includes(keyword.toLowerCase())) {
                console.log(`키워드 매칭: ${keyword} -> ${file}`);
                return file;
            }
        }
    }
    
    // 파일명 기반 매칭
    const exactMatches = {
        'women-safety': 'women-safety.csv',
        'child-meal': 'child-meal.csv',
        'performance': 'performance.csv',
        'recycling': 'recycling.csv',
        'fire-water': 'fire-water.csv',
        'free-meal': 'free-meal.csv',
        'snow-box': 'snow-box.csv',
        'dog-poop': 'dog-poop.csv'
    };
    
    const exactMatch = exactMatches[dataType];
    if (exactMatch && csvFiles.includes(exactMatch)) {
        return exactMatch;
    }
    
    // 첫 번째 CSV 파일 반환 (fallback)
    return csvFiles.length > 0 ? csvFiles[0] : null;
}

// 좌표 자동 감지 함수
function detectCoordinates(row) {
    let lat = null, lng = null;
    
    // 모든 컬럼에서 좌표 찾기
    for (let i = 0; i < row.length; i++) {
        const value = parseFloat(row[i]);
        if (!isNaN(value)) {
            // 위도 범위: 33-39 (한국)
            if (value >= 33 && value <= 39) {
                lat = value;
            }
            // 경도 범위: 124-132 (한국)
            else if (value >= 124 && value <= 132) {
                lng = value;
            }
        }
    }
    
    return { lat, lng };
}

// 데이터 로드 함수
async function loadData(dataType) {
    try {
        // 자동 CSV 파일 감지 및 로드
        const csvFiles = await detectCSVFiles();
        console.log('감지된 CSV 파일들:', csvFiles);
        
        // 선택된 데이터 타입에 맞는 파일 찾기
        let csvFile = await findMatchingCSVFile(dataType, csvFiles);
        
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
        // 자동 좌표 감지
        const coords = detectCoordinates(row);
        const { lat, lng } = coords;
        
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            const marker = createMarker(lat, lng, row, dataType);
            markers.push(marker);
            validData++;
            console.log(`마커 추가: ${lat}, ${lng}`);
        } else {
            // 좌표가 없는 경우 로그 출력
            console.log('좌표를 찾을 수 없습니다:', row);
        }
    });
    
    // 통계 업데이트
    document.getElementById('totalCount').textContent = validData;
    
    // 현재 데이터 타입 업데이트
    const config = dataConfig[dataType];
    document.getElementById('activeData').textContent = config.name;
    
    // 데이터 정보 업데이트
    document.getElementById('dataInfo').innerHTML = `
        <p><strong>${config.name}</strong></p>
        <p>총 ${validData}개의 시설이 지도에 표시됩니다.</p>
        <p>마커를 클릭하면 상세 정보를 확인할 수 있습니다.</p>
    `;
    
    // 모든 마커가 보이도록 지도 범위 조정 (은평구 내에서)
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        const bounds = group.getBounds();
        
        // 은평구 경계 내에서만 조정
        const paddedBounds = bounds.pad(0.1);
        const limitedBounds = [
            [Math.max(paddedBounds.getSouth(), EUNPYEONG_BOUNDS[0][0]),
             Math.max(paddedBounds.getWest(), EUNPYEONG_BOUNDS[0][1])],
            [Math.min(paddedBounds.getNorth(), EUNPYEONG_BOUNDS[1][0]),
             Math.min(paddedBounds.getEast(), EUNPYEONG_BOUNDS[1][1])]
        ];
        
        map.fitBounds(limitedBounds);
    } else {
        // 마커가 없으면 은평구 중심으로 이동
        map.setView(EUNPYEONG_CENTER, 13);
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
    
    // CSV 파일 업로드 이벤트
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('csvUpload').click();
    });
    
    document.getElementById('csvUpload').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleCSVUpload(e.target.files);
        }
    });
    
    // 은평구로 돌아가기 버튼
    document.getElementById('resetMapBtn').addEventListener('click', () => {
        map.setView(EUNPYEONG_CENTER, 13);
    });
    
    // 페이지 로드 시 자동으로 첫 번째 데이터 로드 (여성안심지킴이집)
    console.log('페이지 로드 - 첫 번째 데이터 자동 로드 시작');
    currentData = await loadData('women-safety');
    displayMarkers(currentData, 'women-safety');
    console.log('첫 번째 데이터 로드 완료');
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

// CSV 파일 업로드 처리
function handleCSVUpload(files) {
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = `업로드 중... ${files.length}개 파일`;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvText = e.target.result;
            const data = parseCSV(csvText);
            
            // 파일명에서 데이터 타입 추측
            const fileName = file.name.toLowerCase();
            let dataType = 'custom';
            
            if (fileName.includes('반려견') || fileName.includes('dog')) dataType = 'dog-poop';
            else if (fileName.includes('여성') || fileName.includes('women')) dataType = 'women-safety';
            else if (fileName.includes('아동') || fileName.includes('child')) dataType = 'child-meal';
            else if (fileName.includes('공연') || fileName.includes('performance')) dataType = 'performance';
            else if (fileName.includes('재활용') || fileName.includes('recycling')) dataType = 'recycling';
            else if (fileName.includes('소방') || fileName.includes('fire')) dataType = 'fire-water';
            else if (fileName.includes('무료') || fileName.includes('free')) dataType = 'free-meal';
            else if (fileName.includes('제설') || fileName.includes('snow')) dataType = 'snow-box';
            
            // 데이터 타입 선택
            document.getElementById('dataType').value = dataType;
            
            // 마커 표시
            displayMarkers(data, dataType);
            
            uploadStatus.textContent = `업로드 완료: ${file.name}`;
        };
        reader.readAsText(file, 'UTF-8');
    });
} 