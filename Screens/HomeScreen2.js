import React, { Component } from "react";
import {
  Animated,
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  AsyncStorage,
  ToastAndroid
} from "react-native";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { RFValue } from "react-native-responsive-fontsize";
import { Searchbar } from "react-native-paper";
import LottieView from "lottie-react-native";
import * as firebase from "firebase";
import Modal from "react-native-modal";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

import Card from "../Components/Card";
import Text from "../data/customText";
const { height, width } = Dimensions.get("window");

const SLIDERHEIGHT = (3 * height) / 9;
const SEARCHBARHEIGHT = height / 15 + 5;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      data: [],
      messData: [],
      isModalVisible: false,
      searchQuery: "",
      scrollY: new Animated.Value(0),
      searchResult: [],
      topViews: [],
      isFilterVisible: false,
      isLocationModalVisible: false,
      coords: null,
      isLocationEnabled: false
    };
  }

  calcViews = data => {
    return data.sort((a, b) => {
      if (b.views > a.views) {
        return true;
      } else {
        return false;
      }
    });
  };

  sortDist = data => {
    return data.sort((a, b) => {
      if (b.dist < a.dist) {
        return true;
      } else {
        return false;
      }
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      // this.setState({
      //   errorMessage: "Permission to access location was denied"
      // });
      ToastAndroid.show("Access Denied", ToastAndroid.SHORT);
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ coords: location.coords });
    // console.log(
    //   "Lat",
    //   location.coords.latitude,
    //   "  Long",
    //   location.coords.longitude
    // );
  };

  async componentDidMount() {
    // const res = await fetch(
    //   "https://miro.medium.com/max/5040/0*gQj7ECqJQeTqbW1M.png"
    // );
    // const blob = await res.blob();
    // await firebase
    //   .storage()
    //   .ref()
    //   .child("GJ/name")
    //   .put(blob);
    // URL = await firebase
    //   .storage()
    //   .ref()
    //   .child("GJ/name")
    //   .getDownloadURL();
    // console.log("Done");
    // this.setState({ URL: URL });
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
            te.push({
              name: element.name,
              mid: element.Credentials.mid,
              // mid: element.Credentials.mid,
              lunch: element.time.lunch.open + " - " + element.time.lunch.close,
              dinner:
                element.time.dinner.open + " - " + element.time.dinner.close,
              email: element.Contact.email,
              mobileNo: element.Contact.mobileNo,
              profileUrl: element.profileUrl,
              limited: element.limited,
              address: element.address,
              avgCost: element.avgCost,
              views: element.views,
              fav: fav.includes(element.Credentials.mid) ? true : false,
              coords: element.coords
            });
          }
          // console.log(te);
          let topViews = this.calcViews(te).slice(0, 5);
          // console.log(topViews);
          // this.setState({
          //   messData: ds.cloneWithRows([])
          // });
          // let data = ds.cloneWithRows(te);
          // this._storeData("messData", te);
          await AsyncStorage.setItem("messData", JSON.stringify(te));
          if (this.state.isLocationEnabled === true) {
            this.onPressLocation(true);
            this.setState({
              topViews: topViews,
              isModalVisible: false
            });
          } else {
            this.setState({
              data: te,
              messData: te,
              topViews: topViews,
              isModalVisible: false
            });
          }

          // console.log("MessData ", this.state.messData);
        }.bind(this)
      );
  }

  searchAction = query => {
    let searchResult = this.state.data.filter(item => {
      return item.name.includes(query);
    });
    this.setState({
      messData: searchResult
    });
  };

  calcDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
    }
  }

  onPressLocation = async permit => {
    if (permit === true) {
      await this._getLocationAsync();
      // console.log("From State: ", this.state.coords);
      let newData = [];
      for (k in this.state.messData) {
        let item = this.state.messData[k];
        // console.log(item);
        item["dist"] = this.calcDistance(
          this.state.coords.latitude,
          this.state.coords.longitude,
          item.coords.lat,
          item.coords.lon
        );
        newData.push(item);
      }
      this.sortDist(newData);
      // console.log(newData);
      this.setState({
        messData: newData
      });
    } else if (permit === false) {
      // ToastAndroid.show("Access denied");
    }
    this.setState({ isLocationModalVisible: false });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("MessDetail", { mess: item });
        }}
        activeOpacity={1}
        style={styles.item}
      >
        <ParallaxImage
          source={{ uri: item.profileUrl }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.85}
          {...parallaxProps}
        />
        <View
          style={{
            width: width - 30,
            height: SLIDERHEIGHT,
            backgroundColor: "#00000050",
            position: "absolute",
            justifyContent: "center"
            // alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: RFValue(28), color: "#fff", paddingLeft: 10 }}
          >
            {item.name}
          </Text>
          <View style={{ flexDirection: "row", paddingLeft: 10 }}>
            <LottieView
              style={{
                width: "10%"
              }}
              source={require("../assets/Lottie/eye.json")}
              autoPlay={true}
            />
            <Text
              style={{
                fontSize: RFValue(13),
                color: "#fff",
                alignSelf: "center"
              }}
            >
              {item.views}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    var headMov = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [0, -180, -180]
    });
    var searchMov = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [
        SLIDERHEIGHT + 15,
        StatusBar.currentHeight + 10,
        StatusBar.currentHeight + 10
      ]
    });
    var searchCorner = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [14, 6, 6]
    });
    var searchHeight = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [SEARCHBARHEIGHT, SEARCHBARHEIGHT, SEARCHBARHEIGHT]
    });
    var searchMarginH = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [25, 9, 9]
    });
    var imgOp = this.state.scrollY.interpolate({
      inputRange: [0, 180, 181],
      outputRange: [1, 0, 0]
    });
    var headColor = this.state.scrollY.interpolate({
      inputRange: [80, 100, 180],
      outputRange: ["white", "white", "white"]
    });
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ flex: 1, backgroundColor: "#f5f5f5" }}
          // source={require("../assets/back1.png")}
        >
          {/* List Items */}
          {this.state.isModalVisible ? (
            <View />
          ) : (
            <View style={{}}>
              {/* <ListView
                key={"dcdcd"}
                dataSource={this.state.messData}
                renderRow={this.renderRow.bind(this)}
                renderScrollComponent={this.renderScroll.bind(this)}
              /> */}
              {this.renderScroll()}
            </View>
          )}
          {/* Top Image Slider */}
          <Animated.View
            style={{
              position: "absolute",
              height: SLIDERHEIGHT,
              width: width,
              top: 0,
              zIndex: 0,
              opacity: imgOp,
              paddingTop: StatusBar.currentHeight,
              // backgroundColor: headColor,
              justifyContent: "flex-end",
              flexDirection: "column",
              transform: [{ translateY: headMov }]
            }}
          >
            {this.state.isModalVisible ? (
              <View />
            ) : (
              <Carousel
                sliderWidth={width}
                sliderHeight={width}
                itemWidth={width - 30}
                data={this.state.topViews}
                renderItem={this._renderItem}
                hasParallaxImages={true}
              />
            )}
          </Animated.View>

          {/* Search Bar */}
          <Animated.View
            style={{
              position: "absolute",
              zIndex: 100,
              height: searchHeight,
              width: width,
              // backgroundColor: "white",
              justifyContent: "flex-end",
              flexDirection: "column",
              transform: [{ translateY: searchMov }]
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                flexDirection: "row",
                // backgroundColor: "white",
                justifyContent: "space-around",
                borderRadius: searchCorner,
                margin: 5,
                marginHorizontal: searchMarginH
              }}
            >
              <Searchbar
                style={{ flex: 6 }}
                placeholder="Search"
                onChangeText={query => {
                  this.setState({ searchQuery: query });
                  this.searchAction(query);
                }}
                value={this.state.searchQuery}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    flex: 1,
                    // height: height / 15,
                    // width: height / 15,
                    backgroundColor: "white",
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 5
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                    elevation: 11
                  }}
                  onPress={() => {
                    this.setState({ isLocationModalVisible: true });
                  }}
                >
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={require("../assets/location.png")}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
          <Modal
            isVisible={this.state.isLocationModalVisible}
            backdropColor="#000"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
            onBackButtonPress={() => {
              this.setState({
                isLocationModalVisible: false
              });
            }}
            onDismiss={() => {
              this.setState({
                isLocationModalVisible: false
              });
            }}
            onBackdropPress={() => {
              this.setState({
                isLocationModalVisible: false
              });
            }}
          >
            <View
              style={{
                // height: 400,
                // width: 400,
                backgroundColor: "white",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "rgba(0, 0, 0, 0.1)",
                padding: 15
              }}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                {"Are you sure you want to sort mess by your nearest location?"}
              </Text>
              <View
                style={{
                  width: width - 60,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  // backgroundColor: "yellow",
                  paddingTop: 10,
                  marginTop: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isLocationEnabled: true
                    });
                    this.onPressLocation(true);
                  }}
                  style={{
                    backgroundColor: "#6E3596",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isLocationEnabled: false
                    });
                    this.onPressLocation(false);
                  }}
                  style={{
                    backgroundColor: "#E71949",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
        </ImageBackground>
      </View>
    );
  }
  _handleScroll(e) {
    // console.log(e.nativeEvent.contentOffset.y, "jvjhvhm");
  }

  renderScroll() {
    return (
      <Animated.ScrollView
        // {...props}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: SLIDERHEIGHT + SEARCHBARHEIGHT + height / 20,
          borderTopRightRadius: 50,
          borderTopLeftRadius: 20
          // height: 1000
          // backgroundColor: "red"
        }}
        // Declarative API for animations ->
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: this.state.scrollY }
              }
            }
          ],
          { listener: this._handleScroll.bind(this) },
          {
            useNativeDriver: true
          }
        )}
      >
        {this.state.messData.map((rowData, key) => {
          {
            /* console.log("rowData", rowData); */
          }
          return (
            <TouchableOpacity
              key={rowData.name}
              activeOpacity={1}
              onPress={() => {
                this.props.navigation.navigate("MessDetail", { mess: rowData });
              }}
            >
              <Card liked={false} messData={rowData} key={rowData.name} />
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: width - 30,
    height: SLIDERHEIGHT,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    borderRadius: 8
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    height: 100,
    width: 150,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalFilter: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalContentFilter: {
    height: height / 2,
    width: width - 50,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  loader: {
    flex: 1
  }
});
