import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

async function GetWeather(lat: number, lon: number) {
  try {
    const Config = await AsyncStorage.getItem('CONFIG');
    const parsedConfig = Config ? JSON.parse(Config) : null;

    const params: any = {
      lat,
      lon,
      exclude: 'minutely,hourly',
      lang: parsedConfig.lang,
      appid: "0051ff2b54f1ae466e72cb622eff4bc1",
    };

    if (parsedConfig.unit !== 'standard') {
      params.units = parsedConfig.unit;
    }

    const climaResponse = await axios.get(
      'https://api.openweathermap.org/data/3.0/onecall',
      { params }
    );

    return climaResponse.data;

  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return null;
  }
}

export default GetWeather;