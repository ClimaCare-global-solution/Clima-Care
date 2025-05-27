"use client"

import type React from "react"
import Image from 'next/image'
import { useState, useEffect } from "react"
import { brazilianCapitals } from "@/lib/weather-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageContainer } from "@/components/body/page-container"
import { SectionContainer } from "@/components/body/section-container"
import { WeatherCard } from "@/components/weather/weather-card"
import type { ProcessedWeatherData } from "@/lib/weather-api"
import {
  AlertTriangle,
  MapPin,
  Search,
  ChevronDown,
  Droplets,
  Sun,
  Wind,
  Shirt,
  Home,
  Coffee,
  Heart,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("São Paulo")
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hotTipsOpen, setHotTipsOpen] = useState(false)
  const [coldTipsOpen, setColdTipsOpen] = useState(false)
  const [currentWeather, setCurrentWeather] = useState<ProcessedWeatherData | null>(null)

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = brazilianCapitals.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredCities(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredCities([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if the search term matches any capital
    const matchedCity = brazilianCapitals.find((city) => city.toLowerCase() === searchTerm.toLowerCase())

    if (matchedCity) {
      handleCitySelect(matchedCity)
    } else if (searchTerm.trim()) {
      // Show error message for non-supported cities
      alert("Apenas capitais brasileiras são suportadas no momento.")
      setSearchTerm("")
    }
  }

  const handleWeatherUpdate = (weatherData: ProcessedWeatherData) => {
    setCurrentWeather(weatherData)
  }

  return (
    <PageContainer background="blue">
      <SectionContainer className="py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <Image
                src="/logo-climacare.png"
                alt="Logo ClimaCare"
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">ClimaCare</h1>
              <p className="text-lg text-blue-700 font-medium">Sua proteção climática inteligente</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Monitore condições climáticas extremas em tempo real, receba alertas personalizados e mantenha-se seguro com
            nossas dicas especializadas para cada situação meteorológica
          </p>
        </div>

        {/* City Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar cidade (ex: São Paulo, Rio de Janeiro)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 shadow-md"
                onFocus={() => searchTerm && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* City Suggestions */}
            {showSuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredCities.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-2 border-b border-blue-100 last:border-b-0 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <p className="text-sm text-gray-600 mt-2 text-center">
            🏛️ Monitoramento disponível para todas as capitais brasileiras
          </p>
        </div>

        {/* Current Weather Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <WeatherCard cityName={selectedCity} onWeatherUpdate={handleWeatherUpdate} />
        </div>

        {/* Useful Tips Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Guia de Proteção Climática</h2>
            </div>
            <p className="text-lg text-gray-600">
              Dicas essenciais para se proteger durante condições climáticas extremas
            </p>
          </div>

          <div className="space-y-4">
            {/* Hot Weather Tips */}
            <Card className="border-red-200 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader
                className="cursor-pointer hover:bg-red-50 transition-colors"
                onClick={() => setHotTipsOpen(!hotTipsOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-red-800 flex items-center">
                        🌡️ Proteção contra Calor Extremo
                      </CardTitle>
                      <CardDescription className="text-red-600">
                        Estratégias essenciais para dias de alta temperatura
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-red-600 transition-transform duration-200 ${hotTipsOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </CardHeader>

              {hotTipsOpen && (
                <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <Droplets className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Hidratação Inteligente</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Beba água a cada 15-20 minutos, mesmo sem sede. Evite álcool, cafeína e bebidas muito geladas.
                          Prefira água em temperatura ambiente com eletrólitos.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                      <Sun className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Proteção Solar Eficaz</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Evite exposição entre 10h-16h. Use protetor solar FPS 30+, chapéu de aba larga e óculos UV.
                          Procure sombra sempre que possível.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                      <Shirt className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Vestimenta Adequada</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Use roupas claras, leves e soltas. Prefira tecidos naturais como algodão e linho. Evite cores
                          escuras que absorvem mais calor.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-cyan-50 rounded-lg">
                      <Wind className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ambiente Climatizado</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Mantenha ambientes ventilados. Use ventilador ou ar condicionado. Feche cortinas durante o dia
                          para bloquear o calor solar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Sinais de Alerta
                    </h5>
                    <p className="text-sm text-red-700">
                      Procure ajuda médica imediatamente se sentir: tontura, náusea, dor de cabeça intensa, pele quente
                      e seca, ou confusão mental.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Cold Weather Tips */}
            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setColdTipsOpen(!coldTipsOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-blue-800 flex items-center">
                        ❄️ Proteção contra Frio Intenso
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Técnicas para manter o calor corporal e prevenir hipotermia
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-600 transition-transform duration-200 ${coldTipsOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </CardHeader>

              {coldTipsOpen && (
                <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                      <Shirt className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Sistema de Camadas</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Use 3 camadas: roupa íntima térmica, isolante (lã/fleece) e externa impermeável. Remova
                          camadas se suar para evitar resfriamento.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                      <Home className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Aquecimento Doméstico</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Mantenha a casa aquecida de forma segura. Feche portas e janelas, use aquecedores com
                          segurança e mantenha a umidade adequada para evitar ressecamento.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg">
                      <Coffee className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Aquecimento Interno</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Beba líquidos quentes como chá, café ou chocolate. Faça refeições quentes e calóricas. Evite
                          álcool que pode causar perda de calor corporal.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Wind className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Proteção das Extremidades</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Use luvas, gorro, cachecol e meias grossas. Proteja especialmente mãos, pés, orelhas e nariz.
                          Mantenha os pés secos e aquecidos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Sinais de Hipotermia
                    </h5>
                    <p className="text-sm text-blue-700">
                      Procure ajuda médica se notar: tremores incontroláveis, sonolência, confusão mental, fala
                      arrastada ou pele azulada.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-white/80 to-blue-50/80 border-blue-200 backdrop-blur-sm shadow-lg">
            <CardContent className="py-8">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Precisa de Ajuda?</h3>
              </div>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Conheça as organizações especializadas que oferecem suporte durante emergências climáticas e saiba como
                contribuir para sua comunidade
              </p>
              <Link href="/help-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Acessar Central de Ajuda
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}
