import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { connecterUtilisateur } from './supabase';

export default function ConnexionScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [chargement, setChargement] = useState(false);

  const seConnecter = async () => {
    if (!email || !motDePasse) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setChargement(true);
    try {
      const data = await connecterUtilisateur(email, motDePasse);
      if (data && data.length > 0) {
        alert(`Bienvenue ${data[0].nom} !`);
        navigation.navigate('Accueil', { nom: data[0].nom });
      } else {
        alert('Email ou mot de passe incorrect');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
    setChargement(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>AgroMind</Text>
      <Text style={styles.soustitre}>Se connecter</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#555555"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <TouchableOpacity style={styles.bouton} onPress={seConnecter}>
        <Text style={styles.boutonTexte}>{chargement ? 'Connexion...' : 'Se connecter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
        <Text style={styles.lien}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titre: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ea8de',
    letterSpacing: 2,
    marginBottom: 8,
  },
  soustitre: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 12,
  },
  bouton: {
    width: '100%',
    backgroundColor: '#4ea8de',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  boutonTexte: {
    color: '#0a0a0a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lien: {
    color: '#4ea8de',
    fontSize: 14,
  },
});