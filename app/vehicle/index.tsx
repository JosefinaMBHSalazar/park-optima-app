import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, BackHandler, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DashboardHeader } from '@/components/dashboard-header';
import { LogoutModal } from '@/components/logout-modal';
import { events } from '@/utils/events';

const { width } = Dimensions.get('window');

type StatItem = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
  trend?: string;
  color?: string;
};

const STATS: StatItem[] = [
  { label: 'Current Balance', value: '₱1,280', icon: 'account-balance', badge: 'Active', color: Colors.light.teal },
  { label: 'Trips Today', value: '4', icon: 'directions-car', trend: '+2', color: Colors.light.green },
  { label: 'Total Spent', value: '₱430', icon: 'attach-money', trend: '+12%', color: Colors.light.purple },
  { label: 'Parking Status', value: 'Parked', icon: 'local-parking', badge: 'Terminal A', color: Colors.light.yellow },
];

type ParkingSession = {
  id: string;
  location: string;
  startTime: string;
  duration: string;
  amount: number;
  status: 'active' | 'completed' | 'pending';
};

const PARKING_SESSIONS: ParkingSession[] = [
  { id: '1', location: 'Terminal A - Lot 3', startTime: '2:30 PM', duration: '2h 15m', amount: 8.50, status: 'active' },
  { id: '2', location: 'Terminal B - Lot 1', startTime: '10:00 AM', duration: '1h 05m', amount: 5.00, status: 'completed' },
  { id: '3', location: 'Terminal C - Lot 2', startTime: '9:00 AM', duration: '30m', amount: 3.50, status: 'completed' },
];

export default function VehicleDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = events.addListener('logout', () => {
      setLogoutModalVisible(true);
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setLogoutModalVisible(true);
      return true;
    });
    
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.replace('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.light.green;
      case 'completed': return Colors.light.purple;
      case 'pending': return Colors.light.yellow;
      default: return Colors.light.charcoal;
    }
  };

  const getStatusIcon = (status: string): keyof typeof MaterialIcons.glyphMap => {
    switch (status) {
      case 'active': return 'check-circle';
      case 'completed': return 'check-circle';
      case 'pending': return 'hourglass-top';
      default: return 'circle';
    }
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Vehicle Dashboard" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content, 
          { 
            paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40),
            paddingTop: Spacing.md,
          }
        ]}
      >
        <View style={styles.welcomeSection}>
          <View>
            <ThemedText style={styles.greeting}>Hi, Driver 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: Colors.light.green }]}>
            <View style={styles.statusDot} />
            <ThemedText style={styles.statusText}>Active</ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statCard,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}30` }]}>
                  <MaterialIcons 
                    name={stat.icon} 
                    size={22} 
                    color={Colors.light.charcoal} 
                  />
                </View>
                {stat.badge && (
                  <View style={[styles.statusBadgeSmall, { backgroundColor: `${Colors.light.green}30` }]}>
                    <View style={styles.statusDotSmall} />
                    <ThemedText style={styles.statusTextSmall}>{stat.badge}</ThemedText>
                  </View>
                )}
                {stat.trend && (
                  <View style={[
                    styles.trendBadge,
                    { backgroundColor: stat.trend.startsWith('+') ? `${Colors.light.green}30` : `${Colors.light.pink}30` }
                  ]}>
                    <ThemedText style={[
                      styles.trendText,
                      { color: Colors.light.charcoal }
                    ]}>
                      {stat.trend}
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.statValue}>
                {stat.value}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Active Parking</ThemedText>
            <Pressable onPress={() => router.push('/vehicle/history')}>
              <ThemedText style={styles.seeAll}>See All</ThemedText>
            </Pressable>
          </View>
          {PARKING_SESSIONS.filter(s => s.status === 'active').map((session) => (
            <View 
              key={session.id}
              style={[
                styles.parkingItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                  borderLeftColor: getStatusColor(session.status),
                  borderLeftWidth: 4,
                }
              ]}
            >
              <View style={styles.parkingInfo}>
                <ThemedText style={styles.parkingLocation}>{session.location}</ThemedText>
                <View style={styles.parkingMeta}>
                  <MaterialIcons name="access-time" size={14} color={Colors.light.charcoal} />
                  <ThemedText style={styles.parkingTime}>{session.startTime} • {session.duration}</ThemedText>
                </View>
              </View>
              <View style={styles.parkingStatus}>
                <View style={[styles.parkingStatusBadge, { backgroundColor: `${getStatusColor(session.status)}20` }]}>
                  <MaterialIcons 
                    name={getStatusIcon(session.status)} 
                    size={14} 
                    color={getStatusColor(session.status)} 
                  />
                  <ThemedText style={[styles.parkingStatusText, { color: getStatusColor(session.status) }]}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.parkingAmount}>₱{session.amount.toFixed(2)}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionGrid}>
            {[
              { label: 'Pay Parking', icon: 'payment' as const, color: Colors.light.purple, route: '/vehicle/payments' },
              { label: 'View History', icon: 'history' as const, color: Colors.light.teal, route: '/vehicle/history' },
              { label: 'Parking Map', icon: 'map' as const, color: Colors.light.green, route: null },
              { label: 'Support', icon: 'support-agent' as const, color: Colors.light.pink, route: null },
            ].map((action, index) => (
              <Pressable 
                key={index}
                style={({ pressed }) => [
                  styles.actionButton,
                  { 
                    backgroundColor: '#ffffff',
                    borderColor: Colors.light.charcoal,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
                onPress={() => {
                  if (action.route) {
                    router.push(action.route as any);
                  }
                }}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: `${action.color}30` }]}>
                  <MaterialIcons name={action.icon} size={24} color={Colors.light.charcoal} />
                </View>
                <ThemedText style={styles.actionLabel}>
                  {action.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onLogout={handleLogout}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.cream,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.6,
    letterSpacing: 0.3,
    color: Colors.light.charcoal,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
    color: Colors.light.charcoal,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.charcoal,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.charcoal,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  statusDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.charcoal,
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  trendBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
    fontWeight: '500',
    color: Colors.light.charcoal,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Colors.light.charcoal,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.teal,
  },
  parkingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
  },
  parkingInfo: {
    flex: 1,
    gap: 4,
  },
  parkingLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  parkingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  parkingTime: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  parkingStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  parkingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  parkingStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  parkingAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.charcoal,
  },
});