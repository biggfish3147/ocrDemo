import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get('window');

// var styles = {
//   wrapper: {},
//   slide1: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#9DD6EB',
//   },
//   slide2: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#97CAE5',
//   },
//   slide3: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#92BBD9',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold',
//   },
// };

export default class MySwiper extends Component {
  render() {
    return (
      //   <Swiper style={styles.wrapper} showsButtons loop={false}>
      //     <View testID="Hello" style={styles.slide1}>
      //       <Text style={styles.text}>Hello Swiper</Text>
      //     </View>
      //     <View testID="Beautiful" style={styles.slide2}>
      //       <Text style={styles.text}>Beautiful</Text>
      //     </View>
      //     <View testID="Simple" style={styles.slide3}>
      //       <Text style={styles.text}>And simple</Text>
      //     </View>
      //   </Swiper>

      <View style={styles.swiper_style}>
        <Swiper
          showsButtons={false}
          loop={true}
          autoplay={true}
          autoplayTimeout={2}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          <TouchableOpacity onPress={() => this.onfirstAdClick()}>
            <Image
              style={styles.imageBackground}
              source={require('../assets/images/ilF0001.jpg')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.onSecondAdClick()}>
            <Image
              style={styles.imageBackground}
              source={require('../assets/images/ilF0002.jpg')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.onThirdAdClick()}>
            <Image
              style={styles.imageBackground}
              source={require('../assets/images/ilF1021.jpg')}
            />
          </TouchableOpacity>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: 'transparent',
    width: 8,
    height: 8,
    borderColor: '#ffffff',
    borderWidth: 1.5,
    borderRadius: 8,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#3c78d8',
    width: 8,
    height: 8,
    borderColor: '#3c78d8',
    borderWidth: 1.5,
    borderRadius: 8,
    marginRight: 6,
  },

  swiper_style: {
    height: 200,
    margin: 5,
  },
  imageBackground: {
    resizeMode: 'repeat',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    // borderBottomLeftRadius: 20,
    width,
    height,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
});
