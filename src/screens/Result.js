import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
//import getJsonLength from '../utils/jsonLength';

const testJsonArr = require('../assets/data/resultdata.json');
//定义全局变量
var tableData = [];

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Id', 'Barcode', 'Name', 'Tel', 'Status', 'Time', 'Date'],
      widthArr: [40, 160, 80, 120, 50, 40, 160],
    };
  }

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

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
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
