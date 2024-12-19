from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import chat, speech, translation
from .config.settings import Settings

app = FastAPI(title="Chat Bot API")
settings = Settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(speech.router, prefix="/api/speech", tags=["speech"])
app.include_router(translation.router, prefix="/api/translation", tags=["translation"]) 