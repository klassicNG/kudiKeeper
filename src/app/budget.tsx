import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

export default function BudgetPlanner() {
    const { expenses, overallBudgetLimit, budgets, addBudget } = useStore();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newLimit, setNewLimit] = useState('');

    const getProgressColor = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 90) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        if (percentage >= 75) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
        return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    };

    const handleSaveBudget = () => {
        if (!newCategory || !newLimit) return alert("Please fill out both fields.");

        addBudget(newCategory, newLimit);
        setNewCategory('');
        setNewLimit('');
        setIsModalOpen(false);
    };

    return (
        <View className="flex-1 relative">
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

                {/* Page Header */}
                <View className="mb-6 flex-row justify-between items-end">
                    <View>
                        <Text className="text-white/60 font-sans text-sm uppercase tracking-widest mb-1">June 2026</Text>
                        <Text className="text-white text-4xl font-serif font-bold tracking-tight">Budgets</Text>
                    </View>
                    {/* THE PLUS BUTTON IS NOW ALIVE */}
                    <TouchableOpacity
                        onPress={() => setIsModalOpen(true)}
                        className="w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
                    >
                        <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Overall Monthly Budget Card */}
                <View
                    className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8"
                    style={Platform.OS === 'web' ? { backdropFilter: 'blur(24px)' } : {}}
                >
                    <Text className="text-emerald-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-4">Overall Spending Limit</Text>
                    <View className="flex-row items-end mb-4">
                        <Text className="text-white text-5xl font-serif font-bold tracking-tight">₦{expenses.toLocaleString()}</Text>
                        <Text className="text-white/40 font-sans text-lg mb-1 ml-2">/ ₦{overallBudgetLimit.toLocaleString()}</Text>
                    </View>
                    <View className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                        <View className={`h-full ${getProgressColor(expenses, overallBudgetLimit)}`} style={{ width: `${Math.min((expenses / overallBudgetLimit) * 100, 100)}%` }} />
                    </View>
                    <Text className="text-white/50 text-xs font-sans text-right">{Math.round((expenses / overallBudgetLimit) * 100)}% Used</Text>
                </View>

                {/* Category Budgets List */}
                <View className="mb-24">
                    <Text className="text-white text-lg font-serif font-bold tracking-wide mb-4">Category Limits</Text>
                    {budgets.map((budget) => {
                        const progressPercentage = Math.min((budget.spent / budget.limit) * 100, 100);
                        return (
                            <View key={budget.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 mb-4">
                                <View className="flex-row justify-between items-center mb-4">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-4 border border-white/5">
                                            <Feather name={budget.icon} size={16} color="#94a3b8" />
                                        </View>
                                        <Text className="text-white font-sans font-bold text-base">{budget.category}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-white font-sans font-bold">₦{budget.spent.toLocaleString()}</Text>
                                        <Text className="text-white/40 font-sans text-[10px] uppercase tracking-widest mt-1">of ₦{budget.limit.toLocaleString()}</Text>
                                    </View>
                                </View>
                                <View className="h-1.5 w-full bg-slate-800 rounded-full">
                                    <View className={`h-full rounded-full ${getProgressColor(budget.spent, budget.limit)}`} style={{ width: `${progressPercentage}%` }} />
                                </View>
                                {progressPercentage >= 90 && (
                                    <Text className="text-red-400 text-[10px] font-sans font-bold mt-3 text-right">
                                        Warning: You have spent {Math.round(progressPercentage)}% of your {budget.category.toLowerCase()} budget.
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* ========================================== */}
            {/* "ADD BUDGET" GLASSMORPHISM MODAL OVERLAY  */}
            {/* ========================================== */}
            {isModalOpen && (
                <View className="absolute inset-0 z-50 justify-end bg-black/60 pb-8 px-4" style={Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}}>
                    <View className="bg-slate-900 border border-white/10 rounded-[32px] p-6 shadow-2xl">

                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-serif font-bold">New Budget</Text>
                            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                                <Feather name="x-circle" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-5">
                            <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Category Name</Text>
                            <TextInput
                                className="bg-slate-800/50 text-white font-sans rounded-2xl px-5 py-4 border border-white/5"
                                placeholder="e.g., Handouts"
                                placeholderTextColor="#475569"
                                value={newCategory}
                                onChangeText={setNewCategory}
                                style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                            />
                        </View>

                        <View className="mb-8">
                            <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Monthly Limit (₦)</Text>
                            <TextInput
                                className="bg-slate-800/50 text-white font-sans rounded-2xl px-5 py-4 border border-white/5"
                                placeholder="0.00"
                                placeholderTextColor="#475569"
                                keyboardType="numeric"
                                value={newLimit}
                                onChangeText={setNewLimit}
                                style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSaveBudget}
                            className="w-full bg-emerald-500 py-4 rounded-2xl items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            <Text className="text-slate-950 font-sans font-black uppercase tracking-wider">Save Limit</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}

        </View>
    );
}