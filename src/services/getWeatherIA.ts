import axios from "axios";

async function GetWeatherIA(prompt: string) {
  try {

    const climaResponse = await axios.post(
      'https://api.openweathermap.org/assistant/session',
      {
        prompt: `Em português brasileiro responda ao prompt: ${prompt}`
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "0051ff2b54f1ae466e72cb622eff4bc1"
        }
      }
    );

    return climaResponse.data;

  } catch (error) {
    console.error('Erro ao buscar resposta da IA:', error);
    return null;
  }
}

export default GetWeatherIA;