import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MobileMenu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <View style={styles.iconContainer}>
          <Image source={require('../../assets/Icons/home.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dashboards')}>
        <View style={styles.iconContainer}>
          <Image source={require('../../assets/Icons/chalkboard.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
        <View style={styles.iconContainer}>
          <Image source={require('../../assets/Icons/profile.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Logout')}>
        <View style={styles.iconContainer}>
          <Image source={require('../../assets/Icons/logout.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555', // Background color for the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
});

export default MobileMenu;