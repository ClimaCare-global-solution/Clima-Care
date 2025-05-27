export interface WeatherData {
  id: number
  name: string
  country: string
  coord: {
    lat: number
    lon: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
}

export interface ProcessedWeatherData {
  cityName: string
  state: string
  temperature: number
  tempMin: number
  tempMax: number
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
  lastUpdated: number
}

const API_KEY = "bd5e378503939ddaee76f12ad7a97608"
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

// Cache for API responses
const weatherCache = new Map<string, { data: ProcessedWeatherData; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export async function fetchWeatherData(cityName: string, countryCode = "BR"): Promise<ProcessedWeatherData | null> {
  const cacheKey = `${cityName},${countryCode}`

  // Check cache first
  const cached = weatherCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(cityName)},${countryCode}&appid=${API_KEY}&units=metric&lang=pt_br`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data: WeatherData = await response.json()

    const processedData: ProcessedWeatherData = {
      cityName: data.name,
      state: getStateFromCity(cityName),
      temperature: Math.round(data.main.temp),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      description: data.weather[0]?.description || "Sem descrição",
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      icon: data.weather[0]?.icon || "01d",
      lastUpdated: Date.now(),
    }

    // Cache the result
    weatherCache.set(cacheKey, { data: processedData, timestamp: Date.now() })

    return processedData
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error)
    return null
  }
}

// Helper function to get state abbreviation from city name
function getStateFromCity(cityName: string): string {
  const cityStateMap: Record<string, string> = {
    "São Paulo": "SP",
    "Rio de Janeiro": "RJ",
    Brasília: "DF",
    Salvador: "BA",
    Fortaleza: "CE",
    "Belo Horizonte": "MG",
    Manaus: "AM",
    Curitiba: "PR",
    Recife: "PE",
    "Porto Alegre": "RS",
    Goiânia: "GO",
    Belém: "PA",
    Guarulhos: "SP",
    Campinas: "SP",
    "São Luís": "MA",
    Maceió: "AL",
    "Campo Grande": "MS",
    "João Pessoa": "PB",
    Teresina: "PI",
    Natal: "RN",
    Florianópolis: "SC",
    Vitória: "ES",
    Aracaju: "SE",
    Cuiabá: "MT",
    "Rio Branco": "AC",
    Macapá: "AP",
    "Boa Vista": "RR",
    Palmas: "TO",
  }

  return cityStateMap[cityName] || "BR"
}

export const brazilianCapitals = [
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Salvador",
  "Fortaleza",
  "Belo Horizonte",
  "Manaus",
  "Curitiba",
  "Recife",
  "Porto Alegre",
  "Goiânia",
  "Belém",
  "São Luís",
  "Maceió",
  "Campo Grande",
  "João Pessoa",
  "Teresina",
  "Natal",
  "Florianópolis",
  "Vitória",
  "Aracaju",
  "Cuiabá",
  "Rio Branco",
  "Macapá",
  "Boa Vista",
  "Palmas",
]
