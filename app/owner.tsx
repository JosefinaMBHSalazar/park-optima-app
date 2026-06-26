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
  trend?: string;
  color?: string;
};

const STATS: StatItem[] = [
  { label: 'Total Spaces', value: '128', icon: 'local-parking', trend: '+12%', color: Colors.light.teal },
  { label: 'Occupied', value: '94', icon: 'local-parking', trend: '73%', color: Colors.light.green },
  { label: 'Revenue Today', value: '$1,780', icon: 'attach-money', trend: '+8%', color: Colors.light.yellow },
  { label: 'LPR Detections', value: '1,247', icon: 'camera-alt', trend: '+23%', color: Colors.light.purple },
];

const RECENT_DETECTIONS = [
  { plate: 'ABC-1234', vehicle: 'Toyota Camry', time: '2 min ago', status: 'Entry', color: Colors.light.green },
  { plate: 'XYZ-5678', vehicle: 'Honda Civic', time: '15 min ago', status: 'Exit', color: Colors.light.pink },
  { plate: 'DEF-9012', vehicle: 'Tesla Model 3', time: '32 min ago', status: 'Entry', color: Colors.light.green },
  { plate: 'GHI-3456', vehicle: 'Ford Mustang', time: '1 hour ago', status: 'Exit', color: Colors.light.pink },
];

const OCCUPANCY_DATA = [
  { name: 'Downtown Garage', occupied: '52/60', color: Colors.light.teal },
  { name: 'Airport Terminal', occupied: '32/40', color: Colors.light.purple },
  { name: 'Mall Parking', occupied: '28/35', color: Colors.light.orange },
];

const QUICK_ACTIONS = [
  { label: 'Scan License Plate', icon: 'camera-alt' as const, color: Colors.light.purple },
  { label: 'View Analytics', icon: 'analytics' as const, color: Colors.light.orange },
  { label: 'Manage Lots', icon: 'local-parking' as const, color: Colors.light.teal },
  { label: 'Reports', icon: 'assessment' as const, color: Colors.light.pink },
];

const MENU_ITEMS = [
  { icon: 'dashboard' as const, label: 'Dashboard', route: '/owner' },
  { icon: 'camera-alt' as const, label: 'LPR Scanner', route: '/owner/scan' },
  { icon: 'local-parking' as const, label: 'Parking Lots', route: '/owner/lots' },
  { icon: 'analytics' as const, label: 'Analytics', route: '/owner/analytics' },
  { icon: 'assessment' as const, label: 'Reports', route: '/owner/reports' },
];

export default function OwnerDashboard() {
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
            <ThemedText style={styles.greeting}>Hi, John 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>JD</ThemedText>
          </View>
        </View>

        <Pressable style={styles.regularOrderBanner}>
          <View style={styles.regularOrderContent}>
            <MaterialIcons name="camera-alt" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.regularOrderText}>Live LPR Feed</ThemedText>
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
            <ThemedText style={styles.sectionTitle}>Recent LPR Detections</ThemedText>
            <Pressable style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          {RECENT_DETECTIONS.map((detection, index) => (
            <View 
              key={index} 
              style={[
                styles.detectionItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
            >
              <View style={styles.detectionLeft}>
                <View style={[styles.detectionIcon, { backgroundColor: `${detection.color}30` }]}>
                  <MaterialIcons name="camera-alt" size={20} color={Colors.light.charcoal} />
                </View>
                <View>
                  <ThemedText style={styles.detectionPlate}>{detection.plate}</ThemedText>
                  <ThemedText style={styles.detectionVehicle}>{detection.vehicle}</ThemedText>
                </View>
              </View>
              <View style={styles.detectionRight}>
                <View style={[styles.detectionStatus, { backgroundColor: `${detection.color}30` }]}>
                  <ThemedText style={[styles.detectionStatusText, { color: detection.color }]}>
                    {detection.status}
                  </ThemedText>
                </View>
                <ThemedText style={styles.detectionTime}>{detection.time}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Occupancy Monitoring</ThemedText>
            <Pressable style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>View All</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {OCCUPANCY_DATA.map((lot, index) => (
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
                <View style={[styles.cardImage, { backgroundColor: `${lot.color}20` }]}>
                  <MaterialIcons name="local-parking" size={32} color={Colors.light.charcoal} />
                </View>
                <ThemedText style={styles.cardTitle}>{lot.name}</ThemedText>
                <ThemedText style={styles.cardSubtext}>{lot.occupied} occupied</ThemedText>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${(parseInt(lot.occupied.split('/')[0]) / parseInt(lot.occupied.split('/')[1])) * 100}%`,
                        backgroundColor: lot.color,
                      }
                    ]} 
                  />
                </View>
                <Pressable style={styles.cardButton}>
                  <ThemedText style={styles.cardButtonText}>Monitor</ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>
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
      </ScrollView>

      <Sidebar
        menuItems={MENU_ITEMS}
        activeRoute="/owner"
        userRole="owner"
        userName="John Doe"
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.charcoal,
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
  detectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  detectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detectionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectionPlate: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
    letterSpacing: 0.5,
  },
  detectionVehicle: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  detectionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  detectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  detectionStatusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detectionTime: {
    fontSize: 12,
    opacity: 0.5,
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
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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