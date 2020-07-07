import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon, Card} from 'react-native-elements';
import {View, StyleSheet, Text, Button} from 'react-native';
import {BlurView} from 'expo-blur';

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
              size={30}
              color={color}
              type="MaterialIcons"
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#3c78d8',
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
      <Stack.Navigator
        // mode="card"
        headerMode="screen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3c78d8',
            // opacity: 0.8,
            // height: 60, // 指定导航栏的高度
          },
          headerTintColor: '#fff',
          headerPressColorAndroid: 'skyblue',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
            flex: 1,
          },
          // headerRight: () => (
          //   <View>
          //     <Text />
          //   </View>
          //   // <Button
          //   //   onPress={() => alert('This is a button!')}
          //   //   title="Info"
          //   //   color="#3c78d8"
          //   // />
          // ),
          headerBackTitle: '返回',
          // headerShown: false,  //是否显示导航栏（位于页面顶部）
          // cardStyle: {backgroundColor: 'transparent'}, //栈区卡片样式设计（背景透明的话，上一层卡片可以看到下一层卡片）
          // cardOverlayEnabled: false,

          // cardStyleInterpolator: ({current: {progress}}) => ({
          //   cardStyle: {
          //     opacity: progress.interpolate({
          //       inputRange: [0, 0.5, 0.9, 1],
          //       outputRange: [0, 0.25, 0.7, 1],
          //     }),
          //   },
          //   overlayStyle: {
          //     opacity: progress.interpolate({
          //       inputRange: [0, 1],
          //       outputRange: [0, 0.5],
          //       extrapolate: 'clamp',
          //     }),
          //   },
          // }),
        }}>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{
            title: 'Welcome to OcrDemo',
            // headerShown: false,
          }}
        />
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={{
            title: '扫描',
            // headerShown: true,
            headerStyle: {
              backgroundColor: '#000',
              opacity: 0.8,
            },
            headerTransparent: true,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
            headerRight: () => (
              <View>
                <Text />
              </View>
            ),
            // headerBackground: '#000',
            // cardStyle: {backgroundColor: 'transparent'},  //会看到下层卡片
          }}
        />
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
