import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type HistoryItem = {
  id: string;
  location: string;
  date: string;
  duration: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
};

const HISTORY_DATA: HistoryItem[] = [
  { id: '1', location: 'Terminal A - Lot 3', date: 'Today, 2:30 PM', duration: '2h 15m', amount: 8.50, status: 'completed' },
  { id: '2', location: 'Terminal B - Lot 1', date: 'Today, 10:00 AM', duration: '1h 05m', amount: 5.00, status: 'completed' },
  { id: '3', location: 'Terminal C - Lot 2', date: 'Yesterday, 9:00 AM', duration: '30m', amount: 3.50, status: 'pending' },
  { id: '4', location: 'Terminal A - Lot 5', date: 'Yesterday, 3:00 PM', duration: '45m', amount: 4.00, status: 'completed' },
  { id: '5', location: 'Terminal B - Lot 8', date: '2 days ago, 11:00 AM', duration: '1h 30m', amount: 6.00, status: 'cancelled' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.light.green;
      case 'pending': return Colors.light.yellow;
      case 'cancelled': return Colors.light.pink;
      default: return Colors.light.charcoal;
    }
  };

  const getStatusIcon = (status: string): keyof typeof MaterialIcons.glyphMap => {
    switch (status) {
      case 'completed': return 'check-circle';
      case 'pending': return 'hourglass-top';
      case 'cancelled': return 'cancel';
      default: return 'circle';
    }
  };

  const filteredData = HISTORY_DATA.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  const totalSpent = HISTORY_DATA
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="History" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40) }
        ]}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Total Trips</ThemedText>
            <ThemedText style={styles.summaryValue}>{HISTORY_DATA.length}</ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Total Spent</ThemedText>
            <ThemedText style={styles.summaryValue}>₱{totalSpent.toFixed(2)}</ThemedText>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterActive,
              { borderColor: Colors.light.charcoal }
            ]}
            onPress={() => setFilter('all')}
          >
            <ThemedText style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'completed' && styles.filterActive,
              { borderColor: Colors.light.charcoal }
            ]}
            onPress={() => setFilter('completed')}
          >
            <ThemedText style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              Completed
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'pending' && styles.filterActive,
              { borderColor: Colors.light.charcoal }
            ]}
            onPress={() => setFilter('pending')}
          >
            <ThemedText style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pending
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.historyList}>
          {filteredData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.historyItem,
                {
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                  borderLeftColor: getStatusColor(item.status),
                  borderLeftWidth: 4,
                }
              ]}
            >
              <View style={styles.historyHeader}>
                <ThemedText style={styles.historyLocation}>{item.location}</ThemedText>
                <View style={[styles.historyStatus, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                  <MaterialIcons 
                    name={getStatusIcon(item.status)} 
                    size={14} 
                    color={getStatusColor(item.status)} 
                  />
                  <ThemedText style={[styles.historyStatusText, { color: getStatusColor(item.status) }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.historyDetails}>
                <View style={styles.historyMeta}>
                  <MaterialIcons name="access-time" size={14} color={Colors.light.charcoal} />
                  <ThemedText style={styles.historyMetaText}>{item.date}</ThemedText>
                </View>
                <View style={styles.historyMeta}>
                  <MaterialIcons name="timer" size={14} color={Colors.light.charcoal} />
                  <ThemedText style={styles.historyMetaText}>{item.duration}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.historyAmount}>₱{item.amount.toFixed(2)}</ThemedText>
            </View>
          ))}
        </View>
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
    gap: Spacing.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
    color: Colors.light.charcoal,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.light.charcoal,
    opacity: 0.2,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  filterActive: {
    backgroundColor: Colors.light.teal,
    borderColor: Colors.light.teal,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  historyList: {
    gap: Spacing.md,
  },
  historyItem: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    gap: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  historyStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  historyDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyMetaText: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.charcoal,
    marginTop: 4,
  },
});