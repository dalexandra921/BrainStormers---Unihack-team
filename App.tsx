import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LandingScreen } from "./src/screens/auth/landing.screen";
import { RegisterScreen } from "./src/screens/auth/register.screen";
import { LoginScreen } from "./src/screens/auth/login.screen";
import { TasksScreen } from "./src/screens/app/tasks.screen";
import { AdmitScreen } from "./src/screens/app/admit.screen";
import { MapScreen } from "./src/screens/app/map.screen";
import { AboutUsScreen } from "./src/screens/aboutUs.screen";
import { SettingsScreen } from "./src/screens/app/settings.screen";
import { Provider, useAtom, useAtomValue } from "jotai";
import { tokenAtom, store } from "./src/store";
import { useAuth } from "./src/hooks/use-auth.hook";
import axios from "axios";

import { tabScreenOptions } from "./src/navigation/tab.options";

axios.defaults.baseURL = "https://ana-unfakable-shenita.ngrok-free.dev";
axios.interceptors.request.use((cfg) => {
  const jwt = store.get(tokenAtom);
  if (jwt) cfg.headers.Authorization = jwt;
  return cfg;
});

const Main = createNativeStackNavigator();

const Auth = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Auth.Navigator>
      <Auth.Screen name="LandingScreen" component={LandingScreen} />
      <Auth.Screen name="RegisterScreen" component={RegisterScreen} />
      <Auth.Screen name="LoginScreen" component={LoginScreen} />
    </Auth.Navigator>
  );
};

const AppTabs = () => {
  const { userDetails } = useAuth();

  return (
    <Tabs.Navigator>
      <Tabs.Screen name="TasksScreen" component={TasksScreen} />
      {userDetails.isAdmin === true && (
        <Tabs.Screen name="AdmitScreen" component={AdmitScreen} />
      )}
      <Tabs.Screen name="MapScreen" component={MapScreen} />
      {!userDetails.isAdmin && (
        <Tabs.Screen name="SettingsScreen" component={SettingsScreen} />
      )}
    </Tabs.Navigator>
  );
};

const Navigation = () => {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Main.Navigator screenOptions={{ headerShown: false }}>
        {token === null ? (
          <Main.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <Main.Screen name="AppTabs" component={AppTabs} />
        )}
        <Main.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{ headerShown: true, title: "About Us" }}
        />
      </Main.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
