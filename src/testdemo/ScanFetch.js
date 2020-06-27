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

let common_url = ' http://47.95.206.210:8080/'; //服务器地址
// let token = ''; //用户登陆后返回的token

class ScanFetch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      isAutoScan: false,
      timer: null,
      location: [0, 0, 0, 0],
    };
    this.takePhoto = this.takePhoto.bind(this);
    this.getLocation = this.getLocation.bind(this);
    // this.uploadImage = this.uploadImage.bind(this);
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
  /**
   * 使用fetch实现图片上传
   * @param {string} url  接口地址
   * @param {JSON} params body的请求参数
   * @return 返回Promise
   */
  uploadImage = (url, params) => {
    return new Promise(function(resolve, reject) {
      let formData = new FormData();
      // for (var key in params) {
      //   formData.append(key, params[key]);
      // }
      let picUri = params.path;
      var uriArr = picUri.split('/');
      console.log(uriArr);
      console.log(uriArr[uriArr.length - 1]);

      let picName = uriArr[uriArr.length - 1];

      var file = {
        uri: params.path,
        type: 'multipart/form-data',
        name: picName,
      };
      formData.append('file', file);

      //额外添加参数，附带测试
      formData.append('name', 'dongjie');

      console.log('进入uploadImage函数');
      console.log(formData);
      //https://api.douban.com/v2/book/1220562
      //http://47.95.206.210:8080/decodeImg
      fetch('http://localhost:8082/ocrServer/image', {
        method: 'POST',
        headers: {
          //application/json,charset=UTF-8
          //multipart/form-data
          // 'Content-Type': 'multipart/form-data',
          // Host: '47.95.206.210:8080',
          Accept: 'application/json,charset=UTF-8',
          // Host: '47.95.206.210',
          //   'x-access-token': token,
        },
        processData: false,
        contentType: false,
        body: formData,
      })
        .then(response => {
          response.json();
          console.log('获得返回数据');
        })
        .then(responseData => {
          console.log('uploadImage', responseData);
          console.log('POST请求成功');
          resolve(responseData);
        })
        .catch(err => {
          console.log('err', err);
          reject(err);
        });
    });
  };

  //upload方式能够请求成功（测试uri:https://api.douban.com/v2/book/1220562）
  //更换为http://47.95.206.210:8080/uploadCon也能正常请求，只是说明Current request is not a multipart request

  upload = (url, params) => {
    return new Promise(function(resolve, reject) {
      console.log('进入upload函数');
      //https://api.douban.com/v2/book/1220562
      //http://47.95.206.210:8080/decodeImg
      //http://localhost:8082/ocrServer/rain?id=12
      //http://47.95.206.210:8080/getTest
      fetch('http://47.95.206.210:8080/getTest', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json,charset=UTF-8',
          Cookie: '__cfduid=dd612525795d9a6c2b8f0a62df17580371588846059',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('upload', responseData);
          console.log('get请求成功');
          resolve(responseData);
        })
        .catch(err => {
          console.log('err', err);
          reject(err);
        });
    });
  };

  //本地测试post Json数据
  uploadJson = (url, params) => {
    return new Promise(function(resolve, reject) {
      // let formData = new FormData();
      // formData.append('id', '123');
      // formData.append('status', ' post okk');

      //FormData数据与Json数据格式不一样，所以body不能用formData 来作为post的数据（指明json数据内容时）
      let testjson = {id: '007', name: 'dongjie', goal: 'test'};

      console.log('进入uploadJson函数');
      fetch('http://192.168.1.181:8082/ocrServer/rain', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: '__cfduid=dd612525795d9a6c2b8f0a62df17580371588846059',
        },
        body: JSON.stringify(testjson),
        //body: "{id: '007', name: 'dongjie', goal: 'test'}"
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('uploadJson', responseData);
          console.log('post请求成功');
          resolve(responseData);
        })
        .catch(err => {
          console.log('err', err);
          reject(err);
        });
    });
  };

  //本地测试上传FormData数据（纯json数据）
  //测试成功
  uploadFormData = (url, params) => {
    return new Promise(function(resolve, reject) {
      let formData = new FormData();
      formData.append('id', '123');
      formData.append('status', ' post okk');

      console.log('进入uploadFormData函数');
      fetch('http://192.168.1.181:8082/ocrServer/image', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
        //body: "{id: '007', name: 'dongjie', goal: 'test'}"
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('uploadFormData', responseData);
          console.log('post formdata请求成功');
          resolve(responseData);
        })
        .catch(err => {
          console.log('err', err);
          reject(err);
        });
    });
  };

  //本地测试上传包含file的FormData数据

  uploadFile = (url, params) => {
    return new Promise(function(resolve, reject) {
      let picUri = params.path;
      var uriArr = picUri.split('/');
      console.log(uriArr);
      console.log(uriArr[uriArr.length - 1]);

      let picName = uriArr[uriArr.length - 1];

      var file = {
        uri: params.path,
        type: 'multipart/form-data',
        name: picName,
      };

      let formData = new FormData();
      formData.append('file', file);

      console.log('进入uploadFormData函数');
      console.log(formData);
      fetch('http://192.168.1.181:8082/ocrServer/file', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('uploadFile', responseData);
          console.log('post file请求成功');
          resolve(responseData);
        })
        .catch(err => {
          console.log('err', err);
          reject(err);
        });
    });
  };

  takePhoto = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: false};
      const data = await this.camera.takePictureAsync(options);
      // console.log(data);
      //内存中的地址uri
      //console.log(data.uri);
      if (data.uri) {
        let permissionResult = this.requestCameraPermission();
        //console.log(await permissionResult);
        if ((await permissionResult).status === '200') {
          // CameraRoll.save(data.uri);

          let params = {
            path: data.uri,
          };
          console.log(data);
          // this.uploadImage('decodeImg', params)
          //   .then(res => {
          //     console.log(res);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });

          // this.upload('decodeImg', params)
          //   .then(res => {
          //     console.log(res);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });

          // this.uploadJson('decodeImg', params)
          //   .then(res => {
          //     console.log(res);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });

          // this.uploadFormData('decodeImg', params)
          //   .then(res => {
          //     console.log(res);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   });

          this.uploadFile('decodeImg', params)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });

          this.toast.show(
            '保存成功\n' + `${toastdata.barcode}` + '\n' + `${toastdata.tel}`,
          );
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
      </View>
    );
  }
}

export default ScanFetch;

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
