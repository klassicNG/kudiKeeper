import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 1. NEW IMPORT

export const useStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            login: () => set({ isAuthenticated: true }),
            // FIX: Logging out now also locks the app session
            logout: () => set({ isAuthenticated: false, isAppUnlocked: false }),
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

            userType: null,
            completeOnboarding: (type, initialIncome) => set({
                userType: type,
                income: Number(initialIncome),
                balance: Number(initialIncome),
            }),

            // ==========================================
            // NEW: BANK-GRADE SECURITY STATE
            // ==========================================
            pin: null, // Will store the 4-digit PIN
            isAppUnlocked: false, // Tracks active session


            setPin: (newPin) => set({ pin: newPin, isAppUnlocked: true }),
            verifyPin: () => set({ isAppUnlocked: true }),
            lockApp: () => set({ isAppUnlocked: false }),

            // NEW: Wipes the PIN and instantly throws up the creation overlay
            resetPin: () => set({ pin: null, isAppUnlocked: false }),

            balance: 0,
            income: 0,
            expenses: 0,
            overallBudgetLimit: 0,
            budgets: [],
            totalSaved: 0,
            savingsGoals: [],
            transactions: [],

            notifications: [
                { id: '3', title: 'Step 3: Secure Your Future 🎯', message: 'Go to the Savings tab and create your first goal (e.g., Emergency Fund).', type: 'info', time: 'Just now' },
                { id: '2', title: 'Step 2: Track a Purchase 💸', message: 'Tap "Log Expense" in the menu to record your first transaction.', type: 'info', time: '1m ago' },
                { id: '1', title: 'Step 1: Set Your Limits 🛡️', message: 'Welcome to KudiKeeper! Head to the Budget Planner and hit the + to set your first monthly budget.', type: 'success', time: '2m ago' }
            ],
            unreadCount: 3,

            addNotification: (title, message, type = 'info') => set((state) => ({
                notifications: [{ id: Date.now().toString(), title, message, type, time: 'Just now' }, ...state.notifications],
                unreadCount: state.unreadCount + 1
            })),

            clearUnread: () => set({ unreadCount: 0 }),

            addExpense: (expenseData) => set((state) => {
                const amountNum = Number(expenseData.amount);
                const newTransaction = { id: Date.now(), title: expenseData.description || 'Quick Expense', category: expenseData.category, amount: amountNum, type: 'out', date: 'Just Now' };

                let alertTriggered = false;
                const updatedBudgets = state.budgets.map(budget => {
                    if (budget.category === expenseData.category) {
                        const newSpent = budget.spent + amountNum;
                        if (newSpent >= budget.limit * 0.9 && budget.spent < budget.limit * 0.9) alertTriggered = true;
                        return { ...budget, spent: newSpent };
                    }
                    return budget;
                });

                if (alertTriggered) get().addNotification('Budget Warning', `You have used over 90% of your ${expenseData.category} budget!`, 'warning');

                return { balance: state.balance - amountNum, expenses: state.expenses + amountNum, budgets: updatedBudgets, transactions: [newTransaction, ...state.transactions] };
            }),

            addBudget: (category, limit) => set((state) => {
                const limitNum = Number(limit);
                const newBudget = { id: Date.now(), category, limit: limitNum, spent: 0, icon: 'target' };
                get().addNotification('Budget Created', `Your ₦${limitNum.toLocaleString()} limit for ${category} is set.`, 'success');
                return { budgets: [...state.budgets, newBudget], overallBudgetLimit: state.overallBudgetLimit + limitNum };
            }),

            addSavingsGoal: (name, target, deadline, priority) => set((state) => {
                const newGoal = { id: Date.now(), name, target: Number(target), current: 0, deadline, priority, icon: 'star', color: 'bg-indigo-500' };
                return { savingsGoals: [newGoal, ...state.savingsGoals] };
            }),

            depositToGoal: (goalId, amount) => set((state) => {
                const depositNum = Number(amount);
                let goalName = '';
                const updatedGoals = state.savingsGoals.map(goal => {
                    if (goal.id === goalId) { goalName = goal.name; return { ...goal, current: goal.current + depositNum }; }
                    return goal;
                });
                get().addNotification('Goal Funded! 🎉', `You added ₦${depositNum.toLocaleString()} to ${goalName}.`, 'success');
                return { savingsGoals: updatedGoals, totalSaved: state.totalSaved + depositNum, balance: state.balance - depositNum };
            }),

            deleteTransaction: (id) => set((state) => {
                const txToDelete = state.transactions.find(tx => tx.id === id);
                if (!txToDelete) return state;
                const newExpenses = state.expenses - txToDelete.amount;
                const newBalance = state.balance + txToDelete.amount;
                const updatedBudgets = state.budgets.map(budget => {
                    if (budget.category === txToDelete.category) return { ...budget, spent: Math.max(0, budget.spent - txToDelete.amount) };
                    return budget;
                });
                return { transactions: state.transactions.filter(tx => tx.id !== id), expenses: newExpenses, balance: newBalance, budgets: updatedBudgets };
            }),

            deleteBudget: (id) => set((state) => {
                const budgetToDelete = state.budgets.find(b => b.id === id);
                if (!budgetToDelete) return state;
                return { budgets: state.budgets.filter(b => b.id !== id), overallBudgetLimit: state.overallBudgetLimit - budgetToDelete.limit };
            }),

            deleteSavingsGoal: (id) => set((state) => {
                const goalToDelete = state.savingsGoals.find(g => g.id === id);
                if (!goalToDelete) return state;
                return { savingsGoals: state.savingsGoals.filter(g => g.id !== id), totalSaved: state.totalSaved - goalToDelete.current, balance: state.balance + goalToDelete.current };
            }),
        }),
        {
            name: 'kudikeeper-storage', // The unique key where your app's data is saved locally
            storage: createJSONStorage(() => AsyncStorage), // 2. THE CRASH FIX
        }
    )
);