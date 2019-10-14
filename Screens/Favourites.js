import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  StatusBar
} from "react-native";
import Card from "../Components/Card";
import * as firebase from "firebase";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";

class Favourites extends Component {
  constructor() {
    super();
    this.state = {
      messData: [],
      isModalVisible: false
    };
  }

  async componentDidMount() {
    // let value = await AsyncStorage.getItem("messData");

    this.setState({ isModalVisible: true });

    let fav = [];
    await firebase
      .database()
      .ref("Users/" + firebase.auth().currentUser.uid + "/fav/")
      .on("value", snapshot2 => {
        let snap2 = JSON.stringify(snapshot2);
        let data2 = JSON.parse(snap2);
        for (key in data2) {
          if (data2[key] === true) {
            fav.push(key);
          }
        }
      });
    await firebase
      .database()
      .ref("Owner/")
      .on(
        "value",
        async function(snapshot) {
          let snap = JSON.stringify(snapshot);
          data = JSON.parse(snap);
          let te = [];
          for (const key in data) {
            const element = data[key];
            // console.log(element);
            {
              fav.includes(element.Credentials.mid)
                ? te.push({
                    name: element.name,
                    mid: element.Credentials.mid,
                    mid: element.Credentials.mid,
                    time:
                      element.time.lunch.open +
                      " - " +
                      element.time.lunch.close,
                    email: element.Contact.email,
                    mobileNo: element.Contact.mobileNo,
                    profileUrl: element.profileUrl,
                    limited: element.limited,
                    address: element.address,
                    avgCost: element.avgCost,
                    views: element.views,
                    fav: fav.includes(element.Credentials.mid) ? true : false
                  })
                : false;
            }
          }
          // await AsyncStorage.setItem("messData", JSON.stringify(te));
          this.setState({
            messData: te,
            isModalVisible: false
          });
        }.bind(this)
      );
    // this.setState({
    //   messData:
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {this.state.messData.map((rowData, key) => {
            return (
              <TouchableOpacity
                key={rowData.name}
                activeOpacity={1}
                onPress={() => {
                  this.props.navigation.navigate("MessDetail", {
                    mess: rowData
                  });
                }}
              >
                <Card liked={false} messData={rowData} key={rowData.name} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {this.state.isModalVisible ? (
          <Modal
            isVisible={this.state.isModalVisible}
            backdropColor="#000"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              <LottieView
                style={styles.loader}
                source={require("../assets/Lottie/cooking.json")}
                autoPlay={true}
                loop={true}
              />
            </View>
          </Modal>
        ) : (
          <View />
        )}
      </View>
    );
  }
}
export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 20
  }
});
