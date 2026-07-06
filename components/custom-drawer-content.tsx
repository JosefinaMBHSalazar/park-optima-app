import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from './themed-text';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';

interface CustomDrawerContentProps {
  navigation?: any;
  state?: any;
  userRole: 'owner' | 'attendant' | 'vehicle';
  userName: string;
  onLogoutPress: () => void;
}

export function CustomDrawerContent({ 
  navigation,
  state,
  userRole,
  userName,
  onLogoutPress
}: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const pathname = usePathname();

  // Get menu items based on user role
  const getMenuItems = () => {
    switch (userRole) {
      case 'owner':
        return [
          { icon: 'dashboard' as const, label: 'Dashboard', route: '/owner' },
          { icon: 'assessment' as const, label: 'Reports', route: '/owner/reports' },
          { icon: 'analytics' as const, label: 'Analytics', route: '/owner/analytics' },
          { icon: 'local-parking' as const, label: 'Parking Lots', route: '/owner/parkinglots' },
          { icon: 'attach-money' as const, label: 'Revenue', route: '/owner/revenue' },
        ];
      case 'attendant':
        return [
          { icon: 'dashboard' as const, label: 'Dashboard', route: '/attendant' },
          { icon: 'camera-alt' as const, label: 'LPR Scanner', route: '/attendant/scan' },
          { icon: 'login' as const, label: 'Vehicle Entry', route: '/attendant/entry' },
          { icon: 'logout' as const, label: 'Vehicle Exit', route: '/attendant/exit' },
          { icon: 'queue' as const, label: 'Queue', route: '/attendant/queue' },
        ];
      case 'vehicle':
        return [
          { icon: 'dashboard' as const, label: 'Dashboard', route: '/vehicle' },
          { icon: 'credit-card' as const, label: 'Payments', route: '/vehicle/payments' },
          { icon: 'history' as const, label: 'History', route: '/vehicle/history' },
          { icon: 'settings' as const, label: 'Settings', route: '/vehicle/settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const activeRoute = pathname;

  const getRoleIcon = () => {
    switch (userRole) {
      case 'owner': return 'apartment';
      case 'attendant': return 'local-parking';
      case 'vehicle': return 'directions-car';
      default: return 'person';
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'owner': return Colors.light.teal;
      case 'attendant': return Colors.light.green;
      case 'vehicle': return Colors.light.pink;
      default: return Colors.light.teal;
    }
  };

  const roleColor = getRoleColor();

  const handleNavigate = (route: string) => {
    // Use router.push for Expo Router navigation
    router.push(route as any);
    // Close the drawer
    if (navigation && navigation.closeDrawer) {
      navigation.closeDrawer();
    }
  };

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + Spacing.lg,
      paddingBottom: insets.bottom + Spacing.lg,
    }]}>
      <View style={[styles.profileSection, { borderBottomColor: Colors.light.charcoal }]}>
        <View style={[styles.avatarWrapper, { backgroundColor: `${roleColor}15`, borderColor: Colors.light.charcoal }]}>
          <View style={[styles.avatar, { backgroundColor: `${roleColor}20` }]}>
            <MaterialIcons name={getRoleIcon()} size={32} color={Colors.light.charcoal} />
          </View>
        </View>
        <ThemedText style={styles.userName}>
          {userName}
        </ThemedText>
        <View style={[styles.roleBadge, { backgroundColor: `${roleColor}15`, borderColor: Colors.light.charcoal }]}>
          <View style={[styles.roleDot, { backgroundColor: Colors.light.charcoal }]} />
          <ThemedText style={[styles.roleBadgeText, { color: Colors.light.charcoal }]}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </ThemedText>
        </View>
      </View>

      <DrawerContentScrollView 
        style={styles.menuScroll}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems.map((item, index) => {
          const isActive = activeRoute === item.route;
          
          return (
            <DrawerItem
              key={index}
              icon={({ color, size }) => (
                <View style={[
                  styles.menuIconWrapper,
                  isActive && { backgroundColor: `${roleColor}15` }
                ]}>
                  <MaterialIcons 
                    name={item.icon} 
                    size={22} 
                    color={isActive ? Colors.light.charcoal : (isDark ? '#9ca3af' : '#6b7280')} 
                  />
                </View>
              )}
              label={({ color }) => (
                <ThemedText style={[
                  styles.menuLabel,
                  { color: isActive ? Colors.light.charcoal : (isDark ? '#e8ecf4' : '#1a1a2e') }
                ]}>
                  {item.label}
                </ThemedText>
              )}
              style={[
                styles.menuItem,
                isActive && styles.menuItemActive,
                { 
                  backgroundColor: isActive 
                    ? `${roleColor}10`
                    : 'transparent',
                }
              ]}
              onPress={() => handleNavigate(item.route)}
              focused={isActive}
            />
          );
        })}
      </DrawerContentScrollView>

      <View style={[styles.footer, { borderTopColor: Colors.light.charcoal }]}>
        <Pressable 
          style={({ pressed }) => [
            styles.logoutButton,
            { 
              opacity: pressed ? 0.7 : 1,
              backgroundColor: `${Colors.light.pink}15`,
              borderColor: Colors.light.charcoal,
            }
          ]} 
          onPress={onLogoutPress}
        >
          <View style={[styles.logoutIconWrapper, { backgroundColor: `${Colors.light.pink}20` }]}>
            <MaterialIcons name="logout" size={20} color={Colors.light.charcoal} />
          </View>
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </Pressable>
        <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.charcoal,
  },
  avatarWrapper: {
    padding: Spacing.sm,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.charcoal,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: 2,
  },
  menuItem: {
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginVertical: 0,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'rgba(10, 126, 164, 0.08)',
    borderColor: Colors.light.charcoal,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: Colors.light.charcoal,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: 2,
    borderTopColor: Colors.light.charcoal,
    gap: Spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  logoutIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.charcoal,
    letterSpacing: 0.3,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.3,
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
});