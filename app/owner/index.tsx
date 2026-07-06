import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, BackHandler, Dimensions, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';
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
  trend?: string;
  color?: string;
};

type ChartData = {
  label: string;
  value: number;
  color: string;
};

type Report = {
  id: string;
  title: string;
  date: string;
  type: 'revenue' | 'occupancy' | 'financial';
};

const QUICK_ACTIONS = [
  { label: 'Generate Report', icon: 'assessment' as const, color: Colors.light.purple },
  { label: 'View Analytics', icon: 'analytics' as const, color: Colors.light.orange },
  { label: 'Manage Lots', icon: 'local-parking' as const, color: Colors.light.teal },
  { label: 'Revenue Chart', icon: 'show-chart' as const, color: Colors.light.green },
];

const STATS: StatItem[] = [
  { label: 'Total Spaces', value: '128', icon: 'local-parking', trend: '+12%', color: Colors.light.teal },
  { label: 'Occupied', value: '94', icon: 'local-parking', trend: '73%', color: Colors.light.green },
  { label: 'Revenue Today', value: '₱1,780', icon: 'attach-money', trend: '+8%', color: Colors.light.yellow },
  { label: 'LPR Detections', value: '1,247', icon: 'camera-alt', trend: '+23%', color: Colors.light.purple },
];

const OCCUPANCY_TREND: ChartData[] = [
  { label: 'Mon', value: 65, color: Colors.light.teal },
  { label: 'Tue', value: 72, color: Colors.light.teal },
  { label: 'Wed', value: 78, color: Colors.light.teal },
  { label: 'Thu', value: 85, color: Colors.light.teal },
  { label: 'Fri', value: 92, color: Colors.light.teal },
  { label: 'Sat', value: 70, color: Colors.light.teal },
  { label: 'Sun', value: 55, color: Colors.light.teal },
];

const RECENT_REPORTS: Report[] = [
  { id: '1', title: 'Monthly Revenue Report', date: 'Mar 2024', type: 'revenue' },
  { id: '2', title: 'Occupancy Analytics', date: 'Mar 2024', type: 'occupancy' },
  { id: '3', title: 'Financial Summary', date: 'Q1 2024', type: 'financial' },
];

type DrawerNavigation = DrawerNavigationProp<any>;

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigation>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('Last 7 days');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

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

  const renderChartBar = (data: ChartData, maxValue: number) => {
    const height = (data.value / maxValue) * 120;
    return (
      <View key={data.label} style={styles.chartBarContainer}>
        <View style={[styles.chartBar, { height: Math.max(height, 20), backgroundColor: data.color }]} />
        <ThemedText style={styles.chartLabel}>{data.label}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Owner Dashboard" 
        onMenuPress={openDrawer}
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
            <ThemedText style={styles.greeting}>Hi, John 👋</ThemedText>
            <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          </View>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>JD</ThemedText>
          </View>
        </View>

        <Pressable style={styles.regularOrderBanner} onPress={() => setShowReportModal(true)}>
          <View style={styles.regularOrderContent}>
            <MaterialIcons name="assessment" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.regularOrderText}>Generate New Report</ThemedText>
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
            <ThemedText style={styles.sectionTitle}>Occupancy Trend</ThemedText>
            <Pressable style={styles.seeAllButton} onPress={() => setShowChartModal(true)}>
              <ThemedText style={styles.seeAllText}>View Full</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          <View style={[styles.chartContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <View style={styles.chartBars}>
              {OCCUPANCY_TREND.map((item) => renderChartBar(item, 100))}
            </View>
            <View style={styles.chartStats}>
              <View style={styles.chartStat}>
                <View style={[styles.chartDot, { backgroundColor: Colors.light.teal }]} />
                <ThemedText style={styles.chartStatText}>Occupancy Rate</ThemedText>
              </View>
              <ThemedText style={styles.chartStatValue}>74% Avg</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Reports</ThemedText>
            <Pressable style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.charcoal} />
            </Pressable>
          </View>
          {RECENT_REPORTS.map((report, index) => (
            <Pressable 
              key={index} 
              style={[
                styles.reportItem,
                { 
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
            >
              <View style={styles.reportLeft}>
                <View style={[styles.reportIcon, { backgroundColor: 
                  report.type === 'revenue' ? `${Colors.light.green}30` : 
                  report.type === 'occupancy' ? `${Colors.light.purple}30` : 
                  `${Colors.light.yellow}30`
                }]}>
                  <MaterialIcons 
                    name={report.type === 'revenue' ? 'attach-money' : 
                          report.type === 'occupancy' ? 'analytics' : 
                          'assessment'} 
                    size={20} 
                    color={Colors.light.charcoal} 
                  />
                </View>
                <View>
                  <ThemedText style={styles.reportTitle}>{report.title}</ThemedText>
                  <ThemedText style={styles.reportDate}>{report.date}</ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.light.charcoal} />
            </Pressable>
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
      </ScrollView>

      <Modal
        visible={showReportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowReportModal(false)} />
          <View style={[styles.modalContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Generate Report</ThemedText>
              <Pressable onPress={() => setShowReportModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.charcoal} />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <ThemedText style={styles.modalLabel}>Report Type</ThemedText>
              <View style={styles.reportTypeGrid}>
                {['Revenue', 'Occupancy', 'Financial', 'Custom'].map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.reportTypeButton,
                      selectedReportType === type.toLowerCase() && styles.reportTypeButtonActive,
                      { borderColor: Colors.light.charcoal }
                    ]}
                    onPress={() => setSelectedReportType(type.toLowerCase())}
                  >
                    <ThemedText style={[
                      styles.reportTypeText,
                      selectedReportType === type.toLowerCase() && styles.reportTypeTextActive
                    ]}>
                      {type}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              <ThemedText style={styles.modalLabel}>Date Range</ThemedText>
              <View style={styles.dateRangeGrid}>
                {['Today', 'Last 7 days', 'Last 30 days', 'Custom'].map((range) => (
                  <Pressable
                    key={range}
                    style={[
                      styles.dateRangeButton,
                      dateRange === range && styles.dateRangeButtonActive,
                      { borderColor: Colors.light.charcoal }
                    ]}
                    onPress={() => setDateRange(range)}
                  >
                    <ThemedText style={[
                      styles.dateRangeText,
                      dateRange === range && styles.dateRangeTextActive
                    ]}>
                      {range}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              <Pressable 
                style={styles.generateButton}
                onPress={() => {
                  setShowReportModal(false);
                }}
              >
                <ThemedText style={styles.generateButtonText}>Generate Report</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showChartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowChartModal(false)} />
          <View style={[styles.modalContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Occupancy Trend</ThemedText>
              <Pressable onPress={() => setShowChartModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.charcoal} />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.chartFullContainer}>
                {OCCUPANCY_TREND.map((item) => renderChartBar(item, 100))}
              </View>
              <View style={styles.chartStats}>
                <View style={styles.chartStat}>
                  <View style={[styles.chartDot, { backgroundColor: Colors.light.teal }]} />
                  <ThemedText style={styles.chartStatText}>Occupancy Rate</ThemedText>
                </View>
                <ThemedText style={styles.chartStatValue}>74% Avg</ThemedText>
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.chartLegendItem}>
                  <View style={[styles.chartLegendDot, { backgroundColor: Colors.light.teal }]} />
                  <ThemedText style={styles.chartLegendText}>Current Week</ThemedText>
                </View>
                <View style={styles.chartLegendItem}>
                  <View style={[styles.chartLegendDot, { backgroundColor: Colors.light.purple }]} />
                  <ThemedText style={styles.chartLegendText}>Previous Week</ThemedText>
                </View>
              </View>
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
    marginTop: Spacing.sm,
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
  chartContainer: {
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingVertical: Spacing.sm,
  },
  chartBarContainer: {
    alignItems: 'center',
    gap: 4,
  },
  chartBar: {
    width: 24,
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 11,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  chartStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartStatText: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  chartStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  reportDate: {
    fontSize: 12,
    opacity: 0.5,
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
    color: Colors.light.charcoal,
  },
  modalBody: {
    gap: Spacing.md,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  reportTypeButton: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
  },
  reportTypeButtonActive: {
    backgroundColor: Colors.light.yellow,
  },
  reportTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.charcoal,
  },
  reportTypeTextActive: {
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  dateRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dateRangeButton: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
  },
  dateRangeButtonActive: {
    backgroundColor: Colors.light.yellow,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.charcoal,
  },
  dateRangeTextActive: {
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  generateButton: {
    padding: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.yellow,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    marginTop: Spacing.sm,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  chartFullContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: Spacing.md,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chartLegendText: {
    fontSize: 13,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
});