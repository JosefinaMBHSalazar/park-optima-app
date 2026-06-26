import { Modal, Pressable, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from './themed-text';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function LogoutModal({ visible, onClose, onLogout }: LogoutModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[
          styles.modalContainer,
          {
            backgroundColor: '#ffffff',
            borderColor: Colors.light.charcoal,
          }
        ]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconWrapper, { borderColor: Colors.light.charcoal }]}>
              <MaterialIcons name="logout" size={34} color={Colors.light.charcoal} />
            </View>
          </View>

          <ThemedText style={styles.title}>Logout Confirmation</ThemedText>
          
          <ThemedText style={styles.description}>
            Are you sure you want to logout? You will need to sign in again to access your dashboard.
          </ThemedText>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: '#ffffff',
                  borderColor: Colors.light.charcoal,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                }
              ]}
              onPress={onClose}
            >
              <ThemedText style={styles.cancelButtonText}>Stay Logged In</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  backgroundColor: Colors.light.pink,
                  borderColor: Colors.light.charcoal,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                }
              ]}
              onPress={onLogout}
            >
              <MaterialIcons name="logout" size={18} color={Colors.light.charcoal} />
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: Radius.md,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: `${Colors.light.pink}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  description: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
    color: Colors.light.charcoal,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.charcoal,
    letterSpacing: 0.3,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.pink,
  },
  logoutButtonText: {
    color: Colors.light.charcoal,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});