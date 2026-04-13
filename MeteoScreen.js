import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const CLE_METEO = '7788b1607f13bd39d02e87d4c55b3e42';

export default function MeteoScreen({ navigation }) {
  const [ville, setVille] = useState('');
  const [meteo, setMeteo] = useState(null);
  const [conseil, setConseil] = useState('');
  const [chargement, setChargement] = useState(false);

  const getConseil = (description, temp, humidity) => {
    if (description.includes('rain') || description.includes('pluie')) {
      return 'Pluie prevue — evitez de semer aujourd\'hui. Profitez pour verifier votre drainage.';
    } else if (temp > 35) {
      return 'Chaleur extreme — arrosez tot le matin ou en soiree. Protegez vos jeunes plants.';
    } else if (humidity < 30) {
      return 'Air tres sec — augmentez l\'arrosage et couvrez le sol avec du paillis.';
    } else if (description.includes('clear') || description.includes('sun')) {
      return 'Beau temps — ideal pour semer, traiter les cultures ou recolter.';
    } else {
      return 'Conditions moderees — bonne journee pour travailler aux champs.';
    }
  };

  const chercherMeteo = async () => {
    if (!ville.trim()) {
      alert('Entrez votre ville');
      return;
    }
    setChargement(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${CLE_METEO}&units=metric&lang=fr`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setMeteo(data);
        setConseil(getConseil(data.weather[0].description, data.main.temp, data.main.humidity));
      } else {
        alert('Ville non trouvee. Verifiez le nom et reessayez.');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
    setChargement(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
        <Text style={styles.retourTexte}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>Meteo Agricole</Text>
      <Text style={styles.soustitre}>Entrez votre localite</Text>

      <View style={styles.searchZone}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Cotonou, Abomey..."
          placeholderTextColor="#555555"
          value={ville}
          onChangeText={setVille}
        />
        <TouchableOpacity style={styles.bouton} onPress={chercherMeteo}>
          <Text style={styles.boutonTexte}>{chargement ? '...' : 'Chercher'}</Text>
        </TouchableOpacity>
      </View>

      {meteo && (
        <View>
          <View style={styles.carteMeteo}>
            <Text style={styles.nomVille}>{meteo.name}, {meteo.sys.country}</Text>
            <Text style={styles.temperature}>{Math.round(meteo.main.temp)}°C</Text>
            <Text style={styles.description}>{meteo.weather[0].description}</Text>
            <View style={styles.details}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Humidite</Text>
                <Text style={styles.detailValeur}>{meteo.main.humidity}%</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Vent</Text>
                <Text style={styles.detailValeur}>{Math.round(meteo.wind.speed)} km/h</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Ressenti</Text>
                <Text style={styles.detailValeur}>{Math.round(meteo.main.feels_like)}°C</Text>
              </View>
            </View>
          </View>
          <View style={styles.carteConseil}>
            <Text style={styles.conseilTitre}>Conseil AudAI</Text>
            <Text style={styles.conseilTexte}>{conseil}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20 },
  retour: { paddingTop: 60, paddingBottom: 10 },
  retourTexte: { color: '#4ea8de', fontSize: 16 },
  titre: { fontSize: 28, fontWeight: 'bold', color: '#4ea8de', textAlign: 'center', letterSpacing: 1 },
  soustitre: { fontSize: 14, color: '#aaaaaa', textAlign: 'center', marginTop: 6, marginBottom: 24 },
  searchZone: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  input: { flex: 1, backgroundColor: '#111111', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#ffffff', borderWidth: 1, borderColor: '#333333' },
  bouton: { backgroundColor: '#4ea8de', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  boutonTexte: { color: '#0a0a0a', fontWeight: 'bold' },
  carteMeteo: { backgroundColor: '#111111', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#4ea8de', marginBottom: 16 },
  nomVille: { fontSize: 18, color: '#aaaaaa', marginBottom: 8 },
  temperature: { fontSize: 64, fontWeight: 'bold', color: '#4ea8de' },
  description: { fontSize: 16, color: '#aaaaaa', marginTop: 4, marginBottom: 20, textTransform: 'capitalize' },
  details: { flexDirection: 'row', gap: 24 },
  detail: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#555555', marginBottom: 4 },
  detailValeur: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  carteConseil: { backgroundColor: '#111111', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#333333', marginBottom: 40 },
  conseilTitre: { fontSize: 14, color: '#4ea8de', fontWeight: 'bold', marginBottom: 8 },
  conseilTexte: { fontSize: 14, color: '#aaaaaa', lineHeight: 22 },
});