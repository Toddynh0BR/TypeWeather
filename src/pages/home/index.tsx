import { 
   StyleSheet,
   View,
   Image,
   Animated,
   ActivityIndicator,
   Dimensions,
   TouchableOpacity,
   Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as S from "./styles";

import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useCallback, useRef } from 'react';
import * as Network from 'expo-network';
import debounce from 'lodash.debounce';
import axios from 'axios';

import { sessionStorage } from '../../utils/sessionStorage';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { api } from '../../services/api';

import { Favorites } from '../../components/favorites';
import { WeatherChat } from  '../../components/chat';
import { Config } from '../../components/config';
import { Input } from '../../components/input';

import { MapPin, ClockCounterClockwise, Star, House, Gear, WifiSlash, OpenAiLogo } from 'phosphor-react-native';

import BG from "../../../assets/Background.png";
import Icon from "../../../assets/Icon4K.png";

interface Props {
  navigation: any;
  route: any;
};

interface PropsAnimated {
  isActive: boolean;
  label: String;
};

type City = {
  name: string;
  lat: number;
  lon: number;
};


import styled from 'styled-components/native';

const BoxItem = styled(Animated.View)`
height: 65px;
width: 65px;

justify-content: center;
align-items: center;
display: flex;
border-radius: 50%;

`;

export function AnimatedItem({ isActive, label }: PropsAnimated) {
  const translateY = useRef(new Animated.Value(0)).current;
  const colorProgress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: isActive ? -8 : 0,
        useNativeDriver: true,
      }),
   Animated.timing(colorProgress, {
        toValue: isActive ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const backgroundColor = colorProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', '#8FB2F5'],
  });
  return (
    <BoxItem
      style={{
        backgroundColor,
        transform: [{ translateY }],
      }}
    >
        {
         label == 'star' ?
          <Star size={35} weight={ isActive ? 'fill' : 'bold'} color='#fff' />
        :
         label == 'home' ?
          <House size={35} weight={ isActive ? 'fill' : 'bold'} color='#fff' />
        :
         label == 'ia' ?
          <OpenAiLogo size={35} weight={ isActive ? 'fill' : 'regular'} color='#fff' />
        :
          <Gear size={35} weight={ isActive ? 'fill' : 'bold'} color='#fff' />
        }

    </BoxItem>
  );
}

export function Home({ navigation, route }: Props) {
    const [historic, setHistoric] = useState<City | null>(null);
    const [loading, setLoading]= useState(false);
    const [results, setResult] = useState([]);

    const [query, setQuery] = useState('');
    const [actualCity, setActualCity] = useState<City | string>('buscando');

    const [selected, setSelected] = useState('home');

    const buscarCidades = async (city: string) => {
        if (city.trim() === '') {
          setResult([]);
          return;
        };
        setLoading(true);

        try {
          const resposta = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
            params: {
              text: city,
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
          const sugestoesUnicas = [];
      
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

    const debouncedBuscarCidades = useCallback(debounce(buscarCidades, 500), []);
    //debounce para evitar que a api seja chamada muitas vezes

    const aoDigitar = (novoTexto: string) => {
        setQuery(novoTexto);
        debouncedBuscarCidades(novoTexto);
    };//conexão com o input

    useEffect(() => {
        // Limpa o debounce ao desmontar o componente
        return () => {
          debouncedBuscarCidades.cancel();
        };
    }, [debouncedBuscarCidades]);

     async function getLocation() {
     try {
      const locationS = sessionStorage.getItem('LOCATION');

      if (locationS) {
        setActualCity(JSON.parse(locationS));
      };
      
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
       const Configurations = await AsyncStorage.getItem('CONFIG');
       const parsedConfig = JSON.parse(Configurations || '{}');
       parsedConfig.location = false;
       await AsyncStorage.setItem('CONFIG', JSON.stringify(parsedConfig));
       
       setActualCity('negado')
       return;
      };

      let location = await Location.getCurrentPositionAsync({});

      let address = await Location.reverseGeocodeAsync({
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
      });
      
      if (!location.coords.latitude || !location.coords.longitude || (!address[0].city && !address[0].subregion)) {
       return setActualCity('incompleto');
      }

      
      setActualCity({
        name: String(address[0].city || address[0].subregion),
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
      
      sessionStorage.setItem('LOCATION', JSON.stringify({
        name: address[0].city || address[0].subregion,
        lat: location.coords.latitude,
        lon: location.coords.longitude
      }));
      setTimeout(async ()=> {
       await UpdateNotifications();
      }, 3000)
      return;
     } catch (error) {
      console.log('ERRO COMPLETO:', error);
     }
     };

     async function UpdateNotifications() {
       const Configs = await AsyncStorage.getItem('CONFIG');
       if (!Config) return;
       const parsedConfigs = JSON.parse(Configs || '{}');

       if (parsedConfigs.notifications) {
         
         const token = (await Notifications.getExpoPushTokenAsync()).data;
         if (!token) return;

         await api.put('/token/update', { token, cidade: actualCity.name, recebe: true, lat: actualCity.lat, lon: actualCity.lon });
       } else return;
     };

     async function getHistoric() {
      const data = await AsyncStorage.getItem('HISTORIC');
      if (data) {
       const parsed = JSON.parse(data)
       setHistoric(parsed)
     };
     };
     async function CheckPermissions() {
       const Configs = await AsyncStorage.getItem('CONFIG');
       const parsedConfig = JSON.parse(Configs || '{}');
       loadLanguage();
       if (parsedConfig.location) {
        getLocation();
       } else {
        setActualCity('negado');
       };
       if (parsedConfig.saveHistoric){
        getHistoric();
       } else {
        setHistoric(null);
       };
     };

useFocusEffect(
  useCallback(() => {
    CheckPermissions()
/// aqui
    return () => {
      console.log('tela perdeu foco');
    };
  }, [])
);

    const screenWidth = Dimensions.get('window').width;
    const translateX = useRef(new Animated.Value(screenWidth / 2 - 43)).current;

    useEffect(() => {
     
     let position = 0;

     if (selected === 'star') position = ((screenWidth / 4) * 0) - 10;
     if (selected === 'ia') position = ((screenWidth / 4) * 1) - 10;
     if (selected === 'home') position = ((screenWidth / 4) * 2) - 10;
     if (selected === 'gear') position = ((screenWidth / 4) * 3) - 10;

     Animated.spring(translateX, {
    toValue: position,
    friction: 15,
    tension: 4,
    useNativeDriver: true,
     }).start();
    }, [selected]);

    /// Checagem de teclado aberto para esconder o menu
    const [keysOpen, setKeysOpen] = useState(false);

    useEffect(() => {
   
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeysOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeysOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
    }, []);
    /// Checagem de wifi e dados móveis
    const [isConnected, setIsConnected] = useState(true);

    async function checkConnection() {
    const state = await Network.getNetworkStateAsync();


    if (!state.isConnected) {
     console.log("Usuário está offline");
     setIsConnected(false);
    }

    if (state.type === Network.NetworkStateType.WIFI) {
     setIsConnected(true);
    }

    if (state.type === Network.NetworkStateType.CELLULAR) {
      console.log("Dados móveis ativos");

      const Configs = await AsyncStorage.getItem('CONFIG');
      const parsedConfig = JSON.parse(Configs || '{}');

      setIsConnected(!!parsedConfig.mobileData);
      return;
    };

 
    setIsConnected(true);
    };

    const [language, setLanguage] = useState('pt_br');
      async function loadLanguage() {
        const SaveConfig = await AsyncStorage.getItem('CONFIG');
        const parsedConfig = JSON.parse(SaveConfig);

        setLanguage(parsedConfig.lang)
      };
    useEffect(() => {


      loadLanguage();
     checkConnection()
    }, []);
    
    return(
      
     <S.Container>
       { selected === 'home' && (
        isConnected ? 
        <S.PartOne
        source={BG}
        resizeMode='cover'
       >
        <S.Header1>
          <S.HeaderImage 
           height={24}
           width={36}
           source={Icon}
          />
          <S.Header1Text>{'   TypeWeather    '}</S.Header1Text>

        </S.Header1>

        <S.Main1>
                <View style={styles.rowText}>
                  <S.Main1Text>{language == 'pt_br' ? 'Boas vindas ao ' : language == 'en' ? 'Welcome to ' : 'Bienvenido a '}</S.Main1Text>
                 <S.Main1Strong> {'TypeWeather  '}</S.Main1Strong>
                </View>
                
                <S.Main1Description>
                {language == 'pt_br' ? 'Escolha um local para ver a previsão do tempo' :
                 language == 'en' ? 'Choose a location to view the weather forecast.' :
                 'Elija una ubicación para ver el pronóstico del tiempo.'
                }
                </S.Main1Description>
       
                <Input 
                 onChangeText={aoDigitar}
                 placeholder={language == 'pt_br' ? 'Buscar local ' : language == 'en' ? 'Search location ' : 'Ubicación de búsqueda '}
                 
                 value={query}
                />

                <S.Results
                 data={results}
                 renderItem={({item}: any) => 
                 <S.ResultItem onPress={()=> {
                  navigation.navigate('result', {
                  lat: item.latitude, 
                  lon: item.longitude, 
                  name: item.name,
                  historic: actualCity == 'negado' || 'buscando' ? true : actualCity.name == item.name ? false : true 
                })
                 setQuery('')
                 setResult([])
                }}>
                  <S.ResultItemText>
                   {item.formatted}
                  </S.ResultItemText>
                 </S.ResultItem>
                 }
                 keyExtractor={(item: any, index: any) => index}
                />

                {
                 results.length ?
                 null
                :
                actualCity == 'buscando' ?
                  <S.ResultItemLocal >
                   <S.ResultItemText> {language == 'pt_br' ? 'Buscando sua localização atual...'
                    : language == 'en' ? 'Searching for your current location' :
                     'Buscando tu ubicación actual'}</S.ResultItemText>
                   <ActivityIndicator size={20} color="#fff" />
                  </S.ResultItemLocal>
                :
                 actualCity == 'negado' || actualCity == 'incompleto' ?
                 null
                :
                <S.ResultItemLocal onPress={()=> {navigation.navigate('result', { name: actualCity.name, lat: actualCity.lat, lon: actualCity.lon, historic: false})}}>
                  <S.ResultItemText>
                   {actualCity.name}
                  </S.ResultItemText>
                  <MapPin size={24} weight='bold' color='#fff' style={{marginRight: 5}}/>
                </S.ResultItemLocal>  
                }

                {
                  results.length ?
                  null
                 :
                  historic ?
                  <S.ResultItemLocal onPress={()=> {navigation.navigate('result', historic)}}>
                  <S.ResultItemText>
                   {historic.name}
                  </S.ResultItemText>
                  <ClockCounterClockwise size={24} weight='bold' color='#fff' style={{marginRight: 5}}/>
                </S.ResultItemLocal>  
                :
                 null
                }
         </S.Main1>

        </S.PartOne>
        :
        <S.NoWifi>
         <WifiSlash size={150} color='#8FB2F5' />
         <S.NoWifiTitle>{language == 'pt_br' ? 'Sem conexão com a internet' :
          language == 'en' ? 'No internet connection' :
           'Sin conexión a Internet'}</S.NoWifiTitle>
         <S.NoWifiText>
         {
          language == 'pt_br' ? 'Se está usando os dados móveis, ative a permissão de dados móveis nas configurações do app.' :
          language == 'en' ? 'If you are using mobile data, enable mobile data permission in the app settings.' :
          'Si está utilizando datos móviles, habilite el permiso de datos móviles en la configuración de la aplicación.'
         }
         </S.NoWifiText>
        </S.NoWifi>
       )
       }

       { selected === 'star' && 
       (
        isConnected ?
         <Favorites navigation={navigation} route={route}/>
        :
        <S.NoWifi>
         <WifiSlash size={150} color='#8FB2F5' />
         <S.NoWifiTitle>{language == 'pt_br' ? 'Sem conexão com a internet' :
          language == 'en' ? 'No internet connection' :
           'Sin conexión a Internet'}</S.NoWifiTitle>
         <S.NoWifiText>
         {
          language == 'pt_br' ? 'Se está usando os dados móveis, ative a permissão de dados móveis nas configurações do app.' :
          language == 'en' ? 'If you are using mobile data, enable mobile data permission in the app settings.' :
          'Si está utilizando datos móviles, habilite el permiso de datos móviles en la configuración de la aplicación.'
         }
         </S.NoWifiText>
        </S.NoWifi>     
       ) 
       }

       { selected === 'ia' && <WeatherChat navigation={navigation} route={route}/>}
       
       { selected === 'gear' && <Config navigation={navigation} route={route} reloadFunction={()=> {CheckPermissions();}}/> }

       { 
       keysOpen ? 
        null
       :
        <S.MenuBar>
        <S.Ball 
         style={{
          transform: [{ translateX }]
        }}
        >
          <S.MiniBallLeft />
          <S.MiniBallLRight />

        </S.Ball>
        <TouchableOpacity onPress={() => setSelected('star')}>
          <AnimatedItem label='star' isActive={selected === 'star'}  />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('ia')}>
          <AnimatedItem label='ia' isActive={selected === 'ia'}  />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('home')}>
          <AnimatedItem label='home' isActive={selected === 'home'}  />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('gear')}>
          <AnimatedItem label='gear' isActive={selected === 'gear'}  />
        </TouchableOpacity>
        </S.MenuBar>
       } 
     </S.Container>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
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
  }
});