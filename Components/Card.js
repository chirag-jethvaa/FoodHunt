import React, { Component } from "react";
import {
  Easing,
  Animated,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import Text from "../data/customText";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as firebase from "firebase";

const { height, width } = Dimensions.get("window");
const CARDHEIGHT = height / 3;

class Card extends Component {
  liked = this.props.messData.fav;
  messData = this.props.messData;

  constructor(props) {
    super(props);
    this.state = {
      heartProgress: this.liked
        ? new Animated.Value(1)
        : new Animated.Value(0.27)
    };
  }

  async componentDidMount() {
    // let views = await firebase
    //   .database()
    //   .ref("Owner/" + this.messData.mid + "/views");
    // views.transaction(function(currView) {
    //   console.log("Views", currView);
    //   return currView + 1;
    // });
    // firebase
    //   .database()
    //   .ref("Owner/" + this.messData.mid)
    //   .update({
    //     views: views
    //   });
  }

  onPressHeart = async row => {
    let uid = firebase.auth().currentUser.uid;
    if (row) {
      Animated.timing(this.state.heartProgress, {
        toValue: 0.27,
        duration: 800,
        easing: Easing.linear
      }).start();
      this.liked = false;
      firebase
        .database()
        .ref("Users/" + uid + "/fav/")
        .update({ [this.messData.mid]: false });
    } else {
      Animated.timing(this.state.heartProgress, {
        toValue: 1,
        duration: 800,
        easing: Easing.quad
      }).start();
      this.liked = true;
      firebase
        .database()
        .ref("Users/" + uid + "/fav/")
        .update({ [this.messData.mid]: true });
    }
  };

  render() {
    return (
      <View
        style={{
          width: width - 30,
          height: CARDHEIGHT,
          marginVertical: 10,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 9
          },
          shadowOpacity: 0.5,
          shadowRadius: 12.35,

          elevation: 19
        }}
      >
        {/* <Text>{rowData}</Text> */}
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            // backgroundColor: "red",
            borderRadius: 15
          }}
        >
          <Image
            key={this.messData.profileUrl}
            style={{
              // flex: 1,
              height: "100%",
              width: "100%",
              resizeMode: "cover",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderRadius: 15,
              position: "absolute"
            }}
            source={{
              uri: this.messData.profileUrl
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000040",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15
            }}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                // marginTop: 10,
                // alignItems: "center",
                // justifyContent: "center",
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                flexDirection: "row"
                // backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  padding: 20,
                  flex: 8
                  // justifyContent: "center"
                  // backgroundColor: "red"
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: RFValue(27),
                    color: "white"
                    // fontWeight: "600"
                  }}
                >
                  {this.messData.name}
                </Text>
                <View
                  style={{
                    justifyContent: "flex-end",
                    // backgroundColor: "black",
                    flex: 1
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      color: "white",
                      marginTop: 10
                      // justifyContent: "flex-end"
                      // textAlign: "bottom"
                    }}
                  >
                    {"Lunch  " + this.messData.lunch}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      color: "white"
                      // marginTop: 10
                    }}
                  >
                    {"Dinner  " + this.messData.dinner}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                key={this.messData.name}
                style={{
                  flex: 3,
                  // backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center"
                  // elevation: 11
                }}
                onPress={() => {
                  this.onPressHeart(this.liked);
                }}
              >
                <LottieView
                  key={this.messData.name}
                  style={{
                    height: "65%",
                    width: "65%",
                    // backgroundColor: "#fff",
                    alignSelf: "center",
                    justifyContent: "center"
                  }}
                  // source={require("../assets/Lottie/heart8.json")}
                  source={require("../assets/Lottie/lt1.json")}
                  progress={this.state.heartProgress}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Card;
