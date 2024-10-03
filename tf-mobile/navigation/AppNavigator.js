// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DashboardCreate from '../screens/Dashboard/DashboardCreate';
import DashboardView from '../screens/Dashboard/DashboardView';
// import DashboardDetail from '../screens/Dashboard/DashboardDetail'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="DashboardCreate">
                <Stack.Screen name="DashboardCreate" component={DashboardCreate} />

                <Stack.Screen name="DashboardView" component={DashboardView} />

                <Stack.Screen name="Home" component={DashboardCreate} />
                <Stack.Screen name="Dashboards" component={DashboardCreate} />
                <Stack.Screen name="Profile" component={DashboardCreate} />
                <Stack.Screen name="Logout" component={DashboardCreate} />


                {/* <Stack.Screen name="DashboardDetail" component={DashboardDetail} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;