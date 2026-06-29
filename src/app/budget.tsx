import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

export default function BudgetScreen() {
    const { budgets, overallBudgetLimit, addBudget, deleteBudget } = useStore();

    // Quick state for the "Add Budget" modal/input (assuming you have this built)
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newLimit, setNewLimit] = useState('');

    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    const totalPercentage = overallBudgetLimit > 0 ? Math.min(100, Math.round((totalSpent / overallBudgetLimit) * 100)) : 0;

    const handleSaveBudget = () => {
        if (newCategory && newLimit) {
            addBudget(newCategory, newLimit);
            setNewCategory('');
            setNewLimit('');
            setIsAdding(false);
        }
    };

    return (
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-end mb-6">
                <View>
                    <Text className="text-white/60 font-sans text-sm uppercase tracking-widest mb-1">June 2026</Text>
                    <Text className="text-white text-3xl font-serif font-bold tracking-tight">Budgets</Text>
                </View>
                <TouchableOpacity onPress={() => setIsAdding(!isAdding)} className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10">
                    <Feather name={isAdding ? "x" : "plus"} size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* OVERALL SPENDING CARD */}
            <View className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 mb-8">
                <Text className="text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-wider mb-2">Overall Spending Limit</Text>
                <View className="flex-row items-baseline mb-4">
                    <Text className="text-white text-4xl font-sans font-bold">₦{totalSpent.toLocaleString()}</Text>
                    <Text className="text-white/40 text-sm font-sans ml-2">/ ₦{overallBudgetLimit.toLocaleString()}</Text>
                </View>
                <View className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-2">
                    <View className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalPercentage}%` }} />
                </View>
                <Text className="text-white/40 text-xs font-sans text-right">{totalPercentage}% Used</Text>
            </View>

            {/* ADD BUDGET FORM */}
            {isAdding && (
                <View className="p-5 rounded-3xl bg-white/5 border border-white/10 mb-8">
                    <TextInput
                        placeholder="Category (e.g. Food)"
                        placeholderTextColor="#64748b"
                        value={newCategory}
                        onChangeText={setNewCategory}
                        className="w-full bg-slate-900/60 text-white font-sans rounded-2xl px-5 py-4 border border-white/5 mb-3"
                    />
                    <TextInput
                        placeholder="Limit Amount (₦)"
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                        value={newLimit}
                        onChangeText={setNewLimit}
                        className="w-full bg-slate-900/60 text-white font-sans rounded-2xl px-5 py-4 border border-white/5 mb-4"
                    />
                    <TouchableOpacity onPress={handleSaveBudget} className="w-full bg-emerald-500 py-4 rounded-2xl items-center">
                        <Text className="text-slate-950 font-sans font-bold uppercase">Save Budget</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* CATEGORY LIMITS LIST */}
            <Text className="text-white text-lg font-serif font-bold tracking-wide mb-4">Category Limits</Text>

            {budgets.map((budget) => {
                const percentUsed = budget.limit > 0 ? Math.min(100, (budget.spent / budget.limit) * 100) : 0;
                // Turn red if over 90%
                const barColor = percentUsed >= 90 ? 'bg-red-500' : 'bg-emerald-500';

                return (
                    <View key={budget.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 mb-4 relative">
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-4 border border-white/5">
                                    <Feather name={budget.icon as any} size={16} color="#94a3b8" />
                                </View>
                                <Text className="text-white font-sans font-bold text-base">{budget.category}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-sans font-bold text-base">₦{budget.spent.toLocaleString()}</Text>
                                <Text className="text-white/40 font-sans text-[10px] uppercase tracking-wider">OF ₦{budget.limit.toLocaleString()}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                <View className={`h-full rounded-full ${barColor}`} style={{ width: `${percentUsed}%` }} />
                            </View>

                            {/* DELETE BUTTON */}
                            <TouchableOpacity onPress={() => deleteBudget(budget.id)} className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20">
                                <Feather name="trash-2" size={14} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}