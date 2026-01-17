# Agriculture Service (Microservice)

The Agriculture Service processes farming and agricultural advisory requests sent from the National Core Platform. This service helps classify user queries related to crops, fertilizers, and soil health.

This service does NOT communicate directly with users. All interactions happen through the Core Platform.

---

## Service Information

Service Name: Agriculture Service  
Port: 9002  
Framework: FastAPI  
Architecture: Stateless Microservice  

---

## API Endpoint

POST /agri/request

This endpoint is used by the Core Platform to forward agriculture-related intents.

---

## Required Headers (Provided by Core Platform)

X-Core-User-Name  
X-Core-User-Role  
X-Core-Request-ID  

These headers are trusted and not validated inside the service.

---

## Example Request Body

```json
{
  "intent": "agri",
  "message": "Suggest fertilizer for wheat crop"
}
