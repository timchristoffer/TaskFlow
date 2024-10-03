import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BudgetList.css';

const BudgetList = (props) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [budgetList, setBudgetList] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://localhost:7287/budgetLists/${props.id}`);
                console.log("Response data: ", response.data);
                setBudgetList(response.data);
            } catch (error) {
                console.error('Error fetching budget list:',error);
                alert("Failed to fetch budgetList");
            }
        };

        getData();
    }, [props.id]);

    const addProduct = () => {
        console.log("Product Name:", productName);
        console.log("Product Price:", productPrice);

        if (!productName.trim()) {
            alert('Product name cannot be empty');
            return;
        }

        if (!productPrice || isNaN(productPrice)) {
            alert('Product price must be a valid number');
            return;
        }
    
        const price = parseInt(productPrice);
    
        axios.post(`https://localhost:7287/budgetList/${props.id}/budgetItems`, {
            name: productName,
            price: price
        })
        .then(response => {
            console.log('Created budget item', response.data);
            setBudgetList(prevBudgetList => ({
                ...prevBudgetList,
                items: [...prevBudgetList.items, response.data]
            }));
            setProductName('');
            setProductPrice('');
        })
        .catch(error => {
            console.error('Error adding budget item:', error);
            alert('Error creating budget item');
        });
    };

    const totalSum = budgetList.items 
        ? budgetList.items.reduce((sum, item) => sum + parseInt(item.price), 0) : 0;

    const budgetItems = budgetList.items && budgetList.items.length > 0 ? (
        budgetList.items.map((item) => (
            <li key={item.id}>
                {item.name} - {item.price}kr
            </li>
        ))
    ) : (
        <p>Empty</p>
    );

    return (
        <div>
            <div className='inputDiv'>
                <input
                    className="textInput"
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    className="numberInput"
                    type="number"
                    placeholder="Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />
                <button className='addProductButton' onClick={addProduct}>Add Product</button>
            </div>
            <div className='productList'>
                <h4>Product List:</h4>
                <ul>
                    {budgetItems}
                </ul>
                <h4>Total: {totalSum}kr</h4>
            </div>
        </div>
    );
};

export default BudgetList;
