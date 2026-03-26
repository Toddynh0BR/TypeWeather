import { 
 StyleSheet,
 Text,
 View,
 Image,
 Alert,
 Animated, 
 TouchableOpacity,
 Easing } from 'react-native';
 import * as S from './styles';
 
 import AsyncStorage from '@react-native-async-storage/async-storage';//salvamento em cache persistente
 import { useEffect, useState, useCallback, useRef } from 'react';//funções do react
 import debounce from 'lodash.debounce';//delay de chamada de api
 import { captureRef } from 'react-native-view-shot';//Captura de tela para compartilhamento
 import * as Sharing from 'expo-sharing';//Compartilhamento nativo
 import { Audio } from 'expo-av';//tocar audio

 import MapView, { UrlTile } from "react-native-maps";//mapa personalizado
 import GetWeather from '../../services/getWeather';//api do clima
 import axios from 'axios';//chamadas http
 
 import { Wind, CloudRain, Drop, ThermometerSimple, Sun, Star, X, ShareNetwork, Warning, Cloud } from 'phosphor-react-native';
 
 import { Input } from '../../components/input';
 
 import Loading from "../../../assets/loading.png"
 import Icon from "../../../assets/Icon4K.png";
 import AlertBCI from './assets/AlertBC.png';

 import ClearDay from './assets/themes/Weather=Clear, Moment=Day.png';
 import ClearNight from './assets/themes/Weather=Clear, Moment=Night.png';
 import CloudyDay from './assets/themes/Weather=Cloudy, Moment=Day.png';
 import CloudyNight from './assets/themes/Weather=Cloudy, Moment=Night.png';
 import FewDay from './assets/themes/Weather=Few Clouds, Moment=Day.png';
 import FewNight from "./assets/themes/Weather=Few Clouds, Moment=Night.png";
 import RainDay from "./assets/themes/Weather=Rain, Moment=Day.png";
 import RainNight from './assets/themes/Weather=Rain, Moment=Night.png';
 import SnowDay from './assets/themes/Weather=Snow, Moment=Day.png';
 import SnowNight from './assets/themes/Weather=Snow, Moment=Night.png';
 import StormDay from "./assets/themes/Weather=Storm, Moment=Day.png";
 import StormNight from './assets/themes/image.png';
 
 import IClearDay from "./assets/icons/Weather=Clear, Moment=Day.png";
 import IClearNight from './assets/icons/Weather=Clear, Moment=Night.png';
 import ICloudyDay from './assets/icons/Weather=Cloudy, Moment=Day.png';
 import ICloudyNight from './assets/icons/Weather=Cloudy, Moment=Night.png';
 import IFewDay from './assets/icons/Weather=Few, Moment=Day.png';
 import IFewNight from "./assets/icons/Weather=Few, Moment=Night.png";
 import IRainDay from "./assets/icons/Weather=Rain, Moment=Day.png";
 import IRainNight from './assets/icons/Weather=Rain, Moment=Night.png';
 import ISnowDay from './assets/icons/Weather=Snow, Moment=Day.png';
 import ISnowNight from './assets/icons/Weather=Snow, Moment=Night.png';
 import IStormDay from "./assets/icons/Weather=Storm, Moment=Day.png";
 import IStormNight from './assets/icons/Weather=Storm, Moment=Night.png';
 
 import ThunderAudio from './assets/sounds/thunder-rain.mp3';
 import NightAudio from './assets/sounds/night.mp3';
 import WindAudio from './assets/sounds/wind.mp3';
 import RainAudio from './assets/sounds/rain.mp3';
 import DayAudio from './assets/sounds/day.mp3';

const IconTime = {
  '01d': IClearDay,
  '01n': IClearNight,
  '02d': IFewDay,
  '02n': IFewNight,
  '03d': ICloudyDay,
  '03n': ICloudyNight,
  '04d': ICloudyDay,
  '04n': ICloudyNight,
  '09d': IRainDay,
  '09n': IRainNight,
  '10d': IRainDay,
  '10n': IRainNight,
  '11d': IStormDay,
  '11n': IStormNight,
  '13d': ISnowDay,
  '13n': ISnowNight,
  '50d': ICloudyDay,
  '50n': ICloudyNight
};

const BackTime = {
  '01d': ClearDay,// day
  '01n': ClearNight,// night
  '02d': FewDay,// day
  '02n': FewNight,// night
  '03d': CloudyDay,// wind
  '03n': CloudyNight,// wind
  '04d': CloudyDay, // wind 
  '04n': CloudyNight, // wind
  '09d': RainDay, // rain
  '09n': RainNight, // rain
  '10d': RainDay, // rain
  '10n': RainNight, // raind
  '11d': StormDay, // thunder
  '11n': StormNight, // thunder
  '13d': SnowDay, // wind
  '13n': SnowNight, // wind
  '50d': CloudyDay, // wind
  '50n': CloudyNight  // wind
};

const TimeSounds = {
  '01d': DayAudio,
  '01n': NightAudio,
  '02d': DayAudio,
  '02n': NightAudio,
  '03d': WindAudio,
  '03n': WindAudio,
  '04d': WindAudio, 
  '04n': WindAudio,
  '09d': RainAudio,
  '09n': RainAudio,
  '10d': RainAudio,
  '10n': RainAudio,
  '11d': ThunderAudio,
  '11n': ThunderAudio,
  '13d': WindAudio,
  '13n': WindAudio,
  '50d': WindAudio,
  '50n': WindAudio 
};

interface Props {
  navigation: any;
  route: any;
};

type Sugestao = {
  name: string;
  formatted: string;
  latitude: number;
  longitude: number;
};

const styles = StyleSheet.create({
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative'
  },
  rowDistance: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  rowDistance2: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  noBorder: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  loadinIcon: {
    width: 50,
    height: 50,
  }
});

export function Result({ navigation, route }: Props) {
  const [loading, setLoading]= useState(false);
  const [weather, setWeather] = useState(null);
  const [results, setResult] = useState<any[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  
  const [inputValue, setInputValue] = useState('');
  const [alerts, setAlerts] = useState(null);
  const [openA, setOpenA] = useState(false);
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [resume, setResume] = useState('');
  
  const [weekDays, setWeekDays] = useState([
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sab",
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sab"
  ]);
  const [dateString, setDateString] = useState('');
  const [unitU, setUnit] = useState(null)
  let today =  new Date().getDay();

  ///////////////////////////////////////
  //////        Linguagem          //////
  ///////////////////////////////////////
  const [language, setLanguage] = useState('pt_br'); 
  async function loadLanguage() {
    const SaveConfig = await AsyncStorage.getItem('CONFIG');
    const parsedConfig = JSON.parse(SaveConfig || '{}');

    setLanguage(parsedConfig.lang)
    if (parsedConfig.lang == 'en') return setWeekDays([
"Sun", 
"Mon", 
"Tue", 
"Wed", 
"Thu", 
"Fri", 
"Sat", 
"Sun", 
"Mon", 
"Tue", 
"Wed", 
"Thu", 
"Fri", 
"Sat"
    ]);
    if (parsedConfig.lang == 'es') return setWeekDays([
"Dom",
"Lun",
"Tener",
"Mié",
"Jue",
"Vie",
"Sáb",
"Dom",
"Lun",
"Tener",
"Mié",
"Jue",
"Vie",
"Sáb"
    ]);
  };//carregar linguagem


  async function HandleGetWeather(lat: number, lon: number, name: string, historic: boolean) {
      setLoading(true);
      setResult([]);
      setCity(name);
     
       const Configs = await AsyncStorage.getItem('CONFIG');
       const parsedConfig = JSON.parse(Configs || '{}');
       setUnit(parsedConfig.unit || 'metric')

      try {

       let weatherData = undefined;
       const CacheMemory = await AsyncStorage.getItem('CACHE');
       if (CacheMemory) {
        const parsedCache = JSON.parse(CacheMemory);
        const CityCache = parsedCache.find((item:any)=> item.name == name);

        if (CityCache && (Date.now() - CityCache.timestamp < 1000 * 60 * 15)) {
          weatherData = CityCache.data;

        } else {
         const Response = await GetWeather(lat, lon);//pega os dados do clima
         
         if (!Response) {
          Alert.alert('Erro!', 'Informações não encontradas');
          navigation.navigate('home', { error: true })
          setLoading(false);
          return;
         }  
         weatherData = Response;
         const CacheData = {
          name,
          data: weatherData,
          timestamp: Date.now()
         };

         const filteredCityCache = parsedCache.filter((item:any)=> item.name !== name);
         filteredCityCache.push(CacheData);
         await AsyncStorage.setItem('CACHE', JSON.stringify(filteredCityCache));
        }
       } else {
        const Response = await GetWeather(lat, lon);//pega os dados do clima
  
        if (!Response) {
         Alert.alert('Erro!', 'Informações não encontradas');
         navigation.navigate('home', { error: true })
         setLoading(false);
         return;
        }  
        
        weatherData = Response;
        const CacheData = {
          name,
          data: weatherData,
          timestamp: Date.now()
        };
        await AsyncStorage.setItem('CACHE', JSON.stringify([CacheData]));
       };
  
       setOpenA(weatherData.alerts ? true : false);
       setAlerts(weatherData.alerts || null);
       setWeather(weatherData);
       setInputValue('');
       setLoaded(true);
       if(historic) {
        await AsyncStorage.setItem('HISTORIC', JSON.stringify({ name, lat, lon }))
       };
      }catch (error) {
        Alert.alert('Erro!', 'Erro ao buscar dados do clima');
        console.error('Erro ao buscar dados do clima:', error);
        navigation.navigate('home', { error: true })
      }finally {
        setLoading(false);
      }
  };//pegar informações do clima

  ///////////////////////////////////////
  //////    formatações de dados   //////
  ///////////////////////////////////////
  function getFormattedLocalTime(dt: number, timeZone: string) {
        const date = new Date(dt * 1000);
        if (language == 'pt_br') {
         return new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone,
         }).format(date);
        } 
        if (language == 'en') {
         return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone,
         }).format(date);
        } 
         return new Intl.DateTimeFormat('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone,
         }).format(date);
  };//formatar horario
    
  function formatTemperature(temp: number): string {
      return Math.trunc(temp).toString();
  };//formatar temperatura
    
  function capitalizeFirstLetter(text: string) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
  }//transforma a primeira letra em maiuscula
    
  function classificarUVI(uvi: number) {
      if (uvi <= 2) return language == 'pt_br' ? 'Baixo' : language == 'en' ? 'Low' : 'Bajo';
      if (uvi <= 5) return language == 'pt_br' ? 'Moderado' : language == 'en' ? 'Moderate' : 'Moderado';
      if (uvi <= 7) return language == 'pt_br' ? 'Alto' : language == 'en' ? 'High' : 'Alto';
      if (uvi <= 10) return language == 'pt_br' ? 'Muito Alto' : language == 'en' ? 'Very High' : 'Muy Alto';
      return language == 'pt_br' ? 'Extremo' : language == 'en' ? 'Extreme' : 'Extremo';
  }//formata o indice uiv

  ///////////////////////////////////////
  //////  debounce de input        //////
  ///////////////////////////////////////
  const buscarCidades = async (query: string) => {
      if (query.trim() === '') return;
      setLoading(true);

      try {
        const resposta = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
          params: {
            text: query,
            type: 'city',
            lang: 'pt',
            filter: 'countrycode:br',
            limit: 5,
            apiKey: 'a643568685f14fba9005419417cbaf07',//change this to your api key
          },
        });
    
        // Filtrar resultados que possuem nome válido
        const resultadosFiltrados = resposta.data.features.filter((item: any) => {
          const nome = item.properties.city || item.properties.name;
          return nome && nome.trim() !== '';
        });
    
        // Remover duplicatas com base no nome da cidade
        const nomesUnicos = new Set();
        const sugestoesUnicas: Sugestao[] = [];
    
        resultadosFiltrados.forEach((item: any) => {
          const nome = item.properties.city || item.properties.name;
          if (!nomesUnicos.has(nome)) {
            nomesUnicos.add(nome);
            sugestoesUnicas.push({
              name: nome,
              formatted: item.properties.formatted,
              latitude: item.properties.lat,
              longitude: item.properties.lon,
            });
          }
        });
    
        setResult(sugestoesUnicas);
      } catch (erro) {
        console.error('Erro ao buscar cidades:', erro);
        setResult([]);
      }finally {
        setLoading(false);
      }
  };//busca de cidades
  const debouncedBuscarCidades = useCallback(debounce(buscarCidades, 500), []);//debounce para evitar que a api seja chamada muitas vezes
  const aoDigitar = (novoTexto: string) => {
   setInputValue(novoTexto);
   debouncedBuscarCidades(novoTexto);
  };//conexão com o input

  useEffect(() => {
      // Limpa o debounce ao desmontar o componente
      return () => {
        debouncedBuscarCidades.cancel();
      };
  }, [debouncedBuscarCidades]);
  ///////////////////////////////////////

  useEffect(() => {
    //pegar informações do clima
    const { lat, lon, name, historic } = route.params;
    setlat(lat)
    setlon(lon)
    loadLanguage();
    HandleGetWeather(lat, lon, name, historic);
    /////////////////////////////////

    ///pegar data atual
    const now = new Date();

    let formattedDate = '';
    if(language == 'pt_br') {
      formattedDate = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
    }
    if(language == 'en') {
      formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
    }
    if(language == 'es') {
      formattedDate = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
    }

    const capitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    setDateString(capitalized);
    /////////////////////////////////
    
    //pegar horario atual e atualiza sempre
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime(); // chamada inicial
    const interval = setInterval(updateTime, 60 * 1000); // atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800, 
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  ///////////////////////////////////////
  //////        Favoritos          //////
  ///////////////////////////////////////
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  async function toggleFavorite() {
    const { lat, lon, name } = route.params;
    const FavoritesExists = await AsyncStorage.getItem('FAVORITES');

    if (!FavoritesExists) {
      await AsyncStorage.setItem('FAVORITES', JSON.stringify([{ lat, lon, name }]));
      return setIsFavorite(true);
    } else {
      const parsedFavorites = JSON.parse(FavoritesExists);
      const isAlreadyFavorite = parsedFavorites.some((item: any) => item.name == name || (item.lat === lat && item.lon === lon));

      if (isAlreadyFavorite) {
        const updatedFavorites = parsedFavorites.filter((item: any)=> item.name !== name && !(item.lat === lat && item.lon === lon));
        await AsyncStorage.setItem('FAVORITES', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {
        parsedFavorites.push({ lat, lon, name });
        await AsyncStorage.setItem('FAVORITES', JSON.stringify(parsedFavorites));
        setIsFavorite(true);
      }
    }
  };

  useEffect(()=> {
    async function checkFavorite() {
     const { lat, lon, name } = route.params;
     const Favorites = await AsyncStorage.getItem('FAVORITES');

     if (!Favorites) return setIsFavorite(false);

     const parsedFavorites = JSON.parse(Favorites);
     const isFavorite = parsedFavorites.some((item: any) => item.name == name || (item.lat === lat && item.lon === lon));
     setIsFavorite(isFavorite);
    };

    checkFavorite();

  }, [weather]);

  ///////////////////////////////////////
  //////     Compartilhamento      //////
  ///////////////////////////////////////
  const viewAlertRef = useRef(null);
  async function handleShareAlert() {
  try {
    const uri = await captureRef(viewAlertRef, {
      format: 'png',
      quality: 1,
    });

    await Sharing.shareAsync(uri);
  } catch (error) {
    console.log(error);
  }
  };

  const viewWeatherRef = useRef(null);
  async function handleShareWeather() {
  try {
    const uri = await captureRef(viewWeatherRef, {
      format: 'png',
      quality: 1,
    });

    await Sharing.shareAsync(uri);
  } catch (error) {
    console.log(error);
  }
  };

  ///////////////////////////////////////
  //////           Audio           //////
  ///////////////////////////////////////
  useEffect(() => {
   let sound: Audio.Sound;

   async function Sound() {
    const Configurations = await AsyncStorage.getItem('CONFIG')
    const parsed = JSON.parse(Configurations || '{}');

    if (!weather || !parsed.song) return;

    const { sound: createdSound } = await Audio.Sound.createAsync(
      TimeSounds[weather.current.weather[0].icon],
      { shouldPlay: true, isLooping: true, volume: 0.3 }
    );

    sound = createdSound;
   };

   Sound();

   return () => {
    if (sound) {
      sound.unloadAsync();
    }
   };

  }, [weather]);

  ///////////////////////////////////////
  //////          Mapa             //////
  ///////////////////////////////////////
  const [mode, setMode] = useState('temp');
  const [lat, setlat] = useState<number>(-8.224);
  const [lon, setlon] = useState<number>(-36.208);

  if (!loaded || isFavorite === null || !unitU) {

    return(
     <S.Container>
      <S.Loading>
         <Animated.Image
          source={Loading} 
          style={[styles.loadinIcon, animatedStyle]}
         />
      </S.Loading>
     </S.Container>
    )
  };

    return(
     <S.Container>
      <S.PartTwo>
          <View style={styles.rowHeader}>
            <S.ImageView onPress={()=> navigation.goBack()}>
             <S.HeaderIcon source={Icon} />
            </S.ImageView>
  
            <Input 
             onChangeText={aoDigitar}
             placeholder={language == 'pt_br' ? 'Buscar local' : language == 'en' ? 'Search location' : 'Ubicación de búsqueda'}
             loading={loading}
             value={inputValue}
            />
  
            <S.Results2>
             { results.length ? 
              results.map((item, index)=> (
                <S.ResultItem key={index} onPress={()=> {HandleGetWeather(item.latitude, item.longitude, item.name)}}>
                 <S.ResultItemText>
                  {item.formatted}
                 </S.ResultItemText>
                </S.ResultItem>
              ))
             :
              null
             }
            </S.Results2>
          </View>

          <View style={{backgroundColor: '#13131A'}} ref={viewWeatherRef} collapsable={false}>
           <S.Header2>
           <S.Header2Images source={BackTime[weather.current.weather[0].icon]} resizeMode='cover'>
            <View style={styles.rowDistance}>
             <S.Header2Text>
              {city}
             </S.Header2Text>
  
             <S.Header2Text2>
              {getFormattedLocalTime(weather.current.dt, weather.timezone)}
             </S.Header2Text2>
            </View>
            <S.Header2Text3>
              {dateString}
            </S.Header2Text3>
  
            <S.SpaceAmong/>
  
            <View style={styles.rowDistance2}>
             <View>
              <S.Header2Text4>
              {formatTemperature(weather.current.temp)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
              </S.Header2Text4>   
  
              <S.Header2Text5>
               {`${formatTemperature(weather.current.dew_point)}${unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}/ ${formatTemperature(weather.current.feels_like)}${unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}`}
              </S.Header2Text5>
  
              <S.Header2Text6>
               {capitalizeFirstLetter(weather.current.weather[0].description)}
              </S.Header2Text6>
             </View>
  
             <S.HeaderTimeIcon source={IconTime[weather.current.weather[0].icon]}/>
            </View>
           </S.Header2Images>
           </S.Header2>
  
           <S.Main2>
           <S.Main2Item>
            <ThermometerSimple size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>{language == 'pt_br' ? 'Sensação térmica' : language == 'en' ? 'Wind chill' : 'Sensación térmica'}</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{formatTemperature(weather.current.feels_like)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <CloudRain size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>{language == 'pt_br' ? 'Probabilidade de chuva' : language == 'en' ? 'Probability of rain' : 'Probabilidad de lluvia'}</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{Math.round(weather.daily[0].pop * 100)}%</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <Wind size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>{language == 'pt_br' ? 'Velocidade do vento' : language == 'en' ? 'Wind speed' : 'Velocidad del viento'}</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{Math.round(weather.current.wind_speed * 3.6)}km\h</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <Drop size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>{language == 'pt_br' ? 'Umidade do ar' : language == 'en' ? 'Air humidity' : 'Humedad del aire'}</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{weather.current.humidity}%</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item style={styles.noBorder}>
           <Sun size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>{language == 'pt_br' ? 'Índice UV' : language == 'en' ? 'UV Index' : 'Índice UV'}</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{classificarUVI(weather.current.uvi)}</S.Main2ItemText2>
           </S.Main2Item>
           </S.Main2>
          </View>

          <S.Map>
            <S.Buttons>
             <S.IconButtons onPress={()=> setMode('temp')}>
              <ThermometerSimple size={22} color={mode == 'temp' ? '#8FB2F5' : '#fff'} weight={mode == 'temp' ? 'bold' : 'regular'} />
             </S.IconButtons>

             <S.IconButtons onPress={()=> setMode('precipitation')}>
              <CloudRain size={22} color={mode == 'precipitation' ? '#8FB2F5' : '#fff'} weight={mode == 'precipitation' ? 'bold' : 'regular'}/>
             </S.IconButtons>

             <S.IconButtons onPress={()=> setMode('wind')}>
              <Wind size={22} color={mode == 'wind' ? '#8FB2F5' : '#fff'} weight={mode == 'wind' ? 'bold' : 'regular'}/>
             </S.IconButtons>

             <S.IconButtons onPress={()=> setMode('clouds')}>
              <Cloud size={22} color={mode == 'clouds' ? '#8FB2F5' : '#fff'} weight={mode == 'clouds' ? 'bold' : 'regular'}/>
             </S.IconButtons>

            </S.Buttons>
            <MapView
             style={{ height: 290 }}
             initialRegion={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 5,
              longitudeDelta: 5
             }}
             moveOnMarkerPress={false}
              loadingEnabled
            >
             <UrlTile
              urlTemplate={`https://tile.openweathermap.org/map/${mode}/{z}/{x}/{y}.png?appid=0051ff2b54f1ae466e72cb622eff4bc1`}
              tileSize={256}
              maximumZ={15}
              opacity={0.6}
              flipY={false}
              zIndex={1}
             />
            </MapView>
          </S.Map>
  
          <S.Main2Week>
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+1]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[1].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[1].temp.max)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[1].temp.min)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+2]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[2].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[2].temp.max)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[2].temp.min)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+3]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[3].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[3].temp.max)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[3].temp.min)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+4]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[4].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[4].temp.max)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[4].temp.min)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+5]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[5].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[5].temp.max)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[5].temp.min)}{unitU == 'metric' ? 'ºc ' : unitU == 'imperial' ? 'ºF ' : 'k '}
            </S.Main2WeekText2>
           </S.Main2WeekItem>
          </S.Main2Week>
      

      </S.PartTwo>  

      {
      alerts && openA && 
      (
       <S.BackAlert>
        <S.HeaderAlert>
         <TouchableOpacity onPress={()=> setAlerts(null)}>
          <X size={30} color='#fff' weight='bold'/>
         </TouchableOpacity>

         <TouchableOpacity onPress={handleShareAlert}>
          <ShareNetwork size={30} color='#fff' weight='fill'/>
         </TouchableOpacity>
        </S.HeaderAlert>

        <S.Alert ref={viewAlertRef} collapsable={false}>
         <S.AlertBC source={AlertBCI}/>
         <S.Areas style={{marginTop: 30}}>
          <Warning size={60} color='#fff'/>
          <S.AlertTitle>Alerta!</S.AlertTitle>
         </S.Areas>

         <S.Areas>
          <S.AlertSubTitle style={{color: '#8FB2F5'}}>{alerts[0].event}</S.AlertSubTitle>
          <S.AlertSubTitle2>Local: {city}</S.AlertSubTitle2>
          <S.AlertText>{alerts[0].description}</S.AlertText>
          
         </S.Areas>

         <S.AlertFooter>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <S.AlertNumberStrong>
                190
              </S.AlertNumberStrong>
              <S.AlertNumber>
               Defesa Civil
              </S.AlertNumber>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <S.AlertNumberStrong>
                193
              </S.AlertNumberStrong>
              <S.AlertNumber>
               Bombeiros
              </S.AlertNumber>
            </View>

            <S.AlertFont>
            *Fonte: {alerts[0].sender_name}
            </S.AlertFont>
          </View>

          <View style={{alignItems: 'center', marginBottom: 20}}>
           <S.AlertFImage source={Icon}/>
           <S.AlertSubTitle>
            TypeWeather
           </S.AlertSubTitle>
          </View>
         </S.AlertFooter>
        </S.Alert>
       </S.BackAlert>
      )
      }
        
      <S.Favorite onPress={toggleFavorite}>
        <Star size={32} weight={isFavorite ? 'fill' : 'bold'} color='#FAFAFA'/>
      </S.Favorite>

      <S.ShareBtn onPress={handleShareWeather}>
        <ShareNetwork size={32} color='#FAFAFA'/>
      </S.ShareBtn>
     </S.Container>
    )

};

