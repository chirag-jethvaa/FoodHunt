import React, { Component } from "react";
import * as firebase from "firebase";

import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
// import reviewScreen from "./reviewScreen.js";
// import { createStackNavigator } from "react-navigation-stack";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";
import { TextField } from "react-native-material-textfield";
import MapView from "../Components/MapView";
import Text from "../data/customText";
var varCurrentRating;

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const HEADER_MAX_HEIGHT = screenHeight / 3;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = 140;
export default class MessDetail extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: true,
      Default_Rating: 2,
      Max_Rating: 5,
      children: [],
      messOwner: [],
      user: [],
      activeItemIndex: 0,
      unlimted: true,
      limited: false,
      rating_mess: 0,
      total_users: 0,
      current_rating: 0,
      NUser: 0,
      views: 0,
      scrollY: new Animated.Value(0),
      showMenu: false,
      image: "",
      isLoading: true,
      reviewText: "",
      reviews: []
    };
    this.Star =
      "http://aboutreact.com/wp-content/uploads/2018/08/star_filled.png";

    this.Star_With_Border =
      "http://aboutreact.com/wp-content/uploads/2018/08/star_corner.png";
  }

  async componentDidMount() {
    this.getReviews();
    this.onSubmitReview = this.onSubmitReview.bind(this);

    const { navigation } = this.props;
    let data = navigation.getParam("mess");

    this.setState({
      views: data.views
    });

    let views = await firebase.database().ref("Owner/" + data.mid + "/views");
    views.transaction(function(currView) {
      // console.log("Views", currView);
      return currView + 1;
    });
    views.on("value", snapshotV => {
      let snap = JSON.stringify(snapshotV);
      let views = JSON.parse(snap);
      this.setState({
        views: views
      });
    });

    // console.log(data);
    firebase
      .database()
      .ref("Menu/" + data.mid + "/")
      .on(
        "value",
        async function(snapshot) {
          let snap = JSON.stringify(snapshot);
          data_mess = JSON.parse(snap);
          // console.log("Data messs", data_mess);
          var te = [];
          // console.log("TE", te);
          for (const dinn_lun in data_mess) {
            const name = dinn_lun;
            const element = data_mess[dinn_lun];
            // console.log("Image element", element);
            for (const imageUrl in element) {
              te.push({
                time: name,
                imageUrl: element[imageUrl]
              });
            }
          }
          this.setState({
            messOwner: te,
            isLoading: false
          });
          // console.log(te.length === 0);
        }.bind(this)
      );
    firebase
      .database()
      .ref("Rating/" + data.mid + "/" + "Users/")
      .on(
        "value",
        async function(snapshot) {
          this.setState({
            total_users: snapshot.numChildren()
          });
        }.bind(this)
      );

    firebase
      .database()
      .ref("Rating/" + data.mid + "/")
      .on("value", snapshot => {
        let rating_data_mess = JSON.parse(JSON.stringify(snapshot));
        this.setState({
          current_rating: rating_data_mess["rating"],
          NUser: rating_data_mess["count"]
        });
      })
      .bind(this);
  }
  static navigationOptions = {
    header: null
  };

  getReviews = () => {
    const { navigation } = this.props;
    let data = navigation.getParam("mess");
    firebase
      .database()
      .ref("Review/" + data.mid + "/")
      .on("value", snapshot => {
        let snap = JSON.stringify(snapshot);
        let reviews = JSON.parse(snap);
        let item = [];
        for (k in reviews) {
          item.push(reviews[k]);
        }
        // console.log(item);
        this.setState({
          reviews: item
        });
      });
  };

  UpdateRating(key) {
    const { navigation } = this.props;
    let data = navigation.getParam("mess");
    this.setState({ Default_Rating: key });
    console.log(key);
    firebase
      .database()
      .ref(
        "Rating/" + data.mid + "/Users/" + firebase.auth().currentUser.uid + "/"
      )
      .set({
        rated: key
      });
  }

  // rev = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  rev = [1];

  renderInner = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Reviews</Text>
      {this.state.reviews.map((item, key) => {
        return (
          <View
            key={key}
            style={{
              width: "100%",
              backgroundColor: "black",
              margin: 10,
              borderRadius: 10,
              padding: 20
            }}
          >
            <Text style={{ fontSize: 18, color: "white" }}>{item.name}</Text>
            <Text style={{ marginTop: 5, fontSize: 12, color: "white" }}>
              {item.time}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "white",
                marginLeft: 10,
                marginTop: 5
              }}
            >
              {item.review}
            </Text>
          </View>
        );
      })}
    </View>
  );

  onSubmitReview() {
    console.log("Hello");
    const { navigation } = this.props;
    let data = navigation.getParam("mess");
    firebase
      .database()
      .ref("Review/" + data.mid + "/" + firebase.auth().currentUser.uid + "/")
      .set({
        time: "Blah",
        name: firebase.auth().currentUser.displayName,
        review: this.state.reviewText
      });
  }

  renderInnerReview = () => (
    // <KeyboardAvoidingView>
    <View key={"Rev"} style={styles.panel2}>
      <Text style={styles.panelTitle}>Give your Review</Text>
      <TextField
        label="Write upto 200 words"
        value={this.state.reviewText}
        onChangeText={reviewText => this.setState({ reviewText })}
        maxLength={200}
        multiline={true}
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          key={"Submit"}
          activeOpacity={0.5}
          style={{
            width: screenWidth / 1.5,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#007aff",
            borderRadius: 5,
            margin: 10,
            marginBottom: 25
          }}
          onPress={this.onSubmitReview.bind(this)}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </KeyboardAvoidingView>
  );

  renderHeader = () => (
    <View style={styles.bHeader}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();
  bsReview = React.createRef();

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: "clamp"
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
      extrapolate: "clamp"
    });

    const { navigation } = this.props;
    let data = navigation.getParam("mess");
    //console.log(data);

    let React_Native_Rating_Bar = [];
    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity
          activeOpacity={0.7}
          key={i}
          onPress={this.UpdateRating.bind(this, i)}
        >
          <Image
            style={styles.StarImage}
            source={
              i <= this.state.Default_Rating
                ? { uri: this.Star }
                : { uri: this.Star_With_Border }
            }
          />
        </TouchableOpacity>
      );
    }

    //console.log(userId);
    firebase
      .database()
      .ref("Rating/" + data.mid + "/")
      .update({
        count: this.state.total_users
      });
    // console.log("Main current rating: " + this.state.current_rating);
    // console.log("Current user: " + this.state.NUser);
    return (
      <View style={styles.safeArea}>
        <SafeAreaView>
          <ScrollView
            style={styles.scrollview}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
            ])}
          >
            {/* <View style={styles.top}></View> */}
            {/* <View style={styles.messImage}>
              <Image
                style={styles.messImage1}
                source={{
                  uri: data.profileUrl
                }}
              />
            </View> */}

            <View style={styles.scrollViewContent}>
              {/* <View style={styles.extra} /> */}
              <View style={styles.mainDetails}>
                <View style={styles.mainDetails1}>
                  <Text style={styles.smallDetails}>
                    {"Lunch  " + data.lunch}
                  </Text>
                  <Text style={styles.smallDetails}>
                    {"Dinner  " + data.dinner}
                  </Text>
                </View>

                <View style={styles.rating}>
                  <View style={styles.subrat}>
                    <Image
                      source={require("../assets/star.png")}
                      style={{ height: 30, width: 30 }}
                    />
                    <Text
                      style={{
                        color: "#FF4E00",
                        // fontWeight: "bold",
                        fontSize: 18
                      }}
                    >
                      {this.state.current_rating}
                    </Text>
                  </View>
                  <View style={styles.subrat}>
                    <Image
                      source={require("../assets/eye.png")}
                      style={{ height: 30, width: 30 }}
                    />
                    <Text
                      style={{
                        color: "#FF4E00",
                        // fontWeight: "bold",
                        // textStyle: "italic"
                        fontSize: 18
                      }}
                    >
                      {this.state.views}
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View>
                <Text style={styles.title}>Menu</Text>
              </View> */}
              {/* <Card title="MENU ITEMS"> */}
              {/* <View style={{ flex: 1 }}> */}
              {this.state.isLoading ? (
                <View
                  style={{
                    // position: "absolute",
                    // backgroundColor: "red",
                    height: screenHeight / 2,
                    width: screenWidth,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <LottieView
                    // style={{ height: 100, width: 100 }}
                    source={require("../assets/Lottie/loading.json")}
                    autoPlay={true}
                    loop={true}
                    speed={1.5}
                  />
                </View>
              ) : (
                <View>
                  {this.state.messOwner.length === 0 ? (
                    <View
                      style={{
                        height: screenHeight / 2,
                        width: screenWidth,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        source={require("../assets/wentWrong.png")}
                        style={{ flex: 10, resizeMode: "contain" }}
                      />
                      <Text style={{ flex: 1, fontSize: 25 }}>
                        {"Menu is not updated by the owner!"}
                      </Text>
                    </View>
                  ) : (
                    this.state.messOwner.map((u, i) => {
                      {
                        /* console.log(this.state.messOwner); */
                      }
                      return (
                        <View style={{ flex: 1, flexDirection: "column" }}>
                          <Text style={{ textAlign: "center", fontSize: 20 }}>
                            {u.time}
                          </Text>
                          <TouchableOpacity
                            style={{
                              height: screenHeight / 2,
                              width: screenWidth
                            }}
                            onPress={() => {
                              this.setState({
                                showMenu: true,
                                image: u.imageUrl
                              });
                            }}
                            activeOpacity={1}
                          >
                            <Image
                              style={{
                                height: screenHeight / 2,
                                width: screenWidth,
                                resizeMode: "contain"
                              }}
                              source={{ uri: u.imageUrl }}
                              // onLoad={()=>{this.setState({isImageLoading: false})}}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
              {/* </View> */}
              {/* </Card> */}

              <View style={{ marginTop: 20 }}>
                <Text
                  style={{ fontSize: 25, color: "#000", textAlign: "center" }}
                >
                  Rate Us
                </Text>
                <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                <Text style={styles.textStyle}>
                  {this.state.Default_Rating} / {this.state.Max_Rating}
                </Text>
                {/* <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => {
                    firebase
                      .database()
                      .ref(
                        "Rating/" +
                          data.mid +
                          "/" +
                          "Users/" +
                          firebase.auth().currentUser.uid +
                          "/"
                      )
                      .update({
                        rated: this.state.Default_Rating
                      });
                    firebase
                      .database()
                      .ref("Rating/" + data.mid + "/")
                      .on("value", snapshot => {
                        // console.log("Rated rating: " + this.state.Default_Rating);
                        // console.log("Current Users: " + this.state.NUser);

                        varCurrentRating =
                          (this.state.current_rating * this.state.NUser +
                            this.state.Default_Rating) /
                          (this.state.NUser + 1);
                        varCurrentRating = varCurrentRating.toFixed(1);
                        // console.log(
                        //   "After Updation of Rating: " + varCurrentRating
                        // );
                      })
                      .bind(this);
                    firebase
                      .database()
                      .ref("Rating/" + data.mid)
                      .update({
                        rating: varCurrentRating
                      });
                  }}
                >
                  <Text>{this.state.Default_Rating}</Text>
                </TouchableOpacity> */}
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={styles.title}>Review</Text> */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    width: screenWidth / 1.5,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#007aff",
                    borderRadius: 5,
                    margin: 10
                    // marginBottom: 25
                  }}
                  // onPress={() => this.props.navigation.navigate("reviewScreen")}
                  onPress={() => this.bsReview.current.snapTo(1)}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    Write a Review
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={styles.title}>Review</Text> */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    width: screenWidth / 1.5,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#007aff",
                    borderRadius: 5,
                    margin: 10,
                    marginBottom: 25
                  }}
                  // onPress={() => this.props.navigation.navigate("reviewScreen")}
                  onPress={() => this.bs.current.snapTo(1)}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    See all reviews
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 400,
                  width: screenWidth,
                  padding: 20,
                  borderRadius: 4,
                  backgroundColor: "white",
                  // justifyContent: "center",
                  // alignItems: "center"
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
                <MapView
                  lat={data.coords.lat}
                  lon={data.coords.lon}
                  name={data.name}
                />
              </View>
            </View>
          </ScrollView>
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.Image
              style={[
                styles.backgroundImage,
                {
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }]
                }
              ]}
              source={{ uri: data.profileUrl }}
            />
            <View style={styles.bar}>
              <Animated.View
                style={{
                  position: "absolute",
                  // backgroundColor: "blue",
                  backgroundColor: "#0007",
                  height: 60,
                  width: screenWidth,
                  opacity: imageOpacity
                }}
              />
              <Text style={styles.title}>{data.name}</Text>
            </View>
          </Animated.View>
          {/* {this.state.showMenu ? ( */}
          <Modal
            isVisible={this.state.showMenu}
            backdropColor="#000"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            style={styles.modalFilter}
            onBackButtonPress={() => {
              this.setState({
                showMenu: false
              });
            }}
            onDismiss={() => {
              this.setState({
                showMenu: false
              });
            }}
            onBackdropPress={() => {
              this.setState({
                showMenu: false
              });
            }}
          >
            <View
              style={{
                height: screenHeight / 1.4,
                width: screenWidth - 40,
                backgroundColor: "white",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  height: "90%",
                  width: "90%",
                  resizeMode: "contain"
                }}
                source={{ uri: this.state.image }}
              />
            </View>
          </Modal>
          <BottomSheet
            key={"ShowReview"}
            ref={this.bs}
            snapPoints={[
              0,
              screenHeight / 2
              // screenHeight - StatusBar.currentHeight
            ]}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            initialSnap={0}
          />
          {/* <KeyboardAvoidingView> */}
          <BottomSheet
            key={"GiveReview"}
            ref={this.bsReview}
            snapPoints={[
              0,
              screenHeight / 1.4
              // screenHeight - StatusBar.currentHeight
            ]}
            renderContent={this.renderInnerReview}
            renderHeader={this.renderHeader}
            initialSnap={0}
          />
          {/* </KeyboardAvoidingView> */}
          {/* ) : (
            <View />
          )} */}
        </SafeAreaView>
      </View>
    );
  }
}
//  createStackNavigator(
//   {
//     mess: MessDetail,
//     // reviewScreen: reviewScreen
//   },
//   {
//     initialRouteName: "mess"
//   }
// );

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  scrollview: {
    // backgroundColor: "white"
  },
  top: {
    height: screenHeight / 3,
    width: Dimensions.width,
    backgroundColor: "#FF4E00",
    zIndex: 0
  },
  subtop: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  messImage: {
    height: screenHeight / 3,
    width: screenHeight / 3,
    alignSelf: "center",
    backgroundColor: "#000000",
    zIndex: 1,
    position: "absolute",
    borderRadius: 30,
    marginTop: screenHeight / 8
  },
  messImage1: {
    height: screenHeight / 3,
    width: screenHeight / 3,
    borderRadius: 30
  },
  extra: {
    paddingTop: screenHeight / 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: screenHeight / 6,
    marginTop: -30,
    backgroundColor: "white",
    width: Dimensions.width,
    position: "relative"
  },
  mainDetails: {
    width: screenWidth,
    height: screenHeight / 6
  },
  messName: {
    fontSize: 24,
    marginLeft: 10,
    color: "#FF4E00",
    fontWeight: "bold"
  },
  smallDetails: {
    // marginLeft: 10,
    textAlign: "center",
    fontSize: 20
  },
  subhead: {
    fontSize: 18,
    fontWeight: "500"
  },
  mainDetails1: {
    height: screenHeight / 12
  },

  rating: {
    flexDirection: "row"
  },
  subrat: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth / 2,
    borderWidth: 1,
    fontWeight: "bold",
    borderLeftColor: "white",
    borderBottomColor: "white",
    borderTopColor: "white",
    height: screenHeight / 12
  },
  menu: {
    backgroundColor: "#FFAC81",
    margin: 5,
    borderRadius: 20
  },
  item: {
    fontSize: 14,
    margin: 10
  },
  childView: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 0
  },
  button: {
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "white"
  },
  StarImage: {
    width: 40,
    height: 40,
    resizeMode: "cover"
  },
  textStyle: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    marginTop: 15
  },
  textStyleSmall: {
    textAlign: "center",
    fontSize: 12,
    color: "#000"
  },
  question: {
    alignSelf: "flex-start"
  },
  answer: {
    alignSelf: "flex-end"
  },
  extraDetails: {
    flexDirection: "row",
    flex: 2
  },
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    opacity: 0.1,
    marginLeft: 10,
    marginRight: 10
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FF4E00",
    overflow: "hidden"
    // height: HEADER_MAX_HEIGHT
  },
  bar: {
    // marginTop: 12,
    height: 60,
    alignItems: "center",
    justifyContent: "center"
    // opacity: 0
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 25,
    textAlign: "center"
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover"
  },
  modalFilter: {
    justifyContent: "center",
    alignItems: "center",
    // height: screenHeight / 2,
    // width: screenWidth - 50,
    borderRadius: 15
    // backgroundColor: "white"
  },
  // modalContentFilter: {
  //   height: screenHeight - 50,
  //   width: screenWidth - 50,
  //   backgroundColor: "white",
  //   borderRadius: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderColor: "rgba(0, 0, 0, 0.1)"
  // }
  panelContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    // flex: 1,
    // height: "100%",
    minHeight: screenHeight / 2,
    // height: screenHeight / 3,
    // minHeight: screenHeight / 2,
    padding: 20,
    backgroundColor: "#f7f5eee8"
  },
  panel2: {
    minHeight: screenHeight / 1.4,
    padding: 20,
    backgroundColor: "#f7f5eee8"
  },
  bHeader: {
    backgroundColor: "#f7f5eee8",
    shadowColor: "#000000",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHeader: {
    alignItems: "center"
  },
  panelHandle: {
    width: 25,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#00000090",
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#318bfb",
    alignItems: "center",
    marginVertical: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white"
  },
  photo: {
    width: "100%",
    height: 225,
    marginTop: 30
  }
});
