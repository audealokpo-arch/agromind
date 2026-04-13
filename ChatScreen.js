import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const CLE_API = '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';

export default function ChatScreen({ route, navigation }) {
  const { categorie } = route.params;
  const [messages, setMessages] = useState([
    { id: 1, auteur: 'ia', texte: `Bonjour ! Je suis AudAI_agromind, cree par Aude. Preferez-vous decrire votre probleme en texte ou envoyer une photo ?` }
  ]);
  const [input, setInput] = useState('');
  const [chargement, setChargement] = useState(false);

  const prendrePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      setMessages(prev => [...prev, { id: Date.now(), auteur: 'user', texte: '', image: photo.uri }]);
      setChargement(true);

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CLE_API}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: `Tu t'appelles AudAI_agromind, cree par Aude. L'agriculteur a un probleme de "${categorie}". Une photo a ete envoyee. Donne un diagnostic et une solution.` },
              { role: 'user', content: 'Photo envoyee par l\'agriculteur pour analyse.' }
            ],
          }),
        });

        const data = await response.json();
        const reponse = data.choices[0].message.content;
        setMessages(prev => [...prev, { id: Date.now(), auteur: 'ia', texte: reponse }]);
      } catch (error) {
        setMessages(prev => [...prev, { id: Date.now(), auteur: 'ia', texte: 'Erreur de connexion. Reessayez.' }]);
      }

      setChargement(false);
    }
  };

  const envoyer = async () => {
    if (!input.trim()) return;

    const nouveauMessage = { id: Date.now(), auteur: 'user', texte: input };
    const nouvellesMessages = [...messages, nouveauMessage];
    setMessages(nouvellesMessages);
    setInput('');
    setChargement(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLE_API}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: `Tu t'appelles AudAI_agromind, cree par Aude. L'agriculteur a un probleme de "${categorie}". Pose des questions courtes pour diagnostiquer. Si necessaire demande une photo.` },
            ...nouvellesMessages.map(m => ({
              role: m.auteur === 'user' ? 'user' : 'assistant',
              content: m.texte
            }))
          ],
        }),
      });

      const data = await response.json();
      const reponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { id: Date.now(), auteur: 'ia', texte: reponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), auteur: 'ia', texte: 'Erreur de connexion. Reessayez.' }]);
    }

    setChargement(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
        <Text style={styles.retourTexte}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.titre}>{categorie}</Text>
      <ScrollView style={styles.chat}>
        {messages.map((msg) => (
          <View key={msg.id} style={msg.auteur === 'ia' ? styles.bulleIa : styles.bulleUser}>
            {msg.image ? (
              <Image source={{ uri: msg.image }} style={styles.photo} />
            ) : (
              <Text style={msg.auteur === 'ia' ? styles.texteIa : styles.texteUser}>{msg.texte}</Text>
            )}
          </View>
        ))}
        {chargement && (
          <View style={styles.bulleIa}>
            <Text style={styles.texteIa}>...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputZone}>
        <TouchableOpacity style={styles.boutonPhoto} onPress={prendrePhoto}>
          <Text style={styles.iconePhoto}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Decrivez le probleme..."
          placeholderTextColor="#555555"
        />
        <TouchableOpacity style={styles.bouton} onPress={envoyer}>
          <Text style={styles.boutonTexte}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  retour: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  retourTexte: { color: '#4ea8de', fontSize: 16 },
  titre: { fontSize: 20, fontWeight: 'bold', color: '#4ea8de', textAlign: 'center', paddingBottom: 16, letterSpacing: 1 },
  chat: { flex: 1, paddingHorizontal: 16 },
  bulleIa: { backgroundColor: '#111111', borderRadius: 12, padding: 12, marginBottom: 10, maxWidth: '80%', borderWidth: 1, borderColor: '#4ea8de' },
  bulleUser: { backgroundColor: '#4ea8de', borderRadius: 12, padding: 12, marginBottom: 10, maxWidth: '80%', alignSelf: 'flex-end' },
  texteIa: { color: '#4ea8de', fontSize: 14 },
  texteUser: { color: '#0a0a0a', fontSize: 14 },
  photo: { width: 200, height: 200, borderRadius: 12 },
  inputZone: { flexDirection: 'row', padding: 24, paddingBottom: 40, gap: 8 },
  boutonPhoto: { backgroundColor: '#111111', borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#4ea8de' },
  iconePhoto: { fontSize: 20 },
  input: { flex: 1, backgroundColor: '#111111', borderRadius: 12, paddingHorizontal: 16, fontSize: 14, color: '#ffffff', borderWidth: 1, borderColor: '#333333' },
  bouton: { backgroundColor: '#4ea8de', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  boutonTexte: { color: '#0a0a0a', fontWeight: 'bold' },
});