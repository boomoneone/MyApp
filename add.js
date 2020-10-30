import React, { useEffect, useState } from "react";
import { Alert, View, TouchableOpacity, Image, Text } from "react-native";
import { Appbar, TextInput, Button } from "react-native-paper";
import Firestore from "@react-native-firebase/firestore";
import Storage from "@react-native-firebase/storage"
import { Actions } from "react-native-router-flux"
import IconAwesome from "react-native-vector-icons/FontAwesome5"
import ImagePicker from "react-native-image-picker"
import RNFS from "react-native-fs"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment"
import { FlatList } from "react-native-gesture-handler";


function Add() {
  const ref = Firestore().collection("todos");
  const [todo, setTodo] = useState("");
  const [photoList, setPhotoList] = useState([]);
  const [photoView, setPhotoView] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelected, setDateSelected] = useState("");
  const [datetimeFirestore, setDatetimeFirestore] = useState()

  useEffect(() => {
  })

  useEffect(() => {
    let photoViewArray = photoList.map((item, key) => {
      return (
        <TouchableOpacity key={'photo' + key} onLongPress={() => {warningDelete(key)}} >
          <Image style={{
            backgroundColor: "#F7F7F7", justifyContent: "center", alignItems: "center",
            borderRadius: 10, width: 80, height: 80, marginHorizontal: 5, marginVertical: 5,
            borderWidth: 1, borderColor: "#E0E0E0"
          }} source={{ uri: item.uri }} />
        </TouchableOpacity>
      )
    })
    setPhotoView(photoViewArray)
  }, [photoList]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker1 = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility(false);
  };

  function handleConfirm(date) {
    setDateSelected(moment(date).format("DD/MM/YYYY HH:mm"))
    setDatetimeFirestore(Firestore.Timestamp.fromDate(date))
    hideDatePicker();
  };

  function handleConfirm1(date) {
    setDateSelected(moment(date).format("DD/MM/YYYY HH:mm"))
    setDatetimeFirestore(Firestore.Timestamp.fromDate(date))
    hideDatePicker();
  };

  


  async function addTodo() {
    if (todo == "") {
      await Alert.alert(
        "คำเตือน!!!",
        "กรุณาพิมพ์ชื่อหัวข้อประชุมด้วย",
        [{ text: "ตกลง" }]
      )
    } else {
      await ref.add({
        title: todo,
        complete: false,
      }).then((docRef) => {
        photoList.map((item, key) => {
          uploadImage(docRef.id, key, item.uri.toString())
        })
      }).then(() => {
        Actions.home()
      })
    }
  }

  function handleChoosePhoto() {
    const options = {
      title: 'เลือกรูป',
    }
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        setPhotoList([...photoList, { uri: response.uri }])
      }
    })
  }

  async function warningDelete(key) {
    Alert.alert(
      'คำเตือน!!!',
      'คุณต้องการที่จะลบรูปภาพหรือไม่?',
      [
        {
          text: 'ลบ',
          onPress: () => {
            const photoArray = photoList
            photoArray.splice(key, 1)
            setPhotoList([...photoArray])
          }
        },
        {
          text: 'ยกเลิก',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  }

  async function uploadImage(docId, index, uri, mime = 'image/jpg') {
    const imageRef = Storage().ref('photos/' + docId + '/').child('image' + index.toString() + '.jpg')
    const data = await RNFS.readFile(uri, 'base64')
    await imageRef.putString(data, 'base64')
    .then(() => { return imageRef.getDownloadURL() })
    .then((url) => {
      ref.doc(docId).collection('photos').add({
        title: 'image' + index.toString() + '.jpg',
        url: url
      })
    })
  }

  return (
    <>
      <Appbar>
        <Appbar.Content title={"เพิ่มหัวข้อประชุม"} />
      </Appbar>
      <TextInput label={"ชื่อ"} value={todo} onChangeText={setTodo} />
      <View>
        <Text style={{ padding: 10, fontWeight: "bold" }}>เลือกวัน-เวลาเริ่มต้น</Text>
      </View>
      <Text style={{ padding: 10 }}>{dateSelected}</Text>
      <View>
        <Button onPress={showDatePicker} >คลิ๊กเพื่อเลือกวัน-เวลาเริ่มต้น</Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
         <View>
        <Text style={{ padding: 10, fontWeight: "bold" }}>เลือกวัน-เวลาสิ้นสุด</Text>
      </View>
      <Text style={{ padding: 10 }}>{dateSelected}</Text>
        <Button onPress={showDatePicker1} >คลิ๊กเพื่อเลือกวัน-เวลาสิ้นสุด</Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm1}
          onCancel={hideDatePicker1}
        />
      </View>
      <View>
        <Text style={{ padding: 10, fontWeight: "bold" }}>เลือกรูปภาพ</Text>
      </View>
      <View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" }}>
          {photoView}
          {(photoList.length < 5) ?
            <View style={{
              backgroundColor: "#FDFDFD", justifyContent: "center", alignItems: "center",
              borderRadius: 10, width: 80, height: 80, marginHorizontal: 5, marginVertical: 5,
              borderWidth: 1, borderColor: "#E0E0E0"
            }}>
              <TouchableOpacity onPress={handleChoosePhoto}>
                <IconAwesome name="plus-circle" size={40} backgroundColor="#FFFFFF" color="#FF0000" />
              </TouchableOpacity>
            </View> : null
          }
        </View>
      </View>
      <FlatList></FlatList>
      <Button style={{backgroundColor: "#00CC00"}} onPress={() => addTodo()}>สร้างหัวข้อประชุม</Button>
    </>
  )
};

export default Add;