import React from 'react';
import {Text, Image, View, TouchableOpacity, Alert} from 'react-native';
import {ListItem, Button} from 'react-native-elements';

const list = [
  {
    //用户基本信息
    title: 'Basic Info',
    icon: 'verified-user',
    page: 'UserInfo',
  },
  {
    //用户改密
    title: 'Change Password',
    icon: 'flight-takeoff',
    page: 'ChangePW',
  },
  {
    //扫描频率设置
    title: 'Scan Setting',
    icon: 'scanner',
    page: 'ScanSetting',
  },
  {
    //操作说明
    title: 'Doc',
    icon: 'flight-takeoff',
    page: 'Doc',
  },
];

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
  }
  settingPress = page => {
    // this.props.navigation.navigate(page);
    //Alert.alert(typeof page);
    Alert.alert(page);
    // console.log(page);
  };
  render() {
    return (
      <>
        <View>
          <View>
            {list.map((item, i) => (
              // <TouchableOpacity onPress={() => Alert.alert('ok?')}>

              <ListItem
                key={i}
                title={item.title}
                leftIcon={{name: item.icon}}
                bottomDivider
                chevron
                // titleProps={item.title}
                // onPress={() => Alert.alert(item.title)}
                onPress={() => this.props.navigation.navigate(item.page)}
              />
              // </TouchableOpacity>
            ))}
          </View>
          <View>
            <Button
              title="Exit"
              type="clear"
              buttonStyle={{
                backgroundColor: 'white',
                marginTop: 20,
                padding: 5,
                height: 50,
              }}
              titleStyle={{color: '#000'}}
            />
          </View>
        </View>
      </>
    );
  }
}
