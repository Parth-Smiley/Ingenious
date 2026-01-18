def process_agri_request(message: str):

    msg = message.lower()

    if "fertilizer" in msg:
        category = "Fertilizer Advisory"
    elif "crop" in msg:
        category = "Crop Guidance"
    elif "soil" in msg:
        category = "Soil Health"
    else:
        category = "General Agriculture"

    return {
        "service": "agri",
        "status": "success",
        "category": category,
        "message": "Agriculture request received"
    }
