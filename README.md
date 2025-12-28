lobal Weather Hub 🌍☁️
A full-stack weather application that provides comprehensive weather information, country insights, and real-time currency exchange rates through server-side API integration.
📦 Setup Instructions
Prerequisites

Node.js (v14 or higher)
npm (Node Package Manager)
OpenWeather API key

Installation Steps

Clone the repository

bash   git clone https://github.com/yourusername/global-weather-hub.git
   cd global-weather-hub

Install dependencies

bash   npm install

Create environment file
Create a .env file in the root directory:

env   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3000
```

4. **Obtain OpenWeather API Key**
   - Visit [OpenWeather API](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your account dashboard
   - Copy the key to your `.env` file
   - **Important**: New API keys may take 10-15 minutes to activate

5. **Create project structure**
```
   project-root/
   ├── server.js
   ├── package.json
   ├── .env
   ├── .gitignore
   └── public/
       └── index.html
```

6. **Add the HTML file**
   
   Create `public` folder and place `index.html` inside it

7. **Create .gitignore file**
```
   node_modules/
   .env

Start the server

bash   node server.js
```
   
   You should see: `Server running on http://localhost:3000`

9. **Access the application**
   
   Open your browser and navigate to:
```
   http://localhost:3000
Package.json
json{
  "name": "global-weather-hub",
  "version": "1.0.0",
  "description": "Weather app with country insights and currency exchange",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1"
  },
  "keywords": ["weather", "api", "express", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}
```

## 🔌 API Usage Details

### API Architecture
All APIs are called **server-side only** to protect API keys and ensure secure data handling. The frontend communicates only with the Express server, which then fetches data from external APIs.

---

### 1. Weather API Endpoint

**Endpoint**: `/api/weather`  
**Method**: GET  
**Query Parameters**: `city` (required, string)

**Example Request**:
```
GET http://localhost:3000/api/weather?city=London
Response:
json{
  "temperature": 15.2,
  "description": "clear sky",
  "coordinates": {
    "lat": 51.5074,
    "lon": -0.1278
  },
  "feels_like": 14.1,
  "wind_speed": 3.5,
  "country_code": "GB",
  "rain": 0
}
External API: OpenWeather API (https://api.openweathermap.org/data/2.5/weather)
What it does:

Retrieves real-time weather data for specified city
Converts temperature to Celsius (metric units)
Extracts all required fields: temperature, description, coordinates, feels-like, wind speed, country code, rain volume
Returns country code for use in subsequent API calls

Error Response:
json{
  "error": "Weather data failed"
}
```

---

### 2. Country Information API Endpoint

**Endpoint**: `/api/country/:code`  
**Method**: GET  
**URL Parameters**: `code` (required, ISO 3166-1 alpha-2 country code)

**Example Request**:
```
GET http://localhost:3000/api/country/GB
Response:
json{
  "fullName": "United Kingdom of Great Britain and Northern Ireland",
  "flag": "https://flagcdn.com/w320/gb.png",
  "population": 67215293,
  "region": "Europe",
  "currencyCode": "GBP",
  "currencyName": "British pound"
}
External API: REST Countries API (https://restcountries.com/v3.1/alpha/)
What it does:

Fetches comprehensive country information using country code from weather API
Provides official country name, flag image, population, and region
Extracts currency information (code and name) for exchange rate API
No API key required

Error Response:
json{
  "error": "Country failed"
}
```

---

### 3. Currency Exchange API Endpoint

**Endpoint**: `/api/exchange/:currency`  
**Method**: GET  
**URL Parameters**: `currency` (required, ISO 4217 currency code)

**Example Request**:
```
GET http://localhost:3000/api/exchange/EUR
Response:
json{
  "rate": "0.93"
}
External API: Exchange Rate API (https://open.er-api.com/v6/latest/USD)
What it does:

Fetches real-time exchange rates with USD as base currency
Converts rate to 2 decimal places for readability
Provides currency conversion information for the selected country
No API key required

Error Response:
json{
  "rate": "N/A"
}
```

---

### API Call Flow
```
User enters "London" → Frontend calls /api/weather?city=London
                              ↓
                    Returns country_code: "GB"
                              ↓
              Frontend calls /api/country/GB
                              ↓
                  Returns currencyCode: "GBP"
                              ↓
             Frontend calls /api/exchange/GBP
                              ↓
                    Returns rate: "0.79"
                              ↓
              All data displayed together
```

## 🎨 Key Design Decisions

### 1. Server-Side API Integration
**Decision**: All external API calls are made from the Express server, not the frontend.

**Reasons**:
- **Security**: API keys (especially OpenWeather) remain hidden on the server and are never exposed to the client
- **Control**: Server validates and processes data before sending to frontend
- **Simplicity**: Frontend code remains clean and focused on display logic
- **Best Practice**: Industry standard for production applications

### 2. Three-API Sequential Architecture
**Decision**: Chained API calls where each API's response feeds into the next request.

**Reasons**:
- **Data Dependency**: Country code from Weather API → Country API → Currency code → Exchange API
- **Comprehensive Information**: Provides complete context (weather + country insights + financial data)
- **Single Search**: User enters one city name and gets all related information
- **Enhanced UX**: Rich, contextual data presentation without multiple user inputs

### 3. Clean JSON Response Structure
**Decision**: Server endpoints return only essential, cleaned data to frontend.

**Reasons**:
- **Efficiency**: Reduces payload size by filtering unnecessary fields
- **Consistency**: Standardized response format across all endpoints
- **Frontend Simplicity**: Frontend doesn't need to navigate complex nested objects
- **Maintainability**: Easy to modify data structure without breaking frontend

### 4. Graceful Error Handling
**Decision**: Try-catch blocks on all API calls with user-friendly error messages.

**Reasons**:
- **Reliability**: Prevents server crashes from external API failures
- **User Experience**: Provides helpful feedback instead of blank screens
- **Debugging**: Console errors help developers identify issues
- **Fallback Values**: Default values (e.g., rain = 0) when data unavailable

### 5. Responsive Single-Page Design
**Decision**: Single HTML page with dynamic content rendering using vanilla JavaScript.

**Reasons**:
- **Performance**: No page reloads, faster user experience
- **Simplicity**: No framework overhead for this scope
- **Assignment Requirements**: Demonstrates core web development skills
- **Mobile-First**: Media queries ensure usability on all devices

### 6. Static File Serving
**Decision**: Express serves frontend files from `public` directory.

**Reasons**:
- **Simplicity**: No need for separate frontend server
- **Same Origin**: Avoids CORS complications
- **Production Ready**: Standard Express pattern for serving static assets

### 7. Environment Variable Configuration
**Decision**: Use `.env` file for API keys and configuration.

**Reasons**:
- **Security**: Prevents accidental commit of sensitive credentials
- **Flexibility**: Easy to change settings without modifying code
- **Standard Practice**: Industry-standard configuration management
- **Team Collaboration**: Each developer uses their own API keys

### 8. Modern UI/UX Patterns
**Decision**: Card-based layout with clear visual hierarchy and loading states.

**Reasons**:
- **User Feedback**: Loading messages keep users informed
- **Readability**: Field-value pairs with clear labels
- **Visual Appeal**: Modern design with shadows, rounded corners, and proper spacing
- **Accessibility**: High contrast, readable fonts, touch-friendly buttons

## 📸 Screenshots

### Web Application Screenshot
![Weather App Screenshot](https://via.placeholder.com/800x600?text=Add+Your+Website+Screenshot+Here)

**To capture your screenshot:**
1. Start the server: `node server.js`
2. Open browser: `http://localhost:3000`
3. Search for a city (e.g., "London", "Tokyo", "Paris")
4. Wait for all data to load
5. Take a full-page screenshot
6. Save as `screenshot-web.png` and replace the placeholder above

---

### Postman API Testing

#### Test 1: Weather API
![Postman Weather Test](https://via.placeholder.com/800x400?text=Postman+Weather+API+Screenshot)

**Request:**
```
GET http://localhost:3000/api/weather?city=Tokyo
Expected Response:
json{
  "temperature": 18.5,
  "description": "partly cloudy",
  "coordinates": { "lat": 35.6895, "lon": 139.6917 },
  "feels_like": 17.2,
  "wind_speed": 4.1,
  "country_code": "JP",
  "rain": 0
}
```

---

#### Test 2: Country API
![Postman Country Test](https://via.placeholder.com/800x400?text=Postman+Country+API+Screenshot)

**Request:**
```
GET http://localhost:3000/api/country/JP
Expected Response:
json{
  "fullName": "Japan",
  "flag": "https://flagcdn.com/w320/jp.png",
  "population": 125836021,
  "region": "Asia",
  "currencyCode": "JPY",
  "currencyName": "Japanese yen"
}
```

---

#### Test 3: Exchange Rate API
![Postman Exchange Test](https://via.placeholder.com/800x400?text=Postman+Exchange+API+Screenshot)

**Request:**
```
GET http://localhost:3000/api/exchange/JPY
Expected Response:
json{
  "rate": "149.25"
}
