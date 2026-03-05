import styled from "styled-components/native";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const Container = styled.View`
height: 100%;
width: 100%;

background-color: #13131A;
position: relative;
`

export const Loading = styled.View`
height: 100%;
flex: 1;

justify-content: center;
align-items: center;
display: flex;

`

export const HeaderIcon = styled.Image`
height: 40px;
width: 40px;

object-fit: contain;
`

export const ResultItem = styled.TouchableOpacity`
height: 54px;
width: 100%;

border-bottom-color:rgb(51, 51, 68);
background-color:rgb(59, 59, 84);
border-bottom-width: 1px;

padding: 0 25px;

justify-content: center;
display: flex;
`

export const ResultItemText = styled.Text`
   font-family: 'nunito';
   font-size: 16px;
   color: #fff;
`

export const PartTwo = styled.ScrollView`
min-height: 100%;
width: 100%;

background-color: #13131A;
padding: 10px;



`

export const Header2 = styled.View`

width: 100%;

align-items: center;
display: flex;

background-color: #16161F;
border-radius: 12px;
border: none;

margin-bottom: 10px;
margin-top: 10px;
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

margin-bottom: 80px;
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

export const Results2 = styled.View`
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

export const Favorite = styled.TouchableOpacity`
height: 56px;
width: 56px;

background-color: #1e1e29b2;
border-radius: 8px;
border: none;

position: absolute;
bottom: 20px;
right: 20px;

justify-content: center;
align-items: center;
display: flex;
`

export const ShareBtn = styled.TouchableOpacity`
height: 56px;
width: 56px;

background-color: #1e1e29b2;
border-radius: 8px;
border: none;

position: absolute;
bottom: 20px;
right: 86px;

justify-content: center;
align-items: center;
display: flex;
`

export const BackAlert = styled.View`
height: 100%;
width: 100%;

align-items: center;
position: absolute;
z-index: 10;
background-color: #00041885;
`

export const HeaderAlert = styled.View`
height: 60px;
width: 100%;

justify-content: space-between;
flex-direction: row;
align-items: flex-end;
padding: 0 20px;
`

export const Alert = styled.View`
height: 57%;
width: 95%;

position: absolute;
z-index: 10;
top: 10%;

background-color: rgb(51, 51, 68);
border-radius: 12px;
padding: 30px 10px 5px;

justify-content: space-between;
align-items: center;

overflow: hidden;
`

export const AlertBC = styled.Image`
height: 50px;
width: 120%;

position: absolute;
top: 0;
right: 0;

`

export const Areas = styled.View`
align-items: center;
width: 100%;

`

export const AlertFooter = styled.View`
justify-content: space-between;
align-items: center;
flex-direction: row;

width: 100%;
`

export const AlertTitle = styled.Text`
font-family: 'nunitoExtraBold';
font-size: 24px;
color: #fff;
`

export const AlertSubTitle = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #fff;

margin-bottom: 5px;
`

export const AlertSubTitle2 = styled.Text`
font-family: 'nunitoBold';
font-size: 16px;
color: #fff;

`

export const AlertText = styled.Text`
font-family: 'nunito';
font-size: 16px;
color: #fff;

width: 90%;
text-align: center;
`

export const AlertNumber = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #fff;
`

export const AlertNumberStrong = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #8FB2F5;
`

export const AlertFont = styled.Text`
font-family: 'nunito';
color: #8FB2F5;
font-size: 12px;

margin-top: 10px;
margin-bottom: -10px;
`

export const AlertFImage = styled.Image`
height: 85px;
width: 85px;

margin-bottom: -10px;
object-fit: contain;
`

export const Map = styled.View`
height: 290px;
width: 100%;

background-color: #16161F;
border-radius: 12px;
overflow: hidden;
border: none;

margin-bottom: 5px;
margin-top: 10px;

position: relative;
`

export const Buttons = styled.View`
height: 40px;
width: 100%;

justify-content: space-between;
align-items: center;
flex-direction: row;
padding: 0 10px;

z-index: 10;

position: absolute;
`

export const IconButtons = styled.TouchableOpacity`
height: 30px;
width: 30px;

background-color: #3B3B54;
border-radius: 50%;

justify-content: center;
align-items: center;
`


