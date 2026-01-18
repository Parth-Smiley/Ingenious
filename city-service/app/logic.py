def process_city_request(message: str):

    msg = message.lower()

    if "road" in msg:
        department = "Road & Transport"
    elif "water" in msg:
        department = "Water Supply"
    elif "electricity" in msg:
        department = "Electricity"
    else:
        department = "Municipal Services"

    return {
        "service": "city",
        "status": "success",
        "department": department,
        "message": "City complaint registered"
    }
