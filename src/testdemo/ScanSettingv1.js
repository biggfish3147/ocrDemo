import React from 'react';
import {Text, View} from 'react-native';
import {Slider, ListItem} from 'react-native-elements';

export default class ScanSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2,
    };
  }
  render() {
    return (
      <>
        <View>
          <ListItem />
        </View>
      </>
    );
  }
}
