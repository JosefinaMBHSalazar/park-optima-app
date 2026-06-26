import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, BackHandler, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DashboardHeader } from '@/components/dashboard-header';
import { Sidebar } from '@/components/sidebar';
import { LogoutModal } from '@/components/logout-modal';

const { width } = Dimensions.get('window');

type StatItem = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
  trend?: string;
  subtext?: string;
  color?: string;
};

const STATS: StatItem[] = [
  { label: 'Current Lot', value: 'Terminal A', icon: 'local-parking', badge: 'Active', color: Colors.light.teal },
  { label: 'Vehicles Served', value: '18', icon: 'directions-car', trend: '+4', color: Colors.light.green },
  { label: 'LPR Scans', value: '247', icon: 'camera-alt', trend: '+12%', color: Colors.light.purple },
  { label: "Today's Total", value: '$430', icon: 'attach-money', trend: '+12%', color: Colors.light.yellow },
];

const QUICK_ACTIONS = [
  { label: 'Scan LPR Entry', icon: 'camera-alt' as const, color: Colors.light.purple },
  { label: 'Vehicle Exit', icon: 'logout' as const, color: Colors.light.yellow },
  { label: 'View Queue', icon: 'queue' as const, color: Colors.light.pink },
  { label: 'Manual Entry', icon: 'edit' as const, color: Colors.light.orange },
];

const ACTIVE_VEHICLES = [
  { name: 'Toyota Camry', ticket: '#023', time: '2h 15m', plate: 'ABC-1234', status: 'LPR Detected' },
  { name: 'Honda Civic', ticket: '#045', time: '1h 05m', plate: 'XYZ-5678', status: 'LPR Detected' },
  { name: 'Tesla Model 3', ticket: '#067', time: '30m', plate: 'EV-2024', status: 'Manual' },
];

const MENU_ITEMS = [
  { icon: 'dashboard' as const, label: 'Dashboard', route: '/attendant' },
  { icon: 'camera-alt' as const, label: 'LPR Scanner', route: '/attendant/scan' },
  { icon: 'login' as const, label: 'Vehicle Entry', route: '/attendant/entry' },
  { icon: 'logout' as const, label: 'Vehicle Exit', route: '/attendant/exit' },
  { icon: 'queue' as const, label: 'Queue', route: '/attendant/queue' },
];

export default function AttendantDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sidebarVisible) {
        setSidebarVisible(false);
        return true;
      }
      setLogoutModalVisible(true);
      return true;
    });
    return () => backHandler.remove();
  }, [sidebarVisible]);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.replace('/');
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Dashboard" 
        onMenuPress={() => setSidebarVisible(true)}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content, 
          { 
            paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40),
          }
        ]}
      >
        <View style={styles.welcomeSection}>
          <View>
            <ThemedText style={styles.greeting}>Hi, Jane 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={[styles.shiftBadge, { backgroundColor: Colors.light.green }]}>
            <View style={styles.shiftDot} />
            <ThemedText style={styles.shiftText}>On Duty</ThemedText>
          </View>
        </View>

        <Pressable style={styles.regularOrderBanner}>
          <View style={styles.regularOrderContent}>
            <MaterialIcons name="camera-alt" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.regularOrderText}>Start LPR Scan</ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.light.charcoal} />
        </Pressable>

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
                  <View style={[styles.statusBadge, { backgroundColor: `${Colors.light.green}30` }]}>
                    <View style={styles.statusDot} />
                    <ThemedText style={styles.statusText}>{stat.badge}</ThemedText>
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
              {stat.subtext && (
                <ThemedText style={styles.statSubtext}>- {stat.subtext}</ThemedText>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionGrid}>
            {QUICK_ACTIONS.map((action, index) => (
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Active Vehicles</ThemedText>
            <Pressable style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>View All</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {ACTIVE_VEHICLES.map((vehicle, index) => (
              <View 
                key={index} 
                style={[
                  styles.horizontalCard,
                  { 
                    backgroundColor: '#ffffff',
                    borderColor: Colors.light.charcoal,
                  }
                ]}
              >
                <View style={[styles.cardImage, { 
                  backgroundColor: index === 0 ? `${Colors.light.purple}30` : 
                                  index === 1 ? `${Colors.light.teal}30` : 
                                  `${Colors.light.orange}30` 
                }]}>
                  <MaterialIcons name="directions-car" size={32} color={Colors.light.charcoal} />
                </View>
                <ThemedText style={styles.cardTitle}>{vehicle.name}</ThemedText>
                <ThemedText style={styles.cardSubtext}>{vehicle.plate}</ThemedText>
                <View style={styles.cardMeta}>
                  <View style={styles.ticketBadge}>
                    <ThemedText style={styles.ticketText}>{vehicle.ticket}</ThemedText>
                  </View>
                  <View style={[styles.statusBadgeSmall, { 
                    backgroundColor: vehicle.status === 'LPR Detected' ? `${Colors.light.purple}30` : `${Colors.light.orange}30`
                  }]}>
                    <ThemedText style={styles.statusBadgeText}>{vehicle.status}</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.cardTime}>{vehicle.time}</ThemedText>
                <Pressable style={styles.cardButton}>
                  <ThemedText style={styles.cardButtonText}>Manage</ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Sidebar
        menuItems={MENU_ITEMS}
        activeRoute="/attendant"
        userRole="attendant"
        userName="Jane Smith"
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onOpen={() => setSidebarVisible(true)}
        onLogoutPress={() => setLogoutModalVisible(true)}
      />

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
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  shiftDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.charcoal,
  },
  shiftText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.charcoal,
    letterSpacing: 0.5,
  },
  regularOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.yellow,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  regularOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regularOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
    letterSpacing: 0.3,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.charcoal,
  },
  statusText: {
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
  statSubtext: {
    fontSize: 13,
    opacity: 0.4,
    marginTop: 0,
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.light.charcoal,
    fontWeight: '600',
    opacity: 0.6,
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
  horizontalScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 4,
  },
  horizontalCard: {
    width: width * 0.6,
    marginRight: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  cardSubtext: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ticketBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  ticketText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  statusBadgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  cardTime: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.charcoal,
    opacity: 0.6,
    marginTop: 2,
  },
  cardButton: {
    marginTop: Spacing.sm,
    padding: 8,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.yellow,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
});