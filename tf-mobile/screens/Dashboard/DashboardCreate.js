import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MobileMenu from '../../components/Menu/MobileMenu';

axios.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
});

axios.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
}, error => {
    console.log('Error:', error);
    return Promise.reject(error);
});

const DashboardCreate = () => {
    const [name, setName] = useState('');
    const [dashboards, setDashboards] = useState([]);
    const [message, setMessage] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                const response = await axios.get('http://192.168.1.125:5000/dashboards'); 
                console.log('API response:', response.data); 
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
            const response = await axios.post('http://192.168.1.125:5000/dashboards', { name }); 
            console.log("Response:", response.data); 
            setDashboards([...dashboards, response.data]);
            setName('');
        } catch (error) {
            console.error('Error creating dashboard:', error);
            Alert.alert("Failed to create dashboard");
        }
    };

    const handleDeleteDashboard = async (id) => {
        console.log("Deleting dashboard with id:", id);
        try {
            await axios.delete(`http://192.168.1.125:5000/dashboards/${id}`);
            setDashboards(dashboards.filter(dashboard => dashboard.id !== id));
        } catch (error) {
            console.error('Error deleting dashboard:', error);
            Alert.alert("Failed to delete dashboard");
        }
    };

    return (
        <View style={styles.container}>
            <View contentContainerStyle={styles.scrollContainer}>
                <View style={styles.dashboardContent}>
                    <View style={styles.dashboardContainer}>
                        <Text style={styles.title}>Create Dashboard</Text>
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Dashboard Name"
                                placeholderTextColor="#fef9ec"
                                required
                            />
                            <Button title="Create" onPress={handleCreateDashboard} color="#187977" />
                        </View>
                        {message ? <Text style={styles.message}>{message}</Text> : null}
                        <Text style={styles.subtitle}>Dashboards</Text>
                    </View>
                </View>
                <FlatList
                    data={dashboards}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.dashboardItemContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('DashboardView', { id: item.id, name: item.name })}>
                                <Text style={styles.dashboardItem}>{item.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteDashboard(item.id)}>
                                <Image source={require('../../assets/Icons/delete.png')} style={[styles.deleteIcon, { tintColor: '#00ffa9' }]} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyList}>No dashboards available</Text>}
                    contentContainerStyle={styles.flatListContent}
                    style={styles.flatList}
                />
            </View>
            <MobileMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#1c1f22',
    },
    container: {
        flex: 1,
        backgroundColor: '#1c1f22',
    },
    flatListContent: {
        paddingBottom: 60, // Lägg till padding för att skapa utrymme för menyn
    },
    flatList: {
        maxHeight: 510, // Sätt en fast höjd för FlatList
    },
    dashboardContent: {
        padding: 20,
    },
    dashboardContainer: {
        marginLeft: 0,
        padding: 20,
        backgroundColor: '#262b30',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fef9ec',
    },
    form: {
        marginBottom: 20,
    },
    input: {
        padding: 10,
        margin: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        color: '#fef9ec',
        backgroundColor: '#1c1f22',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#fef9ec',
    },
    dashboardItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#262b30', // Sätt bakgrundsfärgen till samma som dashboardContainer
        borderRadius: 10, // Lägg till border-radius
        marginVertical: 5, // Lägg till vertikal marginal för att separera objekten
        margin: 10,
    },
    dashboardItem: {
        color: '#187977',
    },
    deleteIcon: {
        width: 24,
        height: 24,
        tintColor: '#00ffa9', // Sätt tintColor till accent
    },
    emptyList: {
        color: '#fef9ec',
    },
    message: {
        color: '#fef9ec',
    },
});

export default DashboardCreate;