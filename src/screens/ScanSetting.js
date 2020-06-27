import React from 'react';
import {Text, View} from 'react-native';
import {Slider} from 'react-native-elements';

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
        <View
          style={{
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'center',
            padding: 20,
          }}>
          <Slider
            value={this.state.value}
            onValueChange={value => this.setState({value})}
            onSlidingComplete={value => {
              this.setState({value: value});
            }}
            minimumValue={1}
            maximumValue={5}
            step={1}
          />

          <Text>Value: {this.state.value} S</Text>
        </View>
      </>
    );
  }
}
