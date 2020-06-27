import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <Text>点击按钮,开始扫描</Text> */}
        <Button
          title="Click to Scan"
          type="solid"
          onPress={() => this.props.navigation.navigate('Scan')}
        />
        <Button
          title="Click to Result"
          type="solid"
          onPress={() => this.props.navigation.navigate('Result')}
          buttonStyle={{marginTop: 10}}
        />
      </View>
    );
  }
}
