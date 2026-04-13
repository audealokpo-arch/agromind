import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { publierAnnonce, getAnnonces } from './supabase';

export default function MarcheScreen({ route, navigation }) {
  const nom = route.params?.nom || 'Agriculteur';
  const [affichage, setAffichage] = useState('liste');
  const [produit, setProduit] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [contact, setContact] = useState('');
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    chargerAnnonces();
  }, []);

  const chargerAnnonces = async () => {
    setChargement(true);
    const data = await getAnnonces();
    if (data && Array.isArray(data)) {
      setAnnonces(data);
    }
    setChargement(false);
  };

  const soumettre = async () => {
    if (!produit || !quantite || !prix || !contact) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setChargement(true);
    const data = await publierAnnonce(produit, quantite, prix, contact, nom);
    if (data && data.length > 0) {
      alert('Annonce publiee avec succes !');
      setProduit('');
      setQuantite('');
      setPrix('');
      setContact('');
      setAffichage('liste');
      chargerAnnonces();
    } else {
      alert('Erreur lors de la publication');
    }
    setChargement(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
        <Text style={styles.retourTexte}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>Marche Direct</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, affichage === 'liste' && styles.tabActif]}
          onPress={() => { setAffichage('liste'); chargerAnnonces(); }}
        >
          <Text style={[styles.tabTexte, affichage === 'liste' && styles.tabTexteActif]}>Annonces</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, affichage === 'publier' && styles.tabActif]}
          onPress={() => setAffichage('publier')}
        >
          <Text style={[styles.tabTexte, affichage === 'publier' && styles.tabTexteActif]}>Publier</Text>
        </TouchableOpacity>
      </View>

      {affichage === 'liste' ? (
        <ScrollView style={styles.liste}>
          {chargement ? (
            <Text style={styles.chargementTexte}>Chargement...</Text>
          ) : annonces.length === 0 ? (
            <Text style={styles.chargementTexte}>Aucune annonce pour l'instant</Text>
          ) : (
            annonces.map((annonce) => (
              <View key={annonce.id} style={styles.carte}>
                <View style={styles.carteHeader}>
                  <Text style={styles.carteProduit}>{annonce.produit}</Text>
                  <Text style={styles.cartePrix}>{annonce.prix}</Text>
                </View>
                <Text style={styles.carteDetail}>Quantite : {annonce.quantite}</Text>
                <Text style={styles.carteDetail}>Vendeur : {annonce.vendeur}</Text>
                <TouchableOpacity style={styles.boutonContact}>
                  <Text style={styles.boutonContactTexte}>Contacter : {annonce.contact}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.formulaire}>
          <TextInput
            style={styles.input}
            placeholder="Nom du produit (ex: Tomates)"
            placeholderTextColor="#555555"
            value={produit}
            onChangeText={setProduit}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantite (ex: 50 kg)"
            placeholderTextColor="#555555"
            value={quantite}
            onChangeText={setQuantite}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix (ex: 5000 FCFA)"
            placeholderTextColor="#555555"
            value={prix}
            onChangeText={setPrix}
          />
          <TextInput
            style={styles.input}
            placeholder="Votre numero de contact"
            placeholderTextColor="#555555"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.boutonPublier} onPress={soumettre}>
            <Text style={styles.boutonPublierTexte}>{chargement ? 'Publication...' : 'Publier mon annonce'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 0 },
  retour: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  retourTexte: { color: '#4ea8de', fontSize: 16 },
  titre: { fontSize: 28, fontWeight: 'bold', color: '#4ea8de', textAlign: 'center', letterSpacing: 1, marginBottom: 20 },
  tabs: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#111111', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActif: { backgroundColor: '#4ea8de' },
  tabTexte: { fontSize: 14, color: '#555555', fontWeight: '500' },
  tabTexteActif: { color: '#0a0a0a', fontWeight: 'bold' },
  liste: { paddingHorizontal: 20 },
  chargementTexte: { color: '#555555', textAlign: 'center', marginTop: 40, fontSize: 14 },
  carte: { backgroundColor: '#111111', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333333' },
  carteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  carteProduit: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  cartePrix: { fontSize: 16, fontWeight: 'bold', color: '#4ea8de' },
  carteDetail: { fontSize: 13, color: '#aaaaaa', marginBottom: 4 },
  boutonContact: { marginTop: 10, backgroundColor: '#0a0a0a', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#4ea8de' },
  boutonContactTexte: { color: '#4ea8de', fontSize: 13, fontWeight: '500' },
  formulaire: { paddingHorizontal: 20 },
  input: { backgroundColor: '#111111', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#ffffff', borderWidth: 1, borderColor: '#333333', marginBottom: 12 },
  boutonPublier: { backgroundColor: '#4ea8de', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  boutonPublierTexte: { color: '#0a0a0a', fontWeight: 'bold', fontSize: 16 },
});