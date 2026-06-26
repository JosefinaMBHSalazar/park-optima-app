import { Modal, StyleSheet, View, Dimensions } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors, Spacing } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface LoadingModalProps {
  visible: boolean;
}

const { width } = Dimensions.get('window');

export function LoadingModal({ visible }: LoadingModalProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { 
          duration: 1500, 
          easing: Easing.linear 
        }),
        -1,
        false
      );
      scale.value = withRepeat(
        withTiming(1.05, { 
          duration: 800, 
          easing: Easing.inOut(Easing.ease) 
        }),
        -1,
        true
      );
    } else {
      rotation.value = 0;
      scale.value = 1;
    }
  }, [visible]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Retro Tire */}
          <Animated.View style={[styles.tireContainer, rotateStyle]}>
            {/* Outer tire ring with tread pattern */}
            <View style={styles.tireOuter}>
              {/* Tread marks around the tire */}
              <View style={styles.tireTread}>
                {[...Array(16)].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.treadMark,
                      { 
                        transform: [{ rotate: `${i * 22.5}deg` }],
                        position: 'absolute',
                        top: -4,
                        left: '50%',
                        marginLeft: -4,
                      }
                    ]} 
                  />
                ))}
              </View>
              {/* Inner tire ring */}
              <View style={styles.tireInner}>
                {/* White center hubcap */}
                <View style={styles.hubcap}>
                  {/* Retro spoke design */}
                  <View style={styles.spokes}>
                    {[...Array(8)].map((_, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.spoke,
                          { 
                            transform: [{ rotate: `${i * 45}deg` }],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -2,
                            marginLeft: -30,
                          }
                        ]} 
                      />
                    ))}
                  </View>
                  {/* Center hub */}
                  <View style={styles.centerHub}>
                    <View style={styles.centerDot} />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Loading text with retro feel */}
          <View style={styles.loadingTextContainer}>
            <ThemedText style={styles.loadingText}>LOADING</ThemedText>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, { backgroundColor: Colors.light.purple }]} />
              <View style={[styles.dot, { backgroundColor: Colors.light.yellow }]} />
              <View style={[styles.dot, { backgroundColor: Colors.light.teal }]} />
            </View>
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
    backgroundColor: 'rgba(242, 239, 233, 0.92)',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  tireContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  tireOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 14,
    borderColor: Colors.light.charcoal,
    backgroundColor: 'rgba(26, 26, 46, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.charcoal,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  tireTread: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
  },
  treadMark: {
    width: 8,
    height: 18,
    backgroundColor: Colors.light.charcoal,
    borderRadius: 2,
    opacity: 0.3,
  },
  tireInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Colors.light.charcoal,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  hubcap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
  spokes: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
  spoke: {
    width: 60,
    height: 4,
    backgroundColor: Colors.light.charcoal,
    borderRadius: 2,
    opacity: 0.2,
  },
  centerHub: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  loadingTextContainer: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.charcoal,
    letterSpacing: 3,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.charcoal,
  },
});