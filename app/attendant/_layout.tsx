import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { events } from '@/utils/events';

export default function AttendantLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            userRole="attendant"
            userName="Jane Smith"
            onLogoutPress={() => {
              props.navigation.closeDrawer();
              events.emit('logout');
            }}
          />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: 300,
            borderRightWidth: 2,
            borderRightColor: '#1a1a2e',
          },
          drawerType: 'front',
          overlayColor: 'rgba(0,0,0,0.4)',
          swipeEdgeWidth: 30,
          swipeMinDistance: 50,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="scan"
          options={{
            drawerLabel: 'LPR Scanner',
            title: 'LPR Scanner',
          }}
        />
        <Drawer.Screen
          name="entry"
          options={{
            drawerLabel: 'Vehicle Entry',
            title: 'Vehicle Entry',
          }}
        />
        <Drawer.Screen
          name="exit"
          options={{
            drawerLabel: 'Vehicle Exit',
            title: 'Vehicle Exit',
          }}
        />
        <Drawer.Screen
          name="queue"
          options={{
            drawerLabel: 'Queue',
            title: 'Queue',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}