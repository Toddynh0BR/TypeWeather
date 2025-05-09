import { StatusBar } from 'react-native';


import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./src/routes/app.routes";
import React, { useEffect } from 'react';

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


export default function App(props: Props) {  
  useEffect(() => {
    fetchFonts();
  }, []);

    return (
     <>
      <StatusBar       
       backgroundColor="transparent"
       barStyle="light-content"
       translucent
      />
      <NavigationContainer>
       <AppRoutes/>
      </NavigationContainer>
     </>
  );
};

