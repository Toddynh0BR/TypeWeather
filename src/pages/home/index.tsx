import { StyleSheet, Text, View, Image, Alert, Animated, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as S from "./styles";
import { sessionStorage } from '../../utils/sessionStorage'

import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

import * as Location from 'expo-location';

import { Input } from '../../components/input';

import { MapPin, ClockCounterClockwise } from 'phosphor-react-native';

import BG from "../../../assets/Background.png";
import Icon from "../../../assets/Vector.png";

interface Props {
  navigation: any;
  route: any;
};


export function Home({ navigation, route }: Props) {
    const [historic, setHistoric] = useState(null);
    const [loading, setLoading]= useState(false);
    const [results, setResult] = useState([]);

    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');

    const [actualCity, setActualCity] = useState('buscando');

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

    useEffect(() => {
     async function getLocation() {
     try {
      const locationS = sessionStorage.getItem('LOCATION')

      if (locationS) {
        setActualCity(JSON.parse(locationS));
      };
      
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
       console.log('Permissão negada');
       setActualCity('negado')
       return;
      };

      let location = await Location.getCurrentPositionAsync({});

      let address = await Location.reverseGeocodeAsync({
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
      });

      if (!location.coords.latitude || !location.coords.longitude || (!address[0].city && !address[0].district)) {
       return setActualCity('incompleto');
      }

      
       setActualCity({
        name: address[0].city || address[0].district,
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });

      sessionStorage.setItem('LOCATION', JSON.stringify({
        name: address[0].city || address[0].district,
        lat: location.coords.latitude,
        lon: location.coords.longitude
      }));

      return;
     } catch (error) {
      console.log('ERRO COMPLETO:', error);
     }
     };
     async function getHistoric() {
      const data = await AsyncStorage.getItem('HISTORIC');
      if (data) {
       const parsed = JSON.parse(data)
       setHistoric(parsed)
     };
     };

     getLocation();
     getHistoric();
    }, []);
    
    return(
     <S.Container>
       <S.PartOne
        source={BG}
        resizeMode='cover'
       >
        <S.Header1>
          <Image 
           height={24}
           width={36}
           source={Icon}
          />
          <S.Header1Text>{'   TypeWeather    '}</S.Header1Text>

        </S.Header1>

        <S.Main1>
                <View style={styles.rowText}>
                  <S.Main1Text>{'Boas vindas ao '}</S.Main1Text>
                 <S.Main1Strong> {'TypeWeather  '}</S.Main1Strong>
                </View>
                
                <S.Main1Description>
                Escolha um local para ver a previsão do tempo
                </S.Main1Description>
       
                <Input 
                 onChangeText={aoDigitar}
                 placeholder='Buscar local '
                 loading={loading}
                 value={query}
                />

                <S.Results
                 data={results}
                 renderItem={({item}) => 
                 <S.ResultItem onPress={()=> {navigation.navigate('result', {
                  lat: item.latitude, 
                  lon: item.longitude, 
                  name: item.name
                })}}>
                  <S.ResultItemText>
                   {item.formatted}
                  </S.ResultItemText>
                 </S.ResultItem>
                 }
                 keyExtractor={(item, index) => index}
                />

                {
                 results.length ?
                 null
                :
                actualCity == 'buscando' ?
                  <S.ResultItemLocal >
                   <S.ResultItemText> Buscando sua localização atual</S.ResultItemText>
                   <ActivityIndicator size={20} color="#fff" />
                  </S.ResultItemLocal>
                :
                 actualCity == 'negado' || actualCity == 'incompleto' ?
                 null
                :
                <S.ResultItemLocal onPress={()=> {navigation.navigate('result', { name: actualCity.name, lat: actualCity.lat, lon: actualCity.lon, historic: true})}}>
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