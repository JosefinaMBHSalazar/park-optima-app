import { Pressable, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from './themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DashboardHeaderProps {
  title: string;
  onMenuPress: () => void;
}

export function DashboardHeader({ title, onMenuPress }: DashboardHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.header,
      {
        backgroundColor: Colors.light.cream,
        borderBottomWidth: 2,
        borderBottomColor: Colors.light.charcoal,
      }
    ]}>
      <Pressable 
        onPress={onMenuPress} 
        style={({ pressed }) => [
          styles.menuButton,
          { opacity: pressed ? 0.6 : 1 }
        ]} 
        hitSlop={12}
      >
        <MaterialIcons 
          name="menu" 
          size={28} 
          color={Colors.light.charcoal} 
        />
      </Pressable>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.cream,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.charcoal,
  },
  menuButton: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.light.charcoal,
  },
});