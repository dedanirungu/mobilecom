import React, { Component, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import LogoHeader from "./LogoHeader";
import FeatherIcon from "react-native-vector-icons/Feather";

function HeaderX(props) {


  const redirect = (name) =>{ 

    props.navigation.navigate(name); 

  }


  return (
    <View style={[styles.container]}>
        <View style={styles.tabs}>
          <TouchableOpacity 
          style={styles.following} 
          onPress={() => redirect('SMSIn')}> 
          <FeatherIcon
            name="arrow-up-circle"
            style={[styles.icon, props.screenname == 'SMSIn' ? styles.activeButton : null]}
          ></FeatherIcon>
            <Text style={[styles.text, props.screenname == 'SMSIn' ? styles.activeButton : null]}>SMS In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.following} 
          onPress={() => redirect('SMSOut')}>
          <FeatherIcon
            name="arrow-down-circle"
            style={[styles.icon, props.screenname == 'SMSOut' ? styles.activeButton : null]}
          ></FeatherIcon>
            <Text style={[styles.text, props.screenname == 'SMSOut' ? styles.activeButton : null]}>SMS Out</Text>
          </TouchableOpacity> 
          <TouchableOpacity 
          style={styles.following} 
          onPress={() => redirect('Ignore')}>
          <FeatherIcon
            name="phone-off"
            style={[styles.icon, props.screenname == 'Ignore' ? styles.activeButton : null]}
          ></FeatherIcon>
            <Text style={[styles.text, props.screenname == 'Ignore' ? styles.activeButton : null]}>Ignore</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.following} 
          onPress={() => redirect('Forward')}>
          <FeatherIcon
            name="phone-outgoing"
            style={[styles.icon, props.screenname == 'Forward' ? styles.activeButton : null]}
          ></FeatherIcon>
            <Text style={[styles.text, props.screenname == 'Forward' ? styles.activeButton : null]}>Forward</Text>
          </TouchableOpacity>         
          <TouchableOpacity 
          style={styles.following} 
          onPress={() => redirect('Settings')}>
          <FeatherIcon
            name="settings" 
            style={[styles.icon, props.screenname == 'Settings' ? styles.activeButton : null]}
          ></FeatherIcon>
            <Text style={[styles.text, props.screenname == 'Settings' ? styles.activeButton : null]}>Setting</Text>
          </TouchableOpacity>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(31,178,204,1)"
  },

  tabs: {
    height: 60,
    backgroundColor: "rgba(31,178,204,1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 0,
    shadowOffset: {
      height: 0,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowRadius: 0
  },
  group: {
    height: 55,
    backgroundColor: "rgba(31,178,204,1)",
    flexDirection: "row",
    marginTop: 25
  },
  following: {
    width: 100,
    height: 38,
    alignSelf: "center",
    justifyContent: "center"
  },
  activeButton:{
    color: "rgba(255,255,0,1)",
  },
  icon: {
    alignSelf: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    width: 25,
    height: 30,
    marginTop: 9
  },
  text: {
    color: "rgba(255,255,255,1)",
    alignSelf: "center",
    fontSize: 10
  },
  logoHeader: {
    width: 41,
    height: 44,
    marginLeft: 131
  },
  iconRow: {
    height: 44,
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 6
  },
  iconRowFiller: {
    flex: 1,
    flexDirection: "row"
  },
  button: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginTop: 15
  },
  icon2: {
    color: "rgba(250,250,250,1)",
    fontSize: 25
  }
});

export default HeaderX;
