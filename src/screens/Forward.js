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
import FeatherIcon from "react-native-vector-icons/Feather";
import ActionButton from 'react-native-action-button';
import { createForwardTable, listRecord, saveRecord} from "../Helper"

function Forward(props) { 

  const [loading, setLoading] = useState(0);
  const [adding, setAdding] = useState(0);
  const [editing, setEditing] = useState(0);
  const [counter, setCounter] = useState(0);
  const [limit, setLimit] = useState(7);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [end_page, setEndPage] = useState(1);
  const [forward_list, setForwardList] = useState([]);
  const [name, setName] = useState(''); 
  const [phone, setPhone] = useState('');   
  const [search, setSearch] = useState('');   
  const [edit_item, setEditItem] = useState({});   

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

    var table_name = "forward";
    var where_list = "";

    if(search.length > 0){
      where_list = "name LIKE '%" + search + "%' OR phone LIKE '%" + search + "%'"
    }

    var result = await listRecord( table_name, where_list, offset, limit )
    var listing = result[0];
    var total = result[1];
    var end_page = Math.ceil(total/limit)

    setCounter(total) 
    setForwardList(listing) 
    setEndPage(end_page) 

    setLoading(0);

  };

  const editRecord = (item) => {

    setEditItem(item);

    setName(item.name);
    setPhone(item.phone);

    setAdding(1);
    setEditing(1);

  }

  const navigateList = async (page) => {

    setOffset(limit * page-limit)

    setPage(page)

    await fetchList()
  };

  const cancelModification = () => {
    setAdding(0); 
    setEditing(0);
  }

  const savePhone = async (name, phone) => {

    if (name) {
     if (phone) {

       var record = [
         ['name', name],
         ['phone', phone],
       ];

       if(editing){
        await saveRecord('forward', record, edit_item.id );
       }else{
        await saveRecord('forward', record);
       }

       setAdding(0);
       setEditing(0);
       setEditItem({});
       await fetchList();


     } else {
       alert('Please Enter your Phone.');
     }
   } else {
     alert('Please fill Name.');
   }


 };

  useEffect(() => {
    async function fetchData() {
      await createForwardTable()
      await fetchList()
    }

    fetchData();
  }, []);



  return (
    <View style={styles.root}>
      <HeaderX
        screenname='Forward'
        navigation={props.navigation}
      ></HeaderX>
      <View style={styles.body}>

        { !adding ?
          <TextInput style = {styles.inputSearch}
            underlineColorAndroid = "transparent"
            placeholder = "Search"
            placeholderTextColor = "#9a73ef"
            autoCapitalize = "none"
            onChangeText = {searchList}/>
        : null}
        
        <ScrollView>
          { !adding ?
          <View>
            { !loading ? 
            <View>         
              <Text style = {styles.viewTitle}>Forward List</Text>

              {
              forward_list.map((item, index) => (
                <TouchableOpacity
                    id={index} 
                    onPress={() => editRecord(item)}
                  >
                  <View style = {styles.itemWrapper}>
                    <View style = {styles.item}>
                      <Text style = {styles.itemTitle}>{item.name}</Text>
                      <Text style = {styles.itemAmount}>{item.phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
            :<ActivityIndicator size="large" color="#00CC99" />}

          </View>
          : 
          <View>
            <Text style = {styles.viewTitle}>Add Phone Number to {props.list_type} List</Text>
      
            <TextInput style = {styles.input}
              underlineColorAndroid = "transparent"
              placeholder = "Name"
              placeholderTextColor = "#9a73ef"
              autoCapitalize = "none"
              value = {name.toString()}
              onChangeText = {setName}/>
      
            <TextInput style = {styles.input}
              underlineColorAndroid = "transparent"
              placeholder = "Phone"
              placeholderTextColor = "#9a73ef"
              autoCapitalize = "none"
              value = {phone.toString()}
              onChangeText = {setPhone}/>
      
            <View style={styles.submitButtonWrapper}>
              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => savePhone(name, phone)}
                >
                  <FeatherIcon name="plus"  size={22} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>   
              <TouchableOpacity
                  style={styles.submitButtonCancel}
                  onPress={() => cancelModification()}
                >
                  <FeatherIcon name="x"  size={22} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>         
            </View>
          </View>

            
          }

      </ScrollView>

      { !adding ?
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            onPress={() => { setAdding(1);}}
          />
          : null}
          
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
    fontSize: 16,
    fontWeight: "bold",
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

export default Forward;
