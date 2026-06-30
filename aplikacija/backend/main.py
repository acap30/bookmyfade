from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from routers import user, hairdresser, owner, salon, service, working_hours, reservation, wh_exceptions, wh_salon
from auth import authentication
from router_impl import db_user
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static", "images", "users")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(hairdresser.router)
app.include_router(hairdresser.router_public)
app.include_router(owner.router)
app.include_router(salon.router)
app.include_router(salon.router_public)
app.include_router(service.router)
app.include_router(service.public_router)
app.include_router(working_hours.router)
app.include_router(reservation.router)
app.include_router(reservation.public_router)
app.include_router(wh_exceptions.router)
app.include_router(wh_salon.router)

@app.on_event("startup")
async def create_admin():
    db_user.create_admin()

# @app.exception_handler(IntegrityError)
# async def integrity_error_handler(request: Request, exc: IntegrityError):

#     return JSONResponse(
#         status_code=400,
#         content={
#             "detail": "Bad request"
#         },
#     )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    print(exc)
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc.orig)},
    )

