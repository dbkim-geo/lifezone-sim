# 생활권 시뮬레이션 WebGIS

안동권의 장래 생활권 설정을 위한 인터랙티브 WebGIS 애플리케이션입니다.

## 📋 목차

- [시스템 아키텍처](#시스템-아키텍처)
- [기술 스택](#기술-스택)
- [프로젝트 구성](#프로젝트-구성)
- [로컬 실행](#로컬-실행)
- [주요 기능](#주요-기능)

## 🏗️ 시스템 아키텍처

```text
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ├── OpenLayers (지도 시각화)
       ├── jQuery (DOM 조작)
       └── Chart.js (방사형 차트)
       │
       ▼
┌─────────────┐
│   FastAPI   │
│   (Backend) │
└──────┬──────┘
       │
       ├── GeoServer (지도 서비스)
       └── PostgreSQL + PostGIS (공간 데이터베이스)
```

## 🛠️ 기술 스택

### Backend

- **FastAPI**: Python 웹 프레임워크
- **PostgreSQL + PostGIS**: 공간 데이터베이스
- **GeoServer**: 지도 서비스 및 WMS/WFS 제공

### Frontend

- **OpenLayers**: 지도 시각화 라이브러리
- **jQuery**: DOM 조작 및 이벤트 처리
- **Chart.js**: 방사형 차트 시각화
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

## 📁 프로젝트 구성

```text
lifezone-sim/
│
├── server/                          # FastAPI 서버
│   ├── main.py                      # FastAPI 애플리케이션 진입점
│   └── templates/                   # HTML 템플릿
│       ├── index.html                # 시작 페이지 (메인)
│       ├── current.html              # 현재 생활권 살펴보기
│       ├── simulation.html           # 장래 생활권 시뮬레이션
│       └── intent.html               # 기획 의도
│
├── static/                          # 정적 파일
│   ├── css/                         # 스타일시트
│   │   ├── index.css                # 메인 페이지 스타일
│   │   └── current.css              # 현재 생활권 페이지 스타일
│   │
│   ├── js/                          # JavaScript 파일
│   │   ├── index.js                 # 메인 페이지 로직
│   │   ├── current.js               # 현재 생활권 로직
│   │   └── main.js                  # 공통 jQuery 로직
│   │
│   └── images/                      # 이미지 파일
│       ├── favicon.png
│       ├── Main_map_1.svg
│       └── Main_map_2.png
│
├── data/                            # 데이터 파일
│   └── gadm41_KOR_2.json            # 행정구역 GeoJSON 데이터
│
└── lifezonesim/                     # Python 가상환경 (venv)
```

## 🚀 로컬 실행

### 사전 요구사항

- Python 3.8+
- PostgreSQL + PostGIS
- GeoServer

### 실행 방법

```bash
# 가상환경 활성화 (Windows)
lifezonesim\Scripts\activate

# FastAPI 서버 실행
uvicorn server.main:app --reload --host=0.0.0.0 --port=8080
```

서버가 실행되면 브라우저에서 `http://localhost:8000`으로 접속할 수 있습니다.

## ✨ 주요 기능

### 1. 현재 생활권 살펴보기 (`/current`)

- 기초생활권 및 지역생활권 선택
- 최대 4개의 지표 선택 및 시각화
- 체크된 지표 개수에 따른 자동 지도 분할 (1개, 2개, 3개, 4개)
- 각 지도에 방사형 차트 오버레이 표시
- 지도 클릭 시 해당 지역의 특성 차트 업데이트

### 2. 장래 생활권 시뮬레이션 (`/simulation`)

- (구현 예정)

### 3. 기획 의도 (`/intent`)

- (구현 예정)

## 📝 라이선스

이 프로젝트는 KRIHS 인터랙티브 분석 리포트 샘플입니다.
