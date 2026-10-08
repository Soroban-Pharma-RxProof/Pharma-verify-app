export type SupportedLocale = 'en' | 'fr' | 'ha' | 'yo' | 'sw';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  verifyMedicine: string;
  scanQrCode: string;
  enterSerialManually: string;
  serialNumberPlaceholder: string;
  verifyButton: string;
  authenticTitle: string;
  authenticDesc: string;
  expiredTitle: string;
  expiredDesc: string;
  recalledTitle: string;
  recalledDesc: string;
  suspiciousTitle: string;
  suspiciousDesc: string;
  batchId: string;
  productName: string;
  dosage: string;
  expiryDate: string;
  custodyChain: string;
  reportCounterfeit: string;
  dispenseMedicine: string;
  burnSerial: string;
  pharmacyPortal: string;
  manufacturerPortal: string;
  regulatorPortal: string;
  connectWallet: string;
  disconnectWallet: string;
  offlineMode: string;
  blisterStripsRemaining: string;
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    appName: 'Soroban Pharma RxProof',
    tagline: 'Cryptographic Counterfeit Medicine Verification on Stellar',
    verifyMedicine: 'Verify Medicine Pack',
    scanQrCode: 'Scan Pack QR Code',
    enterSerialManually: 'Enter Serial Manually',
    serialNumberPlaceholder: 'e.g. RX-2026-9812-4412',
    verifyButton: 'Verify Authenticity',
    authenticTitle: 'Authentic Medicine',
    authenticDesc: 'This medicine pack is genuine, verified on Stellar blockchain, and unburned.',
    expiredTitle: 'Expired Medicine',
    expiredDesc: 'Warning: This medicine has expired and must not be consumed or dispensed.',
    recalledTitle: 'Recalled Medicine',
    recalledDesc: 'Warning: This batch has been officially recalled by health authorities.',
    suspiciousTitle: 'Suspicious / Cloned Code',
    suspiciousDesc: 'DANGER: This serial code was previously burned/dispensed. Possible counterfeit replica.',
    batchId: 'Batch Number',
    productName: 'Product Name',
    dosage: 'Dosage Form',
    expiryDate: 'Expiry Date',
    custodyChain: 'Chain of Custody',
    reportCounterfeit: 'Report Suspicious Medicine',
    dispenseMedicine: 'Dispense Pack',
    burnSerial: 'Burn Pack Serial On-Chain',
    pharmacyPortal: 'Pharmacy Portal',
    manufacturerPortal: 'Manufacturer Portal',
    regulatorPortal: 'Regulator Oversight',
    connectWallet: 'Connect Wallet',
    disconnectWallet: 'Disconnect',
    offlineMode: 'Offline Cache Active',
    blisterStripsRemaining: 'Blister Strips Remaining',
  },
  fr: {
    appName: 'Soroban Pharma RxProof',
    tagline: 'Vérification Cryptographique des Médicaments sur Stellar',
    verifyMedicine: 'Vérifier le Médicament',
    scanQrCode: 'Scanner le Code QR',
    enterSerialManually: 'Saisir le Numéro de Série',
    serialNumberPlaceholder: 'ex. RX-2026-9812-4412',
    verifyButton: 'Vérifier l\'Authenticité',
    authenticTitle: 'Médicament Authentique',
    authenticDesc: 'Ce paquet est authentique, vérifié sur la blockchain Stellar et non dispensé.',
    expiredTitle: 'Médicament Périmé',
    expiredDesc: 'Attention: Ce médicament est périmé et ne doit pas être consommé.',
    recalledTitle: 'Médicament Rappelé',
    recalledDesc: 'Attention: Ce lot a été officiellement rappelé par les autorités sanitaires.',
    suspiciousTitle: 'Suspect / Code Cloné',
    suspiciousDesc: 'DANGER: Ce numéro de série a déjà été utilisé. Risque élevé de contrefaçon.',
    batchId: 'Numéro de Lot',
    productName: 'Nom du Produit',
    dosage: 'Forme Pharmaceutique',
    expiryDate: 'Date d\'Expiration',
    custodyChain: 'Chaîne de Traçabilité',
    reportCounterfeit: 'Signaler un Médicament Suspect',
    dispenseMedicine: 'Délivrer le Paquet',
    burnSerial: 'Brûler le Numéro de Série sur la Blockchain',
    pharmacyPortal: 'Portail Pharmacie',
    manufacturerPortal: 'Portail Fabricant',
    regulatorPortal: 'Régulateur de Santé',
    connectWallet: 'Connecter Portefeuille',
    disconnectWallet: 'Déconnecter',
    offlineMode: 'Mode Hors-ligne Actif',
    blisterStripsRemaining: 'Plaquettes Restantes',
  },
  ha: {
    appName: 'Soroban Pharma RxProof',
    tagline: 'Tantance Magani na Gaskiya ta Hanyar Fasahar Stellar Blockchain',
    verifyMedicine: 'Tantance Magani',
    scanQrCode: 'Duba Lambar QR',
    enterSerialManually: 'Rubuta Lambar Magani da Hannu',
    serialNumberPlaceholder: 'misali: RX-2026-9812-4412',
    verifyButton: 'Tantance Yanzu',
    authenticTitle: 'Magani na Gaskiya',
    authenticDesc: 'Wannan magani na asali ne, kuma an tantance shi a kan tsarin Stellar.',
    expiredTitle: 'Magani Ya Lalace',
    expiredDesc: 'Gargadi: Ranar amfanin wannan magani ta wuce, kada a sha ko a sayar.',
    recalledTitle: 'An Janye Maganin',
    recalledDesc: 'Gargadi: Hukumar lafiya ta janye wannan rukunin magani saboda matsala.',
    suspiciousTitle: 'Magani na Bogi / An Kwaikwaya',
    suspiciousDesc: 'HATSARI: An riga an yi amfani da wannan lambar a baya. Wannan magani na bogi ne.',
    batchId: 'Lambar Rukuni (Batch)',
    productName: 'Sunan Magani',
    dosage: 'Yadda Ake Sha',
    expiryDate: 'Ranar Lalacewa',
    custodyChain: 'Tarihin Hanyar Kawo Magani',
    reportCounterfeit: 'Kai Karar Maganin Bogi',
    dispenseMedicine: 'Ba da Magani ga Mara Lafiya',
    burnSerial: 'Kona Lambar Magani a Blockchain',
    pharmacyPortal: 'Shafin Masu Sayar da Magani',
    manufacturerPortal: 'Shafin Masana\'anta',
    regulatorPortal: 'Hukumar Kula da Magunguna',
    connectWallet: 'Haɗa Wallet',
    disconnectWallet: 'Cire Haɗin Wallet',
    offlineMode: 'Yanayin Ba da Intanet na Aiki',
    blisterStripsRemaining: 'Rukunin Kwayoyi da Suka Rage',
  },
  yo: {
    appName: 'Soroban Pharma RxProof',
    tagline: 'Ìfìwéran Ògùn Gidi Lórí Stellar Blockchain',
    verifyMedicine: 'Ṣe Àyèwò Ògùn',
    scanQrCode: 'Ṣe Àyèwò Àmì QR',
    enterSerialManually: 'Tẹ Nọ́ńbà Ògùn Sínú Ẹ̀rọ',
    serialNumberPlaceholder: 'bí àpẹẹrẹ: RX-2026-9812-4412',
    verifyButton: 'Ṣe Àyèwò Nísinsìnyí',
    authenticTitle: 'Ògùn Gidi Ni',
    authenticDesc: 'Ògùn yìí jẹ́ ojúlówó látọwọ́ ilé-iṣẹ́, ó sì wà lórí Stellar blockchain.',
    expiredTitle: 'Ògùn Yìí Ti Bàjẹ́',
    expiredDesc: 'Ìkìlọ̀: Ògùn yìí ti kọjá àkókò ìlò rẹ̀, ẹ má ṣe lò ó tàbí tà á.',
    recalledTitle: 'A Ti Fagilé Ògùn Yìí',
    recalledDesc: 'Ìkìlọ̀: Àwọn aláṣẹ ìlera ti pàṣẹ pé kí a má ṣe ta ògùn yìí mọ́.',
    suspiciousTitle: 'Ògùn Àtọwọ́dá / Ayédèrú',
    suspiciousDesc: 'Ewu: Ẹnìkan ti lo nọ́ńbà yìí rí. Ó ṣeé ṣe kí èyí jẹ́ ayédèrú.',
    batchId: 'Nọ́ńbà Ìpele (Batch)',
    productName: 'Orúkọ Ògùn',
    dosage: 'Bí A Ṣe Ń Lò Ó',
    expiryDate: 'Ọjọ́ Ìparí Ògùn',
    custodyChain: 'Ọ̀nà Ìgbéwọle Ògùn',
    reportCounterfeit: 'Fisùn Ògùn Ayédèrú',
    dispenseMedicine: 'Fún Aláìsàn ní Ògùn',
    burnSerial: 'Pa Nọ́ńbà Rẹ́ lórí Blockchain',
    pharmacyPortal: 'Ojúewé Ilé-Ìtajà Ògùn',
    manufacturerPortal: 'Ojúewé Ilé-iṣẹ́ Agbóògùn',
    regulatorPortal: 'Ojúewé Àwọn Aláṣẹ Ìlera',
    connectWallet: 'So Àpò-owó Pọ̀',
    disconnectWallet: 'Yọ Àpò-owó Kúrò',
    offlineMode: 'Àyèwò Láìsí Íńtánẹ́ẹ̀tì',
    blisterStripsRemaining: 'Àwọn Kóró Ògùn Tó Ṣẹ́kù',
  },
  sw: {
    appName: 'Soroban Pharma RxProof',
    tagline: 'Uthibitishaji Salama wa Dawa Halisi kwenye Stellar Blockchain',
    verifyMedicine: 'Thibitisha Dawa',
    scanQrCode: 'Changanua Msimbo wa QR',
    enterSerialManually: 'Ingiza Nambari ya Dawa kwa Mkono',
    serialNumberPlaceholder: 'mfano: RX-2026-9812-4412',
    verifyButton: 'Thibitisha Ukweli',
    authenticTitle: 'Dawa Halisi',
    authenticDesc: 'Dawa hii ni halali, imethibitishwa kwenye blockchain ya Stellar, na haijatumiwa bado.',
    expiredTitle: 'Dawa Imeisha Muda',
    expiredDesc: 'Onyo: Dawa hii imepitisha muda wake wa matumizi na haipaswi kutumika au kuuzwa.',
    recalledTitle: 'Dawa Imerudishwa Nyuma',
    recalledDesc: 'Onyo: Kundi hili la dawa limerudishwa rasmi na mamlaka ya afya.',
    suspiciousTitle: 'Msimbo wa Shaka / Bandia',
    suspiciousDesc: 'HATARI: Nambari hii ya dawa tayari ilishatumika hapo awali. Kuna uwezekano mkubwa ni bandia.',
    batchId: 'Nambari ya Kundi (Batch)',
    productName: 'Jina la Dawa',
    dosage: 'Kipimo na Aina',
    expiryDate: 'Tarehe ya Kuisha Muda',
    custodyChain: 'Msururu wa Umiliki na Usambazaji',
    reportCounterfeit: 'Toa Taarifa ya Dawa Bandia',
    dispenseMedicine: 'Toa Dawa kwa Mgonjwa',
    burnSerial: 'Choma Nambari ya Dawa kwenye Blockchain',
    pharmacyPortal: 'Tovuti ya Duka la Dawa',
    manufacturerPortal: 'Tovuti ya Mtengenezaji',
    regulatorPortal: 'Mamlaka ya Udhibiti wa Dawa',
    connectWallet: 'Unganisha Mkoba',
    disconnectWallet: 'Tenganisha Mkoba',
    offlineMode: 'Hali ya Nje ya Mtandao Inafanya Kazi',
    blisterStripsRemaining: 'Vipande vya Vidonge Vilivyobaki',
  },
};
