import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import KatalogScreen from "../screens/KatalogScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home", label: "Home", icon: Home, component: HomeScreen },
  {
    name: "Catalog",
    label: "Catalog",
    icon: ShoppingBag,
    component: KatalogScreen,
  },
  { name: "Cart", label: "Cart", icon: ShoppingCart, component: CartScreen },
  { name: "Account", label: "Account", icon: User, component: AccountScreen },
];

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { icon: Icon, label } = TABS[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            {focused ? (
              <View style={styles.activeNavItem}>
                <Icon color="#FFFFFF" size={18} strokeWidth={2} />
                <Text style={styles.activeNavText} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ) : (
              <View style={styles.navItem}>
                <Icon color="#8D8484" size={20} strokeWidth={1.8} />
                <Text style={styles.navText} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function RootNavigation() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#ECE4DD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: "#8D8484",
    fontFamily: "PoppinsMedium",
  },
  activeNavItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B0000",
    borderRadius: 14,
    paddingVertical: 9,
    gap: 3,
    width: "85%",
  },
  activeNavText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: "PoppinsSemiBold",
  },
});
