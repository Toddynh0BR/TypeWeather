import styled from "styled-components/native";
import { Dimensions } from 'react-native';

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

position: relative;
z-index: 2;

align-items: center;
display: flex;
`

export const Header1 = styled.View`
height: 80px;
width: 100%;

justify-content: center;
align-items: flex-end;
flex-direction: row;
display: flex;
gap: 10px;
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
width: fit-content;
`
export const Main1Strong = styled.Text`
font-family: 'nunitoBold';
font-size: 20px;
color: #8FB2F5;

display: flex;
width: fit-content;
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

export const ResultItemText = styled.Text`
   font-family: 'nunito';
   font-size: 16px;
   color: #fff;
`

//////////////////////////////////56 8 24 20

export const PartTwo = styled.ScrollView`
min-height: 100%;
width: 100%;

background-color: #13131A;
padding: 10px;



`

export const Header2 = styled.View`
min-height: 400px;
width: 100%;

align-items: center;
display: flex;

background-color: #16161F;
border-radius: 12px;
border: none;

margin-bottom: 10px;
margin-top: 30px;
padding: 12px;
`

export const ImageView = styled.TouchableOpacity`
height: 56px;
width: 56px;

justify-content: center;
align-items: center;
display: flex;

background-color: #1E1E29;
border-radius: 8px;
border: none;
`

export const Header2Images = styled.ImageBackground`
 height: ${screenWidth - 30}px;
 width: 100%;

 border-radius: 12px;
 overflow: hidden;

 margin-top: 12px;
`

export const Header2Text = styled.Text`
font-family: 'nunitoBold';
color: #fafafa;
font-size: 22px;
`

export const Header2Text2 = styled.Text`
font-family: 'nunitoBold';
color: #fafafa;
font-size: 14px;
`

export const Header2Text3 = styled.Text`
font-family: 'nunito';
color: #fafafa;
font-size: 14px;

opacity: .8;

margin-left: 20px;
`

export const SpaceAmong = styled.View`
flex: 1;
width: 100%;

`

export const Header2Text4 = styled.Text`
font-family: 'nunitoExtraBold';
color: #fff;
font-size: 48px;

`

export const Header2Text5 = styled.Text`
font-family: 'nunitoBold';
color: #fff;
font-size: 18px;

`

export const Header2Text6 = styled.Text`
font-family: 'nunito';
font-size: 14px;
color: #fff;

margin-bottom: 20px;

`

export const HeaderTimeIcon = styled.Image`
height: 180px;
width: 180px;

margin-bottom: -20px;
margin-right: -20px;
`

export const Main2 = styled.View`
height: fit-content;
width: 100%;

align-items: center;
display: flex;

background-color: #16161F;
border-radius: 12px;
padding: 16px;
border: none;
`

export const Main2Item = styled.View`
height: 56px;
width: 100%;

border-bottom-color: #3B3B54;
border-bottom-width: 1px;

flex-direction: row;
align-items: center;
display: flex;
` 

export const Main2ItemText = styled.Text`
font-family: 'nunitoBold';
font-size: 16px;
color: #fff;
`

export const Main2ItemText2 = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #fff;
`

export const Main2SpaceAmong = styled.View`
flex: 1;
height: 100%;
`

export const Main2Week = styled.View`
height: 180px;
width: 100%;

flex-direction: row;
align-items: center;
display: flex;

background-color: #16161F;
border-radius: 12px;
padding: 25px;
border: none;

margin-bottom: 20px;
margin-top: 10px;
`

export const Main2WeekItem = styled.View`
height: 100%;
width: 20%;

align-items: center;
display: flex;
`

export const Main2WeekText = styled.Text`
font-family: 'nunitoBold';
color: #fff;
font-size: 16px;
`

export const Main2WeekText2 = styled.Text`
font-family: 'nunitoBold';
color: #7F7F98;
font-size: 16px;
`

export const Main2WeekImage = styled.Image`
height: 75px;
width: 75px;

`

export const Results2 = styled.FlatList`
max-height: 280px;
width: ${screenWidth - 108}px;

position: absolute;
overflow: hidden;
z-index: 5;
top: 0px;
right: 0;


background-color: #16161F;
border-radius: 8px;
margin-top: 65px;
`
