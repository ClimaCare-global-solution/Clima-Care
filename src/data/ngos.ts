import type { NGO } from "@/types/ngo"

export const mockNGOs: NGO[] = [
  {
    id: "1",
    name: "Projeto Esperança",
    logo: "/placeholder.svg?height=80&width=80",
    mission:
      "Oferecemos abrigo e alimentação para pessoas em situação de vulnerabilidade durante eventos climáticos extremos.",
    description:
      "O Projeto Esperança atua há mais de 15 anos no apoio a comunidades carentes durante emergências climáticas. Nossa missão é garantir que ninguém fique desamparado durante ondas de calor ou frio extremo. Contamos com uma rede de voluntários dedicados e parcerias com o poder público para oferecer abrigo temporário, alimentação e cuidados básicos de saúde.",
    donationInstructions:
      "Você pode doar através de PIX: projetoesperanca@email.com ou transferência bancária: Banco do Brasil, Agência 1234-5, Conta 67890-1. Também aceitamos doações de alimentos não perecíveis, cobertores e produtos de higiene pessoal em nosso endereço.",
    website: "https://projetoesperanca.org.br",
    phone: "(11) 3456-7890",
    email: "contato@projetoesperanca.org.br",
    location: "São Paulo, SP",
    category: "shelter",
  },
  {
    id: "2",
    name: "Abrigo do Sul",
    logo: "/placeholder.svg?height=80&width=80",
    mission: "Especialistas em proteção contra o frio extremo, oferecemos abrigo aquecido e roupas adequadas.",
    description:
      "O Abrigo do Sul nasceu da necessidade de proteger a população mais vulnerável durante as ondas de frio que atingem a região Sul do Brasil. Nossos centros de acolhimento funcionam 24 horas durante alertas de frio extremo, oferecendo não apenas abrigo aquecido, mas também refeições quentes, roupas adequadas e atendimento médico básico.",
    donationInstructions:
      "Faça sua doação via PIX: abrigodosul@pix.com.br ou através do nosso site. Precisamos especialmente de cobertores, roupas de inverno, calçados fechados e alimentos que possam ser preparados quentes. Também aceitamos doações em dinheiro para manutenção dos aquecedores.",
    website: "https://abrigodosul.org.br",
    phone: "(51) 2345-6789",
    email: "ajuda@abrigodosul.org.br",
    location: "Porto Alegre, RS",
    category: "shelter",
  },
  {
    id: "3",
    name: "Rede Solidária",
    logo: "/placeholder.svg?height=80&width=80",
    mission: "Conectamos voluntários e recursos para resposta rápida em emergências climáticas em todo o Brasil.",
    description:
      "A Rede Solidária é uma organização nacional que coordena esforços de ajuda humanitária durante eventos climáticos extremos. Utilizamos tecnologia para conectar rapidamente voluntários, recursos e pessoas necessitadas. Nossa plataforma digital permite que comunidades se organizem de forma eficiente para enfrentar ondas de calor, frio, enchentes e outros desastres naturais.",
    donationInstructions:
      "Contribua através do nosso site com doações recorrentes ou pontuais. Aceitamos PIX: redesolidaria@pix.org.br. Suas doações são utilizadas para compra de suprimentos de emergência, combustível para transporte de voluntários e manutenção de nossa plataforma tecnológica.",
    website: "https://redesolidaria.org.br",
    phone: "(61) 9876-5432",
    email: "contato@redesolidaria.org.br",
    location: "Brasília, DF",
    category: "general",
  },
  {
    id: "4",
    name: "Água Vida",
    logo: "/placeholder.svg?height=80&width=80",
    mission: "Distribuição de água potável e hidratação durante ondas de calor extremo no Nordeste.",
    description:
      "A ONG Água Vida foi criada para combater os efeitos devastadores das ondas de calor no Nordeste brasileiro. Nossos caminhões-pipa percorrem comunidades carentes distribuindo água potável gratuita, enquanto nossos postos de hidratação oferecem soro caseiro e orientações sobre prevenção de desidratação. Também instalamos bebedouros comunitários em áreas de maior vulnerabilidade.",
    donationInstructions:
      "Doe através de PIX: aguavida@doacao.org.br ou boleto bancário disponível em nosso site. Cada R$ 10 garantem 50 litros de água potável para uma família. Também precisamos de garrafas d'água, sais para hidratação e equipamentos para purificação de água.",
    website: "https://aguavida.org.br",
    phone: "(85) 1234-5678",
    email: "ajuda@aguavida.org.br",
    location: "Fortaleza, CE",
    category: "food",
  },
  {
    id: "5",
    name: "SOS Clima",
    logo: "/placeholder.svg?height=80&width=80",
    mission: "Atendimento médico de emergência e primeiros socorros durante eventos climáticos extremos.",
    description:
      "O SOS Clima é uma organização médica especializada em atendimento de emergência durante eventos climáticos extremos. Nossa equipe de médicos, enfermeiros e paramédicos está sempre pronta para atender casos de insolação, hipotermia, desidratação e outras emergências relacionadas ao clima. Operamos ambulâncias equipadas e postos de atendimento móveis.",
    donationInstructions:
      "Suas doações ajudam a manter nossos equipamentos médicos e ambulâncias em funcionamento. Doe via PIX: sosclima@emergencia.org.br ou cartão de crédito em nosso site. Também precisamos de medicamentos básicos, termômetros, mantas térmicas e equipamentos de primeiros socorros.",
    website: "https://sosclima.org.br",
    phone: "(21) 5555-0000",
    email: "emergencia@sosclima.org.br",
    location: "Rio de Janeiro, RJ",
    category: "medical",
  },
  {
    id: "6",
    name: "Alimenta Brasil",
    logo: "/placeholder.svg?height=80&width=80",
    mission: "Distribuição de refeições nutritivas para famílias afetadas por eventos climáticos extremos.",
    description:
      "A Alimenta Brasil combate a insegurança alimentar que se intensifica durante eventos climáticos extremos. Nossos restaurantes comunitários servem refeições gratuitas e nutritivas, enquanto nossos kits de emergência levam alimentos não perecíveis diretamente às famílias mais necessitadas. Priorizamos crianças, idosos e pessoas com necessidades especiais.",
    donationInstructions:
      "Contribua para alimentar famílias em situação de vulnerabilidade. PIX: alimentabrasil@solidariedade.org.br. Cada R$ 5 garantem uma refeição completa. Também aceitamos doações de alimentos não perecíveis, utensílios de cozinha e equipamentos para nossas cozinhas comunitárias.",
    website: "https://alimentabrasil.org.br",
    phone: "(81) 7777-8888",
    email: "doacoes@alimentabrasil.org.br",
    location: "Recife, PE",
    category: "food",
  },
]
