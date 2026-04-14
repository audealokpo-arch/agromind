import MarcheScreen from './MarcheScreen';
import MeteoScreen from './MeteoScreen';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './ChatScreen';
import InscriptionScreen from './InscriptionScreen';
import ConnexionScreen from './ConnexionScreen';
import AgriFinanceScreen from './AgriFinanceScreen';

const Stack = createStackNavigator();

const categories = [
  { id: 1, icon: '🍃', label: 'Maladies des feuilles' },
  { id: 2, icon: '🐛', label: 'Insectes et parasites' },
  { id: 3, icon: '🌱', label: 'Problèmes racinaires' },
  { id: 4, icon: '💧', label: "Manque d'eau ou sol" },
  { id: 5, icon: '🌤️', label: 'Meteo agricole' },
  { id: 6, icon: '🛒', label: 'Marche direct' },
  { id: 7, icon: '💰', label: 'AgriFinance' },
];

function AccueilScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>AgroMind</Text>
        <Text style={styles.soustitre}>Votre assistant agricole intelligent</Text>
      </View>
      <Text style={styles.question}>Quel est le probleme ?</Text>
      <View style={styles.grille}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.carte}
onPress={() => {
  if (cat.label === 'Meteo agricole') {
    navigation.navigate('Meteo');
  } else if (cat.label === 'Marche direct') {
    navigation.navigate('Marche', { nom: route.params?.nom || 'Agriculteur' });
  } else if (cat.label === 'AgriFinance') {
    navigation.navigate('AgriFinance');
  } else {
    navigation.navigate('Chat', { categorie: cat.label });
  }
}}

          >
            <Text style={styles.icone}>{cat.icon}</Text>
            <Text style={styles.label}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inscription">
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Accueil" component={AccueilScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Meteo" component={MeteoScreen} />
        <Stack.Screen name="Marche" component={MarcheScreen} />
        <Stack.Screen name="AgriFinance" component={AgriFinanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titre: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ea8de',
    letterSpacing: 2,
  },
  soustitre: {
    fontSize: 13,
    color: '#555555',
    marginTop: 6,
    letterSpacing: 1,
  },
  question: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 24,
  },
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  carte: {
    width: 145,
    height: 145,
    backgroundColor: '#111111',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4ea8de',
  },
  icone: {
    fontSize: 38,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#4ea8de',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontWeight: '500',
  },
});
