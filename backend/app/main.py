from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, book

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(book.router)

@app.get("/")
def home():
    return {"message": "Backend is successfully running"}