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

export default function ExitScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [plateNumber, setPlateNumber] = useState('');

  const handleExit = () => {
    if (!plateNumber) {
      Alert.alert('Error', 'Please enter a plate number');
      return;
    }
    Alert.alert(
      'Process Exit',
      `Vehicle ${plateNumber.toUpperCase()} is ready to exit. Payment will be processed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Process Exit', 
          onPress: () => {
            Alert.alert('Success', `Vehicle ${plateNumber.toUpperCase()} exited successfully`);
            setPlateNumber('');
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="Vehicle Exit" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: `${Colors.light.yellow}30` }]}>
              <MaterialIcons name="logout" size={48} color={Colors.light.charcoal} />
            </View>
          </View>
          
          <ThemedText style={styles.title}>Vehicle Exit</ThemedText>
          <ThemedText style={styles.subtitle}>Enter license plate number to exit</ThemedText>
          
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

          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color={Colors.light.charcoal} />
            <ThemedText style={styles.infoText}>Auto-payment will be processed from wallet</ThemedText>
          </View>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: Colors.light.purple }]}
            onPress={handleExit}
          >
            <MaterialIcons name="logout" size={24} color={Colors.light.charcoal} />
            <ThemedText style={styles.actionButtonText}>Process Exit</ThemedText>
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    backgroundColor: `${Colors.light.purple}10`,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.purple,
    width: '100%',
  },
  infoText: {
    fontSize: 13,
    opacity: 0.7,
    color: Colors.light.charcoal,
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