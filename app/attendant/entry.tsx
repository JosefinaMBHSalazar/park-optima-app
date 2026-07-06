import { useState } from 'react';
import { StyleSheet, View, Pressable, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

export default function EntryScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [plateNumber, setPlateNumber] = useState('');

  const handleEntry = () => {
    if (!plateNumber) {
      Alert.alert('Error', 'Please enter a plate number');
      return;
    }
    Alert.alert('Success', `Vehicle ${plateNumber.toUpperCase()} entered successfully`);
    setPlateNumber('');
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Vehicle Entry" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: `${Colors.light.purple}30` }]}>
              <MaterialIcons name="login" size={48} color={Colors.light.charcoal} />
            </View>
          </View>
          
          <ThemedText style={styles.title}>Vehicle Entry</ThemedText>
          <ThemedText style={styles.subtitle}>Enter license plate number</ThemedText>
          
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
            style={[styles.actionButton, { backgroundColor: Colors.light.yellow }]}
            onPress={handleEntry}
          >
            <MaterialIcons name="login" size={24} color={Colors.light.charcoal} />
            <ThemedText style={styles.actionButtonText}>Process Entry</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.cream,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.md,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    color: Colors.light.charcoal,
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    backgroundColor: '#ffffff',
  },
  input: {
    padding: 14,
    fontSize: 18,
    borderRadius: Radius.md,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    width: '100%',
    marginTop: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
});