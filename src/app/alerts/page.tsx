"use client"

import { useState, useEffect } from "react"
import { fetchWeatherData, brazilianCapitals } from "@/lib/weather-api"
import { saveClimateAlert, clearOldAlerts } from "@/lib/climate-alerts"
import { classifyTemperature, TemperatureClassification } from "@/lib/climate-classification"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Thermometer,
  Snowflake,
  MapPin,
  Calendar,
  Search,
  Info,
  Sun,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react"



interface CityWeatherData {
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
  classification: TemperatureClassification | null
  loading: boolean
  error: string | null
}

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [citiesData, setCitiesData] = useState<CityWeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  
  useEffect(() => {
    const initializeCities = () => {
      const initialData = brazilianCapitals.map((city) => ({
        cityName: city,
        state: getStateFromCity(city),
        temperature: 0,
        tempMin: 0,
        tempMax: 0,
        description: "",
        humidity: 0,
        windSpeed: 0,
        feelsLike: 0,
        icon: "",
        lastUpdated: 0,
        classification: null,
        loading: true,
        error: null,
      }))
      setCitiesData(initialData)
    }

    initializeCities()
    loadAllCitiesWeather()
  }, [])

  
  const getStateFromCity = (cityName: string): string => {
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

  const loadAllCitiesWeather = async () => {
    setLoading(true)
    setLoadingProgress(0)

    
    clearOldAlerts()

    const totalCities = brazilianCapitals.length
    let completedCities = 0

    const batchSize = 5
    for (let i = 0; i < brazilianCapitals.length; i += batchSize) {
      const batch = brazilianCapitals.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (city) => {
          try {
            const weatherData = await fetchWeatherData(city)

            if (weatherData) {
              const classification = classifyTemperature(weatherData.temperature)

             
              saveClimateAlert(weatherData)

              setCitiesData((prev) =>
                prev.map((cityData) =>
                  cityData.cityName === city
                    ? {
                        ...cityData,
                        ...weatherData,
                        classification,
                        loading: false,
                        error: null,
                      }
                    : cityData,
                ),
              )
            } else {
              setCitiesData((prev) =>
                prev.map((cityData) =>
                  cityData.cityName === city
                    ? {
                        ...cityData,
                        loading: false,
                        error: "Dados não disponíveis",
                      }
                    : cityData,
                ),
              )
            }
          } catch (error) {
            console.error(`Error loading weather for ${city}:`, error)
            setCitiesData((prev) =>
              prev.map((cityData) =>
                cityData.cityName === city
                  ? {
                      ...cityData,
                      loading: false,
                      error: "Erro ao carregar dados",
                    }
                  : cityData,
              ),
            )
          }

          completedCities++
          setLoadingProgress((completedCities / totalCities) * 100)
        }),
      )

      
      if (i + batchSize < brazilianCapitals.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    setLoading(false)
  }

  const refreshAllData = () => {
    loadAllCitiesWeather()
  }

  
  const filteredCities = citiesData.filter((city) => {
    const matchesSearch =
      city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || city.classification?.severity === severityFilter

    let matchesStatus = true
    if (statusFilter !== "all") {
      if (statusFilter === "normal" && city.classification?.alertType) {
        matchesStatus = false
      } else if (statusFilter === "heat" && city.classification?.alertType !== "heat") {
        matchesStatus = false
      } else if (statusFilter === "cold" && city.classification?.alertType !== "cold") {
        matchesStatus = false
      }
    }

    return matchesSearch && matchesSeverity && matchesStatus
  })

  
  const statistics = {
    total: citiesData.filter((c) => !c.loading && !c.error).length,
    heatAlerts: citiesData.filter((c) => c.classification?.alertType === "heat").length,
    coldAlerts: citiesData.filter((c) => c.classification?.alertType === "cold").length,
    normalConditions: citiesData.filter((c) => c.classification && !c.classification.alertType).length,
    loading: citiesData.filter((c) => c.loading).length,
    errors: citiesData.filter((c) => c.error).length,
  }

  const renderCityCard = (city: CityWeatherData) => {
    if (city.loading) {
      return (
        <Card key={city.cityName} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-6 h-6 rounded" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (city.error) {
      return (
        <Card key={city.cityName} className="border-red-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <CardTitle className="text-lg">{city.cityName}</CardTitle>
                  <CardDescription>{city.state}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{city.error}</p>
          </CardContent>
        </Card>
      )
    }

    const classification = city.classification
    if (!classification) return null

    return (
      <Card key={city.cityName} className={`border-l-4 ${classification.color} hover:shadow-lg transition-shadow`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {classification.alertType === "heat" ? (
                <Thermometer className="w-6 h-6 text-red-500" />
              ) : classification.alertType === "cold" ? (
                <Snowflake className="w-6 h-6 text-blue-500" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <CardTitle className="text-lg">{city.cityName}</CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{city.state}</span>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{city.temperature}°C</div>
              <Badge className={`${classification.bgColor} ${classification.textColor}`}>{classification.label}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700 text-sm capitalize">{city.description}</p>
          <p className="text-gray-600 text-sm">{classification.description}</p>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-600">Sensação Térmica</p>
              <p className="font-semibold text-gray-900">{city.feelsLike}°C</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Umidade</p>
              <p className="font-semibold text-gray-900">{city.humidity}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Vento</p>
              <p className="font-semibold text-gray-900">{city.windSpeed} m/s</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Min/Máx</p>
              <p className="font-semibold text-gray-900">
                {city.tempMin}°/{city.tempMax}°
              </p>
            </div>
          </div>

          {/* Classification Reasoning */}
          <div className={`p-3 rounded-lg ${classification.bgColor}`}>
            <div className="flex items-start space-x-2">
              <Info className={`w-4 h-4 mt-0.5 ${classification.textColor}`} />
              <div>
                <h4 className={`font-medium text-sm ${classification.textColor}`}>Critério de Classificação</h4>
                <p className={`text-xs ${classification.textColor} opacity-90 mt-1`}>{classification.reasoning}</p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Atualizado em: {new Date(city.lastUpdated).toLocaleString("pt-BR")}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <PageContainer background="default">
      <SectionContainer className="py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Alertas Climáticos</h1>
              <p className="text-lg text-gray-600">Monitore as condições climáticas em todas as capitais brasileiras</p>
            </div>
            <Button onClick={refreshAllData} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar Tudo
            </Button>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <div className="flex-1">
                  <p className="text-blue-800 font-medium">Carregando dados meteorológicos...</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">{Math.round(loadingProgress)}% concluído</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="heat">Alertas de Calor</SelectItem>
              <SelectItem value="cold">Alertas de Frio</SelectItem>
              <SelectItem value="normal">Condições Normais</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por severidade" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todas as severidades</SelectItem>
              <SelectItem value="extreme">Extremo</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Thermometer className="w-6 h-6 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas de Calor</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.heatAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Snowflake className="w-6 h-6 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas de Frio</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.coldAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Sun className="w-6 h-6 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Condições Normais</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.normalConditions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Carregado</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Loader2 className="w-6 h-6 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Carregando</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.loading}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Erros</p>
                  <p className="text-xl font-bold text-gray-900">{statistics.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredCities.map(renderCityCard)}</div>

        {/* No results message */}
        {filteredCities.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma cidade encontrada</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
            </CardContent>
          </Card>
        )}
      </SectionContainer>
    </PageContainer>
  )
}
