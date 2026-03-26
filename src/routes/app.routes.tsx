import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../pages/home";
import { Result } from "../pages/result";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes(){
    return(
     <Navigator screenOptions={{headerShown: false}} initialRouteName="home">
      <Screen 
       name="home"
       component={Home}
      />

      <Screen 
       name="result"
       component={Result}
      />
     </Navigator>
    )
};