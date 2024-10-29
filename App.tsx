import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Antarmuka User
interface User {
  id: number;
  first_name: string;
  last_name: string;
  nim: string; // NIM untuk setiap pengguna
  avatar: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fungsi untuk mengambil data pengguna
  const fetchData = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users?per_page=2');
      const formattedUsers = response.data.data.map((user: any) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        nim: user.id.toString(), // Menyusun NIM berdasarkan ID pengguna
        avatar: user.avatar,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.log('Fetch Error:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  // Fungsi untuk menambahkan pengguna baru
const postData = async () => {
  // Definisikan array pengguna baru
  const newUsers = [
    {
      first_name: 'Cha',
      last_name: 'Eun Woo',
      nim: '20220040139',
      avatar: 'https://i.pinimg.com/564x/b2/5e/a0/b25ea09bf9d9939638417b4b77e58df2.jpg',
    },
    {
      first_name: 'Hwang',
      last_name: 'In Yeop',
      nim: '20220040135',
      avatar: 'https://i.pinimg.com/564x/15/a7/11/15a7110aa56ca36b86c6af6e3faf27eb.jpg',
    },
    {
      first_name: 'Lim',
      last_name: 'Jukyung',
      nim: '20220040127',
      avatar: 'https://i.pinimg.com/564x/10/c2/ea/10c2eaac5a0c7a5122ea2c5daf26a593.jpg',
    },
  ];

  try {
    // Mengirim permintaan untuk setiap pengguna baru
    const userPromises = newUsers.map(async (newUser) => {
      const response = await axios.post('https://reqres.in/api/users', {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        avatar: newUser.avatar,
      });
      return { id: response.data.id, ...newUser }; // Kembalikan pengguna baru dengan ID
    });

    const createdUsers = await Promise.all(userPromises); // Tunggu semua permintaan selesai
    setUsers((prevUsers) => [...prevUsers, ...createdUsers]); // Tambahkan pengguna baru ke state

    Alert.alert('Users Created', 'Users successfully added');
  } catch (error) {
    console.log('Post Error:', error);
    Alert.alert('Error', 'Failed to add users');
  }
};


  // Fungsi untuk memperbarui data pengguna
  const updateData = async (id: number) => {
    try {
      const updatedUser = {
        first_name: 'Park',
        last_name: 'Yoona',
        nim: '20220040123',
        avatar: 'https://i.pinimg.com/564x/c3/74/81/c37481d37975a832f02d8cecf6c58c20.jpg',
      };

      await axios.put(`https://reqres.in/api/users/${id}`, {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        avatar: updatedUser.avatar,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );

      Alert.alert('User Updated', `User ID: ${id} successfully updated`);
    } catch (error) {
      console.log('Update Error:', error);
      Alert.alert('Error', `Failed to update user ID: ${id}`);
    }
  };

  // Fungsi untuk menghapus pengguna
  const deleteData = async (id: number) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      Alert.alert('User Deleted', `User ID: ${id} successfully deleted`);
    } catch (error) {
      console.log('Delete Error:', error);
      Alert.alert('Error', `Failed to delete user ID: ${id}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk merender setiap item pengguna
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.nim}>{item.nim}</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={() => updateData(item.id)}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>API from Reqres.in - Riska</Text>
            <TouchableOpacity style={styles.createButton} onPress={postData}>
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff', // Latar belakang putih
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#800000', // Warna maroon untuk header
  },
  createButton: {
    backgroundColor: '#800000', // Warna maroon untuk tombol
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 125,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  nim: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  university: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#ffa726',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 5,
  },
});