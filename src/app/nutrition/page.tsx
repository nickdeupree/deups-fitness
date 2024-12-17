"use client";

import React from 'react';
import Navigation from "../components/navigation/Navigation";
import SearchPage from "../search/Search";
const NutritionPage: React.FC = () => {
    return (
        <div>
           <Navigation/>
            <SearchPage/> 
        </div>
        
    );
}

export default NutritionPage;