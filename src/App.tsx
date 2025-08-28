import React, { useState, useEffect } from 'react';
import { Package, ChefHat, TrendingDown, ShoppingCart, Leaf, Calendar, AlertTriangle, Star, Clock, MapPin, Plus, Minus, CheckCircle, Navigation } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const UnifiedNutriSenseApp = () => {
  const [currentScreen, setCurrentScreen] = useState('inventory');
  const [inventory, setInventory] = useState({
    'Αυγά': { quantity: 6, expiryDate: '2025-08-25', expiryType: 'best-before', storageTemp: 'fridge', category: 'perishable', addedDate: '2025-08-20' },
    'Σπανάκι': { quantity: 1, expiryDate: '2025-08-22', expiryType: 'best-before', storageTemp: 'fridge', category: 'very-perishable', addedDate: '2025-08-19' },
    'Αβοκάντο': { quantity: 2, expiryDate: '2025-08-23', expiryType: 'best-before', storageTemp: 'room', category: 'perishable', addedDate: '2025-08-20' },
    'Γιαούρτι': { quantity: 1, expiryDate: '2025-08-26', expiryType: 'expiry', storageTemp: 'fridge', category: 'perishable', addedDate: '2025-08-18' },
    'Μπανάνες': { quantity: 3, expiryDate: '2025-08-24', expiryType: 'best-before', storageTemp: 'room', category: 'perishable', addedDate: '2025-08-21' },
    'Ντομάτες': { quantity: 2, expiryDate: '2025-08-23', expiryType: 'best-before', storageTemp: 'room', category: 'perishable', addedDate: '2025-08-20' },
    'Ελαιόλαδο': { quantity: 1, expiryDate: '2026-05-20', expiryType: 'best-before', storageTemp: 'room', category: 'long-lasting', addedDate: '2025-08-01' },
    'Αλάτι': { quantity: 1, expiryDate: null, expiryType: 'never', storageTemp: 'room', category: 'non-perishable', addedDate: '2025-07-15' },
    'Πιπέρι': { quantity: 1, expiryDate: '2026-01-10', expiryType: 'best-before', storageTemp: 'room', category: 'long-lasting', addedDate: '2025-08-15' }
  });

  const [shoppingList, setShoppingList] = useState([
    { item: 'Σπανάκι', priority: 'urgent', reason: 'Λήγει σε 1 ημέρα', category: 'vegetables' },
    { item: 'Γάλα', priority: 'high', reason: 'Τελείωσε', category: 'dairy' }
  ]);

  const [wasteData] = useState({
    currentWeek: { totalItems: 12, wastedItems: 3, savedMoney: 8.50, wastedValue: 4.20, co2Saved: 2.1 },
    trend: [
      { week: 'Εβδ 1', wasted: 5, saved: 15 },
      { week: 'Εβδ 2', wasted: 4, saved: 18 },
      { week: 'Εβδ 3', wasted: 6, saved: 14 },
      { week: 'Εβδ 4', wasted: 3, saved: 20 }
    ]
  });

  const currentDate = new Date('2025-08-21');

  const screens = {
    inventory: { title: 'Inventory', icon: Package },
    recipes: { title: 'Συνταγές', icon: ChefHat },
    analytics: { title: 'Analytics', icon: TrendingDown },
    shopping: { title: 'Αγορές', icon: ShoppingCart }
  };

  const getExpiryStatus = (item) => {
    if (!item.expiryDate) {
      return { status: 'never', daysLeft: null, color: 'text-gray-500', bgColor: 'bg-gray-50', priority: 999 };
    }
    
    const expiryDate = new Date(item.expiryDate);
    const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: 'expired', daysLeft, color: 'text-red-700', bgColor: 'bg-red-100', priority: 1, warning: 'ΕΛΗΞΕ' };
    } else if (daysLeft === 0) {
      return { status: 'today', daysLeft, color: 'text-red-600', bgColor: 'bg-red-50', priority: 3, warning: 'Λήγει σήμερα!' };
    } else if (daysLeft <= 2) {
      return { status: 'urgent', daysLeft, color: 'text-orange-600', bgColor: 'bg-orange-50', priority: 4, warning: 'Λήγει σύντομα' };
    } else if (daysLeft <= 7) {
      return { status: 'soon', daysLeft, color: 'text-yellow-600', bgColor: 'bg-yellow-50', priority: 5 };
    } else {
      return { status: 'fresh', daysLeft, color: 'text-green-600', bgColor: 'bg-green-50', priority: 6 };
    }
  };

  const updateQuantity = (itemName, delta) => {
    setInventory(prev => ({
      ...prev,
      [itemName]: {
        ...prev[itemName],
        quantity: Math.max(0, prev[itemName].quantity + delta)
      }
    }));
  };

  const addToShoppingList = (itemName) => {
    if (!shoppingList.find(item => item.item === itemName)) {
      setShoppingList(prev => [...prev, {
        item: itemName,
        priority: 'high',
        reason: 'Εξαντλήθηκε',
        category: 'general'
      }]);
    }
  };

  const recipes = [
    {
      id: 1,
      name: 'Σπανάκι ομελέτα με αβοκάντο',
      ingredients: ['Αυγά', 'Σπανάκι', 'Αβοκάντο', 'Ελαιόλαδο', 'Αλάτι', 'Πιπέρι'],
      urgentIngredients: ['Σπανάκι', 'Αβοκάντο'],
      prepTime: 15,
      rating: 4.8,
      wasteReduction: 85
    },
    {
      id: 2,
      name: 'Ντομάτες γεμιστές με αυγά',
      ingredients: ['Ντομάτες', 'Αυγά', 'Ελαιόλαδο', 'Αλάτι', 'Πιπέρι'],
      urgentIngredients: ['Ντομάτες'],
      prepTime: 25,
      rating: 4.6,
      wasteReduction: 70
    }
  ];

  const getUrgentRecipes = () => {
    return recipes.filter(recipe => 
      recipe.urgentIngredients.some(ing => {
        const item = inventory[ing];
        return item && item.quantity > 0 && getExpiryStatus(item).daysLeft <= 2;
      })
    );
  };

  const stores = [
    {
      id: 1,
      name: 'Παραδοσιακός Μανάβης',
      type: 'Μανάβικο',
      distance: 0.5,
      rating: 4.8,
      specialties: ['vegetables'],
      icon: '🥬'
    },
    {
      id: 2,
      name: 'Super Market Μασούρης',
      type: 'Σούπερ μάρκετ',
      distance: 1.2,
      rating: 4.3,
      specialties: ['dairy', 'general'],
      icon: '🏪'
    }
  ];

  // Inventory Screen Component
  const InventoryScreen = () => {
    const sortedItems = Object.entries(inventory).sort(([,a], [,b]) => 
      getExpiryStatus(a).priority - getExpiryStatus(b).priority
    );

    const urgentItems = sortedItems.filter(([,item]) => 
      ['expired', 'today', 'urgent'].includes(getExpiryStatus(item).status)
    );

    return (
      <div className="space-y-4">
        {urgentItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">
                {urgentItems.length} προϊόντα χρειάζονται προσοχή!
              </span>
            </div>
            <div className="space-y-1">
              {urgentItems.slice(0, 3).map(([name, item]) => {
                const status = getExpiryStatus(item);
                return (
                  <div key={name} className="text-sm text-red-700">
                    • {name}: {status.warning}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {sortedItems.map(([name, item]) => {
            const expiryStatus = getExpiryStatus(item);
            const isOutOfStock = item.quantity === 0;
            
            return (
              <div key={name} className={`border rounded-lg p-4 ${expiryStatus.bgColor} ${isOutOfStock ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
                    {item.expiryDate && (
                      <div className={`text-sm ${expiryStatus.color} mb-2`}>
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {item.expiryType === 'expiry' ? 'Λήγει' : 'Καλύτερα πριν'}: {item.expiryDate}
                        {expiryStatus.daysLeft !== null && (
                          <span className="ml-2">
                            ({expiryStatus.daysLeft > 0 ? `${expiryStatus.daysLeft} ημέρες` : 
                              expiryStatus.daysLeft === 0 ? 'Σήμερα' : 
                              `${Math.abs(expiryStatus.daysLeft)} ημέρες πριν`})
                          </span>
                        )}
                      </div>
                    )}
                    {expiryStatus.warning && (
                      <div className={`text-xs ${expiryStatus.color} font-medium`}>
                        ⚠️ {expiryStatus.warning}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateQuantity(name, -1)}
                      disabled={item.quantity === 0}
                      className="w-8 h-8 rounded-full bg-red-500 text-white disabled:bg-gray-300 hover:bg-red-600 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`w-8 text-center font-medium ${isOutOfStock ? 'text-red-600' : ''}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(name, 1)}
                      className="w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {isOutOfStock && (
                  <button
                    onClick={() => addToShoppingList(name)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    Προσθήκη στη λίστα αγορών
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Recipes Screen Component  
  const RecipesScreen = () => {
    const urgentRecipes = getUrgentRecipes();
    const availableRecipes = recipes.filter(recipe => 
      recipe.ingredients.every(ing => inventory[ing] && inventory[ing].quantity > 0)
    );

    return (
      <div className="space-y-4">
        {urgentRecipes.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium text-orange-800">Επείγουσες συνταγές</span>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              Αυτές οι συνταγές χρησιμοποιούν προϊόντα που λήγουν σύντομα
            </p>
          </div>
        )}

        <div className="space-y-4">
          {recipes.map(recipe => {
            const isUrgent = urgentRecipes.includes(recipe);
            const canMake = availableRecipes.includes(recipe);
            const missingIngredients = recipe.ingredients.filter(ing => 
              !inventory[ing] || inventory[ing].quantity === 0
            );

            return (
              <div 
                key={recipe.id}
                className={`border rounded-lg p-4 ${isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{recipe.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.prepTime} λεπτά
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {recipe.rating}
                      </div>
                    </div>
                  </div>
                </div>

                {isUrgent && (
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-2 mb-3">
                    <div className="text-sm text-orange-700">
                      <span className="font-medium">Επείγον!</span> Χρησιμοποιεί προϊόντα που λήγουν σύντομα
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Υλικά:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipe.ingredients.map(ing => {
                      const available = inventory[ing] && inventory[ing].quantity > 0;
                      const urgent = inventory[ing] && getExpiryStatus(inventory[ing]).daysLeft <= 2;
                      
                      return (
                        <span
                          key={ing}
                          className={`px-2 py-1 text-xs rounded-full ${
                            !available ? 'bg-red-100 text-red-700' :
                            urgent ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          {ing}
                          {!available && ' (λείπει)'}
                          {urgent && ' (λήγει)'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  disabled={!canMake}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    canMake 
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canMake ? 'Ξεκίνα μαγείρεμα' : `Λείπουν: ${missingIngredients.join(', ')}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Analytics Screen Component
  const AnalyticsScreen = () => {
    const categoryData = [
      { name: 'Πολύ ευαίσθητα', value: 40, color: '#ef4444' },
      { name: 'Ευαίσθητα', value: 35, color: '#f97316' },
      { name: 'Μακράς διάρκειας', value: 15, color: '#eab308' },
      { name: 'Φρούτα', value: 10, color: '#22c55e' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-gray-600 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{wasteData.currentWeek.wastedItems}</div>
            <div className="text-sm text-gray-500">προϊόντα σπαταλήθηκαν</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-gray-600 mb-2">
              <Leaf className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">€{wasteData.currentWeek.savedMoney}</div>
            <div className="text-sm text-gray-500">εξοικονομήθηκαν</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-800 mb-4">Τάση σπατάλης (4 εβδομάδες)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteData.trend}>
                <XAxis dataKey="week" />
                <YAxis />
                <Line type="monotone" dataKey="wasted" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="saved" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-800 mb-4">Σπατάλη ανά κατηγορία</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center mb-3">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-medium text-green-800">Περιβαλλοντική επίδραση</h3>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            <div>• Αποφύγατε {wasteData.currentWeek.co2Saved}kg CO₂ αυτή την εβδομάδα</div>
            <div>• Ισοδυναμεί με 12km λιγότερη οδήγηση</div>
            <div>• Εξοικονομήσατε 150L νερό</div>
          </div>
        </div>
      </div>
    );
  };

  // Shopping Screen Component
  const ShoppingScreen = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Λίστα αγορών ({shoppingList.length})</h3>
        <div className="space-y-2">
          {shoppingList.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.item}</div>
                <div className="text-sm text-gray-600">{item.reason}</div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                item.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Προτεινόμενα καταστήματα</h3>
        {stores.map(store => (
          <div key={store.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{store.icon}</span>
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{store.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{store.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {store.distance}km
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
                Δες λεπτομέρειες
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">
                <Navigation className="w-4 h-4 inline mr-1" />
                Οδηγίες
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'inventory': return <InventoryScreen />;
      case 'recipes': return <RecipesScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'shopping': return <ShoppingScreen />;
      default: return <InventoryScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold">NutriSense</h1>
          </div>
          <div className="text-sm text-right">
            <div>Πέμπτη 21/8</div>
            <div className="text-xs opacity-90">Κόρινθος, 28°C</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-gray-50">
        <div className="flex">
          {Object.entries(screens).map(([key, screen]) => {
            const IconComponent = screen.icon;
            return (
              <button
                key={key}
                onClick={() => setCurrentScreen(key)}
                className={`flex-1 py-3 px-2 text-sm font-medium flex flex-col items-center ${
                  currentScreen === key 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                {screen.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderCurrentScreen()}
      </div>
    </div>
  );
};

export default UnifiedNutriSenseApp;
