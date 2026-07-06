import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { DashboardHeader } from '@/components/dashboard-header';

export default function ScanScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const scanAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: Colors.light.cream }]}>
      <DashboardHeader 
        title="LPR Scanner" 
        onMenuPress={() => navigation.openDrawer()}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={styles.scanCornerTL} />
            <View style={styles.scanCornerTR} />
            <View style={styles.scanCornerBL} />
            <View style={styles.scanCornerBR} />
            <Animated.View 
              style={[
                styles.scanLine,
                {
                  transform: [{
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    })
                  }]
                }
              ]} 
            />
            <MaterialIcons name="camera-alt" size={64} color={Colors.light.charcoal} />
            <ThemedText style={styles.scanText}>Position plate in frame</ThemedText>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.scanButton, { backgroundColor: Colors.light.yellow }]}
            onPress={() => Alert.alert('Scan', 'Scanning license plate...')}
          >
            <MaterialIcons name="camera" size={24} color={Colors.light.charcoal} />
            <ThemedText style={styles.scanButtonText}>Start Scan</ThemedText>
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
    justifyContent: 'space-between',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.light.charcoal,
  },
  scanCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.light.charcoal,
  },
  scanCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.light.charcoal,
  },
  scanCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.light.charcoal,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.light.charcoal,
    opacity: 0.5,
  },
  scanText: {
    marginTop: Spacing.md,
    fontSize: 14,
    opacity: 0.6,
    color: Colors.light.charcoal,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.charcoal,
  },
});