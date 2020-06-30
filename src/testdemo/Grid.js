import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

let data = require('./data.json');

export default class Grid extends Component {
  render() {
    return (
      <View>
        <FlatList
          data={data.data}
          numColumns={4} // 一行3个
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => (
            <GoodsList name={item.title} price={item.price} url={item.icon} />
          )}
        />
      </View>
    );
  }
}
class GoodsList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
      // onPress={() => console.log('tt')}
      // style={[styles.item, {backgroundColor: '#f9c2ff'}]}
      >
        <View style={styles.goodsContainer}>
          {/* require('./image/more.png') */}
          {/* {uri: this.props.url} */}
          <Image source={require('./image/more.png')} style={styles.goodsImg} />
          <View>
            <Text>{this.props.name}</Text>
            {/* <Text style={styles.goodsPrice}>￥{this.props.price}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  goodsContainer: {
    flex: 1, // 空间平均分布
    alignItems: 'center',
  },
  goodsImg: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  goodsPrice: {
    color: '#f00',
  },
});
