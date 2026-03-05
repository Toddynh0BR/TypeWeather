import * as S from './styles';

import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { Trash } from 'phosphor-react-native'

import BG from "../../../assets/Background.png";
import Icon from "../../../assets/Icon4K.png";

interface Props {
  navigation: any;
  route: any;
};

export function Favorites({ navigation, route }: Props) {
    const [favorites, setFavorites] = useState<any[] | null>(null);
    const [language, setLanguage] = useState('pt_br'); 

    useEffect(() => {
      async function loadFavorites() {
        const Favorites = await AsyncStorage.getItem('FAVORITES');
        if (Favorites) {
         setFavorites(JSON.parse(Favorites));
        } else {
            return setFavorites([]); 
        };
      };
      async function loadLanguage() {
        const SaveConfig = await AsyncStorage.getItem('CONFIG');
        const parsedConfig = JSON.parse(SaveConfig || '{}');

        setLanguage(parsedConfig.lang)
      };

      loadLanguage();
      loadFavorites();
    }, []);
    
    async function removeFavorite(name: string) {
      const updatedFavorites = favorites?.filter((item: any) => item.name !== name);
      setFavorites(updatedFavorites || []);
      AsyncStorage.setItem('FAVORITES', JSON.stringify(updatedFavorites || []));
    };

    return(
     <S.Container         
      source={BG}
      resizeMode='cover'>
      <S.Header>
       <S.HeaderImage 
        height={24}
        width={36}
        source={Icon}
       />
       <S.HeaderText>{'   TypeWeather    '}</S.HeaderText>
      </S.Header>

      <View style={styles.rowText}>
       <S.Text>{language == 'pt_br' ? 'Cidades' : language == 'en' ? 'Favorite' : 'Ciudades'}</S.Text>
       <S.Strong>{language == 'pt_br' ? ' Favoritadas' : language == 'en' ? ' Cities' : ' Favoritas'}</S.Strong>
      </View>
                
      <S.Description>
      {language == 'pt_br' ?
       'Veja informações detalhadas sobre as cidades que você mais gosta.' 
      : language == 'en' ? 
       'See detailed information about the cities you like best.' 
      : 
      'Consulta información detallada de las ciudades que más te gusten.'
      }
      
      </S.Description>

      { favorites != null ? 
       (      
        <S.List
         data={favorites}
         keyExtractor={(item: any)=> item.name}
         renderItem={({ item }: any)=> (
          <S.FavoriteItem onPress={()=> {navigation.navigate('result', {
                  lat: item.lat, 
                  lon: item.lon, 
                  name: item.name,
                  historic: true
                })}}>
          <S.FavoriteText>{item.name}</S.FavoriteText>
          <TouchableOpacity onPress={()=> removeFavorite(item.name)}>
            <Trash size={25} weight='bold' color='#fff'/>
          </TouchableOpacity>
          </S.FavoriteItem>
         )}
         ListEmptyComponent={(
                             <S.EmptyList>

      {language == 'pt_br' ?
       'Você ainda não favoritou nenhuma cidade, pesquise sobre o clima de alguma e clique no ícone de estrela para adicioná-la aqui.' 
      : language == 'en' ? 
       "You haven't favorited any cities yet, search for the climate of one and click the star icon to add it here."
      : 
      'Aún no has añadido ninguna ciudad a favoritos, busca el clima de una y haz clic en el icono de estrella para agregarla aquí.'
      }
                             </S.EmptyList>
                            )}
        />
       )
      :
       null 
      }
     </S.Container>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
  }
});