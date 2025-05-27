"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchWeatherData, type ProcessedWeatherData } from "@/lib/weather-api"
import { saveClimateAlert } from "@/lib/climate-alerts"
import { getNextDaysForecast } from "@/lib/climate-classification"
import {
  MapPin,
  Thermometer,
  Snowflake,
  Sun,
  Calendar,
  AlertTriangle,
  Droplets,
  Wind,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { classifyTemperature } from "@/lib/climate-classification"

interface WeatherCardProps {
  cityName: string
  onWeatherUpdate?: (weatherData: ProcessedWeatherData) => void
}

export function WeatherCard({ cityName, onWeatherUpdate }: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    if (!cityName) return

    setLoading(true)
    setError(null)

    try {
      const data = await fetchWeatherData(cityName)

      if (data) {
        setWeatherData(data)

        // Save to climate alerts system
        saveClimateAlert(data)

        // Notify parent component
        onWeatherUpdate?.(data)
      } else {
        setError("Dados meteorológicos não disponíveis para esta cidade.")
      }
    } catch (err) {
      setError("Erro ao buscar dados meteorológicos. Tente novamente.")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [cityName])

  if (loading) {
    return (
      <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-6 h-6 rounded" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchWeather} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Sun className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma cidade selecionada</h3>
            <p className="text-gray-600">Busque por uma cidade para ver os dados meteorológicos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const classification = weatherData ? classifyTemperature(weatherData.temperature) : null
  const forecast = weatherData ? getNextDaysForecast(weatherData.temperature) : []

  return (
    <Card className={`border-l-4 ${classification?.color || "border-gray-300"} shadow-xl bg-white/90 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-gray-600" />
              <div>
                <CardTitle className="text-2xl">{weatherData.cityName}</CardTitle>
                <CardDescription className="text-lg">{weatherData.state}</CardDescription>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              {classification?.alertType === "heat" ? (
                <Thermometer className="w-8 h-8 text-red-500" />
              ) : classification?.alertType === "cold" ? (
                <Snowflake className="w-8 h-8 text-blue-500" />
              ) : (
                <Sun className="w-8 h-8 text-yellow-500" />
              )}
              <span className="text-4xl font-bold text-gray-900">{weatherData.temperature}°C</span>
            </div>

            {classification && (
              <Badge className={`${classification.bgColor} ${classification.textColor}`}>{classification.label}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{classification?.label || "Carregando..."}</h3>
            <p className="text-gray-600 capitalize">{weatherData.description}</p>
            {classification && <p className="text-gray-600 text-sm mt-1">{classification.description}</p>}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={fetchWeather} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>

            {classification?.alertType && (
              <Link href="/alerts">
                <Button variant="outline" size="sm" className="hover:bg-blue-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Ver Alertas
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Sensação</span>
            </div>
            <p className="font-semibold text-gray-900">{weatherData.feelsLike}°C</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Droplets className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600">Umidade</span>
            </div>
            <p className="font-semibold text-gray-900">{weatherData.humidity}%</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Wind className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Vento</span>
            </div>
            <p className="font-semibold text-gray-900">{weatherData.windSpeed} m/s</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Min/Máx</span>
            </div>
            <p className="font-semibold text-gray-900">
              {weatherData.tempMin}°/{weatherData.tempMax}°
            </p>
          </div>
        </div>

        {/* Forecast */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Previsão dos Próximos Dias
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">{day.day}</p>
                <p className="text-xl font-bold text-gray-900 mb-1">{day.temperature}°C</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${day.classification.bgColor} ${day.classification.textColor}`}
                >
                  {day.classification.label}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center border-t pt-2">
          Última atualização: {new Date(weatherData.lastUpdated).toLocaleString("pt-BR")}
        </div>
      </CardContent>
    </Card>
  )
}
