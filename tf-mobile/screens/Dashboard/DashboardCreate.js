import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DashboardCreate = () => {
    const [name, setName] = useState('');
    const [dashboards, setDashboards] = useState([]);
    const [message, setMessage] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                const response = await axios.get('https://192.168.0.15:7287/dashboards');
                console.log('API response:', response.data); // Logga API-svaret
                setDashboards(response.data);
            } catch (error) {
                console.error('Error fetching dashboards:', error);
                Alert.alert("Failed to fetch dashboards");
            }
        };

        fetchDashboards();
    }, []);

    const handleCreateDashboard = async () => {
        console.log("Creating dashboard with name:", name);
        try {
            const response = await axios.post('https://192.168.0.15:7287/dashboards', { name });
            console.log("Response:", response.data); // Logga API-svaret
            setDashboards([...dashboards, response.data]);
            setName('');
        } catch (error) {
            console.error('Error creating dashboard:', error);
            Alert.alert("Failed to create dashboard");
        }
    };

    return (
        <View style={styles.dashboardContent}>
            <View style={styles.dashboardContainer}>
                <Text style={styles.title}>Create Dashboard</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Dashboard Name"
                        required
                    />
                    <Button title="Create" onPress={handleCreateDashboard} />
                </View>

                {message ? <Text>{message}</Text> : null}

                <Text style={styles.subtitle}>Dashboards</Text>
                <FlatList
                    data={dashboards}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('DashboardDetail', { id: item.id })}>
                            <Text style={styles.dashboardItem}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text>No dashboards available</Text>} // Lägg till en tom lista-komponent
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dashboardContent: {
        flex: 1,
        padding: 20,
    },
    dashboardContainer: {
        marginLeft: 0,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 20,
    },
    input: {
        padding: 10,
        marginRight: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    dashboardItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        color: '#187977',
    },
});

export default DashboardCreate;