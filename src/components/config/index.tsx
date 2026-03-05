import * as S from './styles';

import { Image, StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';

import BG from "../../../assets/Background.png";
import Icon from "../../../assets/Icon4K.png";

interface Props {
  navigation: any;
  route: any;
  reloadFunction: ()=> any;
};

type ConfigType = {
 saveHistoric: boolean,
 mobileData: boolean,
 song: boolean,

 notifications: boolean,
 location: boolean,

 unit: string,
 lang: string
};

export function Config({ navigation, route , reloadFunction}: Props) {
    const [config, setConfig] = useState<ConfigType | null>(null);
    const [language, setLanguage] = useState('pt_br');

    useEffect(()=> {
      async function loadConfig() {
        const SaveConfig = await AsyncStorage.getItem('CONFIG');

        if (!SaveConfig) {
         setConfig(null);
         return;
        };

        const parsedConfig = JSON.parse(SaveConfig)
        setConfig(JSON.parse(SaveConfig));
        setLanguage(parsedConfig.lang)
      };

      loadConfig();
    }, [config]);

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

      <S.Strong>{language == 'pt_br' ? 'Configurações' : language == 'en' ? 'Settings' : 'Ajustes'}</S.Strong>
                
      { config && (
        <S.Scroll>
       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Permitir notificações' : language == 'en' ? 'Allow notifications' : 'Permitir notificaciones'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.notifications}
         onChange={async ()=> {
          setConfig(prev => {if (!prev) return prev; 
                             return {...prev, notifications: !prev.notifications};});
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, notifications: !config.notifications}));
         }}
        />
       </S.Row>

       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Permitir localização' : language == 'en' ? 'Allow location' : 'Permitir ubicación'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.location}
         onChange={async ()=> {
          setConfig(prev => {if (!prev) return prev; 
                             return {...prev, location: !prev.location};});
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, location: !config.location}));
          reloadFunction(); 
         }
        }
        />
       </S.Row>

       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Salvar histórico' : language == 'en' ? 'Save history' : 'Guardar historial'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.saveHistoric}
         onChange={async ()=> {
          setConfig(prev => {if (!prev) return prev; 
                             return {...prev, saveHistoric: !prev.saveHistoric};});
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, saveHistoric: !config.saveHistoric}));
          reloadFunction(); 
         }}
        />
       </S.Row>

       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Usar dados móveis' : language == 'en' ? 'Using mobile data' : 'Uso de datos móviles'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.mobileData}
         onChange={async ()=> {
          setConfig(prev => {if (!prev) return prev; 
                             return {...prev, mobileData: !prev.mobileData};});
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, mobileData: !config.mobileData}));
         }}
        />
       </S.Row>

       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Permitir som ambiente' : language == 'en' ? 'Allow ambient sound' : 'Permitir sonido ambiental'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.song}
         onChange={async ()=> {
          setConfig(prev => {if (!prev) return prev; 
                             return {...prev, song: !prev.song};});
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, song: !config.song}));
         }}
        />
       </S.Row>

       <S.Column>
        <S.Text>{language == 'pt_br' ? 'Idioma do app' : language == 'en' ? 'App language' : 'Idioma de la aplicación'}</S.Text>
        <View style={{width: '100%', overflow: 'hidden', borderRadius: 8}}>
         <Picker 
          dropdownIconColor="#fff" 
          selectedValue={config.lang}
          onValueChange={(value) => {
           setConfig((prev: any) =>
           prev.lang === value
           ? prev
           : { ...prev, lang: value }
           );
            AsyncStorage.setItem('CONFIG', JSON.stringify({ ...config, lang: value }));
            reloadFunction();
          }}
          style={{color: '#FAFAFA', backgroundColor: '#1f1f28', paddingLeft: 10, paddingRight: 20}}>
          <Picker.Item label={language == 'pt_br' ? '🇧🇷 Português' : language == 'en' ? '🇧🇷 Portuguese' : '🇧🇷 Portugués'} value="pt_br" />
          <Picker.Item label={language == 'pt_br' ? '🇺🇸 Inglês' : language == 'en' ? '🇺🇸 English' : '🇺🇸 Inglés'} value="en" />
          <Picker.Item label={language == 'pt_br' ? '🇪🇸 Espanhol' : language == 'en' ? '🇪🇸 Spanish' : '🇪🇸 Español'} value="es" />
         </Picker>
        </View>
       </S.Column>

       <S.Column>
        <S.Text>{language == 'pt_br' ? 'Unidade de temperatura' : language == 'en' ? 'Temperature unit' : 'Unidad de temperatura'}</S.Text>
        <View style={{width: '100%', overflow: 'hidden', borderRadius: 8}}>
         <Picker 
          dropdownIconColor="#fff" 
          selectedValue={config.unit}
          onValueChange={async (value) => {
           setConfig((prev: any) =>
           prev.unit === value
           ? prev
           : { ...prev, unit: value }
           );
            await AsyncStorage.setItem('CONFIG', JSON.stringify({ ...config, unit: value }));
            await AsyncStorage.setItem('CACHE', '[]')
          }}
          style={{color: '#FAFAFA', backgroundColor: '#1f1f28', paddingLeft: 10, paddingRight: 20}}>
          <Picker.Item label="🌡️ Celsius" value="metric" />
          <Picker.Item label="🌡️ Fahrenheit" value="imperial" />
          <Picker.Item label="🌡️ Kelvin" value="standart" />
         </Picker>
        </View>
       </S.Column>
      </S.Scroll>
      )}
     </S.Container>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  }
});