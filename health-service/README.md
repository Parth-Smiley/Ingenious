# Healthcare Service (Microservice)

This service handles healthcare-related citizen requests routed from the National Core Platform.

Users never interact with this service directly. All requests come through the Core Platform.

---

## Service Details

Service Name: Healthcare Service  
Port: 9001  
Framework: FastAPI  
Architecture: Stateless Microservice  

---

## Endpoint

POST /health/request

This endpoint receives healthcare intent requests from the Core Platform.

---

## Required Headers (Sent by Core Platform)

X-Core-User-Name  
X-Core-User-Role  
X-Core-Request-ID  

These headers are trusted and not validated inside this service.

---

## Request Body Example

```json
{
  "intent": "health",
  "message": "I want to see a doctor"
}
