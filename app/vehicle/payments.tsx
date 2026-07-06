import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type PaymentMethod = {
  id: string;
  type: 'wallet' | 'card' | 'cash';
  label: string;
  details: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isDefault?: boolean;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'wallet', label: 'Wallet Balance', details: '₱1,280.00', icon: 'account-balance-wallet', isDefault: true },
  { id: '2', type: 'card', label: 'Credit Card', details: '•••• 4242', icon: 'credit-card' },
  { id: '3', type: 'cash', label: 'Cash', details: 'Pay at exit', icon: 'payments' },
];

type PaymentItem = {
  id: string;
  location: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
};

const RECENT_PAYMENTS: PaymentItem[] = [
  { id: '1', location: 'Terminal A - Lot 3', date: 'Today, 2:30 PM', amount: 8.50, status: 'paid' },
  { id: '2', location: 'Terminal B - Lot 1', date: 'Today, 10:00 AM', amount: 5.00, status: 'paid' },
  { id: '3', location: 'Terminal C - Lot 2', date: 'Yesterday, 9:00 AM', amount: 3.50, status: 'pending' },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState('1');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return Colors.light.green;
      case 'pending': return Colors.light.yellow;
      case 'failed': return Colors.light.pink;
      default: return Colors.light.charcoal;
    }
  };

  const handlePay = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay using ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => {
            Alert.alert('Success', 'Payment processed successfully!');
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Payments" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40) }
        ]}
      >
        <View style={styles.balanceCard}>
          <ThemedText style={styles.balanceLabel}>Available Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>₱1,280.00</ThemedText>
          <Pressable style={[styles.topUpButton, { borderColor: Colors.light.charcoal }]}>
            <MaterialIcons name="add-circle" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.topUpText}>Top Up</ThemedText>
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              style={[
                styles.methodItem,
                {
                  backgroundColor: '#ffffff',
                  borderColor: selectedMethod === method.id ? Colors.light.teal : Colors.light.charcoal,
                  borderWidth: selectedMethod === method.id ? 3 : 2,
                }
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, { backgroundColor: `${Colors.light.teal}20` }]}>
                  <MaterialIcons name={method.icon} size={24} color={Colors.light.charcoal} />
                </View>
                <View>
                  <ThemedText style={styles.methodLabel}>{method.label}</ThemedText>
                  <ThemedText style={styles.methodDetails}>{method.details}</ThemedText>
                </View>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <ThemedText style={styles.defaultText}>Default</ThemedText>
                </View>
              )}
              {selectedMethod === method.id && (
                <MaterialIcons name="check-circle" size={24} color={Colors.light.teal} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Payments</ThemedText>
          {RECENT_PAYMENTS.map((payment) => (
            <View
              key={payment.id}
              style={[
                styles.paymentItem,
                {
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
            >
              <View style={styles.paymentInfo}>
                <ThemedText style={styles.paymentLocation}>{payment.location}</ThemedText>
                <ThemedText style={styles.paymentDate}>{payment.date}</ThemedText>
              </View>
              <View style={styles.paymentRight}>
                <ThemedText style={styles.paymentAmount}>₱{payment.amount.toFixed(2)}</ThemedText>
                <View style={[styles.paymentStatus, { backgroundColor: `${getStatusColor(payment.status)}20` }]}>
                  <ThemedText style={[styles.paymentStatusText, { color: getStatusColor(payment.status) }]}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          style={[styles.payButton, { backgroundColor: Colors.light.yellow }]}
          onPress={handlePay}
        >
          <MaterialIcons name="payment" size={24} color={Colors.light.charcoal} />
          <ThemedText style={styles.payButtonText}>Pay Now</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.cream,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.md,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginVertical: Spacing.sm,
    color: Colors.light.charcoal,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  topUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  methodDetails: {
    fontSize: 13,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  defaultBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: `${Colors.light.teal}20`,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.teal,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  paymentInfo: {
    gap: 4,
  },
  paymentLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  paymentDate: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  paymentStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    marginTop: Spacing.sm,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
});