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
    };
    this.takePhoto = this.takePhoto.bind(this);
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
  onBarCodeRead = barresult => {
    const {navigate} = this.props.navigation;
    const {data} = barresult;
    navigate('Result', {
      url: data,
    });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      if (data.uri) {
        let permissionResult = this.requestCameraPermission();
        if ((await permissionResult).status == '200') {
          //Alert.alert('成功授权');
          CameraRoll.saveToCameraRoll(data.uri);
          //如下两句打印下来为空，可能因为不是在同一线程上
          Alert.alert((await permissionResult).status);
          //  Alert.alert((await permissionResult).message);
          //Alert.alert('成功保存到相册');
        }
      }
    }
  };

  autoTakePicture = () => {
    setInterval(() => this.takePicture, 5000);
  };

  //获取写文件权限，后续才能将图片保存在相册
  requestCameraPermission = async () => {
    let permissionJson = {
      status: '400',
      message: 'Default Message...',
    };
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
        // CameraRoll.saveToCameraRoll(uri);
        permissionJson.status = '200';
        permissionJson.message = '已授予文件读写权限';
        return permissionJson;
      } else {
        console.log('Camera permission denied');
        permissionJson.status = '400';
        permissionJson.message =
          '已拒绝授予文件读写权限，图片将不能保存到本地相册';
        return permissionJson;
      }
    } catch (err) {
      console.warn(err);
      return permissionJson;
    }
  };

  takePhoto = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      if (data.uri) {
        let permissionResult = this.requestCameraPermission();
        if ((await permissionResult).status == '200') {
          //Alert.alert('成功授权');
          CameraRoll.saveToCameraRoll(data.uri);
          //如下两句打印下来为空，可能因为不是在同一线程上
          // Alert.alert((await permissionResult).status);
          //  Alert.alert((await permissionResult).message);
          Alert.alert('成功保存到相册');
        }
      }
    }
  };

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
            // onPress={this.onPress.bind(this, 'switch')}
          >
            <Text style={styles.bottomtext}>切换</Text>
          </TouchableOpacity>
          <Button title="点击拍照" onPress={this.takePhoto} color="red" />
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
