/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Table, TableWrapper, Row} from 'react-native-table-component';
//import getJsonLength from '../utils/jsonLength';

const testJsonArr = require('../assets/data/resultDataDemo.json');
//定义全局变量
var tableData = [];

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Id', 'Barcode', 'Name', 'Tel', 'Status', 'Time', 'Date'],
      widthArr: [40, 160, 80, 120, 50, 40, 160],
      dataSource: {},
    };
  }

  // componentDidMount() {
  //测试传参
  // const {
  //   params: {id, name, tag},
  // } = this.props.route;
  // console.log('id: ', id);
  // console.log('name: ', name);
  // console.log('tag: ', tag);
  // }

  componentDidMount() {
    this.getData().then(data => {
      this.setState({
        dataSource: data,
      });
    });
  }

  //读取数据

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('res');
      // console.log('RES值：' + jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
      // return jsonValue != null ? jsonValue : null;
    } catch (e) {
      // error reading value
    }
  };

  //json数组转换为二维数组
  getTableData = jsonArr => {
    //清除之前数据，执行赋空语句
    tableData = [];
    for (let i = 0; i < jsonArr.length; i += 1) {
      const rowData = [];
      for (var index in jsonArr[i]) {
        //console.log(jsonArr[i][index]);
        let tempData = jsonArr[i][index];
        rowData.push(tempData);
      }
      tableData.push(rowData);
    }
    if (tableData) {
      return tableData;
      //this.setState({tableData: tableData});
    } else {
      console.log('数据为空');
    }
  };

  render() {
    const state = this.state;
    // const tableData = [];
    // for (let i = 0; i < 5; i += 1) {
    //   const rowData = [];
    //   for (let j = 0; j < 7; j += 1) {
    //     rowData.push(`${i}${j}`);
    //   }
    //   tableData.push(rowData);
    //   console.log(tableData);
    // }
    const tableData2 = this.getTableData(testJsonArr);
    // const tableData = this.state.tableData;
    //this.getTableData(testJsonArr);

    // const storeData = this.getData().then(jsonObject => {
    //   console.log(jsonObject);
    //   return jsonObject;
    // });

    // const storeData = this.getData();
    const storeData = state.dataSource;
    console.log(typeof storeData);

    const storeDataStr = JSON.stringify(storeData);
    console.log('state中数据源' + storeDataStr);

    // for (let i in storeData) {
    //   console.log(i);
    //   console.log(storeData[i]);
    // }

    // console.log(typeof storeDataStr);
    // console.log('json字符串' + storeDataStr);

    // console.log(typeof testJsonArr);

    // let storeDataArr = this.getTableData(storeData.scanResultList);

    // console.log(typeof storeDataArr);

    // console.log('json数组转换为二维数组' + storeDataArr);

    // const {id} = this.props.route.params;
    // const {name} = this.props.route.params;

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            {/* <Text>参数1:{id}</Text> */}
            {/* <Text>参数1:{name}</Text> */}
            <Text>{storeDataStr}</Text>

            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={state.tableHead}
                widthArr={state.widthArr}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {tableData2.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 5, paddingTop: 5, backgroundColor: '#eee'},
  header: {height: 50, backgroundColor: '#e6e6fa'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
