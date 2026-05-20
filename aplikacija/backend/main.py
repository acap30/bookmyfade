from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user, hairdresser, owner, salon, service
from auth import authentication
from router_impl import db_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  

app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(hairdresser.router)
app.include_router(owner.router)
app.include_router(salon.router)
app.include_router(service.router)

@app.on_event("startup")
async def create_admin():
    db_user.create_admin()
