def process_health_request(message: str):
    
    msg = message.lower()

    if "heart" in msg:
        department = "Cardiology"

    elif "skin" in msg:
        department = "Dermatology"

    elif "eye" in msg:
        department = "Ophthalmology"

    else:
        department = "General Medicine"

    return {
        "status": "success",
        "department": department,
        "message": "Doctor appointment request received"
    }
