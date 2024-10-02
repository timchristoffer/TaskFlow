import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView, ViewComponent } from 'react-native';
import axios from 'axios';

const DashboardView = ({ route }) => {
    const { id } = route.params;
    const { name } = route.params;
    const [notepads, setNotepads] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get(`http://192.168.10.230:5000/notepads`, { params: { dashboardId: id } })
                .then(response => {
                    setNotepads(response.data);
                })
                .catch(error => {
                    console.error('Error fetching notepads:', error);
                });
        }
    }, [id]);

    
    const notepadElements = notepads.map(n => (
        <View style={styles.notepadContainer}>
            <Text style={styles.notepadTitle}>{n.name}</Text>
            {n.notes.map(n => (
                <Text style={styles.note}>{n.text}</Text>
            ))}
        </View>
    ))

  return (
    <ScrollView style={styles.dashboardContainer}>
        <View style={styles.titelContainer}>
            <Text style={styles.dashboardTitel}>Dashboard: {name}</Text>
            <Text>DashboardId: {id}</Text>
        </View>
        {notepadElements}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    dashboardContent: {
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1,
        flex: 1,
        padding: 20,
    },
    notepadContainer: {
        flex: 1,
        alignItems: "center",
        marginLeft: 0,
        padding: 20,
    },
    notepadTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dashboardTitel: {
        padding: 3,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'blue',

    },
    titelContainer: {
        flex: 1,
        alignItems: "center",
        padding: 4,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    note: {
        padding: 1,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        color: 'black',
    },
});

export default DashboardView