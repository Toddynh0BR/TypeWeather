<p>
  <img src="https://github.com/Toddynh0BR/TypeWeather/blob/d6afcec568ad970f858be6a34a75fdfd06a82373/assets/icon.png" alt="Logo" width="70" align="left" >
  <h1>TypeWeather</h1> 
</p>

TypeWeather is a simple weather forecast app that uses the OpenWeather API to search for weather forecasts for a given city, and the Geoapify API to search for latitude and longitude information for a given location.

## Overview

To use the app, you just need to type the name of a city in the input (Brazilian because I limited the API to Brazilian cities) and the input will give some options similar to what you typed in the input, just select one and you will be taken to a page with information such as: current time of the location, temperature (celsius), sky condition, thermal sensation, probability of rain, etc.

## Screenshots

### Search City:
 <img src="https://github.com/Toddynh0BR/Assets/blob/688c79cd1a3025646818a32a8db1949af0f40f07/TypeWeatherApp1.jpg" alt="App Screenshot" height="600" width="300">
 
### City Weather:
 <img src="https://github.com/Toddynh0BR/Assets/blob/688c79cd1a3025646818a32a8db1949af0f40f07/TypeWeatherApp2.jpg" alt="App Screenshot" height="600" width="300">


## Technologies Used

- **React Native**
- **Typescript**
- **Javascript**
- **Expo**
- **Dev-Client**
- **Styled-Components**
- **Axios**

## Preview App

[![Download APK](https://img.shields.io/badge/Download-APK-blue?style=for-the-badge)](https://github.com/Toddynh0BR/TypeWeather/releases/download/v1.0/TypeWeather.apk)

- No ios version

## Installation

1. Clone the repository:
   
```bash
git clone https://github.com/seuusuario/TypeWeather.git
cd TypeWeather
```
   
2. Install dependencies:
   
```bash
npm install
npx expo install
```

3. Create the development application:
   
```bash
eas build --profile development --platform android
```

Need to connect to expo

4. Open the app on your device or in android studio and run the project:

 ```bash
npx expo start --dev-client
```


## License
Este projeto está licenciado sob a [MIT](https://github.com/Toddynh0BR/TypeWeather/blob/main/LICENSE) License.

## Author

- [@Toddynh0BR](https://github.com/Toddynh0BR)
    
