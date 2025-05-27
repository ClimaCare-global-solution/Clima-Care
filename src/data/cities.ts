import { classifyTemperature, type TemperatureClassification } from "@/lib/climate-classification"

export interface BrazilianCity {
  name: string
  state: string
  code: string
  temperature: number
  classification: TemperatureClassification
}

const cityTemperatures = [
  { name: "São Paulo", state: "SP", code: "sao-paulo", temperature: 28 },
  { name: "Rio de Janeiro", state: "RJ", code: "rio-de-janeiro", temperature: 35 },
  { name: "Brasília", state: "DF", code: "brasilia", temperature: 32 },
  { name: "Salvador", state: "BA", code: "salvador", temperature: 30 },
  { name: "Fortaleza", state: "CE", code: "fortaleza", temperature: 33 },
  { name: "Belo Horizonte", state: "MG", code: "belo-horizonte", temperature: 26 },
  { name: "Manaus", state: "AM", code: "manaus", temperature: 36 },
  { name: "Curitiba", state: "PR", code: "curitiba", temperature: 18 },
  { name: "Recife", state: "PE", code: "recife", temperature: 31 },
  { name: "Porto Alegre", state: "RS", code: "porto-alegre", temperature: 8 },
  { name: "Goiânia", state: "GO", code: "goiania", temperature: 29 },
  { name: "Belém", state: "PA", code: "belem", temperature: 32 },
  { name: "Guarulhos", state: "SP", code: "guarulhos", temperature: 27 },
  { name: "Campinas", state: "SP", code: "campinas", temperature: 25 },
  { name: "São Luís", state: "MA", code: "sao-luis", temperature: 33 },
  { name: "Maceió", state: "AL", code: "maceio", temperature: 29 },
  { name: "Campo Grande", state: "MS", code: "campo-grande", temperature: 31 },
  { name: "João Pessoa", state: "PB", code: "joao-pessoa", temperature: 30 },
  { name: "Teresina", state: "PI", code: "teresina", temperature: 37 },
  { name: "Natal", state: "RN", code: "natal", temperature: 31 },
  { name: "Florianópolis", state: "SC", code: "florianopolis", temperature: 12 },
  { name: "Vitória", state: "ES", code: "vitoria", temperature: 28 },
  { name: "Aracaju", state: "SE", code: "aracaju", temperature: 30 },
  { name: "Cuiabá", state: "MT", code: "cuiaba", temperature: 38 },
  { name: "Rio Branco", state: "AC", code: "rio-branco", temperature: 33 },
  { name: "Macapá", state: "AP", code: "macapa", temperature: 32 },
  { name: "Boa Vista", state: "RR", code: "boa-vista", temperature: 39 },
  { name: "Palmas", state: "TO", code: "palmas", temperature: 33 },
]

export const brazilianCapitals: BrazilianCity[] = cityTemperatures.map((city) => ({
  ...city,
  classification: classifyTemperature(city.temperature),
}))
