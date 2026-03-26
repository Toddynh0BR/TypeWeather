import * as S from './styles';

import { ScrollView, StyleSheet, View, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useRef } from 'react';

import GetWeatherIA from '../../services/getWeatherIA';
import { Input } from '../input';

import { PaperPlaneRight } from 'phosphor-react-native'
import Icon from "../../../assets/Icon4K.png";
import { parse } from '@babel/core';

interface Props {
  navigation: any;
  route: any;
};

interface MessageProps {
  who: string;
  text: string;
  date: string;
};

function Message({who, text, date}: MessageProps) {
  if (who == 'IA') return (
   <View style={{ width: '100%',  gap: 10}}>
    <View style={{ paddingBottom: 25, position: 'relative', padding: 15, backgroundColor: '#8FB2F5', width: '80%', marginTop: 15, borderRadius: 8, borderBottomLeftRadius: 0}}>
     <S.MessageText>
      {text}
     </S.MessageText>
     <S.DateText>
      {date}
     </S.DateText>
    </View>
   </View>
  );
  else return (
   <View style={{ width: '100%', alignItems: 'flex-end', gap: 10}}>
    <View style={{ paddingBottom: 25, position: 'relative', padding: 15, backgroundColor: '#1a1a24', width: '80%', marginTop: 15, borderRadius: 8, borderBottomRightRadius: 0}}>
     <S.MessageText>
      {text}
     </S.MessageText>
      <S.DateTextLeft>
      {date}
     </S.DateTextLeft>
    </View>
   </View>
  );
};

export function WeatherChat() {
    const [language, setLanguage] = useState('pt_br'); 
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false)
    const [texting, setTexting] = useState('');
    const [query, setQuery] = useState('');

    const scrollViewRef = useRef();
    useEffect(() => {
      async function loadLanguage() {
        const SaveConfig = await AsyncStorage.getItem('CONFIG');
        const parsedConfig = JSON.parse(SaveConfig || '{}');

        setLanguage(parsedConfig.lang)
      };
      async function loadMessages() {
        const savedMessages = await AsyncStorage.getItem('MESSAGES');

        if (!savedMessages) {
          await AsyncStorage.setItem('MESSAGES', '[]');
          return setMessages([]);
        };

        console.log(savedMessages)
        const parsedMessages = JSON.parse(savedMessages);

        setMessages(parsedMessages);
      };

      loadMessages();
      loadLanguage();
    }, []);

    async function HandleAsk() {
     if (!texting.trim()) return;

     const now = new Date();
     const time = now.getHours() + ":" + now.getMinutes();

     const userMessage = {
       who: "User",
       text: texting,
       time
     };

     setMessages((prev) => {
       const updated = [...prev, userMessage];
       AsyncStorage.setItem("MESSAGES", JSON.stringify(updated));
       return updated;
     });
     setTexting('');
     setLoading(true);
     try {
       const response = await GetWeatherIA(texting);

       const IAnow = new Date();
       const IAtime = IAnow.getHours() + ":" + IAnow.getMinutes();

       const aiMessage = {
         who: "IA",
         text: response.answer,
         time: IAtime
       };

       setMessages(prev => {
        const updated = [...prev, aiMessage];
        AsyncStorage.setItem("MESSAGES", JSON.stringify(updated));
        return updated;
       });
       scrollViewRef.current?.scrollToEnd({ animated: true });
     } catch (error) {
       console.error(error);
       alert("Erro ao perguntar a IA.");
     } finally {
       setLoading(false);
     }
    };

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

    return(
     <S.Container style={{ paddingBottom: keysOpen ? 5 : 95 }}>
      <S.Header>
       <S.HeaderImage 
        source={Icon}
       />
       <S.HeaderText>{'   TypeWeather IA    '}</S.HeaderText>
      </S.Header>

      <S.Main>
        <S.Chats ref={scrollViewRef}>
         { messages.length ?
          messages.map((item, index)=> (
           <Message key={index} date={item.time} who={item.who} text={item.text}/>
          ))
         :
          null
         }
        </S.Chats>

        <S.InputArea>
         <Input 
          placeholder={ language == 'pt_br' ? 'Pergunte algo sobre o clima para a IA' : language == 'en' ? 'Ask something about the climate for AI.' : 'Pregunte algo sobre el clima para la IA.'}
          onChangeText={setTexting}
          numberOfLines={4}
          loading={loading}
          value={texting}
          multiline
         />

         <TouchableOpacity style={{ opacity: loading ? 0.6 : 1 }} disabled={loading} onPress={HandleAsk} style={{ 
                                   height: 56, 
                                   width: 56, 
                                   backgroundColor: '#8FB2F5', 
                                   borderRadius: '50%',
                                   alignItems: 'center',
                                   justifyContent: 'center'
                                  }}>
          {
            loading ?
            <ActivityIndicator size={30} color='#fff'/>
            :
            <PaperPlaneRight size={30} color='#fff'/>
          }
         </TouchableOpacity>
        </S.InputArea>
      </S.Main>
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