import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type DrawerNavigation = DrawerNavigationProp<any>;

const LOTS = [
  { name: 'Downtown Garage', occupied: '52/60', color: Colors.light.teal },
  { name: 'Airport Terminal', occupied: '32/40', color: Colors.light.purple },
  { name: 'Mall Parking', occupied: '28/35', color: Colors.light.orange },
];

export default function ParkingLotsScreen() {
  const navigation = useNavigation<DrawerNavigation>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Parking Lots" 
        onMenuPress={openDrawer}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: Spacing.md }]}
      >
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.screenTitle}>Parking Lots</ThemedText>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>128</ThemedText>
            <ThemedText style={styles.statLabel}>Total Spaces</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ffffff', borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.statValue}>94</ThemedText>
            <ThemedText style={styles.statLabel}>Occupied</ThemedText>
          </View>
        </View>

        {LOTS.map((lot, index) => (
          <View 
            key={index} 
            style={[
              styles.listItem,
              { 
                backgroundColor: '#ffffff',
                borderColor: Colors.light.charcoal,
                marginBottom: Spacing.md,
              }
            ]}
          >
            <View style={styles.lotHeader}>
              <View style={styles.lotInfo}>
                <View style={[styles.lotDot, { backgroundColor: lot.color }]} />
                <ThemedText style={styles.lotName}>{lot.name}</ThemedText>
              </View>
              <ThemedText style={styles.occupancyText}>{lot.occupied} occupied</ThemedText>
            </View>
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
          </View>
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
  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  lotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lotDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lotName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  occupancyText: {
    fontSize: 13,
    opacity: 0.6,
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
  listItem: {
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
});