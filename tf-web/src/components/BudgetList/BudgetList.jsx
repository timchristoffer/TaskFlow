import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BudgetList.css';

const BudgetList = (props) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [budgetList, setBudgetList] = useState({ items: [] }); // Initialize with empty items

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://localhost:7287/budgetLists/${props.id}`);
                console.log("Response data: ", response.data);
                setBudgetList(response.data);
            } catch (error) {
                console.error('Error fetching budget list:', error);
                alert("Failed to fetch budgetList");
            }
        };

        getData();
    }, [props.id]);

    const addProduct = async () => {
        if (!productName.trim()) {
            alert('Product name cannot be empty');
            return;
        }

        if (!productPrice || isNaN(productPrice)) {
            alert('Product price must be a valid number');
            return;
        }

        const price = parseFloat(productPrice); // Use parseFloat for decimal support

        try {
            const response = await axios.post(`https://localhost:7287/budgetList/${props.id}/budgetItems`, {
                name: productName,
                price: price
            });
            console.log('Created budget item', response.data);
            setBudgetList(prevBudgetList => ({
                ...prevBudgetList,
                items: [...prevBudgetList.items, response.data]
            }));
            setProductName('');
            setProductPrice('');
        } catch (error) {
            console.error('Error adding budget item:', error);
            alert('Error creating budget item');
        }
    };

    const removeProduct = async (itemId) => {
        try {
            await axios.delete(`https://localhost:7287/budgetList/${props.id}/budgetItems/${itemId}`);
            setBudgetList(prevBudgetList => ({
                ...prevBudgetList,
                items: prevBudgetList.items.filter(item => item.id !== itemId)
            }));
        } catch (error) {
            console.error('Error deleting budget item:', error);
            alert('Error deleting budget item');
        }
    };

    const totalSum = budgetList.items.reduce((sum, item) => sum + parseFloat(item.price), 0); // Use parseFloat for decimal support

    const budgetItems = budgetList.items.length > 0 ? (
        budgetList.items.map((item) => (
            <div key={item.id} className="budget-item">
                <span>{item.name} - {item.price} kr</span>
                <button className="remove-item-button" onClick={() => removeProduct(item.id)}>Remove</button>
            </div>
        ))
    ) : (
        <p>Empty</p>
    );

    const handleRemoveBudgetList = () => {
        props.removeBudgetList(props.id);
    };

    return (
        <div className="budget-widget">
            <div className='inputDiv'>
                <input
                    className="textInput small-input"
                    type="text"
                    placeholder="Produkt"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    className="numberInput small-input"
                    type="number"
                    placeholder="Pris"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />
                <button className='addProductButton' onClick={addProduct}>+</button>
            </div>
            <div className='productList'>
                <h4>Product List:</h4>
                {budgetItems}
                <h4>Total: {totalSum} kr</h4>
            </div>
            <div className="budget-footer">
                <button className="remove-budget-button" onClick={handleRemoveBudgetList}>Remove Budget List</button>
            </div>
        </div>
    );
};

export default BudgetList;
