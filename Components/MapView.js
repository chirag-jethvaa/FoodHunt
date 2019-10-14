import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapViewC, { Marker } from "react-native-maps";

class MapView extends Component {
  componentDidMount() {
    console.log(this.props.lat);
  }

  render() {
    return (
      // <View style={styles.container}>
      <MapViewC
        style={{ flex: 1 }}
        initialRegion={{
          latitude: this.props.lat,
          longitude: this.props.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        <Marker
          coordinate={{ latitude: this.props.lat, longitude: this.props.lon }}
          title={this.props.name}
        />
      </MapViewC>
      // {/* </View> */}
    );
  }
}
export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
