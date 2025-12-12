from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json, os
from pathlib import Path


app = FastAPI()

# 정적 파일 (JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 템플릿 설정
templates = Jinja2Templates(directory="server/templates")

# CSS 파일 버전 가져오기 (수정 시간 기반)
def get_css_version(css_filename: str) -> str:
    """CSS 파일의 수정 시간을 기반으로 버전 번호 생성 (노캐싱용)"""
    css_path = Path(f"static/css/{css_filename}")
    if css_path.exists():
        # 파일 수정 시간을 타임스탬프로 변환
        mtime = css_path.stat().st_mtime
        return str(int(mtime))
    return "1"  # 파일이 없으면 기본값

# === 라우팅 ===
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "css_version": get_css_version("index.css")
    })

@app.get("/current", response_class=HTMLResponse)
async def current(request: Request):
    return templates.TemplateResponse("current.html", {
        "request": request,
        "css_version": get_css_version("current.css")
    })

@app.get("/simulation", response_class=HTMLResponse)
async def simulation(request: Request):
    return templates.TemplateResponse("simulation.html", {
        "request": request,
        "css_version": get_css_version("simulation.css")
    })

@app.get("/layer/{layer_name}")
async def get_layer(layer_name: str):
    file_path = f"data/{layer_name}.json"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Layer not found"}, status_code=404)
    with open(file_path, encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)
