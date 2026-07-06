import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type DrawerNavigation = DrawerNavigationProp<any>;

const OCCUPANCY_TREND = [
  { label: 'Mon', value: 65, color: Colors.light.teal },
  { label: 'Tue', value: 72, color: Colors.light.teal },
  { label: 'Wed', value: 78, color: Colors.light.teal },
  { label: 'Thu', value: 85, color: Colors.light.teal },
  { label: 'Fri', value: 92, color: Colors.light.teal },
  { label: 'Sat', value: 70, color: Colors.light.teal },
  { label: 'Sun', value: 55, color: Colors.light.teal },
];

export default function AnalyticsScreen() {
  const navigation = useNavigation<DrawerNavigation>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Analytics" 
        onMenuPress={openDrawer}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Spacing.md }]}
      >
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.screenTitle}>Analytics</ThemedText>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>74%</ThemedText>
            <ThemedText style={styles.statLabel}>Avg Occupancy</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>1,247</ThemedText>
            <ThemedText style={styles.statLabel}>LPR Detections</ThemedText>
          </View>
        </View>

        <View style={[styles.chartContainer, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
          <ThemedText style={styles.chartTitle}>Weekly Occupancy Trend</ThemedText>
          <View style={styles.chartBars}>
            {OCCUPANCY_TREND.map((item) => {
              const height = (item.value / 100) * 120;
              return (
                <View key={item.label} style={styles.chartBarContainer}>
                  <View style={[styles.chartBar, { height: Math.max(height, 20), backgroundColor: item.color }]} />
                  <ThemedText style={styles.chartLabel}>{item.label}</ThemedText>
                </View>
              );
            })}
          </View>
          <View style={styles.chartStats}>
            <View style={styles.chartStat}>
              <View style={[styles.chartDot, { backgroundColor: Colors.light.teal }]} />
              <ThemedText style={styles.chartStatText}>Occupancy Rate</ThemedText>
            </View>
            <ThemedText style={styles.chartStatValue}>74% Avg</ThemedText>
          </View>
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
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.charcoal,
    marginBottom: Spacing.md,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
  chartContainer: {
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.light.charcoal,
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
});