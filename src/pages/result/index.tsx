import { StyleSheet, Text, View, Image, Alert, Animated } from 'react-native';
import * as S from './styles';

import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

import { Wind, CloudRain, Drop, ThermometerSimple, Sun } from 'phosphor-react-native';

import GetWeather from '../../services/getWeather';
import { Input } from '../../components/input';

import Loading from "../../../assets/loading.png"
import Icon from "../../../assets/Vector.png";

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

const weekDays = [
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
];

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
  '01d': ClearDay,
  '01n': ClearNight,
  '02d': FewDay,
  '02n': FewNight,
  '03d': CloudyDay,
  '03n': CloudyNight,
  '04d': CloudyDay,
  '04n': CloudyNight,
  '09d': RainDay,
  '09n': RainNight,
  '10d': RainDay,
  '10n': RainNight,
  '11d': StormDay,
  '11n': StormNight,
  '13d': SnowDay,
  '13n': SnowNight,
  '50d': CloudyDay,
  '50n': CloudyNight 
};

interface Props {
  navigation: any;
  route: any;
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
  const [weather, setWeather] = useState({});
  const [results, setResult] = useState([]);
  
  const [loaded, setLoaded] = useState(false);
  
  const [inputValue, setInputValue] = useState('');
  const [city, setCity] = useState('');
  
  const [dateString, setDateString] = useState('');
  const [time, setTime] = useState('');
  let today =  new Date().getDay();
  
  async function HandleGetWeather(lat: number, lon: number, name: string) {
      setLoading(true);
      setResult([]);
      setCity(name);
     
      try {
       const Response = await GetWeather(lat, lon);//pega os dados do clima
  
       if (!Response) {
        Alert.alert('Erro!', 'Informações não encontradas');
        setLoading(false);
        return;
       }
  
       setWeather(Response);
       setInputValue('');
       setLoaded(true);
      }catch (error) {
        Alert.alert('Erro!', 'Erro ao buscar dados do clima');
        console.error('Erro ao buscar dados do clima:', error);
      }finally {
        setLoading(false);
      }
  };//pegar informações do clima

  function getFormattedLocalTime(dt: number, timeZone: string) {
        const date = new Date(dt * 1000);
        return new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone,
        }).format(date);
  };//formatar unix para horario
    
  function formatTemperature(temp: number): string {
      return Math.trunc(temp).toString();
  };//formatar temperatura
    
  function capitalizeFirstLetter(text: string) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
  }//transforma a primeira letra em maiuscula
    
  function classificarUVI(uvi: number) {
      if (uvi <= 2) return "Baixo";
      if (uvi <= 5) return "Moderado";
      if (uvi <= 7) return "Alto";
      if (uvi <= 10) return "Muito alto";
      return "Extremo";
  }//formata o indice uiv

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
        const resultadosFiltrados = resposta.data.features.filter((item) => {
          const nome = item.properties.city || item.properties.name;
          return nome && nome.trim() !== '';
        });
    
        // Remover duplicatas com base no nome da cidade
        const nomesUnicos = new Set();
        const sugestoesUnicas = [];
    
        resultadosFiltrados.forEach((item) => {
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

  useEffect(() => {
    //pegar informações do clima
    const { lat, lot, name } = route.params;

    HandleGetWeather(lat, lot, name);
    /////////////////////////////////

    ///pegar data atual
    const now = new Date();

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

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
        duration: 800, // 2 segundos para uma rotação completa
        useNativeDriver: true,
        easing: Animated.linear,
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

  if (!loaded) {

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
  }

    return(
     <S.Container>
        <S.PartTwo>
        
          <S.Header2>
           <View style={styles.rowHeader}>
            <S.ImageView onPress={()=> navigation.navigate('home')}>
             <Image source={Icon} height={40} width={40}/>
            </S.ImageView>
  
            <Input 
             onChangeText={aoDigitar}
             placeholder='Buscar local'
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
              {formatTemperature(weather.current.temp)}ºc
              </S.Header2Text4>   
  
              <S.Header2Text5>
               {`${formatTemperature(weather.current.dew_point)}ºc / ${formatTemperature(weather.current.feels_like)}ºc`}
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
            <S.Main2ItemText>Sensação térmica</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{formatTemperature(weather.current.feels_like)}ºc</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <CloudRain size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>Probabilidade de chuva</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{Math.round(weather.daily[0].pop * 100)}%</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <Wind size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>Velocidade do vento</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{Math.round(weather.current.wind_speed * 3.6)}km\h</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item>
           <Drop size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>Umidade do ar</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{weather.current.humidity}%</S.Main2ItemText2>
           </S.Main2Item>
  
           <S.Main2Item style={styles.noBorder}>
           <Sun size={24} color='#3B3B54' style={{marginRight: 5}}/>
            <S.Main2ItemText>Índice UV</S.Main2ItemText>
            <S.Main2SpaceAmong/>
            <S.Main2ItemText2>{classificarUVI(weather.current.uvi)}</S.Main2ItemText2>
           </S.Main2Item>
          </S.Main2>
  
          <S.Main2Week>
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+1]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[1].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[1].temp.max)}ºc
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[1].temp.min)}ºc
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+2]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[2].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[2].temp.max)}ºc
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[2].temp.min)}ºc
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+3]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[3].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[3].temp.max)}ºc
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[3].temp.min)}ºc
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+4]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[4].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[4].temp.max)}ºc
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[4].temp.min)}ºc
            </S.Main2WeekText2>
           </S.Main2WeekItem>
  
           <S.Main2WeekItem>
            <S.Main2WeekText>
            {weekDays[today+5]}
            </S.Main2WeekText>
  
            <S.Main2WeekImage source={IconTime[weather.daily[5].weather[0].icon]}/>
  
            <S.Main2WeekText>
             {formatTemperature(weather.daily[5].temp.max)}ºc
            </S.Main2WeekText>
            <S.Main2WeekText2>
              {formatTemperature(weather.daily[5].temp.min)}ºc
            </S.Main2WeekText2>
           </S.Main2WeekItem>
          </S.Main2Week>
      
         
        </S.PartTwo>  
 
     </S.Container>
    )

};

