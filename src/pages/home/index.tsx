import { StyleSheet, Text, View, Image, Alert, Animated } from 'react-native';
import * as S from "./styles";

import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

import { Input } from '../../components/input';

import BG from "../../../assets/Background.png";
import Icon from "../../../assets/Vector.png";

interface Props {
  navigation: any;
};

export function Home({ navigation }: Props) {
    const [loading, setLoading]= useState(false);
    const [results, setResult] = useState([]);

    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');

    const buscarCidades = async (city: string) => {
        if (city.trim() === '') return;
        setLoading(true);

        try {
          const resposta = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
            params: {
              text: city,
              type: 'city',
              lang: 'pt',
              filter: 'countrycode:br',
              limit: 5,
              apiKey: 'your-api-key',//change this to your api key
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
        setQuery(novoTexto);
        debouncedBuscarCidades(novoTexto);
    };//conexão com o input

    useEffect(() => {
        // Limpa o debounce ao desmontar o componente
        return () => {
          debouncedBuscarCidades.cancel();
        };
    }, [debouncedBuscarCidades]);
    
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
          <S.Header1Text>TypeWeather</S.Header1Text>

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
                 placeholder='Buscar local'
                 loading={loading}
                 value={query}
                />
                
                <S.Results
                 data={results}
                 renderItem={({item}) => 
                 <S.ResultItem onPress={()=> {navigation.navigate('result', {
                  lat: item.latitude, 
                  lot: item.longitude, 
                  name: item.name
                })}}>
                  <S.ResultItemText>
                   {item.formatted}
                  </S.ResultItemText>
                 </S.ResultItem>
                 }
                 keyExtractor={(item, index) => index}
                />
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