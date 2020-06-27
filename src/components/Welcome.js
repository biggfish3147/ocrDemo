import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.welcome}>
        <Text style={styles.welcome_text}>Welcome to OCR DEMO !</Text>
        <Image
          source={require('../assets/images/welcome.png')}
          style={styles.welcome_image}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'skyblue',
  },
  welcome_text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcome_image: {width: 200, height: 200},
});
