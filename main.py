from fastapi import FastAPI, HTTPException
from typing import List, Dict, Optional
from databases import Database
from pydantic import BaseModel,Field
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime,date,time
from fastapi.middleware.cors import CORSMiddleware
import stripe
from fastapi.responses import JSONResponse

stripe.api_key =  "sk_test_51PFzEcSHs424eprLkiUN5DLZdf2dFfNuv01ZJGT6mewfle6CmUhDCKxBfjeh4Mofh1c5WTgljkA5Xv3K5roi57Nw00Pm312EBO"

app = FastAPI()

DATABASE_URL = "mysql+pymysql://root:@localhost/patient_db"
database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
Base = declarative_base()
stripe.api_key = "your_stripe_api_key"
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Patient(BaseModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    mobile: str
    email: str
    age: int
    height: float
    weight: float
    bloodGroup: str
    purpose: str


class Appointment(BaseModel):
    id: Optional[int]  = Field(default=None, primary_key=True)
    date: date
    time: datetime
    doctor_name: str
    patient_id: int = Field(foreign_key="patients.id")

@app.get("/patients", response_model=List[Patient])
async def get_all_patients():
    query = "SELECT * FROM patients"
    results = await database.fetch_all(query=query)
    print(results)
    if not results:
        raise HTTPException(status_code=404, detail="Patient not found")
    return results

@app.get("/patients/search/{name}", response_model=List[Patient])
async def search_patients_by_name(name: str):
    query = "SELECT * FROM patients WHERE name = :name"
    results = await database.fetch_all(query=query, values={"name": name})
    if not results:
        raise HTTPException(status_code=404, detail="Patient with name not found")
    return results


@app.delete("/patients/{patient_id}", response_model=Dict[str, str])
async def delete_patient(patient_id: int):
    try:
        query = "DELETE FROM patients WHERE id = :id"
        await database.execute(query=query, values={"id": patient_id})
        return {"message": "Patient deleted successfully"}
    except Exception as e:
        return {"error": f"Failed to delete patient with ID {patient_id}. Error: {str(e)}"}
    

@app.post("/patients/", response_model=Patient)
async def create_patient(patient: Patient):
    query = """
    INSERT INTO patients (name, mobile, email, age, height, weight, bloodGroup, purpose) 
    VALUES (:name, :mobile, :email, :age, :height, :weight, :bloodGroup, :purpose)
    """
    values = {
        "name": patient.name,
        "mobile": patient.mobile,
        "email": patient.email,
        "age": patient.age,
        "height": patient.height,
        "weight": patient.weight,
        "bloodGroup": patient.bloodGroup,
        "purpose": patient.purpose
    }
    patient_id = await database.execute(query=query, values=values)
    return {**patient.dict(), "id": patient_id}


@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient_by_id(patient_id: int):
    print(patient_id)
    try:
        query = "SELECT * FROM patients WHERE id = :id"
        result = await database.fetch_one(query=query, values={"id": patient_id})
        print("Retrieved patient from database:", result)
        if result is None:
            raise HTTPException(status_code=404, detail="Patient with id not found")
        
        print("Retrieved patient from database:", result)  # Debugging statement
        
        return Patient(**result)
    except Exception as e:
        print("Error fetching patient from database:", e)  # Debugging statement
        raise HTTPException(status_code=500, detail="Internal Server Error")




@app.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: int, patient: Patient):
    query = """
    UPDATE patients
    SET name = :name, mobile = :mobile, email = :email, 
        age = :age, height = :height, weight = :weight, 
        bloodGroup = :bloodGroup, purpose = :purpose
    WHERE id = :id
    """
    values = {
        "id": patient_id,
        "name": patient.name,
        "mobile": patient.mobile,
        "email": patient.email,
        "age": patient.age,
        "height": patient.height,
        "weight": patient.weight,
        "bloodGroup": patient.bloodGroup,
        "purpose": patient.purpose
    }
    await database.execute(query=query, values=values)
    return patient




@app.get("/appointment/{id}", response_model=Appointment)
async def get_appointment(id: int):
    query = "SELECT * FROM appointment WHERE id = :id"
    result = await database.fetch_one(query=query, values={"id": id})
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return result


@app.post("/appointment/", response_model=Appointment)
async def create_appointment(appointment: Appointment):
    query = """
    INSERT INTO appointment (date, time, doctor_name, patient_id) 
    VALUES (:date, :time, :doctor_name, :patient_id)
    """
    values = {"date": appointment.date, "time": appointment.time, "doctor_name": appointment.doctor_name, "patient_id": appointment.patient_id}
    appointment_id = await database.execute(query=query, values=values)
    return {**appointment.dict(), "id": appointment_id}


@app.put("/appointment/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: Appointment):
    query = """
    UPDATE appointment
    SET date = :date, time = :time, doctor_name = :doctor_name
    WHERE id = :id
    """
    values = {"id": appointment_id, "date": appointment.date, "time": appointment.time, "doctor_name": appointment.doctor_name}
    await database.execute(query=query, values=values)
    return appointment


@app.delete("/appointment/{appointment_id}", response_model=Appointment)
async def delete_appointment(appointment_id: int):
    query = "DELETE FROM appointment WHERE id = :id"
    await database.execute(query=query, values={"id": appointment_id})
    return {"message": "Appointment deleted successfully"}

    
@app.post("/process-payment/")
async def process_payment(amount: int, currency: str, token: str):
    try:
        charge = stripe.Charge.create(
            amount=amount,
            currency=currency,
            source=token,  
            description="Payment for FastAPI Store", 
        )

        return {"status": "success", "charge_id": charge.id}

    except stripe.error.CardError as e:
        return {"status": "error", "message": str(e)}
    except stripe.error.StripeError as e:
        return {"status": "error", "message": "Something went wrong. Please try again later."}


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
