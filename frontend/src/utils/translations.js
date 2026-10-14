/**
 * Multi-language translation structure for Disaster Relief System.
 * Default: English (en). Extensible structure for Tamil (ta) and other local languages.
 */

export const translations = {
  en: {
    systemTitle: 'Disaster Relief Coordination System',
    emergencyNotice: 'Emergency Relief Portal',
    liveOperations: 'LIVE CONTROL ROOM',
    requestImmediateHelp: 'Report Emergency / Request Aid',
    responderPortal: 'Responder & NGO Portal',
    
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
      ASSIGNED: 'Responder Assigned',
      IN_PROGRESS: 'Relief In Progress',
      RESOLVED: 'Aid Delivered & Resolved'
    },

    // Form labels
    form: {
      emergencyCategory: 'Emergency Category',
      description: 'Describe the Emergency Situation',
      location: 'Location / Landmark Address',
      latitude: 'Latitude',
      longitude: 'Longitude',
      peopleAffected: 'Estimated People Affected',
      contactPhone: 'Contact Phone Number',
      submitEmergency: 'Transmit Emergency Request',
      pickOnMap: 'Click on map or use GPS to set exact coordinates',
      offlineDraftSaved: 'Offline: Form data saved locally. Will restore when online.'
    },

    // Roles
    roles: {
      CITIZEN: 'Citizen',
      NGO: 'Non-Governmental Org (NGO)',
      VOLUNTEER: 'Disaster Volunteer',
      GOVERNMENT: 'Government Authority',
      ADMIN: 'System Administrator'
    }
  },

  // Tamil (தமிழ்) translation skeleton
  ta: {
    systemTitle: 'பேரிடர் நிவாரண ஒருங்கிணைப்பு அமைப்பு',
    emergencyNotice: 'அவசர நிவாரண போர்டல்',
    liveOperations: 'நேரடி கட்டுப்பாட்டு அறை',
    requestImmediateHelp: 'அவசர உதவி கோரிக்கை',
    responderPortal: 'தன்னார்வலர் / என்ஜிஓ போர்டல்',

    categories: {
      Food: 'உணவு மற்றும் குடிநீர்',
      Medical: 'மருத்துவம் மற்றும் முதலுதவி',
      Shelter: 'அவசர தங்குமிடம்',
      Rescue: 'மீட்பு மற்றும் வெளியேற்றம்'
    },

    priorities: {
      CRITICAL: 'அதிமுக்கியம் (Critical)',
      HIGH: 'உயர் முன்னுரிமை (High)',
      MEDIUM: 'நடுத்தர முன்னுரிமை (Medium)',
      LOW: 'குறைந்த முன்னுரிமை (Low)'
    },

    statuses: {
      PENDING: 'நிலுவையில் உள்ளது',
      ASSIGNED: 'ஒதுக்கப்பட்டது',
      IN_PROGRESS: 'நிவாரண பணியில்',
      RESOLVED: 'தீர்க்கப்பட்டது'
    },

    form: {
      emergencyCategory: 'அவசர பிரிவு',
      description: 'சூழ்நிலையை விவரிக்கவும்',
      location: 'இடம் / முகவரி',
      latitude: 'அட்சரேகை',
      longitude: 'தீர்க்கரேகை',
      peopleAffected: 'பாதிக்கப்பட்டோர் எண்ணிக்கை',
      contactPhone: 'தொடர்பு எண்',
      submitEmergency: 'அவசர கோரிக்கையை சமர்ப்பிக்கவும்',
      pickOnMap: 'வரைபடத்தில் கிளிக் செய்யவும்',
      offlineDraftSaved: 'ஆஃப்லைன்: வரைவு சேமிக்கப்பட்டது.'
    },

    roles: {
      CITIZEN: 'குடிமகன்',
      NGO: 'தொண்டு நிறுவனம் (NGO)',
      VOLUNTEER: 'தன்னார்வலர்',
      GOVERNMENT: 'அரசு அதிகாரி',
      ADMIN: 'கணினி நிர்வாகி'
    }
  }
};

export const getTranslation = (lang = 'en') => {
  return translations[lang] || translations.en;
};
