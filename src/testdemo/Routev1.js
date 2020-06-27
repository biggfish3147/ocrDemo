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

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RecordStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'My Home',
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
      <HomeStack.Screen name="Scan" component={Scan} />
      {/* <Stack.Screen name="Setting" component={Setting} /> */}
    </HomeStack.Navigator>
  );
}

function RecordStackScreen() {
  return (
    <RecordStack.Navigator>
      <RecordStack.Screen name="Record" component={Record} />
      <RecordStack.Screen name="Result" component={Result} />
      {/* <Stack.Screen name="Setting" component={Setting} /> */}
    </RecordStack.Navigator>
  );
}

export default function Routev1() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Record" component={RecordStackScreen} />
        <Tab.Screen name="Setting" component={Setting} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
