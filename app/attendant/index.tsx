import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, BackHandler, Dimensions, Modal, Alert, TextInput } from 'react-native';
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
  subtext?: string;
  color?: string;
};

type VehicleEntry = {
  id: string;
  plate: string;
  status: 'parked' | 'exited' | 'unpaid';
  time: string;
  amount?: number;
};

const STATS: StatItem[] = [
  { label: 'Current Lot', value: 'Terminal A', icon: 'local-parking', badge: 'Active', color: Colors.light.teal },
  { label: 'Vehicles Served', value: '18', icon: 'directions-car', trend: '+4', color: Colors.light.green },
  { label: 'LPR Scans', value: '247', icon: 'camera-alt', trend: '+12%', color: Colors.light.purple },
  { label: "Today's Total", value: '₱430', icon: 'attach-money', trend: '+12%', color: Colors.light.yellow },
];

const PARKED_VEHICLES: VehicleEntry[] = [
  { id: '1', plate: 'ABC-1234', status: 'parked', time: '2h 15m', amount: 8.50 },
  { id: '2', plate: 'XYZ-5678', status: 'parked', time: '1h 05m', amount: 5.00 },
  { id: '3', plate: 'EV-2024', status: 'unpaid', time: '30m', amount: 7.00 },
];

const QUICK_ACTIONS = [
  { label: 'Scan Entry', icon: 'camera-alt' as const, color: Colors.light.purple, route: '/attendant/entry' },
  { label: 'Scan Exit', icon: 'logout' as const, color: Colors.light.yellow, route: '/attendant/exit' },
  { label: 'Top Up Balance', icon: 'add-circle' as const, color: Colors.light.green, route: null },
  { label: 'View Queue', icon: 'queue' as const, color: Colors.light.pink, route: '/attendant/queue' },
  { label: 'Alerts', icon: 'notifications' as const, color: Colors.light.orange, route: null },
];

export default function AttendantDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [scanType, setScanType] = useState<'entry' | 'exit'>('entry');
  const [plateNumber, setPlateNumber] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [vehicles, setVehicles] = useState<VehicleEntry[]>(PARKED_VEHICLES);

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

  const handleScan = () => {
    if (!plateNumber) {
      Alert.alert('Error', 'Please enter a plate number');
      return;
    }

    if (scanType === 'entry') {
      const newVehicle: VehicleEntry = {
        id: Date.now().toString(),
        plate: plateNumber.toUpperCase(),
        status: 'parked',
        time: 'Just now',
        amount: 0,
      };
      setVehicles([newVehicle, ...vehicles]);
      Alert.alert('Success', `Vehicle ${plateNumber.toUpperCase()} entered successfully`);
    } else {
      const vehicle = vehicles.find(v => v.plate === plateNumber.toUpperCase());
      if (vehicle) {
        if (vehicle.status === 'unpaid') {
          Alert.alert('Payment Required', `Vehicle ${plateNumber.toUpperCase()} has unpaid fees. Please process payment first.`);
          return;
        }
        if (vehicle.amount && vehicle.amount > 0) {
          Alert.alert('Auto-Payment', `₱${vehicle.amount.toFixed(2)} will be deducted from wallet`);
          setVehicles(vehicles.filter(v => v.id !== vehicle.id));
          Alert.alert('Success', `Vehicle ${plateNumber.toUpperCase()} exited successfully. Payment processed.`);
        } else {
          setVehicles(vehicles.filter(v => v.id !== vehicle.id));
          Alert.alert('Success', `Vehicle ${plateNumber.toUpperCase()} exited successfully.`);
        }
      } else {
        Alert.alert('Error', 'Vehicle not found');
      }
    }
    setScanModalVisible(false);
    setPlateNumber('');
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Success', `₱${amount.toFixed(2)} added to balance`);
    setTopUpModalVisible(false);
    setTopUpAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'parked': return Colors.light.green;
      case 'exited': return Colors.light.purple;
      case 'unpaid': return Colors.light.pink;
      default: return Colors.light.charcoal;
    }
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Attendant Dashboard" 
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
            <ThemedText style={styles.greeting}>Hi, Jane 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={[styles.shiftBadge, { backgroundColor: Colors.light.green }]}>
            <View style={styles.shiftDot} />
            <ThemedText style={styles.shiftText}>On Duty</ThemedText>
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <Pressable style={[styles.bannerButton, { backgroundColor: Colors.light.yellow }]} onPress={() => router.push('/attendant/entry')}>
            <MaterialIcons name="camera-alt" size={24} color={Colors.light.charcoal} />
            <View>
              <ThemedText style={styles.bannerButtonTitle}>Scan Plate Entry</ThemedText>
              <ThemedText style={styles.bannerButtonSub}>Quick LPR entry scan</ThemedText>
            </View>
          </Pressable>
          <Pressable style={[styles.bannerButton, { backgroundColor: Colors.light.purple }]} onPress={() => router.push('/attendant/exit')}>
            <MaterialIcons name="logout" size={24} color={Colors.light.charcoal} />
            <View>
              <ThemedText style={styles.bannerButtonTitle}>Scan Plate Exit</ThemedText>
              <ThemedText style={styles.bannerButtonSub}>Auto-payment on exit</ThemedText>
            </View>
          </Pressable>
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
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Active Vehicles</ThemedText>
            <View style={styles.alertBadge}>
              <MaterialIcons name="notifications" size={18} color={Colors.light.pink} />
              <ThemedText style={styles.alertBadgeText}>2 unpaid</ThemedText>
            </View>
          </View>
          {vehicles.map((vehicle, index) => (
            <View 
              key={index} 
              style={[
                styles.vehicleItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                  borderLeftColor: getStatusColor(vehicle.status),
                  borderLeftWidth: 4,
                }
              ]}
            >
              <View style={styles.vehicleInfo}>
                <View>
                  <ThemedText style={styles.vehiclePlate}>{vehicle.plate}</ThemedText>
                  <ThemedText style={styles.vehicleTime}>{vehicle.time}</ThemedText>
                </View>
              </View>
              <View style={styles.vehicleStatus}>
                {vehicle.amount && vehicle.amount > 0 && (
                  <View style={styles.vehicleAmount}>
                    <MaterialIcons name="attach-money" size={16} color={Colors.light.charcoal} />
                    <ThemedText style={styles.vehicleAmountText}>₱{vehicle.amount.toFixed(2)}</ThemedText>
                  </View>
                )}
                <View style={[styles.vehicleStatusBadge, { backgroundColor: `${getStatusColor(vehicle.status)}20` }]}>
                  <ThemedText style={[styles.vehicleStatusText, { color: getStatusColor(vehicle.status) }]}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
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
                onPress={() => {
                  if (action.route) {
                    router.push(action.route as any);
                  } else if (action.label === 'Top Up Balance') {
                    setTopUpModalVisible(true);
                  } else if (action.label === 'Alerts') {
                    Alert.alert('Alerts', 'No new alerts');
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

      <Modal
        visible={scanModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setScanModalVisible(false)} />
          <View style={[styles.modalContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {scanType === 'entry' ? 'Scan Entry' : 'Scan Exit'}
              </ThemedText>
              <Pressable onPress={() => setScanModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.charcoal} />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.scanIconContainer}>
                <View style={[styles.scanIcon, { backgroundColor: scanType === 'entry' ? `${Colors.light.purple}30` : `${Colors.light.yellow}30` }]}>
                  <MaterialIcons name="camera-alt" size={48} color={Colors.light.charcoal} />
                </View>
              </View>
              
              <ThemedText style={styles.modalLabel}>License Plate Number</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={plateNumber}
                  onChangeText={setPlateNumber}
                  placeholder="ABC-1234"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="characters"
                />
              </View>

              <Pressable 
                style={styles.scanButton}
                onPress={handleScan}
              >
                <MaterialIcons name={scanType === 'entry' ? 'login' : 'logout'} size={20} color={Colors.light.charcoal} />
                <ThemedText style={styles.scanButtonText}>
                  {scanType === 'entry' ? 'Process Entry' : 'Process Exit'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={topUpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTopUpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setTopUpModalVisible(false)} />
          <View style={[styles.modalContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Top Up Balance</ThemedText>
              <Pressable onPress={() => setTopUpModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.charcoal} />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.topUpIconContainer}>
                <View style={[styles.topUpIcon, { backgroundColor: `${Colors.light.green}30` }]}>
                  <MaterialIcons name="add-circle" size={48} color={Colors.light.charcoal} />
                </View>
              </View>

              <View style={styles.quickAmountGrid}>
                {[10, 20, 50, 100].map((amount) => (
                  <Pressable
                    key={amount}
                    style={[styles.quickAmountButton, { borderColor: Colors.light.charcoal }]}
                    onPress={() => setTopUpAmount(amount.toString())}
                  >
                    <ThemedText style={styles.quickAmountText}>₱{amount}</ThemedText>
                  </Pressable>
                ))}
              </View>
              
              <ThemedText style={styles.modalLabel}>Or Enter Amount</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={topUpAmount}
                  onChangeText={setTopUpAmount}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>

              <Pressable 
                style={styles.scanButton}
                onPress={handleTopUp}
              >
                <MaterialIcons name="add-circle" size={20} color={Colors.light.charcoal} />
                <ThemedText style={styles.scanButtonText}>Add Funds</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  bannerContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  bannerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.yellow,
  },
  bannerButtonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  bannerButtonSub: {
    fontSize: 11,
    opacity: 0.6,
    color: Colors.light.charcoal,
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
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.light.pink}20`,
    borderWidth: 1,
    borderColor: Colors.light.pink,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.pink,
  },
  vehicleItem: {
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
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehiclePlate: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  vehicleTime: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  vehicleStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  vehicleAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  vehicleAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  vehicleStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  vehicleStatusText: {
    fontSize: 11,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    gap: Spacing.md,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  scanIconContainer: {
    alignItems: 'center',
  },
  scanIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    backgroundColor: '#ffffff',
  },
  input: {
    padding: 14,
    fontSize: 16,
    borderRadius: Radius.md,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.yellow,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    marginTop: Spacing.sm,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  topUpIconContainer: {
    alignItems: 'center',
  },
  topUpIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmountGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAmountButton: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
  },
});