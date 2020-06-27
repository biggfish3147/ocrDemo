'use strict';
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
  Button,
  PermissionsAndroid,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';

class Scan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      isCancel: false,
      isOk: false,
      isSwitch: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(-100);
    Animated.timing(this.state.moveAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => this.startAnimation());
  };
  //  识别二维码
  onBarCodeRead = result => {
    const {navigate} = this.props.navigation;
    const {data} = result;
    navigate('Result', {
      url: data,
    });
  };

  onPress(choices) {
    // eslint-disable-next-line eqeqeq
    if (choices == 'cancle') {
      // eslint-disable-next-line no-alert
      Alert.alert(
        '取消',
        '取消后本次扫描结果将不被保存！！',
        [
          {
            text: '还是算了',
            onPress: () => this.setState({isCancel: this.state.isCancel}),
          },
          {
            text: '确认',
            onPress: () => {
              this.setState({isCancel: !this.state.isCancel});
              this.props.navigation.navigate('Home');
            },
          },
        ],
        {cancelable: true},
      );
      //Alert.alert(this.state.isCancel.toString());
      /*
      if (this.state.isCancel) {
        this.props.navigation.navigate('Home');
      }
      */
    } else if (choices == 'ok') {
      Alert.alert('点击OK');
    } else {
      Alert.alert('切换功能开发中');
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      Alert.alert(data.uri);
      //this.props.navigation.navigate('Result');
      if (data.uri) {
        await CameraRoll.saveToCameraRoll(data.uri);
        Alert.alert('成功保存到相册');
      }
    }
  };

  //测试：点击拍照并将图片保存到本地相册

  //获取权限
  requestCameraPermission = async uri => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        CameraRoll.saveToCameraRoll(uri);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  takePhoto() {
    Alert.alert('点击拍照');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topcontainer}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            autoFocusPointOfInterest={{x: 0.5, y: 0.5}}
            onBarCodeRead={this.onBarCodeRead}
            captureAudio={false}>
            <View style={styles.rectangleContainer}>
              <View style={styles.rectangle} />
              <Animated.View
                style={[
                  styles.border,
                  {transform: [{translateY: this.state.moveAnim}]},
                ]}
              />
              <Text style={styles.rectangleText}>
                将手机号信息对准框内，即可自动扫描
              </Text>
            </View>
          </RNCamera>
        </View>

        <View style={styles.bottomcontainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onPress.bind(this, 'cancle')}>
            <Text style={styles.bottomtext}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.takePicture.bind(this)}>
            <Text style={styles.bottomtext}>完成</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onPress.bind(this, 'switch')}>
            <Text style={styles.bottomtext}>切换</Text>
          </TouchableOpacity>
          <Button
            title="点击拍照"
            onPress={this.takePhoto.bind(this)}
            color="red"
          />
        </View>
      </View>
    );
  }
}

export default Scan;

const styles = StyleSheet.create({
  bottomtext: {
    color: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  topcontainer: {
    flex: 1,
  },
  bottomcontainer: {
    //backgroundColor: 'skyblue',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'skyblue',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingTop: 20,
  },
  rectangle: {
    height: 100,
    width: 300,
    borderWidth: 1,
    borderColor: '#00FF00',
    //backgroundColor: 'gray',
    //opacity: 0.3,
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },

  border: {
    flex: 0,
    width: 300,
    height: 2,
    backgroundColor: '#00FF00',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'skyblue',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
});
