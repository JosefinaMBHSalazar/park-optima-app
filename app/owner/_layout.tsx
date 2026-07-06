import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { events } from '@/utils/events';

export default function OwnerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            userRole="owner"
            userName="John Doe"
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
          name="reports"
          options={{
            drawerLabel: 'Reports',
            title: 'Reports',
          }}
        />
        <Drawer.Screen
          name="analytics"
          options={{
            drawerLabel: 'Analytics',
            title: 'Analytics',
          }}
        />
        <Drawer.Screen
          name="parkinglots"
          options={{
            drawerLabel: 'Parking Lots',
            title: 'Parking Lots',
          }}
        />
        <Drawer.Screen
          name="revenue"
          options={{
            drawerLabel: 'Revenue',
            title: 'Revenue',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}