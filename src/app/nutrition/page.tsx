"use client";

import React, { useState, useEffect } from 'react';
import Navigation from "../components/navigation/Navigation";
import SearchPage from "../search/Search";
import { FoodItem } from "../types/nutrition";
import { db, auth } from "../lib/firebaseClient";
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

const NutritionPage: React.FC = () => {
    const [selectedFoods, setSelectedFoods] = useState<{ [key: string]: FoodItem }>({});
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {           // not loading automatically    
        const fetchSelectedFoods = async () => {
            if (!auth.currentUser) return;

            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const nutritionCollectionRef = collection(userDocRef, 'nutrition', date, 'foods');
            const querySnapshot = await getDocs(nutritionCollectionRef);

            const foodsData = querySnapshot.docs.reduce((acc, doc) => {
                const food = doc.data() as FoodItem;
                acc[food.name] = food;
                return acc;
            }, {} as { [key: string]: FoodItem });

            console.log(foodsData);
            setSelectedFoods(foodsData);
        };

        fetchSelectedFoods();
    }, [auth.currentUser, date]);

    const handleSelectFood = async (food: FoodItem) => {
        if (!auth.currentUser) {
            console.error("User not logged in");
            return;
        }

        const filteredFood = Object.fromEntries(
            Object.entries(food).filter(([key, value]) => key.trim() !== '' && value !== null && value !== '')
        );
        console.log("Selected food", filteredFood);

        setSelectedFoods((prevFoods) => ({
            ...prevFoods,
            [food.name]: food,
        }));

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const nutritionCollectionRef = collection(userDocRef, "nutrition", date, 'foods');
        await setDoc(doc(nutritionCollectionRef, encodeURIComponent(food.name)), filteredFood);
    };

    const handleRemoveFood = async (foodId: string) => {
        if (!auth.currentUser) {
            console.error("User not logged in");
            return;
        }

        setSelectedFoods((prevFoods) => {
            const newFoods = { ...prevFoods };
            delete newFoods[foodId];
            return newFoods;
        });

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const nutritionCollectionRef = collection(userDocRef, 'nutrition', date, 'foods');
        await deleteDoc(doc(nutritionCollectionRef, foodId));
    };

    return (
        <div>
            <Navigation />
            <SearchPage onSelectFood={handleSelectFood} />
            {Object.keys(selectedFoods).length > 0 && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-xl font-bold">Selected Foods</h2>
                    <ul>
                        {Object.values(selectedFoods).map((food) => (
                            <li key={food.name} className="flex justify-between items-center">
                                <div>
                                    <p>Name: {food.name}</p>
                                    <p>Calories: {food.calories}</p>
                                    {/* Add more details as needed */}
                                </div>
                                <button
                                    onClick={() => handleRemoveFood(food.name)}
                                    className="ml-4 p-2 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NutritionPage;
