# 🏙️ 은평구 공공데이터 지도

은평구 공공데이터포털의 다양한 시설 정보를 인터랙티브 지도에서 확인할 수 있는 웹 애플리케이션입니다.

## 🌟 주요 기능

- **다양한 공공데이터 시각화**: 여성안심지킴이집, 아동복지급식, 공연행사정보, 재활용센터, 소방용수시설 등
- **인터랙티브 지도**: Leaflet.js를 활용한 반응형 지도
- **실시간 검색**: 지역명으로 시설 검색 가능
- **상세 정보 팝업**: 마커 클릭 시 시설 상세 정보 표시
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원

## 📊 포함된 데이터

1. **여성안심지킴이집** - 은평구 내 여성안심지킴이집 위치 및 연락처
2. **아동복지급식** - 아동복지급식 제공 시설 정보
3. **공연행사정보** - 은평구 문화재단 공연 및 행사 정보
4. **재활용센터** - 은평구 재활용센터 위치 정보
5. **소방용수시설** - 은평구 소방용수시설 위치 및 연락처
6. **무료급식소** - 은평구 무료급식소 위치 및 운영시간
7. **제설함** - 은평구 제설함 위치 및 용량 정보

## 🚀 시작하기

### 요구사항
- 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- 로컬 웹 서버 (CORS 정책으로 인해 필요)

### 설치 및 실행

1. **프로젝트 다운로드**
   ```bash
   git clone [repository-url]
   cd eunpyeong-map
   ```

2. **로컬 서버 실행**
   
   **Python 3 사용:**
   ```bash
   python -m http.server 8000
   ```
   
   **Node.js 사용:**
   ```bash
   npx http-server
   ```
   
   **PHP 사용:**
   ```bash
   php -S localhost:8000
   ```

3. **브라우저에서 접속**
   ```
   http://localhost:8000
   ```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **지도 라이브러리**: Leaflet.js
- **지도 타일**: OpenStreetMap
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **아이콘**: Emoji 및 CSS 커스텀 아이콘

## 📁 프로젝트 구조

```
eunpyeong-map/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 로직
├── README.md           # 프로젝트 설명서
└── data/               # CSV 데이터 파일들
    ├── 서울특별시_은평구_여성안심지킴이집_20250318.csv
    ├── 서울특별시_은평구_아동복지급식정보_20241209.csv
    ├── 서울특별시_은평구_공연행사정보_20250626.csv
    ├── 서울특별시_은평구_재활용센터_20240101.csv
    ├── 서울특별시_은평구_소방용수시설_20250408.csv
    ├── 서울특별시_은평구_무료급식소_20250203.csv
    └── 서울특별시_은평구_제설함_20250326.csv
```

## 🎨 사용법

1. **데이터 선택**: 상단 드롭다운에서 원하는 데이터 타입 선택
2. **지도 탐색**: 마우스로 지도 이동, 휠로 확대/축소
3. **마커 클릭**: 시설 상세 정보 확인
4. **검색**: 검색창에 지역명 입력 후 검색 버튼 클릭

## 🔧 커스터마이징

### 새로운 데이터 추가

1. CSV 파일을 `data/` 폴더에 추가
2. `script.js`의 `dataConfig` 객체에 새 데이터 타입 추가
3. `loadData()` 함수에 새 케이스 추가
4. `createMarker()` 함수에 팝업 내용 로직 추가

### 스타일 변경

- `styles.css`에서 색상, 폰트, 레이아웃 수정
- `dataConfig`에서 마커 색상 및 아이콘 변경

## 📱 반응형 디자인

- **데스크톱**: 1200px 이상 - 전체 레이아웃 표시
- **태블릿**: 768px - 1199px - 사이드바 축소
- **모바일**: 767px 이하 - 세로 레이아웃, 터치 최적화

## 🔍 검색 기능

- 지역명, 시설명, 주소 등으로 검색 가능
- 실시간 필터링으로 검색 결과만 지도에 표시
- 검색 결과 없을 시 알림 표시

## 📈 통계 정보

- 현재 표시된 시설 개수 실시간 업데이트
- 데이터 타입별 통계 정보 제공
- 지도 범위 내 시설 분포 시각화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

- **개발자**: [Your Name]
- **이메일**: [your.email@example.com]
- **프로젝트 링크**: [https://github.com/yourusername/eunpyeong-map](https://github.com/yourusername/eunpyeong-map)

## 🙏 감사의 말

- **서울특별시 은평구**: 공공데이터 제공
- **OpenStreetMap**: 지도 타일 제공
- **Leaflet.js**: 지도 라이브러리 제공

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 