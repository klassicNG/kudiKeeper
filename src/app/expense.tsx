import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Add this
import { useStore } from '../store/useStore'; // Add this

export default function ExpenseLogger() {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank');

    const addExpense = useStore((state) => state.addExpense); // Pull the action
    const router = useRouter(); // Pull the router

    const categories = ['Food', 'Transport', 'Airtime/Data', 'Bills', 'Shopping', 'Business', 'Family', 'Entertainment', 'Savings'];
    const paymentMethods = ['Cash', 'Bank', 'Opay', 'PalmPay', 'Moniepoint'];

    const handleSave = () => {
        if (!amount) {
            alert("Please enter an amount");
            return;
        }

        // 1. Send data to global store
        addExpense({ amount, category, description, paymentMethod });

        // 2. Clear fields
        setAmount('');
        setDescription('');

        // 3. Immediately bounce user back to dashboard to see the magic
        router.push('/dashboard');
    };

    // ... keep your return statement exactly the same ...
    return (
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

            {/* Page Header */}
            <View className="mb-6">
                <Text className="text-white/60 font-sans text-sm uppercase tracking-widest mb-1">
                    Quick Entry
                </Text>
                <Text className="text-white text-4xl font-serif font-bold tracking-tight">
                    Log Expense
                </Text>
            </View>

            {/* True Glassmorphism Form Card */}
            <View
                className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8"
                style={Platform.OS === 'web' ? { backdropFilter: 'blur(24px)' } : {}}
            >

                {/* Amount Input */}
                <View className="mb-8">
                    <Text className="text-emerald-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-2 ml-1">
                        Amount (₦)
                    </Text>
                    <View className="flex-row items-center border-b border-white/10 pb-2">
                        <TextInput
                            className="flex-1 text-white text-5xl font-serif font-bold p-0 m-0"
                            placeholder="0.00"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                        />
                    </View>
                </View>

                {/* Description Input */}
                <View className="mb-8">
                    <Text className="text-emerald-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-2 ml-1">
                        Description
                    </Text>
                    <TextInput
                        className="text-white text-lg font-sans border-b border-white/10 pb-3"
                        placeholder="What did you buy?"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={description}
                        onChangeText={setDescription}
                        style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                    />
                </View>

                {/* Category Selector */}
                <View className="mb-8">
                    <Text className="text-emerald-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-3 ml-1">
                        Category
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-2 px-2">
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                className={`mr-3 px-5 py-3 rounded-2xl border ${category === cat
                                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <Text className={`font-sans font-bold text-sm ${category === cat ? 'text-slate-950' : 'text-white/60'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Payment Method Selector */}
                <View className="mb-4">
                    <Text className="text-emerald-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-3 ml-1">
                        Payment Method
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-2 px-2">
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method}
                                onPress={() => setPaymentMethod(method)}
                                className={`mr-3 px-5 py-3 rounded-2xl border ${paymentMethod === method
                                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <Text className={`font-sans font-bold text-sm ${paymentMethod === method ? 'text-slate-950' : 'text-white/60'}`}>
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </View>

            {/* Save Button */}
            <TouchableOpacity
                onPress={handleSave}
                className="w-full bg-white py-5 rounded-full items-center justify-center mb-12 flex-row gap-2 shadow-[0_10px_25px_rgba(255,255,255,0.1)]"
            >
                <Feather name="check-circle" size={20} color="black" />
                <Text className="text-black text-base font-sans font-black uppercase tracking-wider">
                    Save Expense
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}