import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Dashboard() {
    const { balance, income, expenses, transactions, deleteTransaction } = useStore();

    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Today', 'Week', 'Month'];

    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    const getFilteredTransactions = () => {
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        return transactions.filter(tx => {
            if (activeFilter === 'All') return true;
            const timeDiff = now - tx.id;
            if (activeFilter === 'Today') return timeDiff <= ONE_DAY;
            if (activeFilter === 'Week') return timeDiff <= (7 * ONE_DAY);
            if (activeFilter === 'Month') return timeDiff <= (30 * ONE_DAY);
            return true;
        });
    };

    const filteredTransactions = getFilteredTransactions();

    // ==========================================
    // EXPORT TO EXCEL (CSV) LOGIC
    // ==========================================
    const handleExportCSV = async () => {
        if (transactions.length === 0) {
            return alert("No transactions to export yet!");
        }

        const generationDate = new Date().toLocaleDateString();

        let csvString = "KUDIKEEPER FINANCIAL REPORT\n";
        csvString += `Generated On:,${generationDate}\n\n`;
        csvString += "--- ACCOUNT SUMMARY ---\n";
        csvString += `Total Balance (NGN):,${balance}\n`;
        csvString += `Total Income (NGN):,${income}\n`;
        csvString += `Total Expenses (NGN):,${expenses}\n\n`;
        csvString += "--- TRANSACTION HISTORY ---\n";
        csvString += "Date,Description,Category,Type,Amount (NGN)\n";

        transactions.forEach(tx => {
            const dateObj = new Date(tx.id);
            const readableDate = dateObj.toLocaleDateString();
            const typeLabel = tx.type === 'in' ? 'Income' : 'Expense';

            csvString += `${readableDate},"${tx.title}",${tx.category},${typeLabel},${tx.amount}\n`;
        });

        if (Platform.OS === 'web') {
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `KudiKeeper_Report_${generationDate.replace(/\//g, '-')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert("✅ Professional report downloaded successfully!");
        } else {
            try {
                const fileName = `KudiKeeper_Report_${generationDate.replace(/\//g, '-')}.csv`;
                const fileUri = FileSystem.documentDirectory + fileName;

                await FileSystem.writeAsStringAsync(fileUri, csvString, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export Financial Report',
                    UTI: 'public.comma-separated-values-text'
                });
            } catch (error) {
                alert("Error exporting file on mobile.");
            }
        }
    };

    return (
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

            <View className="mb-8">
                <Text className="text-white/60 font-sans text-sm uppercase tracking-widest mb-2">Total Balance</Text>
                <Text className="text-white text-5xl font-serif font-bold tracking-tight">
                    ₦{balance.toLocaleString()}
                </Text>
            </View>

            <View className="flex-row justify-between mb-6 gap-4">
                <View className="flex-1 p-5 rounded-3xl bg-white/5 border border-white/10" style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}>
                    <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mb-3">
                        <Feather name="arrow-down-left" size={16} color="#10b981" />
                    </View>
                    <Text className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Total Income</Text>
                    <Text className="text-white text-xl font-sans font-bold">₦{income.toLocaleString()}</Text>
                </View>

                <View className="flex-1 p-5 rounded-3xl bg-white/5 border border-white/10" style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}>
                    <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center mb-3">
                        <Feather name="arrow-up-right" size={16} color="#ef4444" />
                    </View>
                    <Text className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Total Expenses</Text>
                    <Text className="text-white text-xl font-sans font-bold">₦{expenses.toLocaleString()}</Text>
                </View>
            </View>

            <View className="p-5 rounded-3xl bg-sky-900/20 border border-sky-500/20 mb-8 flex-row items-center justify-between" style={Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}}>
                <View>
                    <Text className="text-sky-400 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Smart Insight</Text>
                    <Text className="text-white/80 font-sans text-sm">
                        {transactions.length === 0 ? "Log an expense to see insights." : "Track your spending carefully."}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-sky-400 text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Savings Rate</Text>
                    <Text className="text-white text-lg font-sans font-bold">{savingsRate}%</Text>
                </View>
            </View>

            <View className="mb-12">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-lg font-serif font-bold tracking-wide">Recent Activity</Text>

                    <TouchableOpacity
                        onPress={handleExportCSV}
                        className="flex-row items-center bg-white/10 px-4 py-2 rounded-full border border-white/20 active:bg-white/20 transition-colors"
                    >
                        <Feather name="download" size={14} color="white" />
                        <Text className="text-white text-xs font-sans font-bold ml-2 tracking-wider">Export CSV</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-2 mb-6">
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full border transition-colors ${activeFilter === filter
                                    ? 'bg-emerald-500/20 border-emerald-500'
                                    : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <Text className={`font-sans text-xs font-bold ${activeFilter === filter ? 'text-emerald-400' : 'text-white/50'}`}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredTransactions.length === 0 ? (
                    <View className="p-8 items-center justify-center border border-dashed border-white/20 rounded-3xl">
                        <Feather name={transactions.length === 0 ? "inbox" : "filter"} size={32} color="rgba(255,255,255,0.2)" className="mb-3" />
                        <Text className="text-white/50 font-sans text-sm text-center">
                            {transactions.length === 0
                                ? "No transactions yet. Log an expense!"
                                : `No transactions found for ${activeFilter.toLowerCase()}.`}
                        </Text>
                    </View>
                ) : (
                    filteredTransactions.map((tx) => (
                        <View key={tx.id} className="flex-row justify-between items-center mb-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <View className="flex-row items-center flex-1">
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${tx.type === 'in' ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                                    <Feather name={tx.type === 'in' ? 'plus' : 'shopping-bag'} size={16} color={tx.type === 'in' ? '#10b981' : '#94a3b8'} />
                                </View>
                                <View className="flex-1 pr-2">
                                    <Text className="text-white font-sans font-bold text-sm mb-1" numberOfLines={1}>{tx.title}</Text>
                                    <Text className="text-white/40 font-sans text-[10px] uppercase tracking-wider">{tx.category} • {tx.date}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-4">
                                <Text className={`font-sans font-bold ${tx.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>
                                    {tx.type === 'in' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => deleteTransaction(tx.id)}
                                    className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20"
                                >
                                    <Feather name="trash-2" size={14} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>

        </ScrollView>
    );
}