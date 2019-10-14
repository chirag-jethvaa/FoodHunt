import {
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  Image
} from "react-native";
import React from "react";
import * as firebase from "firebase";
import LottieView from "lottie-react-native";
import { Button } from "react-native-paper";
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export default class profile extends React.Component {
  constructor() {
    super();
    this.SignOut = this.SignOut.bind(this);
  }

  componentDidMount() {
    // user = firebase.auth().currentUser;
    // console.log(user);
  }
  SignOut = () => {
    // alert("Sign Out");
    console.log("hello");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground
            style={{ flex: 1, backgroundColor: "#cfd8dc" }}
            // source={require("../assets/loginBack.png")}
          >
            <LottieView
              style={{ flex: 1 }}
              source={require("../assets/Lottie/ninja.json")}
              autoPlay={true}
              loop={true}
              speed={1.25}
            />
          </ImageBackground>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>
              {firebase.auth().currentUser.displayName}
            </Text>
            <Button
              // icon="camera"
              color={"red"}
              mode="outlined"
              onPress={() => firebase.auth().signOut()}
            >
              Log Out
            </Button>
          </View>
        </View>
        <Image
          style={styles.image}
          source={{
            uri: firebase.auth().currentUser.photoURL
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 4,
    backgroundColor: "#ecf0f1"
  },

  photo: {
    flex: 1,
    resizeMode: "cover"
  },
  header: {
    //backgroundColor: "#F75728",
    height: (screenHeight * 4) / 10,
    width: screenWidth
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "#5f5f5f",
    marginBottom: 10,
    position: "absolute",
    marginTop: (screenHeight * 4) / 10 - 85,
    marginLeft: (screenWidth * 1) / 10,
    zIndex: 1000
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    position: "absolute",
    marginLeft: screenWidth / 10 - 65
  },
  body: {
    height: (screenHeight * 6) / 10,
    backgroundColor: "white",
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    // elevation: 11,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  bodyContent: {
    paddingVertical: 30,
    marginTop: 40,
    // backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    //marginTop: 150,
    height: 40,
    color: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: (screenHeight * 3) / 10,
    marginLeft: (screenWidth * 4) / 10,
    width: 100
  }
});
