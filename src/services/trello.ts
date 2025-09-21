import { URLSearchParams } from "url"
import { getProjects } from "./workana"

export interface ICARD {
  title: string 
  link: string 
  budget: string
  description: string
}

export async function createCard({title, link, budget, description}: ICARD) {
  const TRELLO_KEY = process.env.TRELLO_KEY
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN
  const LIST_ID = process.env.LIST_ID

  const params =  new URLSearchParams({
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
      idList: LIST_ID,
      name: title,
      desc: `LINK: ${link} \n\n ORÇAMENTO: ${budget ?? "Não informado"} \n\n DESCRIÇÃO: ${description}`,
      pos: "top",
  })

  const url = `https://api.trello.com/1/cards?${params.toString()}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Accept': 'application/json'
    },
  });

  
  if (!response.ok) {
    console.error('Erro na requisição:', response.status, response.statusText);
    return;
  }

  await response.json(); 
}

export async function getExistingCards() {
  const response = await fetch(`https://api.trello.com/1/lists/${process.env.LIST_ID}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`);
  return await response.json(); // array de cards
}

export async function handleNewCard() {
  try {
    const projects = await getProjects();

    const existingCards = await getExistingCards();
    const existingTitles = new Set(existingCards.map((card: { name: string }) => card.name));

    await Promise.all(
      projects.map(p => {
        const title = p.title ?? "NAO DEFINIDO";

        if (!existingTitles.has(title)) {
          existingTitles.add(title)

          return createCard({
            title: `${p.title}`, 
            budget: p.budget ?? "NÃO DEFINIDO", 
            link: p.link ?? "NÃO DEFINIDO",
            description: p.description ?? "NÃO DEFINIDO"
          })
        } else {
          console.log('PULANDO TITULO')
          return Promise.resolve(); // retorna promessa resolvida para não quebrar o Promise.all
        }
      })
    )
 
  } catch (error) {
    console.error("❌ Erro ao criar card:", error);
  }
}