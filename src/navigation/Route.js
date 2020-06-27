import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//import TabRoute from './TabRoute';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

import Home from '../screens/Home';
import Record from '../screens/Record';
import Setting from '../screens/Setting';
import Scan from '../screens/Scan';
import Result from '../screens/Result';
import Doc from '../screens/Doc';
import Login from '../screens/Login';
import UserInfo from '../screens/UserInfo';
import ChangePW from '../screens/ChangePW';
import ScanSetting from '../screens/ScanSetting';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Record') {
            iconName = focused ? 'book' : 'book';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings';
          }
          // You can return any component that you like here!
          return (
            <Icon
              name={iconName}
              size={size}
              color={color}
              type="MaterialIcons"
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'green',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Record" component={Record} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}

export default function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            title: 'Welcome to OcrDemo',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'center',
              flex: 1,
            },
          }}
        />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="Doc" component={Doc} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="ChangePW" component={ChangePW} />
        <Stack.Screen name="ScanSetting" component={ScanSetting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
