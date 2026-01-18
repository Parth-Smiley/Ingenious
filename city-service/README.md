# City Service (Municipal Complaint Microservice)

The City Service is responsible for handling citizen complaints related to municipal infrastructure such as roads, water supply, electricity, and public utilities.

This service does not communicate directly with users. All requests are routed through the National Core Platform.

---

## Service Information

Service Name: City Service  
Port: 9003  
Framework: FastAPI  
Architecture: Stateless Microservice  

---

## API Endpoint

POST /city/request

This endpoint receives city-related complaints forwarded by the Core Platform.

---

## Required Headers (Provided by Core Platform)

The Core Platform sends the following trusted headers:

X-Core-User-Name  
X-Core-User-Role  
X-Core-Request-ID  

The City Service does not perform authentication or validation on these headers.

---

## Example Request Body

```json
{
  "intent": "city",
  "message": "There is water leakage on my street"
}
