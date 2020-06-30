import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import imageArr from '../utils/imageLoad';

const {width, height} = Dimensions.get('window');

//获取功能项数据（当前仅扫描，记录，更多）
let serviceData = require('../assets/data/serviceData.json');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  //设置启动页消失时间
  componentDidMount() {
    // 隐藏启动页，如果不设置消失时间，在组件加载完启动页自动隐藏
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }

  //banner点击事件
  onBannerClick() {}

  render() {
    return (
      <View style={styles.mainbody}>
        <StatusBar backgroundColor="#3c78d8" />
        <View style={styles.swiper_style}>
          <Swiper
            showsButtons={false}
            loop={true}
            autoplay={true}
            autoplayTimeout={2}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}>
            <TouchableOpacity onPress={() => this.onBannerClick()}>
              <Image
                style={styles.imageBackground}
                source={imageArr['banner1']}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onBannerClick()}>
              <Image
                style={styles.imageBackground}
                source={imageArr['banner2']}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onBannerClick()}>
              <Image
                style={styles.imageBackground}
                source={imageArr['banner3']}
              />
            </TouchableOpacity>
          </Swiper>
        </View>
        <View>
          <View style={styles.listcontainer}>
            <FlatList
              data={serviceData.services}
              numColumns={3} // 一行3个
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <ServiceList
                  name={item.title}
                  iconUri={item.iconUri}
                  index={index}
                  navigation={this.props.navigation} //navigation需要传递给子组件，才能在子组件中调用导航的函数
                />
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.navService = this.navService.bind(this);
  }
  navService = index => {
    // console.log(index);
    if (index === 0) {
      this.props.navigation.navigate('Scan');
    } else if (index === 1) {
      this.props.navigation.navigate('Result');
    } else if (index === 2) {
      ToastAndroid.show('功能开发中', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      console.log('是哪一个功能呢...');
    }
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.navService(this.props.index)}
          // style={[styles.item, {backgroundColor: '#f9c2ff'}]}
        >
          <View style={styles.serviceContainer}>
            {/* {uri: this.props.url} */}
            <Image
              source={imageArr['icon' + (this.props.index + 1)]}
              style={styles.serviceImg}
            />
            <View>
              <Text>{this.props.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainbody: {
    flex: 1,
    alignItems: 'flex-start',
  },
  // 轮播图样式设计
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
    width,
    height,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  // 功能列表样式
  listcontainer: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  serviceContainer: {
    flex: 1, // 空间平均分布
    alignItems: 'center',
  },
  serviceImg: {
    width: 80,
    height: 80,
    marginRight: 5,
    marginLeft: 5,
  },
});
