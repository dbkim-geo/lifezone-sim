from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json, os


app = FastAPI()

# 정적 파일 (JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 템플릿 설정
templates = Jinja2Templates(directory="server/templates")

# === 라우팅 ===
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/current", response_class=HTMLResponse)
async def current(request: Request):
    return templates.TemplateResponse("current.html", {"request": request})

@app.get("/simulation", response_class=HTMLResponse)
async def simulation(request: Request):
    return templates.TemplateResponse("simulation.html", {"request": request})

@app.get("/intent", response_class=HTMLResponse)
async def intent(request: Request):
    return templates.TemplateResponse("intent.html", {"request": request})

@app.get("/layer/{layer_name}")
async def get_layer(layer_name: str):
    file_path = f"data/{layer_name}.json"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Layer not found"}, status_code=404)
    with open(file_path, encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)
