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
            // 탭으로 구분된 경우와 쉼표로 구분된 경우 모두 처리
            let values;
            if (lines[i].includes('\t')) {
                values = lines[i].split('\t');
            } else {
                values = lines[i].split(',');
            }
            data.push(values);
        }
    }
    
    return data;
}

// 데이터 로드 함수
async function loadData(dataType) {
    try {
        let csvFile;
        
        switch (dataType) {
            case 'women-safety':
                csvFile = '서울특별시_은평구_여성안심지킴이집_20250318.csv';
                break;
            case 'child-meal':
                csvFile = '서울특별시_은평구_아동복지급식정보_20241209.csv';
                break;
            case 'performance':
                csvFile = '서울특별시_은평구_공연행사정보_20250626.csv';
                break;
            case 'recycling':
                csvFile = '서울특별시_은평구_재활용센터_20240101.csv';
                break;
            case 'fire-water':
                csvFile = '서울특별시_은평구_소방용수시설_20250408.csv';
                break;
            case 'free-meal':
                csvFile = '서울특별시_은평구_무료급식소_20250203.csv';
                break;
            case 'snow-box':
                csvFile = '서울특별시_은평구_제설함_20250626.csv';
                break;
            case 'dog-poop':
                csvFile = '반려견 배변봉투함 위치.csv';
                break;
        }
        
        const response = await fetch(csvFile);
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
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
            // 인코딩 문제로 첫 줄이 깨질 수 있으니, 컬럼 순서: 위치명, 주소
            lat = parseFloat(row[2]);
            lng = parseFloat(row[3]);
            // 만약 좌표가 없으면 주소로 변환 필요(여기선 좌표만 사용)
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
