const SUPABASE_URL = 'https://plbqebyiysuiajgqtysu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_M5H-LDlgeTseTqzUK43iJQ_4sa9eM8Y';

export const inscrireUtilisateur = async (nom, email, numero, motDePasse) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ nom, email, numero, mot_de_passe: motDePasse }),
    });

    const data = await response.json();
    console.log('Reponse Supabase:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.log('Erreur:', error.message);
    return null;
  }
};

export const publierAnnonce = async (produit, quantite, prix, contact, vendeur) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/annonces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ produit, quantite, prix, contact, vendeur }),
  });
  const data = await response.json();
  return data;
};

export const getAnnonces = async () => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/annonces?order=date_creation.desc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  const data = await response.json();
  return data;
};

export const connecterUtilisateur = async (email, motDePasse) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs?email=eq.${email}&mot_de_passe=eq.${motDePasse}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  const data = await response.json();
  return data;
};