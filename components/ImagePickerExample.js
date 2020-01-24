import * as React from 'react';
import { Button, Image, View,FlatList, ActivityIndicator,Text,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class ImagePickerExample extends React.Component {
    state = {
        image: null,
        isLoading: true,
        resultAPI : null,
        imageFormat:null,
        message:'',
        ipServer : 'http://172.16.4.33:5000',
    };


    uploadImage(){
        let data = new FormData();
        let uri = this.state.image;

        data.append('file', {
            uri: this.state.image,
            type: 'image/jpeg', // or photo.type
            name: 'image.'+uri.substr(uri.lastIndexOf('.') + 1)
        });


        fetch(this.state.ipServer+'/file-upload', {
            method: 'post',
            body: data,
        })
            .then((response) => response.json())
            .then((responseJson) => {


            })
            .catch((error) =>{
                console.error(error);
            });
    }

    ConnectAPI(){

        return fetch(this.state.ipServer)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson.movies,
                    message : responseJson.title,
                }, function(){
                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }

    render() {
        //let { image } = this.state;

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Attend la réponse du server</Text>
                        <ActivityIndicator/>
                    </View>
                </View>
            )
        }

        return(
            <View style={{flex: 1, paddingTop:20}}>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        title="Pick an image from camera roll"
                        onPress={this._pickImage}
                    />
                    {this.state.image &&
                    <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
                    <Text/><Text/>
                    <Button
                        title="heure"
                        onPress={this._time}
                    />
                    <Text>{this.state.message}</Text>

                    <Button
                        title="eteindre"
                        onPress={this._Eteindre}
                    />

                </View>
            </View>
        );
    }

    componentDidMount() {
        this.getPermissionAsync();
        this.ConnectAPI();
        console.log('hi');
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _time = async ()=>{
        return fetch(this.state.ipServer+'/heure')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                   // message: responseJson.message,
                }, function(){
                });

            })
            .catch((error) =>{
                console.error(error);
            });
    };

    _Eteindre = async ()=>{
        return fetch(this.state.ipServer+'/eteindre')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                   // message: responseJson.message,
                }, function(){
                });

            })
            .catch((error) =>{
                console.error(error);
            });
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        });


        if (!result.cancelled) {
            this.setState({ image: result.uri,imageFormat:result.type });
            this.uploadImage();
        }
    };
}