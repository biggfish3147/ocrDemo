/**
 * 此版能够实现将图片上传到福林服务器。
 * 2020.6.3.14.53保存
 */

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
  findNodeHandle,
  NativeModules,
  PixelRatio,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import Toast, {DURATION} from 'react-native-easy-toast';

const toastdata = require('../testdata/toastdata.json');
//const ppi = PixelRatio.get();

class Scan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      isAutoScan: false,
      timer: null,
      location: [0, 0, 0, 0],
    };
    this.takePhoto = this.takePhoto.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.autoTakePicture = this.autoTakePicture.bind(this);
    this.pauseAutoTakePicture = this.pauseAutoTakePicture.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  componentDidMount() {
    this.startAnimation();
    // Alert.alert(`${this.state.isAutoScan}`);
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
  // onBarCodeRead = barresult => {
  //   const {navigate} = this.props.navigation;
  //   const {data} = barresult;
  //   navigate('Result', {
  //     url: data,
  //   });
  // };

  uploadFile = (url, fileParams) => {
    return new Promise(function(resolve, reject) {
      let picUri = fileParams.path;
      var uriArr = picUri.split('/');
      // console.log(uriArr);
      // console.log(uriArr[uriArr.length - 1]);

      let picName = uriArr[uriArr.length - 1];

      var file = {
        uri: fileParams.path,
        type: 'multipart/form-data',
        name: picName,
      };

      let formData = new FormData();
      formData.append('file', file);

      // console.log('进入uploadFile函数');
      // console.log(formData);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          // console.log('uploadFile', responseData);
          // console.log('post file请求成功');
          resolve(responseData);
        })
        .catch(err => {
          // console.log('err', err);
          reject(err);
        });
    });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      if (data.uri) {
        let permissionResult = this.requestCameraPermission();
        if ((await permissionResult).status === '200') {
          CameraRoll.save(data.uri);
          // Alert.alert((await permissionResult).status);
          // Alert.alert('success');
        } else {
          Alert.alert('授权失败');
        }
      }
    }
  };

  autoTakePicture = () => {
    Alert.alert('开启计时器');
    this.state.timer = setInterval(() => this.takePicture(), 2000);
  };

  pauseAutoTakePicture = () => {
    Alert.alert('取消计时器');
    clearInterval(this.state.timer);
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
      //内存中的地址uri
      //console.log(data.uri);
      if (data.uri) {
        let permissionResult = this.requestCameraPermission();
        //console.log(await permissionResult);
        if ((await permissionResult).status === '200') {
          // CameraRoll.save(data.uri);
          let fileParams = {
            path: data.uri,
          };

          this.uploadFile('http://47.95.206.210:8080/decodeImg', fileParams)
            .then(res => {
              console.log(res);
              this.toast.show(
                '识别成功\n' + `${res.barcode}` + '\n' + `${res.totalTime}`,
              );
            })
            .catch(err => {
              console.log(err);
              this.toastErro.show('出错了！！！');
            });
        } else {
          Alert.alert('授权失败');
        }
      }
    }
  };

  getLocation = e => {
    NativeModules.UIManager.measure(
      e.target,
      (x, y, width, height, pageX, pageY) => {
        this.currentPosY = pageY; // pageY是组件在当前屏幕上的绝对位置
        console.log('*****');
        console.log(x, y);
        console.log(pageX, pageY);
        // this.setState({location[1]:pageX,location[2]:pageY});
      },
    );
  };

  getLocation2 = e => {
    const handle = findNodeHandle(this.scanRectangle);
    console.log('wkak');
    // Alert.alert('test');
    NativeModules.UIManager.measure(
      handle,
      (x, y, width, height, pageX, pageY) => {
        console.log(x, y, width, height, pageX, pageY);
        //Alert.alert(x + y + width + height + pageX + pageY);
      },
    );
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
              <View
                style={styles.rectangle}
                onLayout={e => this.getLocation(e)}
              />
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
            // onPress={this.onPress.bind(this, 'cancle')}
          >
            <Text style={styles.bottomtext}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.takePicture.bind(this)}>
            <Text style={styles.bottomtext}>完成</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState(state => ({isAutoScan: !state.isAutoScan}));
              //Alert.alert(`${this.state.isAutoScan}`);
              this.state.isAutoScan
                ? this.autoTakePicture()
                : this.pauseAutoTakePicture();
              //Alert.alert('??');
            }}>
            <Text style={styles.bottomtext}>自动扫描</Text>
          </TouchableOpacity>
          <Button title="点击拍照" onPress={this.takePhoto} color="red" />
        </View>

        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={{backgroundColor: 'green'}}
          position="bottom"
          positionValue={220}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />

        <Toast
          ref={ref => {
            this.toastErro = ref;
          }}
          style={{backgroundColor: 'red'}}
          position="bottom"
          positionValue={220}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
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
