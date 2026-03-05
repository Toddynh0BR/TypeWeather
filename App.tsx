import { StatusBar } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppRoutes } from "./src/routes/app.routes";
import { View, StyleSheet } from 'react-native';

import * as Updates from 'expo-updates';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'nunito': require('./assets/fonts/Nunito-Regular.ttf'),
    'nunitoBold': require('./assets/fonts/Nunito-Bold.ttf'),
    'nunitoExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf')
  });
};

type Props = {
  navigation: any;
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
});

export default function App(props: Props) {  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await fetchFonts();
    setFontsLoaded(true);
  };//carrega as fontes

  async function checkForUpdate() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // recarrega o app com a nova versão
      }
    } catch (e) {
      console.log("Erro ao buscar atualizações", e);
    }
  };//verifica se há atualizações disponíveis

  async function checkConfig() {
    const config = await AsyncStorage.getItem('CONFIG');

    if (!config) {
      const defaultConfig = {
        saveHistoric: true,
        mobileData: false,
        song: true,

        notifications: false,
        location: false,

        unit: 'metric',
        lang: 'pt_br'
      }

      await AsyncStorage.setItem('CONFIG', JSON.stringify(defaultConfig));
    };
  };//verifica se há uma configuração salva, caso contrário, salva a configuração padrão

  useEffect(() => {
    checkForUpdate();
    checkConfig();
    loadFonts();
  }, []);

  if (!fontsLoaded) return (<View style={style.container}></View>);

    return (
     <SafeAreaView style={style.container}>
      <StatusBar       
       backgroundColor="transparent"
       barStyle="light-content"
       translucent
      />
      <NavigationContainer>
       <AppRoutes/>
      </NavigationContainer>
     </SafeAreaView>
  );
};

