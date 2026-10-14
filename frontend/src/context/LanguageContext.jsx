import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    systemTitle: 'DISASTER RELIEF',
    systemSubtitle: 'Coordination & Management System',
    emergencyNotice: 'Emergency Relief Portal',
    liveOperations: 'LIVE EMERGENCY MONITORING',
    activeMonitoring: 'ACTIVE MONITORING',
    heroTag: 'REAL-TIME DISASTER COORDINATION PLATFORM',
    heroTitle: 'Rapid Response. Unified Relief. Saving Lives Together.',
    heroSubtitle: 'Connecting flood, cyclone, and disaster-affected citizens directly with certified NGOs, field rescue volunteers, and government emergency control rooms.',
    requestEmergencyAid: 'Request Emergency Aid',
    volunteerResponders: 'Responder & NGO Portal',
    login: 'Login',
    signUp: 'Sign Up',
    citizenRegistration: 'Citizen Registration',
    goToDashboard: 'Go to Dashboard',
    logout: 'Logout',
    hotlineBanner: 'CRITICAL EMERGENCY HOTLINES: National Disaster Relief: 1070 | Police/Fire/Ambulance: 112 | State Flood Control: 1077',
    
    // Auth
    selectRoleTitle: 'Select Your Account Role',
    selectRoleSubtitle: 'Choose your portal access level to continue',
    signInTitle: 'Sign In to Portal',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    signInButton: 'Sign In',
    registerTitle: 'Create Relief Account',
    registerSubtitle: 'Join the Disaster Relief Coordination Network',
    accountTypePrompt: 'What type of account do you want to create?',
    fullNameLabel: 'Full Name',
    orgNameLabel: 'Organization Name',
    contactPersonLabel: 'Contact Person Name',
    phoneLabel: 'Contact Phone Number',
    operatingAreaLabel: 'Operating District / Area',
    skillsLabel: 'Skills & Availability (e.g. First Aid, Boat Rescue, Medical)',
    addressLabel: 'Address / Landmark',
    completeRegistration: 'Complete Registration',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    registerNow: 'Sign Up Here',
    roleMismatchError: 'Access Denied: Your account role does not match the selected portal.',
    passwordsDoNotMatch: 'Passwords do not match. Please verify.',
    
    // Categories
    categories: {
      Food: 'Food & Clean Water',
      Medical: 'Medical & First Aid',
      Shelter: 'Emergency Shelter',
      Rescue: 'Emergency Rescue & Evacuation'
    },
    
    // Priorities
    priorities: {
      CRITICAL: 'Critical Priority',
      HIGH: 'High Priority',
      MEDIUM: 'Medium Priority',
      LOW: 'Low Priority'
    },

    // Statuses
    statuses: {
      PENDING: 'Pending Dispatch',
      ASSIGNED: 'Assigned to Responder',
      IN_PROGRESS: 'Relief In Progress',
      RESOLVED: 'Aid Delivered & Resolved'
    },

    // Form
    form: {
      emergencyCategory: 'Emergency Category',
      description: 'Describe the Emergency Situation',
      location: 'Location / Landmark Address',
      peopleAffected: 'Estimated People Affected',
      contactPhone: 'Contact Phone Number',
      submitEmergency: 'Transmit Emergency Request',
      pickOnMap: 'Click on map or use GPS to set exact coordinates',
      detectingAddress: 'Detecting readable address from coordinates...'
    },

    // Roles
    roles: {
      CITIZEN: 'Citizen',
      NGO: 'NGO Team',
      VOLUNTEER: 'Disaster Volunteer',
      GOVERNMENT: 'Government Authority',
      ADMIN: 'System Administrator'
    },

    // Chatbot / Help Assistant
    assistant: {
      title: 'Disaster Relief Help Assistant',
      subtitle: 'Guidance & Emergency Navigation',
      greeting: 'Hello! I can help you find immediate assistance. What type of emergency support do you need?',
      disclaimer: 'Note: This assistant guides you to the correct emergency form. It does not replace official emergency calls (112 / 1070).',
      quickFood: 'I need Food / Water',
      quickMedical: 'I need Medical Assistance',
      quickShelter: 'I need Emergency Shelter',
      quickRescue: 'I need Boat / Evacuation Rescue',
      createRequestBtn: 'Create Emergency Request Now'
    }
  },

  ta: {
    systemTitle: 'பேரிடர் நிவாரணம்',
    systemSubtitle: 'ஒருங்கிணைப்பு மற்றும் மேலாண்மை அமைப்பு',
    emergencyNotice: 'அவசர நிவாரண போர்டல்',
    liveOperations: 'நேரடி அவசர கண்காணிப்பு',
    activeMonitoring: 'செயலில் உள்ள கண்காணிப்பு',
    heroTag: 'நேரடி பேரிடர் மீட்பு ஒருங்கிணைப்பு தளம்',
    heroTitle: 'விரைவான மீட்பு. ஒருங்கிணைந்த நிவாரணம். உயிர்களைக் காப்போம்.',
    heroSubtitle: 'வெள்ளம், புயல் மற்றும் பேரிடரால் பாதிக்கப்பட்ட மக்களை அரசு, தொண்டு நிறுவனங்கள் (NGO) மற்றும் தன்னார்வலர்களுடன் உடனடியாக இணைக்கிறது.',
    requestEmergencyAid: 'அவசர உதவி கோரிக்கை',
    volunteerResponders: 'தன்னார்வலர் / NGO போர்டல்',
    login: 'உள்நுழைக (Login)',
    signUp: 'பதிவு செய்க (Sign Up)',
    citizenRegistration: 'குடிமக்கள் பதிவு',
    goToDashboard: 'டாஷ்போர்டுக்கு செல்',
    logout: 'வெளியேறு (Logout)',
    hotlineBanner: 'முக்கிய அவசர எண்கள்: தேசிய பேரிடர் மீட்பு: 1070 | காவல்/தீயணைப்பு/ஆம்புலன்ஸ்: 112 | மாநில வெள்ளக் கட்டுப்பாடு: 1077',

    selectRoleTitle: 'உங்கள் கணக்கு வகையைத் தேர்ந்தெடுக்கவும்',
    selectRoleSubtitle: 'தொடர உங்கள் அணுகல் நிலையைத் தேர்வுசெய்க',
    signInTitle: 'போர்ட்டலில் உள்நுழைக',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    passwordLabel: 'கடவுச்சொல்',
    confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    signInButton: 'உள்நுழைக',
    registerTitle: 'நிவாரண கணக்கை உருவாக்கவும்',
    registerSubtitle: 'பேரிடர் நிவாரண அமைப்பில் இணையுங்கள்',
    accountTypePrompt: 'நீங்கள் எந்த வகையான கணக்கை உருவாக்க விரும்புகிறீர்கள்?',
    fullNameLabel: 'முழு பெயர்',
    orgNameLabel: 'அமைப்பின் பெயர் (NGO)',
    contactPersonLabel: 'தொடர்பு நபர் பெயர்',
    phoneLabel: 'தொலைபேசி எண்',
    operatingAreaLabel: 'செயல்படும் பகுதி / மாவட்டம்',
    skillsLabel: 'திறன்கள் மற்றும் இருப்பு (முதலுதவி, படகு மீட்பு போன்றவை)',
    addressLabel: 'முகவரி / இருப்பிடம்',
    completeRegistration: 'பதிவை முடிக்கவும்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount: 'புதிய கணக்கு வேண்டுமா?',
    registerNow: 'இங்கே பதிவு செய்க',
    roleMismatchError: 'அனுமதி மறுக்கப்பட்டது: உங்கள் கணக்கு வகை தேர்ந்தெடுக்கப்பட்ட போர்ட்டலுடன் பொருந்தவில்லை.',
    passwordsDoNotMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை. சரிபார்க்கவும்.',

    categories: {
      Food: 'உணவு மற்றும் குடிநீர்',
      Medical: 'மருத்துவம் மற்றும் முதலுதவி',
      Shelter: 'அவசர தங்குமிடம்',
      Rescue: 'மீட்பு மற்றும் படகு வெளியேற்றம்'
    },

    priorities: {
      CRITICAL: 'அதிமுக்கியம் (Critical)',
      HIGH: 'உயர் முன்னுரிமை (High)',
      MEDIUM: 'நடுத்தர முன்னுரிமை (Medium)',
      LOW: 'குறைந்த முன்னுரிமை (Low)'
    },

    statuses: {
      PENDING: 'நிலுவையில் உள்ளது',
      ASSIGNED: 'மீட்பாளர் நியமிக்கப்பட்டார்',
      IN_PROGRESS: 'நிவாரணப் பணி நடக்கிறது',
      RESOLVED: 'உதவி வழங்கப்பட்டு முடிக்கப்பட்டது'
    },

    form: {
      emergencyCategory: 'அவசர பிரிவு',
      description: 'சூழ்நிலையை விவரிக்கவும்',
      location: 'இடம் / முகவரி',
      peopleAffected: 'பாதிக்கப்பட்டோர் எண்ணிக்கை',
      contactPhone: 'தொடர்பு எண்',
      submitEmergency: 'அவசர கோரிக்கையை சமர்ப்பிக்கவும்',
      pickOnMap: 'வரைபடத்தில் கிளிக் செய்யவும்',
      detectingAddress: 'முகவரி கண்டறியப்படுகிறது...'
    },

    roles: {
      CITIZEN: 'குடிமகன்',
      NGO: 'தொண்டு நிறுவனம் (NGO)',
      VOLUNTEER: 'தன்னார்வலர்',
      GOVERNMENT: 'அரசு அதிகாரி',
      ADMIN: 'கணினி நிர்வாகி'
    },

    assistant: {
      title: 'பேரிடர் உதவி உதவியாளர்',
      subtitle: 'வழிகாட்டுதல் மற்றும் உதவி',
      greeting: 'வணக்கம்! உங்களுக்கு என்ன வகையான அவசர உதவி தேவை? நான் வழிகாட்டுகிறேன்.',
      disclaimer: 'குறிப்பு: இந்த உதவியாளர் சரியான அவசர படிவத்தை நிரப்ப உதவும். இது அதிகாரப்பூர்வ அழைப்புகளை (112 / 1070) மாற்றாது.',
      quickFood: 'எனக்கு உணவு / தண்ணீர் தேவை',
      quickMedical: 'எனக்கு மருத்துவ உதவி தேவை',
      quickShelter: 'எனக்கு தங்குமிடம் தேவை',
      quickRescue: 'எனக்கு படகு / மீட்பு தேவை',
      createRequestBtn: 'உடனடி கோரிக்கை உருவாக்கவும்'
    }
  },

  hi: {
    systemTitle: 'आपदा राहत प्रणाली',
    systemSubtitle: 'समन्वय एवं प्रबंधन प्रणाली',
    emergencyNotice: 'आपातकालीन राहत पोर्टल',
    liveOperations: 'लाइव आपातकालीन निगरानी',
    activeMonitoring: 'सक्रिय निगरानी',
    heroTag: 'रीयल-टाइम आपदा समन्वय मंच',
    heroTitle: 'त्वरित प्रतिक्रिया। एकीकृत राहत। जीवन रक्षा।',
    heroSubtitle: 'बाढ़, चक्रवात और आपदा प्रभावित नागरिकों को प्रमाणित गैर सरकारी संगठनों, बचाव स्वयंसेवकों और सरकारी नियंत्रण कक्षों से सीधे जोड़ना।',
    requestEmergencyAid: 'आपातकालीन सहायता का अनुरोध करें',
    volunteerResponders: 'प्रतिक्रियाकर्ता और एनजीओ पोर्टल',
    login: 'लॉग इन करें',
    signUp: 'साइन अप करें',
    citizenRegistration: 'नागरिक पंजीकरण',
    goToDashboard: 'डैशबोर्ड पर जाएं',
    logout: 'लॉग आउट',
    hotlineBanner: 'आपातकालीन हेल्पलाइन: राष्ट्रीय आपदा राहत: 1070 | पुलिस/अग्निशमन/एम्बुलेंस: 112 | राज्य बाढ़ नियंत्रण: 1077',

    selectRoleTitle: 'अपनी खाता भूमिका चुनें',
    selectRoleSubtitle: 'जारी रखने के लिए अपना पोर्टल स्तर चुनें',
    signInTitle: 'पोर्टल में साइन इन करें',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    signInButton: 'साइन इन करें',
    registerTitle: 'राहत खाता बनाएं',
    registerSubtitle: 'आपदा राहत समन्वय नेटवर्क से जुड़ें',
    accountTypePrompt: 'आप किस प्रकार का खाता बनाना चाहते हैं?',
    fullNameLabel: 'पूरा नाम',
    orgNameLabel: 'संगठन का नाम (NGO)',
    contactPersonLabel: 'संपर्क व्यक्ति का नाम',
    phoneLabel: 'संपर्क फोन नंबर',
    operatingAreaLabel: 'कार्य क्षेत्र / जिला',
    skillsLabel: 'कौशल और उपलब्धता (प्राथमिक चिकित्सा, नाव बचाव आदि)',
    addressLabel: 'पता / स्थान',
    completeRegistration: 'पंजीकरण पूरा करें',
    alreadyHaveAccount: 'क्या आपके पास पहले से एक खाता मौजूद है?',
    dontHaveAccount: 'क्या आपके पास खाता नहीं है?',
    registerNow: 'यहाँ साइन अप करें',
    roleMismatchError: 'पहुंच अस्वीकृत: आपकी खाता भूमिका चयनित पोर्टल से मेल नहीं खाती है।',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते। कृपया जांचें।',

    categories: {
      Food: 'भोजन और स्वच्छ पानी',
      Medical: 'चिकित्सा एवं प्राथमिक उपचार',
      Shelter: 'आपातकालीन आश्रय',
      Rescue: 'आपातकालीन बचाव एवं निकासी'
    },

    priorities: {
      CRITICAL: 'अत्यंत गंभीर (Critical)',
      HIGH: 'उच्च प्राथमिकता (High)',
      MEDIUM: 'मध्यम प्राथमिकता (Medium)',
      LOW: 'निम्न प्राथमिकता (Low)'
    },

    statuses: {
      PENDING: 'लंबित प्रेषण',
      ASSIGNED: 'प्रतिक्रियाकर्ता नियुक्त',
      IN_PROGRESS: 'राहत कार्य प्रगति पर है',
      RESOLVED: 'सहायता पहुंचाई गई एवं समाधान हुआ'
    },

    form: {
      emergencyCategory: 'आपातकालीन श्रेणी',
      description: 'आपातकालीन स्थिति का वर्णन करें',
      location: 'स्थान / लैंडमार्क पता',
      peopleAffected: 'प्रभावित लोगों की अनुमानित संख्या',
      contactPhone: 'संपर्क फोन नंबर',
      submitEmergency: 'आपातकालीन अनुरोध भेजें',
      pickOnMap: 'मानचित्र पर क्लिक करें',
      detectingAddress: 'पता खोजा जा रहा है...'
    },

    roles: {
      CITIZEN: 'नागरिक',
      NGO: 'गैर सरकारी संगठन (NGO)',
      VOLUNTEER: 'आपदा स्वयंसेवक',
      GOVERNMENT: 'सरकारी अधिकारी',
      ADMIN: 'सिस्टम प्रशासक'
    },

    assistant: {
      title: 'आपदा राहत सहायता सहायक',
      subtitle: 'मार्गदर्शन एवं आपातकालीन नेविगेशन',
      greeting: 'नमस्ते! मैं आपको तुरंत आपातकालीन सहायता खोजने में मदद कर सकता हूँ। आपको किस प्रकार की सहायता चाहिए?',
      disclaimer: 'नोट: यह सहायक आपको सही फॉर्म पर ले जाता है। यह आधिकारिक आपातकालीन नंबरों (112 / 1070) का विकल्प नहीं है।',
      quickFood: 'मुझे भोजन/पानी चाहिए',
      quickMedical: 'मुझे चिकित्सा सहायता चाहिए',
      quickShelter: 'मुझे आश्रय चाहिए',
      quickRescue: 'मुझे नाव/बचाव चाहिए',
      createRequestBtn: 'आपातकालीन अनुरोध बनाएं'
    }
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('app_language', newLang);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
