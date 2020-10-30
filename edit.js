import React, { useEffect, useState } from 'react';
import { FlatList, Image, View, Text } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore';
import { Actions } from 'react-native-router-flux'

function Edit({ id }) {
    const ref = Firestore().collection('todos');
    const [todo, setTodo] = useState('');
    const [photoList, setPhotoList] = useState([]);
    const [photoView, setPhotoView] = useState();

    useEffect(() => {
        ref.doc(id).get().then((result) => {
            setTodo(result.data().title)
        })
        return ref.doc(id).collection('photos').onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { title, url } = doc.data();
                list.push({ title, url });
            })
            setPhotoList(list);
        })
    }, []);

    useEffect(() => {
        let photoViewArray = photoList.map((item, key) => {
            return (
                <Image key={'photo' + key} style={{
                    backgroundColor: "#F7F7F7", justifyContent: "center", alignItems: "center",
                    borderRadius: 10, width: 80, height: 80, marginHorizontal: 5, marginVertical: 5,
                    borderWidth: 1, borderColor: "#E0E0E0"
                }} source={{ uri: item.url }} />
            )
        })
        setPhotoView(photoViewArray)
    }, [photoList]);

    function editTodo() {
        ref.doc(id).update({
            title: todo
        }).then(() => {
            Actions.home()
        })
    }

    return (
        <>
            <Appbar>
                <Appbar.Content title={'แก้ไขหัวข้อประชุม'} />
            </Appbar>
            <Text>doc id : {id}</Text>
            <View>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: 'stretch' }}>
                    {photoView}
                </View>
            </View>
            <TextInput label={'ชื่อประชุม'} value={todo} onChangeText={setTodo} />
            <Button onPress={() => editTodo()}>แก้ไข</Button>
        </>
    )
};


export default Edit;