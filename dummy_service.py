from fastapi import FastAPI, Header

app = FastAPI()

@app.post("/handle")
def handle_request(
    x_core_user_name: str = Header(None),
    payload: dict = None
):
    return {
        "received_user": x_core_user_name,
        "received_payload": payload,
        "service": "dummy"
    }
