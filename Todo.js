import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { List } from 'react-native-paper';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux'

function Todo({ id, title, complete }) {
    async function toggleComplete() {
        await firestore()
        .collection('todos')
        .doc(id)
        .update({
            complete: !complete,
        });
    }

    function deleteTodo(id) {
        Alert.alert(
            'คำเตือน!!!', 
            'ท่านต้องการลบหัวข้อประชุมนี้ใช่หรือไม่?', 
            [
                {text: 'ยกเลิก'},
                {
                    text: 'ตกลง',
                    onPress: async () => {
                        await firestore()
                            .collection('todos')
                            .doc(id).delete()
                    }
                },
            ]
        )
    }

    function gotoEdit(id) {
      Actions.edit({
        id: id
      })
    }

  return (
    <List.Item
      title={title}
      onPress={() => gotoEdit(id)}
      onLongPress={() => deleteTodo(id)}
      left={props => (
        <List.Icon {...props} icon={complete ? 'check' : 'cancel'} />
      )}
    />
  );
}

export default React.memo(Todo);