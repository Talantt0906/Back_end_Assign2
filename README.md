 🌍 Global Weather & Financial Insights Platform

## 📖 Project Overview

This application is a robust, server-side integrated service that synchronizes meteorological data with geopolitical and financial metrics. By centralizing API communication on the backend, the system ensures high security for sensitive credentials and delivers a unified, sanitized data packet to the client-side interface.

---

## ⚙️ Detailed Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (Node Package Manager)
- OpenWeather API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Talantt0906/Back_end_Assign2.git
cd Back_end_Assign2
```

### 2. Dependency Management
```bash
npm install
```

This command reads the `package.json` to install `express`, `axios`, and `dotenv`.

**Required Dependencies:**
- **express**: Minimalist web framework for routing
- **axios**: Promise-based HTTP client for API requests
- **dotenv**: Environment variable isolation for security

### 3. Environment Configuration

Create a `.env` file in the project root directory:
```env
OPENWEATHER_API_KEY=your_secret_key_here
PORT=3000
```

**How to obtain API Key:**
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Create a free account
3. Navigate to API Keys section
4. Generate new key
5. Copy and paste into `.env` file
6. **Important**: Wait 10-15 minutes for key activation

### 4. Project Structure Setup

Ensure your folder structure matches:
```
Back_end_Assign2/
├── node_modules/     # Dependency libraries (Auto-generated)
├── public/           # Static frontend files
│   └── index.html    # Responsive UI
├── .env              # Private API keys (DO NOT COMMIT)
├── .gitignore        # Git exclusion rules
├── package.json      # Project manifest
├── README.md         # Documentation
└── server.js         # Backend API logic
```

### 5. Create .gitignore
```
node_modules/
.env
```

### 6. Launch the Server
```bash
node server.js
```

**Expected Output:**
```
Server running on http://localhost:3000
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📡 API Service Logic & Chaining

The application utilizes a **Linear Data Chain** architecture to ensure context-aware results through three interconnected APIs.

### 🌡️ API 1: Weather Data Aggregation (Core Requirement)

**Endpoint:** `/api/weather`  
**Method:** GET  
**Parameter:** `city` (query string)

**External Source:** OpenWeather API  
**URL:** `https://api.openweathermap.org/data/2.5/weather`

**Request Example:**
```
GET http://localhost:3000/api/weather?city=Tokyo
```

**Response Structure:**
```json
{
  "temperature": 18.5,
  "description": "partly cloudy",
  "coordinates": {
    "lat": 35.6895,
    "lon": 139.6917
  },
  "feels_like": 17.2,
  "wind_speed": 4.1,
  "country_code": "JP",
  "rain": 0
}
```

**Fields Extracted:**
- **temperature**: Current temperature in Celsius (metric units)
- **description**: Weather condition description
- **coordinates**: Geographic latitude and longitude
- **feels_like**: Perceived temperature
- **wind_speed**: Wind speed in meters per second
- **country_code**: ISO 3166-1 alpha-2 country identifier
- **rain**: Precipitation volume for last 3 hours (mm)

**Reliability Feature:**  
Implements a ternary fallback operator for the `rain` object:
```javascript
rain: d.rain ? (d.rain['3h'] || 0) : 0
```
This handles dry weather scenarios gracefully without causing null reference errors.

---

### 🌏 API 2: Geopolitical Intelligence (Additional API #1)

**Endpoint:** `/api/country/:code`  
**Method:** GET  
**Parameter:** `code` (URL parameter - ISO country code)

**External Source:** REST Countries API  
**URL:** `https://restcountries.com/v3.1/alpha/`

**Trigger Logic:**  
Automatically invoked using the `country_code` retrieved from the Weather API response.

**Request Example:**
```
GET http://localhost:3000/api/country/JP
```

**Response Structure:**
```json
{
  "fullName": "Japan",
  "flag": "https://flagcdn.com/w320/jp.png",
  "population": 125836021,
  "region": "Asia",
  "currencyCode": "JPY",
  "currencyName": "Japanese yen"
}
```

**Function:**
- Retrieves official state name
- Provides national flag image URL
- Returns population statistics
- Extracts regional classification
- Identifies primary currency for financial analysis

**No API Key Required** - This is a free, open API service.

---

### 💱 API 3: Financial Conversion (Additional API #2)

**Endpoint:** `/api/exchange/:currency`  
**Method:** GET  
**Parameter:** `currency` (URL parameter - ISO 4217 currency code)

**External Source:** ExchangeRate-API  
**URL:** `https://open.er-api.com/v6/latest/USD`

**Trigger Logic:**  
Automatically invoked using the `currencyCode` identified from the Country API response.

**Request Example:**
```
GET http://localhost:3000/api/exchange/JPY
```

**Response Structure:**
```json
{
  "rate": "149.25"
}
```

**Function:**
- Provides real-time USD to Local Currency exchange rates
- Formatted to 2 decimal places for readability
- Base currency is always USD for consistency
- Handles unavailable currencies with "N/A" fallback

**No API Key Required** - Free tier service with sufficient rate limits.

---

### 🔗 Complete API Chain Flow
```
User Input: "Tokyo"
      ↓
┌─────────────────────────────────────┐
│  Step 1: Weather API Call          │
│  GET /api/weather?city=Tokyo        │
│  Returns: country_code = "JP"       │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  Step 2: Country API Call           │
│  GET /api/country/JP                │
│  Returns: currencyCode = "JPY"      │
└─────────────────────────────────────┘
      ↓
┌─────────────────────────────────────┐
│  Step 3: Exchange Rate API Call     │
│  GET /api/exchange/JPY              │
│  Returns: rate = "149.25"           │
└─────────────────────────────────────┘
      ↓
   Display All Data
```

---

## 🧠 Key Design Decisions

### 1. Server-Side Proxy Pattern

**Decision:** All external API calls are executed on the Express server, not the client browser.

**Rationale:**
- **Security**: The `OPENWEATHER_API_KEY` never reaches the client, preventing unauthorized usage or theft
- **Abstraction**: Client remains ignorant of internal API endpoints and logic
- **Control**: Server validates, sanitizes, and formats data before transmission
- **Best Practice**: Industry-standard architecture for production-grade applications

**Implementation:**
```javascript
// Client never sees this
const apiKey = process.env.OPENWEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
```

---

### 2. Error Resilience with Graceful Degradation

**Decision:** Every API endpoint is wrapped in comprehensive `try...catch` blocks.

**Rationale:**
- **Fault Tolerance**: If Exchange Rate API fails, Weather and Country data are still served
- **User Experience**: Partial data is better than complete failure
- **Debugging**: Server-side error logging helps identify issues without exposing them to users
- **Fallback Values**: Defaults like `rain: 0` or `rate: "N/A"` prevent UI breaks

**Implementation:**
```javascript
try {
    const response = await axios.get(url);
    // Process data
} catch (e) {
    res.status(500).json({ error: "Service unavailable" });
}
```

---

### 3. Mobile-First Responsive Design

**Decision:** UI utilizes CSS Media Queries with a `480px` breakpoint.

**Rationale:**
- **Accessibility**: Mobile traffic often exceeds desktop in modern web usage
- **Stacking Layout**: Data cards reorganize vertically on smaller screens for optimal readability
- **Touch-Friendly**: Larger buttons and inputs accommodate touch interfaces
- **Progressive Enhancement**: Desktop users get enhanced layouts, mobile users get functional layouts

**Implementation:**
```css
@media (max-width: 480px) {
    input { width: 100%; margin-bottom: 10px; }
    button { width: 100%; }
}
```

---

### 4. Clean Code Standards & Separation of Concerns

**Decision:** Backend logic (server.js) is completely separated from frontend presentation (index.html).

**Rationale:**
- **Maintainability**: Changes to UI don't require server modifications
- **Scalability**: Easy to add new endpoints or frontend frameworks
- **Team Collaboration**: Frontend and backend developers can work independently
- **Testing**: Each layer can be tested in isolation

**Structure:**
```
Backend (server.js)     →  Data processing, API calls, business logic
Frontend (index.html)   →  Display, user interaction, styling
```

---

### 5. Sequential API Chaining Architecture

**Decision:** Each API call depends on the previous one's response.

**Rationale:**
- **Data Coherence**: Currency belongs to Country, which belongs to City
- **Single User Input**: User enters one city name, gets complete contextual information
- **Logical Flow**: Mimics natural information hierarchy (Location → Nation → Economy)
- **Efficiency**: No redundant API calls or unnecessary data fetching

---

### 6. Standardized JSON Response Format

**Decision:** All endpoints return consistent JSON structures with predictable field names.

**Rationale:**
- **Frontend Simplicity**: JavaScript can reliably access `data.temperature` without null checks
- **Documentation**: Clear contracts between frontend and backend
- **Error Handling**: Uniform error objects `{ error: "message" }`
- **API Evolution**: Easy to extend fields without breaking existing code

---

## 🖼️ Application Demonstration

### Website Screenshot

<img width="1440" height="984" alt="image" src="https://github.com/user-attachments/assets/387b4bfc-ae87-4e54-9ace-91b02235d269" />


**Example Display:**  
Showing real-time weather, national flag, and currency data for **Altay, China**

<img width="1349" height="970" alt="image" src="https://github.com/user-attachments/assets/84b873c7-3a7f-4ad9-bff5-ccb220d5e021" />

**Visible Elements:**
- Temperature: -13.44°C
- Weather: few clouds
- Coordinates: Lat 47.8667, Lon 88.1167
- Country: People's Republic of China
- Population: 1,402,112,000
- Currency: Chinese yuan (CNY)
- Exchange Rate: 1 USD = 7.24 CNY
- National flag image

---



#### Test 3: Exchange Rate Endpoint
![Postman Exchange API](https://via.placeholder.com/900x500?text=Postman+Exchange+Test)

**Request:**
```
GET http://localhost:3000/api/exchange/CNY
```

**Response Preview:**
```json
{
  "rate": "7.24"
}
```

---


---

## 🛠️ Technical Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend Runtime** | Node.js v16+ | JavaScript execution environment |
| **Web Framework** | Express.js | RESTful API routing and middleware |
| **HTTP Client** | Axios | Promise-based API requests |
| **Security** | Dotenv | Environment variable management |
| **Frontend** | HTML5/CSS3 | Responsive user interface |
| **Scripting** | Vanilla JavaScript | Dynamic content rendering |

---

## 📄 License

This project is developed for educational purposes as part of **Assignment 2: Backend API Integration & Service Development**.

---

## 👤 Author

**Talant**  
GitHub: [@Talantt0906](https://github.com/Talantt0906)

---
