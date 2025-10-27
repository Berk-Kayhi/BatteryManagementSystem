import random
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AIRequest(BaseModel):
    soc: float
@app.post("/predict")
async def predict_soc(request: AIRequest):
    soc_value = request.soc
    
    ai_prediction = soc_value + random.uniform(-1.0, 1.0)
    
    return {"predicted_soc": round(ai_prediction, 2)}