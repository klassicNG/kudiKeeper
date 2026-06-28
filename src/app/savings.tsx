import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

export default function SavingsGoals() {
    const { totalSaved, savingsGoals, addSavingsGoal, depositToGoal } = useStore();

    // Modal States
    const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState(null);

    // Form States
    const [goalName, setGoalName] = useState('');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [depositAmount, setDepositAmount] = useState('');

    const handleCreateGoal = () => {
        if (!goalName || !goalTarget) return alert("Please fill out Name and Target");
        addSavingsGoal(goalName, goalTarget, goalDeadline || 'Ongoing', 'Medium');
        setGoalName(''); setGoalTarget(''); setGoalDeadline('');
        setIsNewGoalModalOpen(false);
    };

    const handleDeposit = () => {
        if (!depositAmount) return;
        depositToGoal(activeGoal.id, depositAmount);
        setDepositAmount('');
        setIsDepositModalOpen(false);
        alert(`Successfully added ₦${depositAmount} to ${activeGoal.name}!`);
    };

    const openDepositModal = (goal) => {
        setActiveGoal(goal);
        setIsDepositModalOpen(true);
    };

    return (
        <View className="flex-1 relative">
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

                {/* Page Header */}
                <View className="mb-6 flex-row justify-between items-end">
                    <View>
                        <Text className="text-white/60 font-sans text-sm uppercase tracking-widest mb-1">Your Future</Text>
                        <Text className="text-white text-4xl font-serif font-bold tracking-tight">Savings</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsNewGoalModalOpen(true)}
                        className="w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
                    >
                        <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Total Saved Hero Card */}
                <View className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8 flex-row items-center justify-between" style={Platform.OS === 'web' ? { backdropFilter: 'blur(24px)' } : {}}>
                    <View>
                        <Text className="text-sky-400/80 text-[10px] font-sans font-bold uppercase tracking-[0.15em] mb-2">Total Vault Balance</Text>
                        <Text className="text-white text-4xl font-serif font-bold tracking-tight">₦{totalSaved.toLocaleString()}</Text>
                    </View>
                    <View className="w-12 h-12 rounded-full bg-sky-500/20 items-center justify-center border border-sky-500/30">
                        <Feather name="lock" size={20} color="#38bdf8" />
                    </View>
                </View>

                {/* Individual Goals List */}
                <View className="mb-24">
                    <Text className="text-white text-lg font-serif font-bold tracking-wide mb-4">Active Goals</Text>

                    {savingsGoals.map((goal) => {
                        const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);

                        return (
                            <View key={goal.id} className="bg-white/[0.03] border border-white/5 rounded-[28px] p-5 mb-4" style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}>
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center mr-4 border border-white/5">
                                            <Feather name={goal.icon} size={20} color="white" />
                                        </View>
                                        <View>
                                            <Text className="text-white font-sans font-bold text-base mb-1">{goal.name}</Text>
                                            <View className="flex-row items-center gap-2">
                                                <Text className="text-white/40 font-sans text-[10px] uppercase tracking-widest">{goal.deadline}</Text>
                                                <View className="w-1 h-1 bg-white/20 rounded-full" />
                                                <Text className={`${goal.priority === 'High' ? 'text-amber-400' : 'text-sky-400'} font-sans text-[10px] uppercase tracking-widest font-bold`}>{goal.priority}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Financial Progress */}
                                <View className="flex-row justify-between items-end mb-3">
                                    <Text className="text-white font-serif font-bold text-xl">₦{goal.current.toLocaleString()}</Text>
                                    <Text className="text-white/50 font-sans text-xs">Target: ₦{goal.target.toLocaleString()}</Text>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                                    <View className={`h-full rounded-full ${goal.color}`} style={{ width: `${progressPercentage}%` }} />
                                </View>

                                {/* Deposit Action Button */}
                                <TouchableOpacity
                                    onPress={() => openDepositModal(goal)}
                                    className="w-full bg-white/5 py-3 rounded-xl items-center justify-center border border-white/10 flex-row gap-2"
                                >
                                    <Feather name="arrow-up-circle" size={16} color="#38bdf8" />
                                    <Text className="text-sky-400 text-xs font-sans font-bold uppercase tracking-wider">Quick Deposit</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* ========================================== */}
            {/* 1. NEW GOAL MODAL */}
            {/* ========================================== */}
            {isNewGoalModalOpen && (
                <View className="absolute inset-0 z-50 justify-end bg-black/60 pb-8 px-4" style={Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}}>
                    <View className="bg-slate-900 border border-white/10 rounded-[32px] p-6 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-serif font-bold">New Goal</Text>
                            <TouchableOpacity onPress={() => setIsNewGoalModalOpen(false)}>
                                <Feather name="x-circle" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4 mb-6">
                            <View>
                                <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Goal Name</Text>
                                <TextInput className="bg-slate-800/50 text-white font-sans rounded-2xl px-5 py-4 border border-white/5" placeholder="e.g., House Rent" placeholderTextColor="#475569" value={goalName} onChangeText={setGoalName} style={Platform.OS === 'web' ? { outline: 'none' } : {}} />
                            </View>
                            <View className="mt-4">
                                <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Target Amount (₦)</Text>
                                <TextInput className="bg-slate-800/50 text-white font-sans rounded-2xl px-5 py-4 border border-white/5" placeholder="0.00" keyboardType="numeric" placeholderTextColor="#475569" value={goalTarget} onChangeText={setGoalTarget} style={Platform.OS === 'web' ? { outline: 'none' } : {}} />
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleCreateGoal} className="w-full bg-sky-500 py-4 rounded-2xl items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                            <Text className="text-slate-950 font-sans font-black uppercase tracking-wider">Start Saving</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* ========================================== */}
            {/* 2. QUICK DEPOSIT MODAL */}
            {/* ========================================== */}
            {isDepositModalOpen && activeGoal && (
                <View className="absolute inset-0 z-50 justify-end bg-black/60 pb-8 px-4" style={Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}}>
                    <View className="bg-slate-900 border border-emerald-500/20 rounded-[32px] p-6 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-widest mb-1">Fund Goal</Text>
                                <Text className="text-white text-2xl font-serif font-bold">{activeGoal.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsDepositModalOpen(false)}>
                                <Feather name="x-circle" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Amount to Save (₦)</Text>
                            <TextInput className="bg-slate-800/50 text-emerald-400 text-2xl font-serif font-bold rounded-2xl px-5 py-4 border border-white/5" placeholder="0.00" keyboardType="numeric" placeholderTextColor="#475569" value={depositAmount} onChangeText={setDepositAmount} autoFocus style={Platform.OS === 'web' ? { outline: 'none' } : {}} />
                        </View>

                        <TouchableOpacity onPress={handleDeposit} className="w-full bg-emerald-500 py-4 rounded-2xl items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <Text className="text-slate-950 font-sans font-black uppercase tracking-wider">Deposit Funds</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </View>
    );
}