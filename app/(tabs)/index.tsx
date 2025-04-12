import { StyleSheet, Alert, View, Text, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ-vlarpblZVVFwZ0GI-KOcfEHE6AFPBc",
  authDomain: "du-an-1-cb743.firebaseapp.com",
  projectId: "du-an-1-cb743",
  storageBucket: "du-an-1-cb743.firebasestorage.app",
  messagingSenderId: "966478519365",
  appId: "1:966478519365:web:5322cd820bfb4d0d10972c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function HomeScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState({ email: '', password: '' });

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [initializing]);

  const onSignUpWithPassword = () => {
    if (!userInput.email || !userInput.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    createUserWithEmailAndPassword(auth, userInput.email, userInput.password)
      .then(() => {
        Alert.alert('Thành công', 'Tài khoản đã được tạo và đăng nhập');
        setUserInput({ email: '', password: '' });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Lỗi', 'Email đã tồn tại');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Lỗi', 'Email không hợp lệ');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
        } else {
          Alert.alert('Lỗi', error.message);
        }
        console.error(error);
      });
  };

  const onSignInWithPassword = () => {
    if (!userInput.email || !userInput.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    signInWithEmailAndPassword(auth, userInput.email, userInput.password)
      .then(() => {
        Alert.alert('Thành công', 'Đăng nhập thành công');
        setUserInput({ email: '', password: '' });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Lỗi', 'Email không hợp lệ');
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng');
        } else {
          Alert.alert('Lỗi', error.message);
        }
        console.error(error);
      });
  };

  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        setUserInput({ email: '', password: '' });
      })
      .catch(error => {
        Alert.alert('Lỗi', error.message);
      });
  };

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userInput.email}
          onChangeText={(text) => setUserInput({ ...userInput, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={userInput.password}
          secureTextEntry
          onChangeText={(text) => setUserInput({ ...userInput, password: text })}
          autoCapitalize="none"
        />
        <Pressable onPress={onSignInWithPassword} style={styles.btn}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </Pressable>
        <Pressable onPress={onSignUpWithPassword} style={styles.btn}>
          <Text style={styles.btnText}>Đăng ký</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Xin chào {user?.email}</Text>
      <Pressable onPress={onSignOut} style={styles.btn}>
        <Text style={styles.btnText}>Đăng xuất</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hello: {
    fontSize: 20,
    marginBottom: 20,
  }
});
