import styled from "styled-components/native";
import { Dimensions, Animated } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const Container = styled.View`
height: 100%;
width: 100%;

background-color: #13131A;
`

export const PartOne = styled.ImageBackground`
max-height: 110%;
min-height: 110%;
width: 100%;

align-items: center;
display: flex;
`

export const HeaderImage = styled.Image`
height: 28px;
width: 40px;

object-fit: cover;
`

export const Header1 = styled.View`
height: 80px;
width: 100%;

justify-content: center;
align-items: flex-end;
flex-direction: row;
display: flex;
`

export const Header1Text = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #FAFAFA;
`

export const Main1 = styled.View`
min-height: 140px;
width: 90%;

margin-top: 250px;

align-items: center;
display: flex;

`

export const Main1Text = styled.Text`
font-family: 'nunitoBold';
font-size: 20px;
color: #FAFAFA;

display: flex;

`
export const Main1Strong = styled.Text`
font-family: 'nunitoBold';
font-size: 20px;
color: #8FB2F5;

display: flex;
`

export const Main1Description = styled.Text`
font-family: 'nunito';
text-align: center;
font-size: 14px;
color: #FAFAFA;

margin-bottom: 30px;
display: flex;
width: 100%;
`

export const Results = styled.FlatList`
max-height: 222px;
width: 100%;

overflow: hidden;

border-radius: 8px;
margin-top: 65px;

`

export const ResultItem = styled.TouchableOpacity`
height: 54px;
width: 100%;

background-color:rgb(59, 59, 84);
margin-bottom: 2px;

padding: 0 25px;

justify-content: center;
display: flex;
`

export const ResultItemLocal = styled.TouchableOpacity`
height: 54px;
width: 100%;

background-color:rgb(59, 59, 84);
border-radius: 8px;
margin-bottom: 5px;

padding: 0 25px;

flex-direction: row;
justify-content: space-between;
align-items: center;
display: flex;
`

export const ResultItemText = styled.Text`
   font-family: 'nunito';
   font-size: 16px;
   color: #fff;

`

//////////////////////////////////

export const MenuBar = styled.View`
height: 70px;
width: 100%;

background-color: #1E1E29;
position: absolute;
bottom: 0;

border-radius: 18px 18px 0 0;
padding: 0 0 10px 0;
z-index: 10;

justify-content: space-around;
flex-direction: row;
align-items: center;
display: flex;

`

export const Ball = styled(Animated.View)`
position: absolute;
height: 85px;
width: 85px;
top: -21px;

align-items: center;
display: flex;
background-color: #13131A;
border-radius: 40px;
`

export const MiniBallLeft = styled.View`
position: absolute;
top: 14px;
left: -14px;
width: 20px;
height: 20px;
background-color: transparent;
border-top-right-radius: 18px;
border-top-width: 6px;
border-top-color: #13131A;
border-right-width: 6px;
border-right-color: #13131A;
`

export const MiniBallLRight = styled.View`
position: absolute;
top: 14px;
right: -14px;
width: 20px;
height: 20px;
background-color: transparent;
border-top-left-radius: 18px;
border-top-width: 6px;
border-top-color: #13131A;
border-left-width: 6px;
border-left-color: #13131A;

`

//////////////////////////////////

export const NoWifi = styled.View`
height: 80%;
width: 100%;

justify-content: center;
align-items: center;

`

export const NoWifiTitle = styled.Text`
font-family: 'nunitoBold';
font-size: 24px;
color: #8FB2F5;
`

export const NoWifiText = styled.Text`
font-family: 'nunito';
font-size: 16px;
color: #fff;

width: 90%;
text-align: center;
`