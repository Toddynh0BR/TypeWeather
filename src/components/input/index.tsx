import styled from "styled-components/native";
import { Animated, StyleSheet } from "react-native";
import { useEffect ,useRef } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 26,
    height: 26,
  },
});
import Loading from "../../../assets/loading.png"

interface Props {
    placeholder: string; 
    loading: boolean
}

const Container = styled.View`
flex: 1;
height: fit-content;
`

const InputArea = styled.View`
   width: 100%;
   height: 56px;

   justify-content: space-between;
   flex-direction: row;
   align-items: center;

   background-color: #1E1E29;
   border-radius: 10px;
   padding: 0 15px;
`;

const InputText = styled.TextInput`
   font-family: 'nunito';
   font-size: 16px;
   flex: 1;
   color: #fff;
   margin-left: 10px;
`;

export function Input({ placeholder, loading=false, ...rest}: Props) {
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

    return (
          <Container>
           <InputArea> 
             <InputText
              placeholderTextColor="#7F7F98"
              placeholder={placeholder} 
              {...rest}
            />

            {
              loading ?
              <Animated.Image
              source={Loading} // substitua pelo caminho correto
              style={[styles.image, animatedStyle]}
            />
            :
             null
            }
           </InputArea>
          </Container>
    );
}
