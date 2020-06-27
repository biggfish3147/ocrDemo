import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class OcrHeader extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.name;
  }

  render() {
    return (
      <View style={styles.welcome}>
        <Text style={styles.welcome_text}>
          Welcome {this.props.name} to OCR DEMO !
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    // flexDirection: 'row',
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'skyblue',
  },
  welcome_text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
