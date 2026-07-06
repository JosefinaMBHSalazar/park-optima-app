import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { events } from '@/utils/events';

export default function VehicleLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            userRole="vehicle"
            userName="Driver Name"
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
          name="payments"
          options={{
            drawerLabel: 'Payments',
            title: 'Payments',
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerLabel: 'History',
            title: 'History',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}