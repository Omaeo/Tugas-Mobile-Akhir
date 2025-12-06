import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function App() {
  const [money, setMoney] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [rebirth, setRebirth] = useState(1);
  const [prestige, setPrestige] = useState(1);

  const [multiplierCost, setMultiplierCost] = useState(10);
  const [autoClicker, setAutoClicker] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(50);

  // -----------------------------
  // LOAD SAVED DATA
  // -----------------------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedMoney = await AsyncStorage.getItem('money');
      const savedMul = await AsyncStorage.getItem('multiplier');
      const savedRebirth = await AsyncStorage.getItem('rebirth');
      const savedPrestige = await AsyncStorage.getItem('prestige');
      const savedMulCost = await AsyncStorage.getItem('multiplierCost');
      const savedAC = await AsyncStorage.getItem('autoClicker');
      const savedACCost = await AsyncStorage.getItem('autoClickerCost');

      if (savedMoney) setMoney(Number(savedMoney));
      if (savedMul) setMultiplier(Number(savedMul));
      if (savedRebirth) setRebirth(Number(savedRebirth));
      if (savedPrestige) setPrestige(Number(savedPrestige));
      if (savedMulCost) setMultiplierCost(Number(savedMulCost));
      if (savedAC) setAutoClicker(Number(savedAC));
      if (savedACCost) setAutoClickerCost(Number(savedACCost));
    } catch (e) {
      console.log("Failed to load");
    }
  };

  // -----------------------------
  // SAVE DATA
  // -----------------------------
  useEffect(() => {
    AsyncStorage.setItem('money', money.toString());
    AsyncStorage.setItem('multiplier', multiplier.toString());
    AsyncStorage.setItem('rebirth', rebirth.toString());
    AsyncStorage.setItem('prestige', prestige.toString());
    AsyncStorage.setItem('multiplierCost', multiplierCost.toString());
    AsyncStorage.setItem('autoClicker', autoClicker.toString());
    AsyncStorage.setItem('autoClickerCost', autoClickerCost.toString());
  }, [money, multiplier, rebirth, prestige, multiplierCost, autoClicker, autoClickerCost]);

  // -----------------------------
  // AUTO CLICKER (ticks every 1 sec)
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClicker > 0) {
        setMoney(prev => prev + autoClicker * (multiplier * rebirth * prestige));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClicker, multiplier, rebirth, prestige]);

  // -----------------------------
  // CLICK BUTTON HANDLER
  // -----------------------------
  const handleClick = () => {
    setMoney(money + 1 * (multiplier * rebirth * prestige));
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <View style={styles.container}>

      <StatusBar style="auto" />

      <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.moneyText}>
        {money.toFixed(1)}$
      </Animatable.Text>

      {/* Big Round Pink Click Button */}
      <Animatable.View animation="bounceIn">
        <TouchableOpacity style={styles.clickButton} onPress={handleClick}>
          <Text style={styles.clickText}>CLICK</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Upgrades Section */}
      <View style={styles.upgradeBox}>

        {/* Multiplier */}
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => {
            if (money < multiplierCost) return alert("Not enough money!");
            setMoney(money - multiplierCost);
            setMultiplier(multiplier + 1 * rebirth * 0.5 + 1);
            setMultiplierCost(Math.floor(multiplierCost * 1.25));
          }}>
          <Text style={styles.upgradeText}>Upgrade Multiplier (${multiplierCost})</Text>
          <Text style={styles.subText}>Current: x{multiplier.toFixed(1)}</Text>
        </TouchableOpacity>

        {/* Auto Clicker */}
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => {
            if (money < autoClickerCost) return alert("Not enough money!");
            setMoney(money - autoClickerCost);
            setAutoClicker(autoClicker + 1);
            setAutoClickerCost(Math.floor(autoClickerCost * 1.3));
          }}>
          <Text style={styles.upgradeText}>Buy Auto Clicker (${autoClickerCost})</Text>
          <Text style={styles.subText}>Owned: {autoClicker}</Text>
        </TouchableOpacity>

        {/* Rebirth */}
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => {
            if (money < 1000) return alert("Need 1000$ to rebirth!");
            setRebirth(rebirth + 1);
            setMoney(1);
            setMultiplier(1);
          }}>
          <Text style={styles.upgradeText}>Rebirth (1000$)</Text>
          <Text style={styles.subText}>Bonus: x{rebirth}</Text>
        </TouchableOpacity>

        {/* Prestige (rebirth 10+) */}
        {rebirth >= 10 && (
          <TouchableOpacity
            style={styles.prestigeBtn}
            onPress={() => {
              setPrestige(prestige + 1);
              setMoney(1);
              setMultiplier(1);
              setRebirth(1);
            }}>
            <Text style={styles.prestigeText}>PRESTIGE</Text>
            <Text style={styles.subText}>Massive Boost: x{prestige}</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const pink = "#FF9CAE";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  moneyText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "white",
    marginBottom: 30,
  },

  clickButton: {
    width: 160,
    height: 160,
    backgroundColor: "white",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#ff6f8f",
    marginBottom: 40,
  },

  clickText: {
    fontSize: 30,
    fontWeight: "bold",
    color: pink,
  },

  upgradeBox: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#ff6f8f",
  },

  upgradeBtn: {
    padding: 15,
    backgroundColor: pink,
    borderRadius: 15,
    marginBottom: 15,
  },

  upgradeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  subText: {
    color: "white",
    opacity: 0.8,
  },

  prestigeBtn: {
    padding: 20,
    backgroundColor: "#ff4b5c",
    borderRadius: 15,
    marginTop: 10,
  },

  prestigeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
