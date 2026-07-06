import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type DrawerNavigation = DrawerNavigationProp<any>;

const RECENT_REPORTS = [
  { id: '1', title: 'Monthly Revenue Report', date: 'Mar 2024', type: 'revenue' },
  { id: '2', title: 'Occupancy Analytics', date: 'Mar 2024', type: 'occupancy' },
  { id: '3', title: 'Financial Summary', date: 'Q1 2024', type: 'financial' },
];

export default function ReportsScreen() {
  const navigation = useNavigation<DrawerNavigation>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Reports" 
        onMenuPress={openDrawer}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Spacing.md }]}
      >
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.screenTitle}>Reports</ThemedText>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>12</ThemedText>
            <ThemedText style={styles.statLabel}>Total Reports</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>₱12,450</ThemedText>
            <ThemedText style={styles.statLabel}>Total Revenue</ThemedText>
          </View>
        </View>

        {RECENT_REPORTS.map((report, index) => (
          <Pressable 
            key={index} 
            style={[
              styles.reportItem,
              { 
                backgroundColor: '#ffffff',
                borderColor: Colors.light.charcoal,
                marginBottom: Spacing.md,
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
});