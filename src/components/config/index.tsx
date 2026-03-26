import * as S from './styles';

import { Image, StyleSheet, View, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';

import { sessionStorage } from '../../utils/sessionStorage'
import { api } from '../../services/api';

import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

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

    async function handleSendNotifications(recebe: boolean) {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Atualizando configuração de envio de notificação por localização');
      if (!token) {
       Alert.alert('Erro', 'Erro do app ao alterar configuração, tente novamente ou fale com o suporte.')
       return setConfig(prev => {
         if (!prev) return prev; 
         return {...prev, notifications: !recebe};
        });
      };


      try {
       if (recebe) {
        console.log('Ativando')
        let actualLocation;
        const location = sessionStorage.getItem('LOCATION');

        if (location) actualLocation = JSON.parse(location);
        else {
         let newLocation = await Location.getCurrentPositionAsync({});

         let address = await Location.reverseGeocodeAsync({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
         });
      
         if (!newLocation.coords.latitude ||!newLocation.coords.longitude ||(!address[0].city && !address[0].subregion)) actualLocation = { name: '', lat: '', lon: '' };
         else {
          actualLocation = {
           name: String(address[0].city || address[0].subregion),
           lat: newLocation.coords.latitude,
           lon: newLocation.coords.longitude
          };
         };

        };

        console.log('Localização atual adquirida:', actualLocation);

        await api.put('/token/update', { token, cidade: actualLocation.name, recebe: true, lat: actualLocation.lat, lon: actualLocation.lon });
        console.log('Ativação concluida');
       } else {
         console.log('Desativando')
         await api.put('/token/update', { token, cidade: '', recebe: false, lat: '', lon: ''});
         console.log('Desativação concluida');
       }
      } catch (error) {
        console.error('Error', error);
        Alert.alert('Erro', 'Erro ao atualizar status de notificação no servidor')
        return setConfig(prev => {
         if (!prev) return prev; 
         return {...prev, notifications: !recebe};
        });
      }
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

      <TouchableOpacity onPress={async ()=> {
        
          await api.get('/teste')
        
      }}>
        <S.Strong>{language == 'pt_br' ? 'Configurações' : language == 'en' ? 'Settings' : 'Ajustes'}</S.Strong>
      </TouchableOpacity>
                
      { config && (
        <S.Scroll>
       <S.Row>
        <S.Text>{language == 'pt_br' ? 'Permitir notificações' : language == 'en' ? 'Allow notifications' : 'Permitir notificaciones'}</S.Text>
        <Switch 
         trackColor={{false: '#dadada', true: '#8FB2F5'}}
         thumbColor={'#72a2fb'}
         value={config.notifications}
         onChange={async ()=> {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
          let finalStatus = existingStatus;
      
          if (existingStatus !== "granted") {
           const { status } = await Notifications.requestPermissionsAsync();
           finalStatus = status;
          };
      
          if (finalStatus !== "granted") {
            Alert.alert('Permissão negada', 'Permita o envio de notificações para ativar essa configuração.');
            return;
          };

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return Alert.alert('Permissão necessária', 'É necessário essa permição para lhe enviarmos notificações personalizadas.');
          };

          const newValue = !config.notifications;

          setConfig(prev => {
           if (!prev) return prev; 
           return {...prev, notifications: newValue};
          });

          await handleSendNotifications(!config.notifications);
          await AsyncStorage.setItem('CONFIG', JSON.stringify({...config, notifications: newValue}));
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