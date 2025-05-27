import { classifyTemperature, type TemperatureClassification } from "./climate-classification"
import type { ProcessedWeatherData } from "./weather-api"

export interface ClimateAlert {
  id: string
  cityName: string
  state: string
  temperature: number
  tempMin: number
  tempMax: number
  classification: TemperatureClassification
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
  createdAt: number
  lastUpdated: number
}

export interface ClimateAlertsState {
  alerts: ClimateAlert[]
  lastUpdated: number
}

const STORAGE_KEY = "climate_alerts"

export function saveClimateAlert(weatherData: ProcessedWeatherData): ClimateAlert {
  const classification = classifyTemperature(weatherData.temperature)

  const alert: ClimateAlert = {
    id: `${weatherData.cityName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    cityName: weatherData.cityName,
    state: weatherData.state,
    temperature: weatherData.temperature,
    tempMin: weatherData.tempMin,
    tempMax: weatherData.tempMax,
    classification,
    description: weatherData.description,
    humidity: weatherData.humidity,
    windSpeed: weatherData.windSpeed,
    feelsLike: weatherData.feelsLike,
    icon: weatherData.icon,
    createdAt: Date.now(),
    lastUpdated: weatherData.lastUpdated,
  }

  // Get existing alerts
  const existingAlerts = getClimateAlerts()

  // Remove old alert for the same city if exists
  const filteredAlerts = existingAlerts.alerts.filter(
    (a) => a.cityName.toLowerCase() !== weatherData.cityName.toLowerCase(),
  )

  // Add new alert
  const updatedAlerts: ClimateAlertsState = {
    alerts: [alert, ...filteredAlerts],
    lastUpdated: Date.now(),
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts))
  }

  return alert
}

export function getClimateAlerts(): ClimateAlertsState {
  if (typeof window === "undefined") {
    return { alerts: [], lastUpdated: 0 }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading climate alerts from storage:", error)
  }

  return { alerts: [], lastUpdated: 0 }
}

export function getAlertsByCondition() {
  const { alerts } = getClimateAlerts()

  return {
    extremeHeat: alerts.filter((a) => a.classification.level === "extreme_heat"),
    hot: alerts.filter((a) => a.classification.level === "hot"),
    warm: alerts.filter((a) => a.classification.level === "warm"),
    normal: alerts.filter((a) => a.classification.level === "normal"),
    cool: alerts.filter((a) => a.classification.level === "cool"),
    cold: alerts.filter((a) => a.classification.level === "cold"),
    extremeCold: alerts.filter((a) => a.classification.level === "extreme_cold"),
  }
}

export function getAlertStatistics() {
  const { alerts } = getClimateAlerts()

  return {
    total: alerts.length,
    heatAlerts: alerts.filter((a) => a.classification.alertType === "heat").length,
    coldAlerts: alerts.filter((a) => a.classification.alertType === "cold").length,
    normalConditions: alerts.filter((a) => !a.classification.alertType).length,
  }
}

export function clearOldAlerts(maxAge: number = 24 * 60 * 60 * 1000) {
  const { alerts } = getClimateAlerts()
  const now = Date.now()

  const recentAlerts = alerts.filter((alert) => now - alert.createdAt < maxAge)

  const updatedState: ClimateAlertsState = {
    alerts: recentAlerts,
    lastUpdated: now,
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState))
  }
}
