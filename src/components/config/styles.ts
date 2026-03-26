import styled from "styled-components/native";

export const Container = styled.ImageBackground`
flex: 1;

align-items: center;
gap: 10px;
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
align-items: flex-end;
flex-direction: row;
display: flex;
`

export const HeaderText = styled.Text`
font-family: 'nunitoBold';
font-size: 18px;
color: #FAFAFA;
`


export const Strong = styled.Text`
font-family: 'nunitoBold';
font-size: 24px;
color: #8FB2F5;

margin-top: 30px;
display: flex;
margin-bottom: 20px;
`

export const Scroll = styled.ScrollView`
width: 90%;

`

export const Row = styled.View`
height: 55px;
width: 100%;

justify-content: space-between;
flex-direction: row;
align-items: center;
gap: 5px;

border-bottom-width: 1px;
border-bottom-color: #a3a3a334;
`

export const Column = styled.View`
width: 100%;

gap: 5px;

border-bottom-width: 1px;
border-bottom-color: #a3a3a334;
padding: 12px 0;
`

export const Text = styled.Text`
font-family: 'nunito';
font-size: 18px;
color: #FAFAFA;

margin-bottom: 4px;
`

