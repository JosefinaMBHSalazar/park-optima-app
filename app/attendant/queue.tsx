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

type QueueItem = {
  id: string;
  plate: string;
  position: number;
  waitTime: string;
  status: 'waiting' | 'processing' | 'completed';
};

const QUEUE_DATA: QueueItem[] = [
  { id: '1', plate: 'ABC-1234', position: 1, waitTime: '2 min', status: 'processing' },
  { id: '2', plate: 'XYZ-5678', position: 2, waitTime: '5 min', status: 'waiting' },
  { id: '3', plate: 'EV-2024', position: 3, waitTime: '8 min', status: 'waiting' },
  { id: '4', plate: 'CAR-9876', position: 4, waitTime: '12 min', status: 'waiting' },
  { id: '5', plate: 'BIKE-001', position: 5, waitTime: '15 min', status: 'waiting' },
];

export default function QueueScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [queue, setQueue] = useState<QueueItem[]>(QUEUE_DATA);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return Colors.light.yellow;
      case 'waiting': return Colors.light.teal;
      case 'completed': return Colors.light.green;
      default: return Colors.light.charcoal;
    }
  };

  const getStatusIcon = (status: string): keyof typeof MaterialIcons.glyphMap => {
    switch (status) {
      case 'processing': return 'hourglass-top';
      case 'waiting': return 'schedule';
      case 'completed': return 'check-circle';
      default: return 'circle';
    }
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Queue" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40) }
        ]}
      >
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.queueTitle}>Current Queue</ThemedText>
            <ThemedText style={styles.queueSubtitle}>{queue.length} vehicles waiting</ThemedText>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{queue.filter(q => q.status === 'waiting').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Waiting</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{queue.filter(q => q.status === 'processing').length}</ThemedText>
              <ThemedText style={styles.statLabel}>Processing</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.queueList}>
          {queue.map((item) => (
            <View 
              key={item.id}
              style={[
                styles.queueItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                  borderLeftColor: getStatusColor(item.status),
                  borderLeftWidth: 4,
                }
              ]}
            >
              <View style={styles.queuePosition}>
                <ThemedText style={styles.positionNumber}>#{item.position}</ThemedText>
              </View>
              <View style={styles.queueInfo}>
                <ThemedText style={styles.queuePlate}>{item.plate}</ThemedText>
                <View style={styles.queueMeta}>
                  <MaterialIcons name="access-time" size={14} color={Colors.light.charcoal} />
                  <ThemedText style={styles.queueTime}>{item.waitTime}</ThemedText>
                </View>
              </View>
              <View style={[styles.queueStatus, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                <MaterialIcons 
                  name={getStatusIcon(item.status)} 
                  size={16} 
                  color={getStatusColor(item.status)} 
                />
                <ThemedText style={[styles.queueStatusText, { color: getStatusColor(item.status) }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          style={[styles.refreshButton, { borderColor: Colors.light.charcoal }]}
          onPress={() => {
            // Refresh queue logic here
          }}
        >
          <MaterialIcons name="refresh" size={20} color={Colors.light.charcoal} />
          <ThemedText style={styles.refreshText}>Refresh Queue</ThemedText>
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
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  queueTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  queueSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.charcoal,
    opacity: 0.2,
  },
  queueList: {
    gap: Spacing.sm,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
    gap: Spacing.md,
  },
  queuePosition: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.light.charcoal}10`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.charcoal,
  },
  positionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  queueInfo: {
    flex: 1,
  },
  queuePlate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  queueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  queueTime: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  queueStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  queueStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
    marginTop: Spacing.sm,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
});