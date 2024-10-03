import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import MobileMenu from '../../components/Menu/MobileMenu';

const DashboardView = ({ route }) => {
    const { id, name } = route.params;
    const [notepads, setNotepads] = useState([]);
    const [budgetLists, setBudgetLists] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

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

    useEffect(() => {
        if (id) {
            axios.get(`http://192.168.1.125:5000/budgetLists`, { params: {dashboardId: id} })
                .then(response => {
                    setBudgetLists(response.data);
                    console.log("This is the response: ", response);
                })
                .catch(error => {
                    console.error('Error fetching budget lists:', error)
                });
        }
    }, [id]);

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price, 0);
    }

    const addItemToBudgetList = (budgetListId) => {
        if (!newItemName || !newItemPrice) {
            Alert.alert('Error', 'Product name and price cannot be empty');
            return;
        }

        const newItem = {
            name: newItemName,
            price: parseInt(newItemPrice, 10),
            // price: newItemPrice,
        };

        // axios.post(`http://192.168.1.125:5000/dashboards/budgetLists/${budgetListId}/budgetItems`, newItem)
        axios.post(`http://192.168.1.125:5000/budgetList/1/budgetItems`, newItem)
            .then(response => {
                setBudgetLists(prevBudgetLists => 
                    prevBudgetLists.map(b => 
                        b.id === budgetListId ? { ...b, items: [...b.items, response.data] } : b
                    )
                );
                setNewItemName('');
                setNewItemPrice('');
                Alert.alert('Success', 'Item har lagts till');
            })
            .catch(error => {
                console.error('Error adding item to budget list:', error);
                Alert.alert('Error', 'Could not add item');
            });
    };

    const notepadElements = notepads.map(n => (
        <View key={n.id} style={styles.notepadContainer}>
            <Text style={styles.notepadTitle}>{n.name}</Text>
            {n.notes.map(note => (
                <Text key={note.id} style={styles.note}>{note.text}</Text>
            ))}
        </View>
    ));

    const budgetListElements = budgetLists.map(b => (
        <View key={b.id} style={styles.notepadContainer}>
            <Text style={styles.notepadTitle}>{b.name}</Text>
            {b.items.map(item => (
                <View key={item.id} style={styles.budgetItemRow}>
                    <Text style={styles.budgetItemName}>{item.name}</Text>
                    <Text style={styles.budgetItemPrice}>{item.price}kr</Text>
                </View>
            ))}
            <Text style={styles.totalText}>Total: {calculateTotal(b.items)}kr</Text>
            <View style={styles.addItemContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Product Name"
                    value={newItemName}
                    onChangeText={setNewItemName}
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={newItemPrice}
                    onChangeText={setNewItemPrice}
                    keyboardType="numeric"
                    placeholderTextColor="#ccc"
                />
                <Button color="#187977" title="Add item" onPress={() => addItemToBudgetList(b.id)} />
            </View>
        </View>
    ))

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.dashboardContent}>
                    <View style={styles.titelContainer}>
                        <Text style={styles.dashboardTitel}>Dashboard: {name}</Text>
                        <Text style={styles.dashboardId}>DashboardId: {id}</Text>
                    </View>
                    {notepadElements}
                    {budgetListElements}
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
    totalText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fef9ec',
    },
    budgetItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    budgetItemName: {
        color: '#fef9ec',
        fontSize: 16,
    },
    budgetItemPrice: {
        color: '#fef9ec',
        fontSize: 16,
    },
    addItemContainer: {
        marginTop: 20,
    },
    input: {
        backgroundColor: '#333',
        color: '#fef9ec',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default DashboardView;