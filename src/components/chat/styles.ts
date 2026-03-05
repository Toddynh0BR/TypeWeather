import styled from "styled-components/native";

export const Container = styled.View`
flex: 1;

align-items: center;


`

export const HeaderImage = styled.Image`
height: 28px;
width: 40px;

object-fit: cover;
`

export const Header = styled.View`
height: 80px;
width: 100%;

justify-content: center;
align-items: center;
flex-direction: row;
display: flex;

padding-top: 10px;
border-bottom-width: 1px;
border-bottom-color: rgba(59, 59, 84, 0.64);
`

export const HeaderText = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #FAFAFA;
`

export const Main = styled.View`
flex: 1;
width: 100%;

padding: 0 10px;
gap: 20px;
`

export const Chats = styled.ScrollView`
flex: 1;
width: 100%;

`

export const InputArea = styled.View`
height: 60px;
width: 100%;

justify-content: space-between;
align-items: center;
flex-direction: row;
gap: 10px;
`

export const MessageText = styled.Text`
font-family: 'nunito';
color: #FAFAFA;
font-size: 16px;

text-align: left;
`

export const DateText = styled.Text`
font-family: 'nunito';
color: #fafafae1;
font-size: 12px;

position: absolute;
bottom: 5px;
right: 8px;
text-align: right;
`
export const DateTextLeft = styled.Text`
font-family: 'nunito';
color: #fafafae1;
font-size: 12px;

position: absolute;
bottom: 5px;
left: 8px;
text-align: right;
`

export const Strong = styled.Text`
font-family: 'nunitoBold';
font-size: 24px;
color: #8FB2F5;

display: flex;

`

export const Description = styled.Text`
font-family: 'nunito';
text-align: center;
font-size: 14px;
color: #FAFAFA;

margin-bottom: 30px;
display: flex;
width: 90%;
`

export const List = styled.FlatList`
height: 100px;
width: 95%;

`

export const EmptyList = styled.Text`
font-family: 'nunito';
text-align: center;
font-size: 13px;
color: #fafafacb;

margin: 0 auto;
width: 90%;
`

export const FavoriteItem = styled.TouchableOpacity`
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

export const FavoriteText = styled.Text`
   font-family: 'nunito';
   font-size: 16px;
   color: #fff;

`