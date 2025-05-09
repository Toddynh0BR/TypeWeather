
import axios from "axios";

 async function GetWeather(lat: number, lon: number) {

    try {
        const climaResponse = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
            params: {
              lat,
              lon,
              exclude: 'minutely,hourly,alerts',
              units: 'metric',
              lang: 'pt_br',
              appid: "your-api-key",//change this to your api key
            },
          });
    
        return climaResponse.data;
    }catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        return null;
    }
};

export default GetWeather;