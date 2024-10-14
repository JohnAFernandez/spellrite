"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [test, setTestState] = useState(() => {
        // Initialize the state from localStorage if available
        if (typeof window !== "undefined") {
            const storedTest = localStorage.getItem('test');
            return storedTest ? JSON.parse(storedTest) : null;
        }
        return null;
    });

    // Sync the state with localStorage whenever it changes
    useEffect(() => {
        if (test) {
            localStorage.setItem('test', JSON.stringify(test));
        }
    }, [test]);

    const setTest = (newTest) => {
        setTestState(newTest);
    };

    return (
        <GlobalStateContext.Provider value={{ test, setTest }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);