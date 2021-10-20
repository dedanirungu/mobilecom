import React, { Component, useState, useEffect, } from "react";
import { 
  StyleSheet, 
  View, 
  Text,
  TextInput, 
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator, 
  Image } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import HeaderX from "../components/HeaderX";
import {saveToStorage, getFromStorage, createSettingTable} from "../Helper"

function Settings(props) {
 
  const [loading, setLoading] = useState(0);
  const [forward_url, setForwardUrl] = useState(''); 
  const [secret_key, setSecretKey] = useState(''); 
  const [forward_all, setForwardAll] = useState(true); 
  const [ignore_list, setIgnoreList] = useState(true); 
  const [forward_list, setForwardList] = useState(false); 
  const [out_going, setOutGoing] = useState(false); 
  const [in_coming, setInComing] = useState(false); 
  const [in_out, setInOut] = useState(true); 

  const onToggleForwardUrl= async (value) => {
    setForwardUrl(value);
  } 

  const onToggleSecretKey= async (value) => {
    setSecretKey(value);
  }

  const onToggleForwardAll = async () => {

    var tmp_forward_all = !forward_all;

    setForwardAll(!forward_all); 
    setForwardList(!tmp_forward_all);
  };

  const onToggleForwardList = async () => {

    var tmp_forward_list = !forward_list;

    setForwardList(!forward_list); 
    setForwardAll(!tmp_forward_list);
  };

  const onToggleOutGoing = async () => {

    var tmp_out_going = !out_going;

    setOutGoing(!out_going);
    setInComing(!tmp_out_going);
    setInOut(!tmp_out_going);
  };

  const onToggleInComing = async () => {

    var tmp_in_coming = !in_coming;

    setInComing(!in_coming);
    setInOut(!tmp_in_coming);
    setOutGoing(!tmp_in_coming);

  };

  const onToggleInOut = async () => {

    var tmp_in_out = !in_out;
    
    setInOut(!in_out);
    setInComing(!tmp_in_out);
    setOutGoing(!tmp_in_out);
  };

  const onToggleIgnoreList = async () => {
    setIgnoreList(!ignore_list);
  }


  const saveSetting = async () => {

    if (forward_url) {
     if (secret_key) { 

      await saveToStorage('forward_url', forward_url);
      await saveToStorage('secret_key', secret_key);
      await saveToStorage('forward_all', forward_all);
      await saveToStorage('ignore_list', ignore_list);
      await saveToStorage('forward_list', forward_list);
      await saveToStorage('out_going', out_going);
      await saveToStorage('in_coming', in_coming);
      await saveToStorage('in_out', in_out);

      alert('Setting saved successful.');

    } else {
       alert('Please Enter Secret Key.');
    }
   } else {
     alert('Please Fill Forward Url.');
   }


 };



  useEffect(() => {

    async function fetchData() {

      setLoading(1);

      await createSettingTable()

      var forward_url = await getFromStorage('forward_url', '');
      var secret_key = await getFromStorage('secret_key', '');
      var in_out_str = await getFromStorage('in_out', true);
      var in_coming_str = await getFromStorage('in_coming', false);
      var out_going_str = await getFromStorage('out_going', false);
      var forward_all_str = await getFromStorage('forward_all', true);
      var forward_list_str = await getFromStorage('forward_list', false);
      var ignore_list_str = await getFromStorage('ignore_list', true);

      var in_out = (in_out_str=='true')?true:false;
      var in_coming = (in_coming_str=='true')?true:false;
      var out_going = (out_going_str=='true')?true:false;
      var forward_all = (forward_all_str=='true')?true:false;
      var forward_list = (forward_list_str=='true')?true:false;
      var ignore_list = (ignore_list_str=='true')?true:false;


      setForwardUrl(forward_url);
      setSecretKey(secret_key);
      setIgnoreList(ignore_list);
      setForwardList(forward_list);
      setForwardAll(forward_all);
      setOutGoing(out_going);
      setInComing(in_coming);
      setInOut(in_out);

      setLoading(0);
    }

    fetchData();

  }, []);



  return (
    <View style={styles.root}>
      <HeaderX screenname='Settings' navigation={props.navigation}></HeaderX>
      <View style={styles.body}>

        { !loading ? 
        <ScrollView>

            <View>
              <Text style={styles.text}>Online System Url:</Text>
              <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "System Url"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  value = {forward_url.toString()}
                  onChangeText = {onToggleForwardUrl}/>
            </View>

            <View>
              <Text style={styles.text}>Secret Key:</Text>
              <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Secret Key"
                  placeholderTextColor = "#9a73ef"
                  autoCapitalize = "none"
                  value = {secret_key.toString()}
                  onChangeText = {onToggleSecretKey}/>
            </View>


       

            <Text style={styles.textTitle}>SMS Flow</Text>

            <View style={styles.item}>
              <Text style={styles.text}>In & Out</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={in_out ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={in_out}
                  style={styles.switch}
                  onValueChange = {onToggleInOut}
                ></Switch>
              </View>
            </View>


            <View style={styles.item}>
              <Text style={styles.text}>In Coming</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={in_coming ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={in_coming}
                  style={styles.switch}
                  onValueChange = {onToggleInComing}
                ></Switch>
              </View>
            </View>

            <View style={styles.item}>
              <Text style={styles.text}>Out Going</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={out_going ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={out_going}
                  style={styles.switch}
                  onValueChange = {onToggleOutGoing}
                ></Switch>
              </View>
            </View>

            <Text style={styles.textTitle}>Sending SMS</Text>

            <View style={styles.item}>
              <Text style={styles.text}>All Numbers</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={forward_all ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={forward_all}
                  style={styles.switch}
                  onValueChange = {onToggleForwardAll}
                ></Switch>
              </View>
            </View>

            <View style={styles.item}>
              <Text style={styles.text}>Only in Forward List</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={forward_list ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={forward_list}
                  style={styles.switch}
                  onValueChange = {onToggleForwardList}
                ></Switch>
              </View>
            </View> 

            <Text style={styles.textTitle}>Ignore SMS</Text>

            <View style={styles.item}>
              <Text style={styles.text}>Ignore in Ignore List</Text>
              <View style = {styles.containerSwitch}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={ignore_list ? "#1fb2cc" : "#666666"}
                  ios_backgroundColor="#3e3e3e"
                  value={ignore_list}
                  style={styles.switch}
                  onValueChange = {onToggleIgnoreList}
                ></Switch>
              </View>
            </View> 

            <View style={styles.submitButtonWrapper}>
              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => saveSetting()}
                >
                  <FeatherIcon name="save"  size={16} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}> Save </Text>
              </TouchableOpacity>   
            </View>

          <View style={styles.tabs}>
          </View>    

        </ScrollView>
      : <ActivityIndicator size="large" color="#00CC99" />} 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)"
  },
  body: {
    marginTop:15,
    minHeight:350,
  },
  item: {
    marginTop:15,
    paddingLeft:5,
    paddingRight:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },  
  containerSwitch: {
    flex: 1, 
    alignItems: 'flex-end',
  },
  switch: {
    minWidth: '60%',
  },
  textTitle:{
    marginLeft:15, 
    marginTop:15,
    marginRight:15,
    borderBottomWidth:1,  
    borderColor: 'rgba(200,200,200,1)',
  },
  text: {
    marginLeft:15,
    fontSize:14,
    color:"#000000"
  },
  input: {
    minWidth: '60%',
    margin: 15,
    marginTop:5,
    marginBottom: 5,
    height: 40,
    borderColor: 'rgba(178,178,178,1)',
    borderRadius:5,
    borderWidth: 1
  },
  tabs: {
    height: 80,
    backgroundColor: "rgba(230,230,230,1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 0,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowRadius: 1,
    borderRadius:5,
    marginLeft: 10,
    marginBottom: 10,
  },
  submitButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',   
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
  submitButtonText:{
      color: 'white',
      textAlign:'center',
      fontSize:16,
  },
});

export default Settings;
