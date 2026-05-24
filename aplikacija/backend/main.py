from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from routers import user, hairdresser, owner, salon, service, working_hours
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
app.include_router(working_hours.router)

@app.on_event("startup")
async def create_admin():
    db_user.create_admin()

@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):

    return JSONResponse(
        status_code=400,
        content={
            "detail": "Bad request"
        },
    )

