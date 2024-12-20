"use client";

import React, { useState, useEffect } from 'react';
import Navigation from "../components/navigation/Navigation";
import SearchPage from "../search/Search";
import { FoodItem } from "../types/nutrition";
import { db, auth } from "../lib/firebaseClient";
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import DateButton from '../dateButton/DateButton';


const NutritionPage: React.FC = () => {
    const [selectedFoods, setSelectedFoods] = useState<{ [key: string]: FoodItem }>({});
    const [currentDate, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        const fetchSelectedFoods = async () => {
            if (!user) return;

            const userDocRef = doc(db, 'users', user.uid);
            const nutritionCollectionRef = collection(userDocRef, 'nutrition', currentDate, 'foods');
            const querySnapshot = await getDocs(nutritionCollectionRef);

            const foodsData = querySnapshot.docs.reduce((acc, doc) => {
                const food = doc.data() as FoodItem;
                acc[food.name] = food;
                return acc;
            }, {} as { [key: string]: FoodItem });

            setSelectedFoods(foodsData);
        };

        fetchSelectedFoods();
    }, [user, currentDate]);

    const handleSelectFood = async (food: FoodItem) => {
        if (!user) {
            console.error("User not logged in");
            return;
        }
    
        const filteredFood: FoodItem = Object.fromEntries(
            Object.entries(food).filter(([key, value]) => key.trim() !== '' && value !== null && value !== '')
        ) as FoodItem;
        
        setSelectedFoods((prevFoods) => ({
            ...prevFoods,
            [food.name]: filteredFood,
        }));
    
        // Update or create dates array
        const userDocRef = doc(db, "users", user.uid);
        const datesDocRef = doc(collection(userDocRef, "nutrition"), "dates");
        const datesDoc = await getDoc(datesDocRef);
    
        if (!datesDoc.exists()) {
            await setDoc(datesDocRef, { dates: [currentDate] });
        } else {
            const dates = datesDoc.data()?.dates || [];
            if (!dates.includes(currentDate)) {
                await updateDoc(datesDocRef, {
                    dates: [...dates, currentDate]
                });
            }
        }
    
        // Save the food item
        const nutritionCollectionRef = collection(userDocRef, "nutrition", currentDate, 'foods');
        await setDoc(doc(nutritionCollectionRef, encodeURIComponent(food.name)), filteredFood);
    };
    
    const handleRemoveFood = async (foodId: string) => {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        setSelectedFoods((prevFoods) => {
            const newFoods = { ...prevFoods };
            delete newFoods[foodId];
            return newFoods;
        });

        const userDocRef = doc(db, 'users', user.uid);
        const nutritionCollectionRef = collection(userDocRef, 'nutrition', currentDate, 'foods');
        await deleteDoc(doc(nutritionCollectionRef, encodeURIComponent(foodId)));
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
    };

    const handleRangeChange = (startDate: string, endDate: string) => {
        // Handle range change logic here
        console.log(`Selected range: ${startDate} to ${endDate}`);
    };

    return (
        <div>
            <Navigation />
            <div>
            <DateButton onDateChange={handleDateChange} onRangeChange={handleRangeChange} />
        
            </div>
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
