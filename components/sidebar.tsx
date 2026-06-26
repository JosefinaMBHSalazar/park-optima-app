import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ThemedText } from './themed-text';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  runOnJS,
  Easing
} from 'react-native-reanimated';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
};

interface SidebarProps {
  menuItems: MenuItem[];
  activeRoute: string;
  userRole: 'owner' | 'attendant' | 'vehicle';
  userName: string;
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  onLogoutPress: () => void;
}

export function Sidebar({ 
  menuItems, 
  activeRoute, 
  userRole, 
  userName, 
  visible,
  onClose, 
  onOpen,
  onLogoutPress 
}: SidebarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = Dimensions.get('window');
  const sidebarWidth = Math.min(width * 0.75, 300);

  const translateX = useSharedValue(-sidebarWidth);

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, { 
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    } else {
      translateX.value = withTiming(-sidebarWidth, { 
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    }
  }, [visible]);

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -50 ? withTiming(0, { duration: 200 }) : withTiming(0.4, { duration: 200 }),
    pointerEvents: translateX.value < -50 ? 'none' : 'auto',
  }));

  const openSidebar = () => {
    translateX.value = withTiming(0, { 
      duration: 280,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    runOnJS(onOpen)();
  };

  const closeSidebar = () => {
    translateX.value = withTiming(-sidebarWidth, { 
      duration: 280,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    runOnJS(onClose)();
  };

  const pan = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((event) => {
      const newX = event.translationX + translateX.value;
      if (newX <= 0 && newX >= -sidebarWidth) {
        translateX.value = newX;
      }
    })
    .onEnd((event) => {
      const threshold = sidebarWidth * 0.3;
      const currentX = translateX.value;
      
      if (event.translationX < -threshold) {
        closeSidebar();
      } else if (event.translationX > threshold) {
        openSidebar();
      } else {
        if (currentX < -sidebarWidth / 2) {
          closeSidebar();
        } else if (currentX > -sidebarWidth / 2) {
          openSidebar();
        } else {
          closeSidebar();
        }
      }
    })
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10]);

  const edgePan = Gesture.Pan()
    .onStart(() => {
      if (!visible) {
        runOnJS(openSidebar)();
      }
    })
    .activeOffsetX([10, 20])
    .failOffsetY([-10, 10]);

  return (
    <View style={styles.overlay} pointerEvents={visible ? 'box-none' : 'none'}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPressable} onPress={closeSidebar} />
      </Animated.View>
      
      <GestureDetector gesture={pan}>
        <Animated.View style={[
          styles.sidebar,
          animatedStyle,
          { 
            backgroundColor: '#ffffff',
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.lg,
            width: sidebarWidth,
            borderRightWidth: 2,
            borderColor: Colors.light.charcoal,
          }
        ]}>
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

          <ScrollView 
            style={styles.menuScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.menuItem,
                  activeRoute === item.route && styles.menuItemActive,
                  { 
                    backgroundColor: activeRoute === item.route 
                      ? `${roleColor}10`
                      : 'transparent',
                    borderColor: activeRoute === item.route ? Colors.light.charcoal : 'transparent',
                  }
                ]}
                onPress={() => handleNavigate(item.route)}
              >
                <View style={[
                  styles.menuIconWrapper,
                  activeRoute === item.route && { backgroundColor: `${roleColor}15` }
                ]}>
                  <MaterialIcons 
                    name={item.icon} 
                    size={22} 
                    color={activeRoute === item.route ? Colors.light.charcoal : (isDark ? '#9ca3af' : '#6b7280')} 
                  />
                </View>
                <ThemedText style={[
                  styles.menuLabel,
                  { color: activeRoute === item.route ? Colors.light.charcoal : (isDark ? '#e8ecf4' : '#1a1a2e') }
                ]}>
                  {item.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

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
              onPress={() => {
                closeSidebar();
                onLogoutPress();
              }}
            >
              <View style={[styles.logoutIconWrapper, { backgroundColor: `${Colors.light.pink}20` }]}>
                <MaterialIcons name="logout" size={20} color={Colors.light.charcoal} />
              </View>
              <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
            </Pressable>
            <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
          </View>
        </Animated.View>
      </GestureDetector>

      {!visible && (
        <GestureDetector gesture={edgePan}>
          <View style={styles.edgeHandle} />
        </GestureDetector>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.charcoal,
  },
  backdropPressable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  edgeHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: '100%',
    zIndex: 999,
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
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