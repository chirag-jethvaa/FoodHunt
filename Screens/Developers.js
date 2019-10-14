import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Text from "../data/customText";
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = height / 5;
const CARD_WIDTH = width - 20;

class Developers extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          name: "Harsh Jobanputra",
          photo:
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2Fharsh.jpg?alt=media&token=a689c3dd-0864-4d08-897b-0d7a7f705716",
          web: "",
          insta: "",
          linkedin: ""
        },
        {
          name: "Karan Kathiriya",
          photo: "",
          web: "",
          insta: "",
          linkedin: ""
        },
        {
          name: "Manan Gadhiya",
          photo: "",
          web: "",
          insta: "",
          linkedin: ""
        },
        {
          name: "Vidhya Kothadiya",
          photo: "",
          web: "",
          insta: "",
          linkedin: ""
        },
        {
          name: "Chirag Jethva",
          photo: "",
          web: "",
          insta: "",
          linkedin: ""
        },
        {
          name: "Riya Intwala",
          photo: "",
          web: "",
          insta: "",
          linkedin: ""
        }
      ]
    };
  }

  _renderCard = (name, url) => {
    return (
      <View
        style={{
          marginTop: 40,
          backgroundColor: "#1f2c48",
          flexDirection: "row",
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 11
        }}
      >
        <Image
          style={{
            height: CARD_HEIGHT,
            width: (2 * CARD_WIDTH) / 5,
            // marginRight: -20,
            // borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            // borderTopRightRadius: 20,
            borderTopLeftRadius: 20
            // resizeMode: "contain"
          }}
          source={{
            uri: url
          }}
        />
        <View
          style={{
            height: CARD_HEIGHT,
            width: (3 * CARD_WIDTH) / 5,
            borderTopRightRadius: 20,
            // borderBottomLeftRadius: 20,
            // borderTopLeftRadius: 20,
            backgroundColor: "#1f2c48"
            // backgroundColor: "white",
            // marginLeft: -20,
          }}
        >
          {/* Name */}
          <View
            style={{
              // backgroundColor: "red",
              flex: 1
              // textAlignVertical: "center"
              // alignItems: "center"
              // justifyContent: "center"
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginLeft: 20,
                marginTop: 20
                // textAlign: "center"
              }}
            >
              {name + ""}
            </Text>
          </View>
          {/* ButtonContainer */}
          <View
            style={{
              flex: 1,
              flexDirection: "row"
              // backgroundColor: "yellow"
              // justifyContent: "space-between",
              // alignItems: "center",
              // padding: 10
            }}
          >
            {/* Btn1 */}
            <TouchableOpacity style={{ flex: 1, margin: 15 }}>
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  resizeMode: "contain"
                }}
                source={require("../assets/domain.png")}
              ></Image>
            </TouchableOpacity>
            {/* Btn2 */}
            <TouchableOpacity style={{ flex: 1, margin: 15 }}>
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  resizeMode: "contain"
                }}
                source={require("../assets/instagram.png")}
              ></Image>
            </TouchableOpacity>
            {/* Btn3 */}
            <TouchableOpacity style={{ flex: 1, margin: 15 }}>
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  resizeMode: "contain"
                }}
                source={require("../assets/linkedin.png")}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            // flex: 1,
            paddingTop: StatusBar.currentHeight + 20,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20
          }}
        >
          {this._renderCard(
            "Harsh Jobanputra",
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2Fharsh.jpg?alt=media&token=a689c3dd-0864-4d08-897b-0d7a7f705716"
          )}
          {this._renderCard(
            "Karan Kathiriya",
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2FIMG_20191011_100339.jpeg?alt=media&token=f5777f85-577f-447d-b05a-7764d98ff88f"
          )}
          {this._renderCard(
            "Manan Gadhiya",
            "https://avatarfiles.alphacoders.com/121/121391.jpg"
          )}
          {this._renderCard(
            "Vidhya Kothadiya",
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2FIMG_20191011_100836.jpeg?alt=media&token=6d39676e-6952-4e94-8dd4-b18f11e63988"
          )}
          {this._renderCard(
            "Chirag Jethva",
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2FLRM_EXPORT_3886907778721_20191006_203336756.jpeg?alt=media&token=74901ecd-5bde-40c9-9c43-b58d49f41d43"
          )}
          {this._renderCard(
            "Riya Intwala",
            "https://firebasestorage.googleapis.com/v0/b/foodhunt-3c6a4.appspot.com/o/profile%2FIMG_20190417_160840.jpeg?alt=media&token=5294dd92-f3a0-471b-ad55-3c0fd40745e9"
          )}
        </ScrollView>
      </View>
    );
  }
}
export default Developers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  title: {
    flex: 1,
    color: "#fff",
    fontSize: 25,
    textAlign: "center",
    textAlignVertical: "center"
  }
});
