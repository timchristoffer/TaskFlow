import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import MobileMenu from '../../components/Menu/MobileMenu';

const DashboardView = ({ route }) => {
    const { id, name } = route.params;
    const [notepads, setNotepads] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get(`http://192.168.0.15:5000/notepads`, { params: { dashboardId: id } })
                .then(response => {
                    setNotepads(response.data);
                })
                .catch(error => {
                    console.error('Error fetching notepads:', error);
                });
        }
    }, [id]);

    const notepadElements = notepads.map(n => (
        <View key={n.id} style={styles.notepadContainer}>
            <Text style={styles.notepadTitle}>{n.name}</Text>
            {n.notes.map(note => (
                <Text key={note.id} style={styles.note}>{note.text}</Text>
            ))}
        </View>
    ));

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.dashboardContent}>
                    <View style={styles.titelContainer}>
                        <Text style={styles.dashboardTitel}>Dashboard: {name}</Text>
                        <Text style={styles.dashboardId}>DashboardId: {id}</Text>
                    </View>
                    {notepadElements}
                </View>
            </ScrollView>
            <MobileMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1f22',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 60, // Lägg till padding för att skapa utrymme för menyn
    },
    dashboardContent: {
        padding: 20,
    },
    notepadContainer: {
        marginLeft: 0,
        padding: 20,
        backgroundColor: '#262b30',
        borderRadius: 10,
        marginVertical: 5,
    },
    notepadTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fef9ec',
    },
    dashboardTitel: {
        padding: 3,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fef9ec',
    },
    dashboardId: {
        color: '#fef9ec',
    },
    titelContainer: {
        alignItems: "center",
        padding: 4,
        marginBottom: 20,
    },
    note: {
        padding: 1,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        color: '#fef9ec',
    },
});

export default DashboardView;