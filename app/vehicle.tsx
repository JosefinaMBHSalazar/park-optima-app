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

type ActivityItem = {
  label: string;
  amount: string;
  time: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  location: string;
  color?: string;
  plate?: string;
  status?: string;
};

const RECENT_ACTIVITY: ActivityItem[] = [
  { label: 'Parking Entry', amount: '$8.50', time: 'Today, 09:35', icon: 'login', location: 'Terminal A', color: Colors.light.teal, plate: 'ABC-1234', status: 'LPR Detected' },
  { label: 'Parking Exit', amount: '$5.00', time: 'Yesterday, 18:22', icon: 'logout', location: 'Downtown', color: Colors.light.yellow, plate: 'XYZ-5678', status: 'LPR Detected' },
  { label: 'Parking Entry', amount: '$7.00', time: 'Yesterday, 10:15', icon: 'login', location: 'Terminal A', color: Colors.light.pink, plate: 'DEF-9012', status: 'Manual' },
];

const LPR_HISTORY = [
  { plate: 'ABC-1234', location: 'Terminal A', time: '09:35 AM', status: 'Entry' },
  { plate: 'XYZ-5678', location: 'Downtown', time: '06:22 PM', status: 'Exit' },
  { plate: 'DEF-9012', location: 'Terminal A', time: '10:15 AM', status: 'Entry' },
];

const MENU_ITEMS = [
  { icon: 'dashboard' as const, label: 'Dashboard', route: '/vehicle' },
  { icon: 'camera-alt' as const, label: 'LPR History', route: '/vehicle/lpr' },
  { icon: 'account-balance-wallet' as const, label: 'Wallet', route: '/vehicle/wallet' },
  { icon: 'history' as const, label: 'History', route: '/vehicle/history' },
  { icon: 'settings' as const, label: 'Settings', route: '/vehicle/settings' },
];

export default function VehicleDashboard() {
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
            <ThemedText style={styles.greeting}>Hi, Bob 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={styles.avatar}>
            <MaterialIcons name="directions-car" size={24} color={Colors.light.charcoal} />
          </View>
        </View>

        <Pressable style={styles.regularOrderBanner}>
          <View style={styles.regularOrderContent}>
            <MaterialIcons name="camera-alt" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.regularOrderText}>View LPR History</ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.light.charcoal} />
        </Pressable>

        <View style={[
          styles.balanceCard,
          { 
            backgroundColor: Colors.light.yellow,
            borderColor: Colors.light.charcoal,
          }
        ]}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceHeaderLeft}>
              <ThemedText style={styles.balanceLabel}>Wallet Balance</ThemedText>
              <ThemedText style={styles.balanceSubtext}>Available for parking</ThemedText>
            </View>
            <View style={styles.balanceIconWrapper}>
              <MaterialIcons name="account-balance-wallet" size={28} color={Colors.light.charcoal} />
            </View>
          </View>
          <View style={styles.balanceAmountWrapper}>
            <ThemedText style={styles.balanceAmount}>
              $54.20
            </ThemedText>
          </View>
          <View style={styles.balanceActions}>
            <Pressable style={({ pressed }) => [
              styles.balanceAction,
              { 
                backgroundColor: '#ffffff',
                transform: [{ scale: pressed ? 0.97 : 1 }],
              }
            ]}>
              <MaterialIcons name="add-circle" size={18} color={Colors.light.charcoal} />
              <ThemedText style={styles.balanceActionText}>Top Up</ThemedText>
            </Pressable>
            <View style={styles.balanceDivider} />
            <Pressable style={({ pressed }) => [
              styles.balanceAction,
              { 
                backgroundColor: '#ffffff',
                transform: [{ scale: pressed ? 0.97 : 1 }],
              }
            ]}>
              <MaterialIcons name="history" size={18} color={Colors.light.charcoal} />
              <ThemedText style={styles.balanceActionText}>History</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.quickStats}>
          <View style={[
            styles.quickStat,
            { 
              backgroundColor: '#ffffff',
              borderColor: Colors.light.charcoal,
            }
          ]}>
            <ThemedText style={styles.quickStatValue}>12</ThemedText>
            <ThemedText style={styles.quickStatLabel}>Total Parking</ThemedText>
          </View>
          <View style={[
            styles.quickStat,
            { 
              backgroundColor: '#ffffff',
              borderColor: Colors.light.charcoal,
            }
          ]}>
            <ThemedText style={styles.quickStatValue}>$127.50</ThemedText>
            <ThemedText style={styles.quickStatLabel}>Total Spent</ThemedText>
          </View>
          <View style={[
            styles.quickStat,
            { 
              backgroundColor: '#ffffff',
              borderColor: Colors.light.charcoal,
            }
          ]}>
            <ThemedText style={styles.quickStatValue}>8</ThemedText>
            <ThemedText style={styles.quickStatLabel}>LPR Detections</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent LPR Activity</ThemedText>
            <Pressable style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          {LPR_HISTORY.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.listItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
            >
              <View style={styles.lprIcon}>
                <MaterialIcons name="camera-alt" size={20} color={Colors.light.charcoal} />
              </View>
              <View style={styles.lprContent}>
                <ThemedText style={styles.lprPlate}>{item.plate}</ThemedText>
                <View style={styles.lprMeta}>
                  <ThemedText style={styles.lprLocation}>{item.location}</ThemedText>
                  <View style={styles.lprDot} />
                  <ThemedText style={styles.lprTime}>{item.time}</ThemedText>
                </View>
              </View>
              <View style={[styles.lprStatus, { 
                backgroundColor: item.status === 'Entry' ? `${Colors.light.green}30` : `${Colors.light.pink}30`
              }]}>
                <ThemedText style={[styles.lprStatusText, { 
                  color: item.status === 'Entry' ? Colors.light.green : Colors.light.pink
                }]}>
                  {item.status}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.topUpButton,
            { 
              backgroundColor: Colors.light.yellow,
              borderColor: Colors.light.charcoal,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            }
          ]}
        >
          <MaterialIcons name="camera-alt" size={22} color={Colors.light.charcoal} />
          <ThemedText style={styles.topUpButtonText}>
            Register License Plate
          </ThemedText>
        </Pressable>
      </ScrollView>

      <Sidebar
        menuItems={MENU_ITEMS}
        activeRoute="/vehicle"
        userRole="vehicle"
        userName="Bob Wilson"
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
  balanceCard: {
    borderRadius: Radius.md,
    padding: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.yellow,
    minHeight: 170,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  balanceHeaderLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  balanceLabel: {
    color: Colors.light.charcoal,
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.8,
  },
  balanceSubtext: {
    color: Colors.light.charcoal,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.5,
  },
  balanceIconWrapper: {
    marginTop: -4,
  },
  balanceAmountWrapper: {
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 44,
    color: Colors.light.charcoal,
    fontWeight: '700',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 50,
  },
  balanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  balanceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  balanceActionText: {
    color: Colors.light.charcoal,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceDivider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.light.charcoal,
    opacity: 0.2,
  },
  quickStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickStat: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  quickStatValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  quickStatLabel: {
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  lprIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: `${Colors.light.purple}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  lprContent: {
    flex: 1,
  },
  lprPlate: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
    letterSpacing: 0.5,
  },
  lprMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  lprLocation: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  lprDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.charcoal,
    opacity: 0.3,
  },
  lprTime: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  lprStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  lprStatusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.yellow,
    marginTop: Spacing.sm,
  },
  topUpButtonText: {
    color: Colors.light.charcoal,
    fontSize: 16,
    fontWeight: '600',
  },
});