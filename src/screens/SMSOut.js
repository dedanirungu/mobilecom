import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,  
  ScrollView,
  ActivityIndicator, 
  ImageBackground
} from "react-native";
import HeaderX from "../components/HeaderX";
import { createSmsoutTable, listRecord, timeConverter} from "../Helper"

function SMSOut(props) { 

  const [loading, setLoading] = useState(0);
  const [counter, setCounter] = useState(0);
  const [limit, setLimit] = useState(7);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [end_page, setEndPage] = useState(1);
  const [smsout_list, setSMSOutList] = useState([]);
  const [search, setSearch] = useState('');   

  const searchList = async (value) => {

    setSearch(value)
    setOffset(0)
    await fetchList()

  }


  const fetchList = async () => { 

    setLoading(1);

    var listing = [];
    var total = 0;
    var end_page = 0;

    var table_name = "smsout";
    var where_list = "";

    if(search.length > 0){
      where_list = " phone LIKE '%" + search + "%' OR sms LIKE '%" + search + "%' "
    }

    var result = await listRecord( table_name, where_list, offset, limit )
    var listing = result[0];
    var total = result[1];
    var end_page = Math.ceil(total/limit)

    setCounter(total) 
    setSMSOutList(listing) 
    setEndPage(end_page) 

    setLoading(0);

  };

  const navigateList = async (page) => {

    setOffset(limit * page-limit)

    setPage(page)

    await fetchList()
  };

  useEffect(() => {
    async function fetchData() {
      await createSmsoutTable()
      await fetchList()
    }

    fetchData();
  }, []);



  return (
    <View style={styles.root}>
    <HeaderX
      screenname='SMSOut'
      navigation={props.navigation}
    ></HeaderX>
    <View style={styles.body}>

      <TextInput style = {styles.inputSearch}
          underlineColorAndroid = "transparent"
          placeholder = "Search"
          placeholderTextColor = "#9a73ef"
          autoCapitalize = "none"
          onChangeText = {searchList}/>
      
      <ScrollView>
          { !loading ? 
          <View>         
            <Text style = {styles.viewTitle}>SMSOut List</Text>

            {
            smsout_list.map((item, index) => (
                <View id={index} style = {styles.itemWrapper}>
                  <View style = {styles.item}>
                    <Text style = {styles.itemAmount}>{item.phone}</Text>
                    <Text style = {styles.itemDate}>{timeConverter(item.date_sent)}</Text>
                  </View>
                  <View style = {styles.item}>
                    <Text style = {styles.itemTitle}>{item.sms}</Text>
                  </View>
                  <View style = {styles.item}>
                    <Text style = {styles.itemDate}>Completed: {yesNo(item.completed)}</Text>
                    <Text style = {styles.itemDate}>Successful: {yesNo(item.successful)}</Text>
                  </View>
                </View>
            ))
            }

            { end_page > 1 ?
            <View style={styles.navigationButtonWrapper}>

              { page > 1 ?
              <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => navigateList(page-1)}
                >
                  <Text style={styles.navigationButtonText}>Prev</Text>
              </TouchableOpacity>  
              : <TouchableOpacity disabled style={[styles.navigationButton, styles.navigationButtonDisabled]}>
                    <Text style={styles.navigationButtonTextDisabled}>Prev</Text>
                </TouchableOpacity>  
              }  

              <Text style = {styles.itemTitle}>{page}/{end_page}</Text>

              {  page < end_page ?
                <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => navigateList(page+1)}
                  >
                    <Text style={styles.navigationButtonText}>Next</Text>
                </TouchableOpacity>  
              : <TouchableOpacity disabled style={[styles.navigationButton, styles.navigationButtonDisabled]}>
                    <Text style={styles.navigationButtonTextDisabled}>Next</Text>
                </TouchableOpacity>  
              }  

            </View>
            : null} 
            

          </View>
          :<ActivityIndicator size="large" color="#00CC99"  />}

      </ScrollView>

        
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)"
  },
  body:{
    minHeight:350,
  },
  itemWrapper:{
    padding: 5,
    margin: 2,
    borderColor: '#dddddd',
    borderBottomWidth: 1,
 },
 itemTitle:{
    fontSize: 12,
    fontWeight: "bold",
    color:"#333333"
 },
 itemAmount:{
    fontSize: 14,
    color: '#3c8bfa',
    fontWeight: "bold",
 },
 itemDate:{
    fontSize: 10,
    color: '#666666',
 },
 item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

 },  
 viewTitle: {
   marginLeft: 10,
 },
 submitButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',   
  },
  input: {
    minWidth: '60%',
    margin: 15,
    height: 40,
    borderColor: 'rgba(31,178,204,1)',
    borderBottomWidth: 1
  },
  inputSearch: {
    minWidth: '60%',
    margin: 10,
    marginBottom:0,
    height: 40,
    borderColor: 'rgba(31,178,204,1)',
    borderWidth: 1,
    borderRadius: 5, 
  },
  submitButton: {
      backgroundColor: 'rgba(31,178,204,1)',
      padding: 10,
      margin: 15,
      height: 40,
      maxWidth: 70,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  submitButtonCancel: {
    backgroundColor: 'rgba(255,0,0,0.9)',
    padding: 10,
    margin: 15,
    height: 40,
    maxWidth: 90,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  submitButtonText:{
      color: 'white',
      textAlign:'center'
  },
  navigationButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',   
    marginBottom:110,
  },

  navigationButton: {
    padding: 10,
    margin: 10,
    maxWidth: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(31,178,204,1)',
  },

  navigationButtonDisabled: {
    borderColor: 'rgba(200,200,200,1)',
  },

  navigationButtonText:{
    color: '#333333',
  },

  navigationButtonTextDisabled:{
    color: '#999999',
  }
});

export default SMSOut;
