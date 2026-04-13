import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const CLE_GROQ = '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';

export default function AgriFinanceScreen({ navigation }) {
  const [affichage, setAffichage] = useState('accueil');
  const [montant, setMontant] = useState('');
  const [raison, setRaison] = useState('');
  const [surface, setSurface] = useState('');
  const [couts, setCouts] = useState('');
  const [revenusEstimes, setRevenusEstimes] = useState('');
  const [analyse, setAnalyse] = useState('');
  const [chargement, setChargement] = useState(false);
  const [demandes, setDemandes] = useState([]);

  const analyserRentabilite = async () => {
    if (!couts || !revenusEstimes) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setChargement(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLE_GROQ}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'Tu es un conseiller financier agricole. Analyse la rentabilite du projet et donne un conseil clair en 3 phrases maximum.' },
            { role: 'user', content: `Couts totaux: ${couts} FCFA. Revenus estimes: ${revenusEstimes} FCFA. Surface: ${surface} hectares. Est-ce rentable ?` }
          ],
        }),
      });
      const data = await response.json();
      setAnalyse(data.choices[0].message.content);
    } catch (error) {
      alert('Erreur de connexion');
    }
    setChargement(false);
  };

  const soumettreCredit = () => {
    if (!montant || !raison) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    const nouvelleDemande = {
      id: Date.now(),
      montant,
      raison,
      statut: 'En attente',
      date: new Date().toLocaleDateString(),
    };
    setDemandes([nouvelleDemande, ...demandes]);
    setMontant('');
    setRaison('');
    setAffichage('demandes');
    alert('Demande soumise avec succes !');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
        <Text style={styles.retourTexte}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>AgriFinance</Text>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, affichage === 'accueil' && styles.tabActif]} onPress={() => setAffichage('accueil')}>
          <Text style={[styles.tabTexte, affichage === 'accueil' && styles.tabTexteActif]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, affichage === 'credit' && styles.tabActif]} onPress={() => setAffichage('credit')}>
          <Text style={[styles.tabTexte, affichage === 'credit' && styles.tabTexteActif]}>Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, affichage === 'rentabilite' && styles.tabActif]} onPress={() => setAffichage('rentabilite')}>
          <Text style={[styles.tabTexte, affichage === 'rentabilite' && styles.tabTexteActif]}>Rentabilite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, affichage === 'demandes' && styles.tabActif]} onPress={() => setAffichage('demandes')}>
          <Text style={[styles.tabTexte, affichage === 'demandes' && styles.tabTexteActif]}>Demandes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contenu}>
        {affichage === 'accueil' && (
          <View>
            <View style={styles.carteInfo}>
              <Text style={styles.carteInfoTitre}>Bienvenue sur AgriFinance</Text>
              <Text style={styles.carteInfoTexte}>Obtenez un micro-credit pour vos cultures ou analysez la rentabilite de votre projet agricole.</Text>
            </View>
            <TouchableOpacity style={styles.boutonAction} onPress={() => setAffichage('credit')}>
              <Text style={styles.boutonActionIcone}>💰</Text>
              <Text style={styles.boutonActionTexte}>Demander un credit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boutonAction} onPress={() => setAffichage('rentabilite')}>
              <Text style={styles.boutonActionIcone}>📊</Text>
              <Text style={styles.boutonActionTexte}>Analyser ma rentabilite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boutonAction} onPress={() => setAffichage('demandes')}>
              <Text style={styles.boutonActionIcone}>📋</Text>
              <Text style={styles.boutonActionTexte}>Voir mes demandes</Text>
            </TouchableOpacity>
          </View>
        )}

        {affichage === 'credit' && (
          <View>
            <Text style={styles.sectionTitre}>Demande de micro-credit</Text>
            <TextInput style={styles.input} placeholder="Montant souhaite (FCFA)" placeholderTextColor="#555555" value={montant} onChangeText={setMontant} keyboardType="numeric" />
            <TextInput style={[styles.input, styles.inputMultiline]} placeholder="Raison de la demande..." placeholderTextColor="#555555" value={raison} onChangeText={setRaison} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.boutonSoumettre} onPress={soumettreCredit}>
              <Text style={styles.boutonSoumettreTexte}>Soumettre la demande</Text>
            </TouchableOpacity>
          </View>
        )}

        {affichage === 'rentabilite' && (
          <View>
            <Text style={styles.sectionTitre}>Calculateur de rentabilite</Text>
            <TextInput style={styles.input} placeholder="Surface cultivee (hectares)" placeholderTextColor="#555555" value={surface} onChangeText={setSurface} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Couts totaux (FCFA)" placeholderTextColor="#555555" value={couts} onChangeText={setCouts} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Revenus estimes (FCFA)" placeholderTextColor="#555555" value={revenusEstimes} onChangeText={setRevenusEstimes} keyboardType="numeric" />
            <TouchableOpacity style={styles.boutonSoumettre} onPress={analyserRentabilite}>
              <Text style={styles.boutonSoumettreTexte}>{chargement ? 'Analyse en cours...' : 'Analyser avec AudAI'}</Text>
            </TouchableOpacity>
            {analyse !== '' && (
              <View style={styles.carteAnalyse}>
                <Text style={styles.carteAnalyseTitre}>Analyse AudAI</Text>
                <Text style={styles.carteAnalyseTexte}>{analyse}</Text>
              </View>
            )}
          </View>
        )}

        {affichage === 'demandes' && (
          <View>
            <Text style={styles.sectionTitre}>Mes demandes de credit</Text>
            {demandes.length === 0 ? (
              <Text style={styles.vide}>Aucune demande pour l'instant</Text>
            ) : (
              demandes.map((d) => (
                <View key={d.id} style={styles.carteDemande}>
                  <View style={styles.carteDemandeHeader}>
                    <Text style={styles.carteDemandeMontant}>{d.montant} FCFA</Text>
                    <View style={[styles.badge, d.statut === 'Approuve' ? styles.badgeVert : d.statut === 'Refuse' ? styles.badgeRouge : styles.badgeOrange]}>
                      <Text style={styles.badgeTexte}>{d.statut}</Text>
                    </View>
                  </View>
                  <Text style={styles.carteDemandeRaison}>{d.raison}</Text>
                  <Text style={styles.carteDemandeDate}>{d.date}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  retour: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  retourTexte: { color: '#4ea8de', fontSize: 16 },
  titre: { fontSize: 28, fontWeight: 'bold', color: '#4ea8de', textAlign: 'center', letterSpacing: 1, marginBottom: 20 },
  tabs: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#111111', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActif: { backgroundColor: '#4ea8de' },
  tabTexte: { fontSize: 11, color: '#555555', fontWeight: '500' },
  tabTexteActif: { color: '#0a0a0a', fontWeight: 'bold' },
  contenu: { paddingHorizontal: 20 },
  carteInfo: { backgroundColor: '#111111', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#4ea8de' },
  carteInfoTitre: { fontSize: 16, fontWeight: 'bold', color: '#4ea8de', marginBottom: 8 },
  carteInfoTexte: { fontSize: 14, color: '#aaaaaa', lineHeight: 22 },
  boutonAction: { backgroundColor: '#111111', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333333' },
  boutonActionIcone: { fontSize: 24, marginRight: 12 },
  boutonActionTexte: { fontSize: 15, color: '#ffffff', fontWeight: '500' },
  sectionTitre: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 16 },
  input: { backgroundColor: '#111111', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#ffffff', borderWidth: 1, borderColor: '#333333', marginBottom: 12 },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  boutonSoumettre: { backgroundColor: '#4ea8de', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  boutonSoumettreTexte: { color: '#0a0a0a', fontWeight: 'bold', fontSize: 16 },
  carteAnalyse: { backgroundColor: '#111111', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#4ea8de', marginBottom: 20 },
  carteAnalyseTitre: { fontSize: 14, fontWeight: 'bold', color: '#4ea8de', marginBottom: 8 },
  carteAnalyseTexte: { fontSize: 14, color: '#aaaaaa', lineHeight: 22 },
  vide: { color: '#555555', textAlign: 'center', marginTop: 40, fontSize: 14 },
  carteDemande: { backgroundColor: '#111111', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333333' },
  carteDemandeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  carteDemandeMontant: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeOrange: { backgroundColor: '#333300' },
  badgeVert: { backgroundColor: '#003300' },
  badgeRouge: { backgroundColor: '#330000' },
  badgeTexte: { fontSize: 12, color: '#ffffff', fontWeight: '500' },
  carteDemandeRaison: { fontSize: 13, color: '#aaaaaa', marginBottom: 4 },
  carteDemandeDate: { fontSize: 12, color: '#555555' },
});