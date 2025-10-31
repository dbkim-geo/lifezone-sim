## 로컬 실행
uvicorn server.main:app --reload

## 프로젝트 구성
lifezone-sim/
│
├── server/
│   ├── main.py                # FastAPI 서버
│   └── templates/
│       ├── index.html         # 시작 페이지
│       ├── current.html       # 현재 생활권 살펴보기
│       ├── simulation.html    # 장래 생활권 시뮬레이션
│       └── intent.html        # 기획 의도
│
├── static/
│   ├── css/
│   └── js/
│       └── main.js            # 공통 jQuery 로직
│       └── current.js         # 현재 생활권 로직
│
├── data/
│
└── venv/                      # (이미 생성됨)
