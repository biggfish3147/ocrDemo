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
  Dimensions,
  StatusBar,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-easy-toast';

var locxy = [];

class Scan extends PureComponent {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      isAutoScan: false,
      timer: null,
      location: [],
    };
    this.takePhoto = this.takePhoto.bind(this);
    // this.takePicture = this.takePicture.bind(this);
    // this.autoTakePicture = this.autoTakePicture.bind(this);
    // this.pauseAutoTakePicture = this.pauseAutoTakePicture.bind(this);
    this.getLayoutLocation = this.getLayoutLocation.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  //React Native生命周期函数/组件挂载时执行
  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    //设置扫描动画效果
    this.state.moveAnim.setValue(-100);
    Animated.timing(this.state.moveAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.startAnimation());
  };

  //  识别二维码
  // onBarCodeRead = barresult => {
  //   const {navigate} = this.props.navigation;
  //   const {data} = barresult;
  //   navigate('Result', {
  //     url: data,
  //   });
  //   console.log(data);
  // };

  /**
   * 获取写文件权限，后续才能将图片保存在相册
   * @return permissionJson返回权限授权情况，json格式数据
   * status：200表示已授予文件权限，400表示未授予
   */
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
   * uploadFile上传文件
   * @url 请求地址api
   * @fileParams 文件及相关参数（目前仅图片uri）
   */
  uploadFile = (url, fileParams) => {
    return new Promise(function(resolve, reject) {
      //从参数中获取拍摄图片的uri
      let picUri = fileParams.path;

      let startTime = fileParams.time;

      //截取图片文件名（xxx.jpg）
      let uriArr = picUri.split('/');
      let picName = uriArr[uriArr.length - 1];

      //图片文件数据（对象形式）
      var file = {
        uri: picUri,
        type: 'multipart/form-data',
        name: picName,
      };

      //封装在表单数据对象中
      let formData = new FormData();
      formData.append('file', file);

      // formData.append('loc', locxy);

      console.log(formData);

      //fetch发起网络请求（POST请求）
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
          //内层获取到响应数据的时间戳
          var firstResultTime = new Date().getTime();
          console.log('获取到内层响应数据： ' + (firstResultTime - startTime));

          //将响应json数据传递出去（promise对象用法）
          resolve(responseData);
        })
        .catch(err => {
          //将报错提示传递出去
          reject(err);
        });
    });
  };

  /**
   * takePhoto调用摄像头拍照，并调用uploadFile函数上传图片文件
   * 核心函数takePictureAsync()，接受一些图片设置参数
   */
  takePhoto = async () => {
    if (this.camera) {
      //获取最开始时间
      var startTime = new Date().getTime();
      // console.log(startTime);

      //拍摄图片的参数（quality：图片质量/压缩比率）
      const options = {quality: 0.5, base64: false, width: 1000};
      const data = await this.camera.takePictureAsync(options);

      console.log(data);

      //
      var takeTime = new Date().getTime();
      console.log('拍照函数耗时：   ' + (takeTime - startTime));

      //console.log(data.uri);
      if (data.uri) {
        //运行时权限申请（写文件的权限--保存图片到本地相册时需要）
        let permissionResult = this.requestCameraPermission();

        //因为requestCameraPermission是异步函数，获取值时需要await关键字
        if ((await permissionResult).status === '200') {
          CameraRoll.save(data.uri);

          //统计保存文件到本地相册耗时
          var saveTime = new Date().getTime();
          console.log('保存到本地相册耗时：   ' + (saveTime - startTime));

          let fileParams = {
            path: data.uri,
            time: startTime,
          };

          //http://47.95.206.210:8080/decodeImg
          this.uploadFile('http://47.95.206.210:8080/decodeImg', fileParams)
            .then(res => {
              //响应数据
              console.log(res);

              //获得响应数据的时间戳
              var resultTime = new Date().getTime();
              console.log(
                '获取到响应数据(外层)耗时：  ' + (resultTime - startTime),
              );

              // this.toast.show(
              //   '识别成功\n' + `${res.barcode}` + '\n' + `${res.totalTime}`,
              // );

              //显示完toast的时间戳
              // var toastTime = new Date().getTime();
              // console.log('toast最终显示：  ' + (toastTime - startTime));

              //完善版的响应数据

              if ((res.status = '200')) {
                console.log('识别成功，正常返回！');
                this.toast.show(
                  '识别成功\n' + `${res.barcode}` + '\n' + `${res.totalTime}`,
                );
              } else if ((res.status = '204')) {
                console.log('识别超时！');
                this.toast.show('请求超时，请重试！');
              } else if ((res.status = '400')) {
                console.log('识别失败！');
                this.toastErro.show('识别失败！');
              } else {
                this.toastErro.show('出现错误！');
              }

              var toastTime = new Date().getTime();
              console.log('toast最终显示：  ' + (toastTime - startTime));
            })
            .catch(err => {
              console.log(err);
              this.toastErro.show('出现错误！！！');
            });
        } else {
          console.log('写文件权限未授予');
        }
      }
    }
  };

  autoTakePicture = () => {
    if (!this.state.isAutoScan) {
      console.log('开启计时器');
      this.setState(state => ({isAutoScan: !state.isAutoScan}));
      this.state.timer = setInterval(() => this.takePhoto(), 1000);
    } else {
      console.log('关闭计时器');
      this.setState(state => ({isAutoScan: !state.isAutoScan}));
      clearInterval(this.state.timer);
    }
  };

  /**
   * 获取组件在屏幕中的绝对位置(布局时获得)
   *
   */
  // var windowWidth = Dimensions.get('window').width; //获取手机宽度
  // var windowHeight = Dimensions.get('window').height; //获取手机高度
  // var {width, height} = Dimensions.get('window'); //获取手机宽度和高度
  // 小米6测试
  //宽360 高640 像素密度3
  // 设备参数 1920x1080分辨率 5.15英寸 428PPI 后置双摄12MP
  getLayoutLocation = e => {
    //终端设备的像素密度（428PPI->density:3）
    const density = PixelRatio.get();

    NativeModules.UIManager.measure(
      e.target,
      (x, y, width, height, pageX, pageY) => {
        //x,y是当前组件相对父组件的相对位置
        //pageX,pageY是组件在当前屏幕上的绝对位置
        //width,height分别是组件的宽与高（逻辑像素）
        // console.log(x, y, width, height, pageX, pageY);

        //进行像素计算之后,组件左上角与右下角坐标（x,y,对角x,对角y）
        const loc = [
          pageX * density,
          pageY * density,
          (pageX + width) * density,
          (pageY + height) * density,
        ];
        // console.log(
        //   pageX * density,
        //   pageY * density,
        //   (pageX + width) * density,
        //   (pageY + height) * density,
        // );
        this.setState(state => ({
          location: state.location.concat(loc),
        }));

        locxy = this.state.location;
        console.log(this.state.location);
      },
    );
  };

  /**
   * 获取组件在屏幕中的绝对位置（点击按钮时获得）
   */
  getLocation2 = e => {
    const handle = findNodeHandle(this.scanRectangle);
    console.log('wkak');
    NativeModules.UIManager.measure(
      handle,
      (x, y, width, height, pageX, pageY) => {
        console.log(x, y, width, height, pageX, pageY);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3c78d8" hidden={true} />
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
                ref={ref => {
                  this.scanRectangle = ref;
                }}
                style={styles.rectangle}
                onLayout={e => this.getLayoutLocation(e)}
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
          <Button
            title="自动扫描"
            onPress={this.autoTakePicture}
            color="skyblue"
          />
          <Text>
            当前模式：{this.state.isAutoScan ? '自动扫描' : '拍照模式'}
          </Text>
          <Button title="点击拍照" onPress={this.takePhoto} color="red" />
        </View>

        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={{backgroundColor: 'green'}}
          position="bottom"
          positionValue={220}
          fadeInDuration={100}
          fadeOutDuration={100}
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
          fadeInDuration={500}
          fadeOutDuration={500}
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
    margin: 5,
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
