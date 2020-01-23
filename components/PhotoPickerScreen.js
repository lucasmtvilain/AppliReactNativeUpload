import React, { Component } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {View, Text, StyleSheet, Dimensions, Button, Image } from "react-native";

export default class PhotoPickerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            image: null,
        }
    }
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === "granted" });
    }

    _getPhotoLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.activeImageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ flex: 1 }} />
                    ) : (
                        <View />
                    )}
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Button
                        onPress={this._getPhotoLibrary.bind(this)}
                        title="Photo Picker Screen!"
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    activeImageContainer: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 2,
        backgroundColor: "#eee",
        borderBottomWidth: 0.5,
        borderColor: "#fff"
    },
});
