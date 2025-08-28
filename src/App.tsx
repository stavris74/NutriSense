import React, { useState } from 'react';
import { Clock, MapPin, Battery, Moon, Plus, Minus, ShoppingCart, TrendingUp, Apple, Leaf } from 'lucide-react';

const NutriSenseApp = () => {
  const [currentScreen, setCurrentScreen] = useState('checkin');
  const [checkinData, setCheckinData] = useState({
    sleep: null,
    mood: [],
    schedule: [],
    yesterday: []
  });
  
  const [inventory, setInventory] = useState({
    'Αυγά': { 
      quantity: 6, 
      expiryDate: '2025-08-25', 
      expiryType: 'best-before',
      storageTemp: 'fridge',
      category: 'perishable'
    },
    'Σπανάκι': { 
      quantity: 1, 
      expiryDate: '2025-08-22', 
      expiryType: 'best-before',
      storageTemp: 'fridge',
      category: 'very-perishable'
    },
    'Αβοκάντο': { 
      quantity: 2, 
      expiryDate: '2025-08-23', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'perishable'
    },
    'Γιαούρτι': { 
      quantity: 1, 
      expiryDate: '2025-08-26', 
      expiryType: 'expiry',
      storageTemp: 'fridge',
      category: 'perishable'
    },
    'Μπανάνες': { 
      quantity: 3, 
      expiryDate: '2025-08-24', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'perishable'
    },
    'Αμύγδαλα': { 
      quantity: 1, 
      expiryDate: '2025-12-15', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'long-lasting'
    },
    'Ελαιόλαδο': { 
      quantity: 1, 
      expiryDate: '2026-05-20', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'long-lasting'
    },
    'Αλάτι': { 
      quantity: 1, 
      expiryDate: null, 
      expiryType: 'never',
      storageTemp: 'room',
      category: 'non-perishable'
    },
    'Πιπέρι': { 
      quantity: 1, 
      expiryDate: '2026-01-10', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'long-lasting'
    },
    'Βούτυρο': { 
      quantity: 0, 
      expiryDate: null, 
      expiryType: 'expiry',
      storageTemp: 'fridge',
      category: 'perishable'
    },
    'Τυρί φέτα': { 
      quantity: 0, 
      expiryDate: null, 
      expiryType: 'expiry',
      storageTemp: 'fridge',
      category: 'perishable'
    },
    'Ντομάτες': { 
      quantity: 2, 
      expiryDate: '2025-08-23', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'perishable'
    },
    'Κρεμμύδι': { 
      quantity: 1, 
      expiryDate: '2025-09-15', 
      expiryType: 'best-before',
      storageTemp: 'room',
      category: 'long-lasting'
    }
  });

  const [currentDay, setCurrentDay] = useState(0);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [feedback, setFeedback] = useState({});

  const screens = {
    checkin: 'Daily Check-in',
    schedule: 'Day Planning',
    suggestions: 'Meal Plan',
    restaurants: 'Dining Out',
    cooking: 'Cook Guide', 
    inventory: 'Inventory',
    feedback: 'Feedback'
  };

  const activities = [
    { key: 'sleep', label: 'Ύπνος', icon: '😴', color: 'bg-purple-100' },
    { key: 'office', label: 'Δουλειά γραφείου', icon: '💻', color: 'bg-blue-100' },
    { key: 'workout', label: 'Γυμναστήριο', icon: '💪', color: 'bg-red-100' },
    { key: 'commute', label: 'Μετακίνηση', icon: '🚗', color: 'bg-yellow-100' },
    { key: 'cooking', label: 'Μαγείρεμα', icon: '🍳', color: 'bg-orange-100' },
    { key: 'relaxing', label: 'Χαλάρωση/TV', icon: '📺', color: 'bg-green-100' },
    { key: 'socializing', label: 'Κοινωνικές δραστηριότητες', icon: '👥', color: 'bg-pink-100' },
    { key: 'study', label: 'Μελέτη/Διάβασμα', icon: '📚', color: 'bg-indigo-100' }
  ];

  const dayNames = ['Σήμερα', 'Αύριο', 'Μεθαύριο'];

  const toggleMoodSelection = (moodKey) => {
    const newMoods = checkinData.mood.includes(moodKey)
      ? checkinData.mood.filter(m => m !== moodKey)
      : [...checkinData.mood, moodKey];
    setCheckinData({...checkinData, mood: newMoods});
  };

  const toggleYesterdaySelection = (yesterdayKey) => {
    const conflicts = {
      'normal': ['overeating', 'salty', 'alcohol', 'junk'],
      'overeating': ['normal'],
      'salty': ['normal'], 
      'alcohol': ['normal'],
      'junk': ['normal']
    };
    
    let newYesterday = checkinData.yesterday.includes(yesterdayKey)
      ? checkinData.yesterday.filter(y => y !== yesterdayKey)
      : [...checkinData.yesterday, yesterdayKey];
    
    if (conflicts[yesterdayKey]) {
      newYesterday = newYesterday.filter(y => !conflicts[yesterdayKey].includes(y));
    }
    
    setCheckinData({...checkinData, yesterday: newYesterday});
  };

  const addScheduleItem = (activity, startTime, endTime) => {
    const newItem = {
      id: Date.now(),
      activity,
      startTime,
      endTime
    };
    setCheckinData({
      ...checkinData,
      schedule: [...checkinData.schedule, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime))
    });
  };

  const getExpiryStatus = (item) => {
    if (!item.expiryDate) {
      return { status: 'never', daysLeft: null, color: 'text-gray-500', bgColor: 'bg-gray-50' };
    }
    
    const today = new Date('2025-08-21');
    const expiryDate = new Date(item.expiryDate);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      if (item.expiryType === 'expiry') {
        return { 
          status: 'expired', 
          daysLeft, 
          color: 'text-red-700', 
          bgColor: 'bg-red-100',
          warning: 'ΕΛΗΞΕ - Έλεγξε πριν καταναλώσεις'
        };
      } else {
        return { 
          status: 'past-best', 
          daysLeft, 
          color: 'text-orange-700', 
          bgColor: 'bg-orange-100',
          warning: 'Μετά την ημ/νία ανάλωσης κατά προτίμηση'
        };
      }
    } else if (daysLeft === 0) {
      return { 
        status: 'today', 
        daysLeft, 
        color: 'text-red-600', 
        bgColor: 'bg-red-50',
        warning: 'Λήγει σήμερα!'
      };
    } else if (daysLeft <= 2) {
      return { 
        status: 'urgent', 
        daysLeft, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50',
        warning: 'Λήγει σύντομα'
      };
    } else if (daysLeft <= 7) {
      return { 
        status: 'soon', 
        daysLeft, 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-50',
        warning: 'Λήγει σε μια εβδομάδα'
      };
    } else {
      return { 
        status: 'fresh', 
        daysLeft, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        warning: null
      };
    }
  };

  const getRecoveryMeals = () => {
    const recoveryMeals = [];
    
    if (checkinData.yesterday.includes('alcohol')) {
      recoveryMeals.push({
        time: '08:00',
        type: 'Αποτοξίνωση',
        name: 'Detox smoothie με σπανάκι & μπανάνα',
        reason: 'Ενυδάτωση + βιταμίνες Β για αποκατάσταση',
        ingredients: ['Σπανάκι', 'Μπανάνες', 'Γιαούρτι', 'Αμύγδαλα'],
        emoji: '🥬',
        prepTime: '8 λεπτά',
        recoveryNote: 'Υδατάνθρακες + ηλεκτρολύτη για hangover'
      });
    }
    
    if (checkinData.yesterday.includes('salty')) {
      recoveryMeals.push({
        time: '08:00',
        type: 'Αποφλοίωση',
        name: 'Αβοκάντο τοστ με λεμόνι',
        reason: 'Κάλιο για εξισορρόπηση νατρίου + διούρηση',
        ingredients: ['Αβοκάντο', 'Ελαιόλαδο', 'Πιπέρι'],
        emoji: '🥑',
        prepTime: '10 λεπτά',
        recoveryNote: 'Χωρίς αλάτι - κάλιο βοηθά με fluid retention'
      });
    }
    
    if (checkinData.yesterday.includes('overeating')) {
      recoveryMeals.push({
        time: '08:00',
        type: 'Ελαφριά',
        name: 'Γιαούρτι με αμύγδαλα',
        reason: 'Πρωτεΐνη + προβιοτικά για πέψη',
        ingredients: ['Γιαούρτι', 'Αμύγδαλα'],
        emoji: '🥣',
        prepTime: '3 λεπτά',
        recoveryNote: 'Μικρή ποσότητα - δώσε ανάπαυλα στο στομάχι'
      });
    }
    
    if (checkinData.yesterday.includes('junk')) {
      recoveryMeals.push({
        time: '08:00',
        type: 'Αντιοξειδωτικά',
        name: 'Αυγά με σπανάκι',
        reason: 'Πραγματικά τρόφιμα + αντιοξειδωτικά',
        ingredients: ['Αυγά', 'Σπανάκι', 'Ελαιόλαδο'],
        emoji: '🍳',
        prepTime: '12 λεπτά',
        recoveryNote: 'Whole foods για reset του μεταβολισμού'
      });
    }
    
    return recoveryMeals;
  };

  const getMealPlan = () => {
    const plan = [];
    const days = ['Σήμερα', 'Αύριο', 'Μεθαύριο'];
    
    days.forEach((day, dayIndex) => {
      const dayPlan = {
        day,
        meals: []
      };

      if (dayIndex === 0 && checkinData.yesterday && checkinData.yesterday.length > 0 && !checkinData.yesterday.includes('normal')) {
        const recoveryMeals = getRecoveryMeals();
        dayPlan.meals.push(...recoveryMeals);
      } else {
        if (checkinData.mood.includes('stressed')) {
          dayPlan.meals.push({
            time: '08:00',
            type: 'Πρωινό',
            name: 'Αυγά scrambled με σπανάκι',
            reason: 'Πρωτεΐνη + μαγνήσιο για στρες',
            ingredients: ['Αυγά', 'Σπανάκι', 'Ελαιόλαδο', 'Αλάτι', 'Πιπέρι'],
            emoji: '🍳',
            prepTime: '10 λεπτά'
          });
        } else {
          dayPlan.meals.push({
            time: '08:00', 
            type: 'Πρωινό',
            name: 'Γιαούρτι με μπανάνα & αμύγδαλα',
            reason: 'Γρήγορη ενέργεια για το πρωί',
            ingredients: ['Γιαούρτι', 'Μπανάνες', 'Αμύγδαλα'],
            emoji: '🥣',
            prepTime: '5 λεπτά'
          });
        }
      }

      const hasWorkout = checkinData.schedule.find(s => s.activity === 'workout');
      if (hasWorkout) {
        dayPlan.meals.push({
          time: '16:30',
          type: 'Pre-workout',
          name: 'Μπανάνα με αμύγδαλα',
          reason: 'Γρήγορη ενέργεια πριν την προπόνηση',
          ingredients: ['Μπανάνες', 'Αμύγδαλα'],
          emoji: '🍌',
          prepTime: '2 λεπτά'
        });

        dayPlan.meals.push({
          time: '19:30',
          type: 'Post-workout', 
          name: 'Protein smoothie',
          reason: 'Ανάκτηση μυών + ενυδάτωση',
          ingredients: ['Γιαούρτι', 'Μπανάνες', 'Αμύγδαλα'],
          emoji: '🥤',
          prepTime: '5 λεπτά'
        });
      }

      const hasOfficeWork = checkinData.schedule.find(s => s.activity === 'office');
      if (hasOfficeWork) {
        let lunchMeal = {
          time: '13:00',
          type: 'Μεσημεριανό',
          name: 'Αβοκάντο τοστ με αυγό',
          reason: 'Sustained energy για το απόγευμα', 
          ingredients: ['Αυγά', 'Αβοκάντο', 'Ελαιόλαδο', 'Αλάτι', 'Πιπέρι'],
          emoji: '🥑',
          prepTime: '15 λεπτά'
        };
        
        if (dayIndex === 0 && checkinData.yesterday.includes('salty')) {
          lunchMeal.ingredients = ['Αυγά', 'Αβοκάντο', 'Ελαιόλαδο', 'Πιπέρι'];
          lunchMeal.reason = 'Sustained energy χωρίς επιπλέον αλάτι';
        }
        
        dayPlan.meals.push(lunchMeal);
      }

      let dinnerMeal = {
        time: '20:00',
        type: 'Βραδινό',
        name: 'Ομελέτα με ντομάτες & φέτα',
        reason: 'Ελαφρύ αλλά θρεπτικό για καλό ύπνο',
        ingredients: ['Αυγά', 'Ντομάτες', 'Τυρί φέτα', 'Ελαιόλαδο', 'Αλάτι', 'Πιπέρι'],
        emoji: '🍅',
        prepTime: '12 λεπτά'
      };
      
      if (dayIndex === 0) {
        if (checkinData.yesterday.includes('overeating')) {
          dinnerMeal = {
            time: '20:00',
            type: 'Βραδινό',
            name: 'Σαλάτα με αβοκάντο',
            reason: 'Ελαφριά επιλογή για καλύτερη πέψη',
            ingredients: ['Αβοκάντο', 'Ντομάτες', 'Ελαιόλαδο'],
            emoji: '🥗',
            prepTime: '8 λεπτά',
            recoveryNote: 'Μικρή ποσότητα - συνέχεια αποκατάστασης'
          };
        } else if (checkinData.yesterday.includes('alcohol')) {
          dinnerMeal.reason = 'Πρωτεΐνη + βιταμίνες για συνέχεια αποκατάστασης';
        }
      }
      
      dayPlan.meals.push(dinnerMeal);
      dayPlan.meals.sort((a, b) => a.time.localeCompare(b.time));
      plan.push(dayPlan);
    });

    return plan;
  };

  const DailyCheckin = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">🌅</div>
        <h2 className="text-xl font-bold text-gray-800">Καλημέρα!</h2>
        <p className="text-gray-600">Ας δούμε πώς νιώθεις σήμερα</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Moon className="inline w-4 h-4 mr-1" />
            Πώς κοιμήθηκες;
          </label>
          <div className="flex space-x-2">
            {[1,2,3,4,5].map(num => (
              <button
                key={num}
                onClick={() => setCheckinData({...checkinData, sleep: num})}
                className={`w-10 h-10 rounded-full border-2 ${checkinData.sleep === num ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:border-blue-300'}`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">1=Άσχημα, 5=Τέλεια</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Battery className="inline w-4 h-4 mr-1" />
            Πώς αισθάνεσαι; (μπορείς να επιλέξεις περισσότερα)
          </label>
          <div className="flex space-x-2">
            {[
              { key: 'energetic', label: 'Ενεργητικός', icon: '⚡' },
              { key: 'tired', label: 'Κουρασμένος', icon: '😴' },
              { key: 'stressed', label: 'Στρεσαρισμένος', icon: '😤' }
            ].map(mood => (
              <button
                key={mood.key}
                onClick={() => toggleMoodSelection(mood.key)}
                className={`flex-1 p-2 rounded-lg border text-sm transition-colors ${
                  checkinData.mood.includes(mood.key) ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-lg">{mood.icon}</div>
                <div className="text-xs">{mood.label}</div>
                {checkinData.mood.includes(mood.key) && (
                  <div className="text-xs text-blue-600 mt-1">✓</div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Επιλεγμένα: {checkinData.mood.length > 0 ? checkinData.mood.join(', ') : 'Κανένα'}
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-orange-800 mb-2">
            🍽️ Πώς ήταν η χθεσινή ημέρα; (μπορείς να επιλέξεις περισσότερα)
          </label>
          <div className="space-y-2">
            {[
              { key: 'normal', label: 'Κανονική διατροφή', icon: '😊', desc: 'Τίποτα ιδιαίτερο' },
              { key: 'overeating', label: 'Υπερκατανάλωση φαγητού', icon: '🍕', desc: 'Έφαγα πολύ χθες' },
              { key: 'salty', label: 'Πολύ αλάτι', icon: '🧂', desc: 'Τηγανητά, snacks, έτοιμα φαγητά' },
              { key: 'alcohol', label: 'Αλκοόλ', icon: '🍷', desc: 'Ήπια αλκοόλ χθες' },
              { key: 'junk', label: 'Junk food', icon: '🍔', desc: 'Fast food, γλυκά, processed' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => toggleYesterdaySelection(option.key)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  checkinData.yesterday.includes(option.key) 
                    ? 'bg-orange-100 border-orange-500' 
                    : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{option.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.desc}</div>
                    </div>
                  </div>
                  {checkinData.yesterday.includes(option.key) && (
                    <div className="text-orange-600 font-bold">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-orange-600 mt-2">
            Επιλεγμένα: {checkinData.yesterday.length > 0 ? checkinData.yesterday.join(', ') : 'Κανένα'}
          </p>
          {checkinData.yesterday.includes('normal') && checkinData.yesterday.length > 1 && (
            <p className="text-xs text-red-600 mt-1">
              ⚠️ "Κανονική διατροφή" δεν συνδυάζεται με άλλες επιλογές
            </p>
          )}
        </div>

        <button
          onClick={() => setCurrentScreen('schedule')}
          disabled={!checkinData.sleep || checkinData.mood.length === 0 || checkinData.yesterday.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Ας οργανώσουμε την ημέρα! 📅
        </button>
      </div>
    </div>
  );

  const SchedulePlanning = () => {
    const [newActivity, setNewActivity] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Σχεδιάζω την ημέρα σου</h2>
          <p className="text-gray-600">Πρόσθεσε τις δραστηριότητές σου</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Δραστηριότητα</label>
            <select 
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Επίλεξε δραστηριότητα...</option>
              {activities.map(act => (
                <option key={act.key} value={act.key}>{act.icon} {act.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Από</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Έως</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (newActivity && startTime && endTime) {
                addScheduleItem(newActivity, startTime, endTime);
                setNewActivity('');
                setStartTime('');
                setEndTime('');
              }
            }}
            disabled={!newActivity || !startTime || !endTime}
            className="w-full bg-green-600 text-white py-2 rounded-lg disabled:bg-gray-300 hover:bg-green-700"
          >
            Προσθήκη + 
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Το πρόγραμμά σου:</h3>
          {checkinData.schedule.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Πρόσθεσε δραστηριότητες για να δεις το πρόγραμμά σου</p>
          ) : (
            <div className="space-y-2">
              {checkinData.schedule.map(item => {
                const activity = activities.find(a => a.key === item.activity);
                return (
                  <div key={item.id} className={`p-3 rounded-lg ${activity?.color || 'bg-gray-100'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{activity?.icon || '📋'}</span>
                      <div>
                        <div className="font-medium">{activity?.label || item.activity}</div>
                        <div className="text-sm text-gray-600">{item.startTime} - {item.endTime}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCheckinData({
                          ...checkinData, 
                          schedule: checkinData.schedule.filter(s => s.id !== item.id)
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Γρήγορα προγράμματα:</h4>
          <div className="space-y-2">
            <button
              onClick={() => {
                setCheckinData({
                  ...checkinData,
                  schedule: [
                    {id: 1, activity: 'office', startTime: '09:00', endTime: '17:00'},
                    {id: 2, activity: 'workout', startTime: '17:30', endTime: '19:00'},
                    {id: 3, activity: 'relaxing', startTime: '20:00', endTime: '22:00'}
                  ]
                });
              }}
              className="w-full text-left p-2 rounded border hover:bg-blue-100"
            >
              💼 Τυπική εργάσιμη με γυμναστήριο
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('suggestions')}
          disabled={checkinData.schedule.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
        >
          Δημιουργία διατροφικού προγράμματος! 🍽️
        </button>
      </div>
    );
  };

  const MealPlanScreen = () => {
    const mealPlan = getMealPlan();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Το διατροφικό σου πρόγραμμα</h2>
          <p className="text-gray-600">3ήμερο πλάνο βασισμένο στις δραστηριότητές σου</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          {dayNames.map((day, index) => (
            <button
              key={index}
              onClick={() => setCurrentDay(index)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentDay === index 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mealPlan[currentDay]?.meals.map((meal, index) => {
            const missingIngredients = meal.ingredients.filter(ing => !inventory[ing] || inventory[ing].quantity === 0);
            const hasAllIngredients = missingIngredients.length === 0;
            
            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{meal.emoji}</span>
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold">{meal.name}</span>
                          <span className="ml-2 text-sm text-gray-500">({meal.time})</span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{meal.type}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{meal.reason}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{meal.prepTime}</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Υλικά:</h4>
                    <button 
                      onClick={() => setEditingMeal(editingMeal === `${currentDay}-${index}` ? null : `${currentDay}-${index}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50"
                    >
                      {editingMeal === `${currentDay}-${index}` ? 'Τέλος επεξ/σίας' : '✏️ Επεξεργασία'}
                    </button>
                  </div>
                  
                  {editingMeal === `${currentDay}-${index}` ? (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-gray-600 mb-2">Προσάρμοσε τα υλικά στις προτιμήσεις σου:</p>
                      {meal.ingredients.map((ingredient, ingIndex) => (
                        <div key={ingIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">{ingredient}</span>
                          <button 
                            onClick={() => alert(`Αφαιρέθηκε: ${ingredient}`)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-gray-700 mb-1">Προσθήκη υλικού:</p>
                        <div className="flex flex-wrap gap-1">
                          {['Κρεμμύδι', 'Κόλιανδρο', 'Τυρί', 'Μανιτάρια', 'Πιπεριές', 'Ντομάτα'].map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => alert(`Προστέθηκε: ${suggestion}`)}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                            >
                              + {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-gray-700 mb-1">Αντικαταστάσεις:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>• Πιπέρι → Κόλιανδρο, Παπρίκα</div>
                          <div>• Αυγά → Τόφου, Τυρί cottage</div>
                          <div>• Ελαιόλαδο → Βούτυρο, Αβοκάντο</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.map(ingredient => {
                        const available = inventory[ingredient] && inventory[ingredient].quantity > 0;
                        const expiryStatus = available ? getExpiryStatus(inventory[ingredient]) : null;
                        
                        return (
                          <span 
                            key={ingredient} 
                            className={`px-2 py-1 text-xs rounded-full ${
                              available 
                                ? expiryStatus.status === 'urgent' || expiryStatus.status === 'today' || expiryStatus.status === 'expired'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                  : 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ingredient} {available ? `(${inventory[ingredient].quantity})` : '(Λείπει)'}
                            {available && expiryStatus.status === 'urgent' && ' ⚠️'}
                            {available && expiryStatus.status === 'today' && ' 🔥'}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {meal.recoveryNote && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center mb-1">
                      <span className="text-orange-600 mr-2">🔄</span>
                      <span className="text-sm font-medium text-orange-800">Recovery info:</span>
                    </div>
                    <p className="text-sm text-orange-700">{meal.recoveryNote}</p>
                  </div>
                )}

                {!hasAllIngredients && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center mb-2">
                      <ShoppingCart className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">Χρειάζεσαι:</span>
                    </div>
                    <div className="space-y-1">
                      {missingIngredients.map(ingredient => (
                        <div key={ingredient} className="text-sm text-yellow-700 flex items-center justify-between">
                          <span>• {ingredient}</span>
                          <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                            Πού να βρω;
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-300">
                      Προσθήκη στη λίστα αγορών
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setSelectedMeal(meal);
                    setCurrentScreen('feedback');
                  }}
                  disabled={!hasAllIngredients}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    hasAllIngredients
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {hasAllIngredients ? 'Μαγειρεύω! 👨‍🍳' : 'Λείπουν υλικά 🛒'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Σύνοψη ημέρας:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Σύνολο γευμάτων: {mealPlan[currentDay]?.meals.length}</div>
            <div>• Προσαρμοσμένο στις δραστηριότητές σου</div>
            <div>• Εστίαση σε: {
              checkinData.mood.includes('stressed') ? 'μείωση στρες' : 
              checkinData.mood.includes('tired') ? 'ενέργεια & ανάκτηση' :
              checkinData.mood.includes('energetic') ? 'διατήρηση ενέργειας' :
              'ισορροπημένη διατροφή'
            }</div>
            {currentDay === 0 && checkinData.yesterday && checkinData.yesterday.length > 0 && !checkinData.yesterday.includes('normal') && (
              <div className="text-orange-700 font-medium">
                • Recovery mode: Αποκατάσταση από χθεσινή διατροφή ({checkinData.yesterday.join(' + ')})
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Προτάσεις καταστημάτων</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div>• <strong>Σπανάκι:</strong> Παραδοσιακός μανάβης Κόρινθος (500μ)</div>
            <div>• <strong>Αυγά:</strong> Super Market Μασούτης (1.2km)</div>
            <div>• <strong>Αβοκάντο:</strong> AB Βασιλόπουλος (800μ)</div>
          </div>
        </div>
      </div>
    );
  };

  const SimpleScreen = ({ title, description, icon }) => (
    <div className="space-y-6 text-center">
      <div className="text-6xl">{icon}</div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Αυτό το feature είναι έτοιμο στο concept και θα υλοποιηθεί στην επόμενη φάση ανάπτυξης!
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold">NutriSense</h1>
          </div>
          <div className="text-sm">
            <div>Πέμπτη 21/8</div>
            <div className="text-xs opacity-90">Κόρινθος, 28°C</div>
          </div>
        </div>
      </div>

      <div className="border-b bg-gray-50">
        <div className="flex">
          {Object.entries(screens).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCurrentScreen(key)}
              className={`flex-1 py-3 px-2 text-sm font-medium ${
                currentScreen === key 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {currentScreen === 'checkin' && <DailyCheckin />}
        {currentScreen === 'schedule' && <SchedulePlanning />}
        {currentScreen === 'suggestions' && <MealPlanScreen />}
        {currentScreen === 'restaurants' && (
          <SimpleScreen 
            title="Restaurant Suggestions"
            description="8 τύποι κουζίνας με healthy picks και recovery filtering"
            icon="🍴"
          />
        )}
        {currentScreen === 'cooking' && (
          <SimpleScreen 
            title="Step-by-Step Cooking"
            description="Interactive μαγείρεμα με detailed οδηγίες για beginners"
            icon="👨‍🍳"
          />
        )}
        {currentScreen === 'inventory' && (
          <SimpleScreen 
            title="Smart Inventory"
            description="Expiry tracking με Best Before vs Use By διάκριση"
            icon="📦"
          />
        )}
        {currentScreen === 'feedback' && (
          <SimpleScreen 
            title="Learning Feedback"
            description="AI που μαθαίνει από τις προτιμήσεις και αντιδράσεις σου"
            icon="🧠"
          />
        )}
      </div>
    </div>
  );
};

export default NutriSenseApp;
