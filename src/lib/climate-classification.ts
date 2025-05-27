export interface TemperatureClassification {
  level: "extreme_cold" | "cold" | "cool" | "normal" | "warm" | "hot" | "extreme_heat"
  severity: "low" | "medium" | "high" | "extreme"
  alertType?: "heat" | "cold"
  label: string
  description: string
  color: string
  bgColor: string
  textColor: string
  reasoning: string
}

export function classifyTemperature(temperature: number): TemperatureClassification {
  if (temperature <= 8) {
    return {
      level: "extreme_cold",
      severity: "extreme",
      alertType: "cold",
      label: "Frio Extremo",
      description: "Risco de hipotermia. Evite exposição prolongada ao frio.",
      color: "border-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      reasoning: `Temperatura ≤ 8°C indica condições de frio extremo que podem causar hipotermia e outros riscos à saúde.`,
    }
  } else if (temperature <= 15) {
    return {
      level: "cold",
      severity: "medium",
      alertType: "cold",
      label: "Frio Intenso",
      description: "Vista roupas adequadas e mantenha-se aquecido.",
      color: "border-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      reasoning: `Temperatura entre 9°C e 15°C requer cuidados especiais para manter o aquecimento corporal.`,
    }
  } else if (temperature <= 20) {
    return {
      level: "cool",
      severity: "low",
      label: "Fresco",
      description: "Condições agradáveis, use roupas leves de manga longa.",
      color: "border-cyan-400",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      reasoning: `Temperatura entre 16°C e 20°C oferece condições confortáveis com leve sensação de frescor.`,
    }
  } else if (temperature <= 28) {
    return {
      level: "normal",
      severity: "low",
      label: "Agradável",
      description: "Condições ideais para atividades ao ar livre.",
      color: "border-green-400",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      reasoning: `Temperatura entre 21°C e 28°C representa a faixa de conforto térmico ideal para a maioria das pessoas.`,
    }
  } else if (temperature <= 32) {
    return {
      level: "warm",
      severity: "low",
      label: "Quente",
      description: "Mantenha-se hidratado e use roupas leves.",
      color: "border-yellow-400",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      reasoning: `Temperatura entre 29°C e 32°C requer atenção à hidratação e uso de roupas adequadas.`,
    }
  } else if (temperature <= 34) {
    return {
      level: "hot",
      severity: "medium",
      alertType: "heat",
      label: "Calor Intenso",
      description: "Evite exposição ao sol e beba água regularmente.",
      color: "border-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      reasoning: `Temperatura entre 33°C e 34°C pode causar desconforto e requer cuidados com hidratação.`,
    }
  } else {
    return {
      level: "extreme_heat",
      severity: "extreme",
      alertType: "heat",
      label: "Calor Extremo",
      description: "Risco de insolação. Evite atividades ao ar livre.",
      color: "border-red-600",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      reasoning: `Temperatura ≥ 35°C representa risco significativo de insolação, desidratação e outros problemas de saúde relacionados ao calor.`,
    }
  }
}

export function getNextDaysForecast(
  baseTemperature: number,
): Array<{ day: string; temperature: number; classification: TemperatureClassification }> {
  const days = ["Hoje", "Amanhã", "Depois de Amanhã"]
  const forecast = []

  for (let i = 0; i < 3; i++) {
    // Add some realistic variation to the temperature
    const variation = (Math.random() - 0.5) * 6 // ±3°C variation
    const temperature = Math.round(baseTemperature + variation)
    const classification = classifyTemperature(temperature)

    forecast.push({
      day: days[i],
      temperature,
      classification,
    })
  }

  return forecast
}
