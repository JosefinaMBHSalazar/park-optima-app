import { useState } from 'react';
import { Pressable, StyleSheet, View, KeyboardAvoidingView, Platform, Dimensions, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LoadingModal } from '@/components/loading-modal';

type RoleValue = 'owner' | 'attendant' | 'vehicle';

const MOCK_USERS: Record<string, { password: string; role: RoleValue; name: string }> = {
  'owner@parkoptima.com': { password: 'password123', role: 'owner', name: 'John Doe' },
  'attendant@parkoptima.com': { password: 'password123', role: 'attendant', name: 'Jane Smith' },
  'vehicle@parkoptima.com': { password: 'password123', role: 'vehicle', name: 'Bob Wilson' },
};

type RouteMap = {
  owner: '/owner';
  attendant: '/attendant';
  vehicle: '/vehicle';
};

const ROUTE_MAP: RouteMap = {
  owner: '/owner',
  attendant: '/attendant',
  vehicle: '/vehicle',
} as const;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setShowErrorModal(true);
      return;
    }

    setShowLoadingModal(true);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    const user = MOCK_USERS[email.toLowerCase()];
    
    if (user && user.password === password) {
      const route = ROUTE_MAP[user.role];
      setShowLoadingModal(false);
      setIsLoading(false);
      router.replace(route);
    } else {
      setShowLoadingModal(false);
      setIsLoading(false);
      setErrorMessage('Invalid email or password');
      setShowErrorModal(true);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setErrorMessage('Please enter your email address');
      setShowErrorModal(true);
      return;
    }

    const userExists = MOCK_USERS[forgotEmail.toLowerCase()];
    if (!userExists) {
      setErrorMessage('No account found with this email');
      setShowErrorModal(true);
      return;
    }

    setResetSent(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotEmail('');
      setResetSent(false);
      setErrorMessage('Password reset email sent! Check your inbox.');
      setShowErrorModal(true);
    }, 1500);
  };

  const quickFill = (email: string) => {
    setEmail(email);
    setPassword(MOCK_USERS[email].password);
  };

  const closeForgotPassword = () => {
    setShowForgotPasswordModal(false);
    setForgotEmail('');
    setResetSent(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={[styles.screen, { 
          paddingTop: Math.min(insets.top + Spacing.xxxl, 40),
          paddingBottom: Math.min(insets.bottom + Spacing.xxl, 24),
        }]}>
          <View style={styles.header}>
            {/* Street Sign Logo with PARKOPTIMA and LPR below */}
            <View style={styles.streetSignContainer}>
              <View style={styles.streetSign}>
                {/* Sign pole */}
                <View style={styles.signPole} />
                
                {/* Top sign - PARKOPTIMA */}
                <View style={styles.signBody}>
                  <View style={styles.signBorder}>
                    {/* Left arrow */}
                    <View style={styles.signArrowLeft}>
                      <View style={styles.arrowHeadLeft} />
                      <View style={styles.arrowShaftLeft} />
                    </View>
                    
                    {/* Sign text */}
                    <View style={styles.signTextContainer}>
                      <ThemedText style={styles.signText}>PARKOPTIMA</ThemedText>
                    </View>
                    
                    {/* Right arrow */}
                    <View style={styles.signArrowRight}>
                      <View style={styles.arrowShaftRight} />
                      <View style={styles.arrowHeadRight} />
                    </View>
                  </View>
                </View>

                {/* Bottom sign - LPR */}
                <View style={[styles.signBody, styles.signBodySmall, styles.signBodyBottom]}>
                  <View style={[styles.signBorder, styles.signBorderSmall]}>
                    <ThemedText style={styles.signTextSmall}>LPR</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDark ? '#ffffff' : '#1a1a2e',
                      backgroundColor: isDark ? '#2a2a44' : '#ffffff',
                    }
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@address.com"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    { 
                      color: isDark ? '#ffffff' : '#1a1a2e',
                      backgroundColor: isDark ? '#2a2a44' : '#ffffff',
                    }
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility' : 'visibility-off'} 
                    size={24} 
                    color={isDark ? '#9ca3af' : '#6b7280'} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Pressable 
              style={({ pressed }) => [
                styles.forgotPasswordLink,
                { opacity: pressed ? 0.6 : 1 }
              ]}
              onPress={() => setShowForgotPasswordModal(true)}
            >
              <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
            </Pressable>

            <View style={styles.secondaryWrapper}>
              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  { 
                    opacity: pressed || isLoading ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  {isLoading ? 'Signing in...' : 'Login'}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.demoSection}>
              <ThemedText style={styles.demoLabel}>Quick Fill Credentials</ThemedText>
              <View style={styles.demoButtons}>
                <Pressable 
                  style={styles.demoButton}
                  onPress={() => quickFill('owner@parkoptima.com')}
                  disabled={isLoading}
                >
                  <MaterialIcons name="apartment" size={16} color="#1a1a2e" />
                  <ThemedText style={styles.demoButtonText}>Owner</ThemedText>
                </Pressable>
                <Pressable 
                  style={styles.demoButton}
                  onPress={() => quickFill('attendant@parkoptima.com')}
                  disabled={isLoading}
                >
                  <MaterialIcons name="local-parking" size={16} color="#1a1a2e" />
                  <ThemedText style={styles.demoButtonText}>Attendant</ThemedText>
                </Pressable>
                <Pressable 
                  style={styles.demoButton}
                  onPress={() => quickFill('vehicle@parkoptima.com')}
                  disabled={isLoading}
                >
                  <MaterialIcons name="directions-car" size={16} color="#1a1a2e" />
                  <ThemedText style={styles.demoButtonText}>Vehicle</ThemedText>
                </Pressable>
              </View>
              <ThemedText style={styles.demoHint}>Tap to fill credentials, then press Login</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>

      <LoadingModal visible={showLoadingModal} />

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.errorOverlay}>
          <Pressable style={styles.errorBackdrop} onPress={() => setShowErrorModal(false)} />
          <View style={styles.errorModalContainer}>
            <View style={styles.errorIconContainer}>
              <View style={styles.errorIconWrapper}>
                <MaterialIcons name="error-outline" size={34} color={Colors.light.charcoal} />
              </View>
            </View>

            <ThemedText style={styles.errorTitle}>Oops!</ThemedText>
            
            <ThemedText style={styles.errorDescription}>
              {errorMessage}
            </ThemedText>

            <Pressable
              style={({ pressed }) => [
                styles.errorButton,
                { 
                  backgroundColor: Colors.light.yellow,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                }
              ]}
              onPress={() => setShowErrorModal(false)}
            >
              <ThemedText style={styles.errorButtonText}>Got It</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={closeForgotPassword}
      >
        <View style={styles.forgotOverlay}>
          <Pressable style={styles.forgotBackdrop} onPress={closeForgotPassword} />
          <View style={styles.forgotModalContainer}>
            <View style={styles.forgotIconContainer}>
              <View style={styles.forgotIconWrapper}>
                <MaterialIcons name="lock-outline" size={34} color={Colors.light.charcoal} />
              </View>
            </View>

            <ThemedText style={styles.forgotTitle}>Reset Password</ThemedText>
            
            <ThemedText style={styles.forgotDescription}>
              Enter your email address and we'll send you a link to reset your password.
            </ThemedText>

            <View style={styles.forgotInputGroup}>
              <View style={styles.forgotInputWrapper}>
                <TextInput
                  style={[
                    styles.forgotInput,
                    { 
                      color: isDark ? '#ffffff' : '#1a1a2e',
                      backgroundColor: isDark ? '#2a2a44' : '#ffffff',
                    }
                  ]}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!resetSent}
                />
              </View>
            </View>

            <View style={styles.forgotButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.forgotCancelButton,
                  { 
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
                onPress={closeForgotPassword}
                disabled={resetSent}
              >
                <ThemedText style={styles.forgotCancelButtonText}>Cancel</ThemedText>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.forgotSendButton,
                  { 
                    backgroundColor: Colors.light.yellow,
                    opacity: pressed || resetSent ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
                onPress={handleForgotPassword}
                disabled={resetSent}
              >
                <ThemedText style={styles.forgotSendButtonText}>
                  {resetSent ? 'Sending...' : 'Send Reset Link'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.light.cream,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  streetSignContainer: {
    marginBottom: 0,
    alignItems: 'center',
  },
  streetSign: {
    alignItems: 'center',
  },
  signPole: {
    width: 6,
    height: 16,
    backgroundColor: '#6b7280',
    borderWidth: 1,
    borderColor: Colors.light.charcoal,
    marginBottom: 0,
  },
  signBody: {
    backgroundColor: '#15803d',
    borderWidth: 3,
    borderColor: Colors.light.charcoal,
    borderRadius: 4,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: Colors.light.charcoal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginVertical: 2,
  },
  signBodySmall: {
    borderWidth: 2,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowOffset: { width: 3, height: 3 },
    elevation: 4,
  },
  signBodyBottom: {
    marginBottom: 0,
  },
  signBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 2,
    minWidth: 280,
  },
  signBorderSmall: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    minWidth: 100,
    borderWidth: 1.5,
  },
  signArrowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  arrowHeadLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#ffffff',
  },
  arrowShaftLeft: {
    width: 16,
    height: 4,
    backgroundColor: '#ffffff',
    marginLeft: -2,
  },
  signTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  signText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  signTextSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  signArrowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  arrowShaftRight: {
    width: 16,
    height: 4,
    backgroundColor: '#ffffff',
  },
  arrowHeadRight: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#ffffff',
    marginRight: -2,
  },
  form: {
    gap: 14,
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.charcoal,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    backgroundColor: '#ffffff',
  },
  input: {
    padding: 14,
    fontSize: 16,
    borderRadius: Radius.md,
    fontWeight: '500',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    borderRadius: Radius.md,
    fontWeight: '500',
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.light.charcoal,
    fontWeight: '500',
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  secondaryWrapper: {
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: Colors.light.yellow,
    overflow: 'hidden',
  },
  secondaryButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.yellow,
  },
  secondaryButtonText: {
    color: Colors.light.charcoal,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  demoSection: {
    marginTop: 6,
    gap: 6,
  },
  demoLabel: {
    textAlign: 'center',
    fontSize: 11,
    opacity: 0.4,
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  demoButtonText: {
    fontSize: 11,
    color: Colors.light.charcoal,
    fontWeight: '600',
  },
  demoHint: {
    textAlign: 'center',
    fontSize: 10,
    opacity: 0.3,
    color: Colors.light.charcoal,
    letterSpacing: 0.3,
  },
  errorOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
  },
  errorBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorModalContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: Radius.md,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  errorIconContainer: {
    marginBottom: Spacing.lg,
  },
  errorIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: `${Colors.light.pink}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  errorDescription: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
    color: Colors.light.charcoal,
  },
  errorButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    backgroundColor: Colors.light.yellow,
  },
  errorButtonText: {
    color: Colors.light.charcoal,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  forgotOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
  },
  forgotBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  forgotModalContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: Radius.md,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
  },
  forgotIconContainer: {
    marginBottom: Spacing.lg,
  },
  forgotIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    backgroundColor: `${Colors.light.purple}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
  forgotDescription: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
    color: Colors.light.charcoal,
  },
  forgotInputGroup: {
    width: '100%',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  forgotInputWrapper: {
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    backgroundColor: '#ffffff',
  },
  forgotInput: {
    padding: 14,
    fontSize: 16,
    borderRadius: Radius.md,
    fontWeight: '500',
  },
  forgotButtonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  forgotCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  forgotCancelButtonText: {
    color: Colors.light.charcoal,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  forgotSendButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    alignItems: 'center',
    backgroundColor: Colors.light.yellow,
  },
  forgotSendButtonText: {
    color: Colors.light.charcoal,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});