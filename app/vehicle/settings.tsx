import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

type SettingItem = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  type: 'toggle' | 'action' | 'info';
  enabled?: boolean;
};

const SETTINGS: SettingItem[] = [
  { id: '1', icon: 'notifications', label: 'Push Notifications', type: 'toggle', enabled: true },
  { id: '2', icon: 'location-on', label: 'Location Services', type: 'toggle', enabled: true },
  { id: '3', icon: 'dark-mode', label: 'Dark Mode', type: 'toggle', enabled: false },
  { id: '4', icon: 'language', label: 'Language', value: 'English', type: 'info' },
  { id: '5', icon: 'security', label: 'Security', type: 'action' },
  { id: '6', icon: 'privacy-tip', label: 'Privacy Policy', type: 'action' },
  { id: '7', icon: 'help', label: 'Help & Support', type: 'action' },
  { id: '8', icon: 'info', label: 'App Version', value: '1.0.0', type: 'info' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(SETTINGS);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(item => 
      item.id === id && item.type === 'toggle' 
        ? { ...item, enabled: !item.enabled } 
        : item
    ));
  };

  const handleAction = (item: SettingItem) => {
    if (item.label === 'Security') {
      Alert.alert('Security', 'Security settings coming soon');
    } else if (item.label === 'Privacy Policy') {
      Alert.alert('Privacy Policy', 'Privacy policy content here');
    } else if (item.label === 'Help & Support') {
      Alert.alert('Help & Support', 'Contact support at support@example.com');
    }
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Settings" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + Spacing.xxl, 40) }
        ]}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <MaterialIcons name="person" size={48} color={Colors.light.charcoal} />
          </View>
          <ThemedText style={styles.profileName}>Driver Name</ThemedText>
          <ThemedText style={styles.profileEmail}>driver@example.com</ThemedText>
          <Pressable style={[styles.editProfileButton, { borderColor: Colors.light.charcoal }]}>
            <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
          </Pressable>
        </View>

        <View style={styles.settingsList}>
          {settings.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.settingItem,
                {
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                }
              ]}
              onPress={() => {
                if (item.type === 'action') {
                  handleAction(item);
                } else if (item.type === 'toggle') {
                  toggleSetting(item.id);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${Colors.light.teal}20` }]}>
                  <MaterialIcons name={item.icon} size={22} color={Colors.light.charcoal} />
                </View>
                <View>
                  <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
                  {item.value && (
                    <ThemedText style={styles.settingValue}>{item.value}</ThemedText>
                  )}
                </View>
              </View>
              {item.type === 'toggle' ? (
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleSetting(item.id)}
                  trackColor={{ false: '#d1d5db', true: Colors.light.teal }}
                  thumbColor={item.enabled ? '#ffffff' : '#f3f4f6'}
                />
              ) : item.type === 'action' ? (
                <MaterialIcons name="chevron-right" size={24} color={Colors.light.charcoal} />
              ) : null}
            </Pressable>
          ))}
        </View>

        <Pressable 
          style={[styles.logoutButton, { backgroundColor: `${Colors.light.pink}20`, borderColor: Colors.light.charcoal }]}
          onPress={() => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/') }
              ]
            );
          }}
        >
          <MaterialIcons name="logout" size={24} color={Colors.light.pink} />
          <ThemedText style={[styles.logoutText, { color: Colors.light.pink }]}>Log Out</ThemedText>
        </Pressable>
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
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: Radius.md,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.light.teal}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: Spacing.md,
    color: Colors.light.charcoal,
  },
  editProfileButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
  },
  settingsList: {
    gap: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.charcoal,
  },
  settingValue: {
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.charcoal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: `${Colors.light.pink}20`,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.pink,
  },
});