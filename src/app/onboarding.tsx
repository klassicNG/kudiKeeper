import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';

export default function OnboardingScreen() {
    const [selectedType, setSelectedType] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');

    const router = useRouter();
    const completeOnboarding = useStore((state) => state.completeOnboarding);

    const userTypes = [
        { id: 'Student', icon: 'book-open', desc: 'Managing allowance & side hustles' },
        { id: 'Entrepreneur', icon: 'briefcase', desc: 'Tracking business & daily sales' },
        { id: 'Salary Earner', icon: 'credit-card', desc: 'Budgeting monthly paycheck' }
    ];

    const handleFinish = () => {
        if (!selectedType) return alert('Please select a user type.');
        if (!monthlyIncome) return alert('Please enter your estimated income.');

        // Inject data into the Zustand brain
        completeOnboarding(selectedType, monthlyIncome);

        // Welcome to the App!
        router.push('/dashboard');
    };

    return (
        <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>

            <View className="mb-10 mt-8">
                <Text className="text-emerald-400 font-sans text-sm uppercase tracking-widest mb-2 font-bold">
                    Step 1 of 1
                </Text>
                <Text className="text-white text-4xl font-serif font-bold tracking-tight mb-2">
                    Personalize Your Experience
                </Text>
                <Text className="text-white/50 font-sans text-base">
                    Let's set up KudiKeeper to match your financial lifestyle.
                </Text>
            </View>

            {/* PRD Requirement: Select User Type */}
            <View className="mb-10">
                <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-4 ml-1">
                    Who are you?
                </Text>

                {userTypes.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        onPress={() => setSelectedType(type.id)}
                        className={`flex-row items-center p-5 rounded-3xl mb-3 border ${selectedType === type.id
                                ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 border-white/10'
                            }`}
                        style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${selectedType === type.id ? 'bg-emerald-500' : 'bg-slate-800'
                            }`}>
                            <Feather name={type.icon} size={20} color={selectedType === type.id ? '#022c22' : 'white'} />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-serif font-bold text-lg mb-1 ${selectedType === type.id ? 'text-emerald-400' : 'text-white'
                                }`}>
                                {type.id}
                            </Text>
                            <Text className="text-white/40 font-sans text-xs">
                                {type.desc}
                            </Text>
                        </View>
                        {selectedType === type.id && (
                            <Feather name="check-circle" size={20} color="#10b981" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* PRD Requirement: Set Monthly Income */}
            <View className="mb-12">
                <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-4 ml-1">
                    Estimated Monthly Income (₦)
                </Text>
                <View
                    className="bg-white/5 border border-white/10 rounded-3xl p-2 pl-6 flex-row items-center"
                    style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}
                >
                    <Text className="text-white/40 text-2xl font-serif font-bold mr-2">₦</Text>
                    <TextInput
                        className="flex-1 text-white text-3xl font-serif font-bold py-4"
                        placeholder="0.00"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        keyboardType="numeric"
                        value={monthlyIncome}
                        onChangeText={setMonthlyIncome}
                        style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                    />
                </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                onPress={handleFinish}
                className="w-full bg-emerald-500 py-5 rounded-2xl items-center justify-center mb-12 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
                <Text className="text-slate-950 font-sans font-black uppercase tracking-wider text-base">
                    Go to Dashboard
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}