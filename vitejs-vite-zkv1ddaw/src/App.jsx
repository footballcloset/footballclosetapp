import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  X,
  Truck,
  Filter,
  ShoppingBag,
  Wifi,
  WifiOff,
  Flame,
  Trophy,
  Store,
  Globe,
  LogOut,
  Lock,
  User,
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Settings,
  Save,
  Palette,
  Pencil,
  History,
  Search,
  RotateCcw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart, 
  Line, 
  Legend
} from 'recharts';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  setDoc,
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously,
  signOut
} from 'firebase/auth';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyC6-xG7JU5ZvnxWiK5DARb68vEerl0yOws",
  authDomain: "football-closet-app.firebaseapp.com",
  projectId: "football-closet-app",
  storageBucket: "football-closet-app.firebasestorage.app",
  messagingSenderId: "790967779824",
  appId: "1:790967779824:web:7171f5f2e1a13eb3329d35"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log("Persistência falhou: Múltiplas abas abertas.");
        } else if (err.code == 'unimplemented') {
            console.log("Navegador não suporta persistência offline.");
        }
    });
} catch (e) {
    console.log("Erro ao iniciar persistencia", e);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- ÍCONES CUSTOMIZADOS ---

// Ícone da Bandeira do Brasil (Colorido)
const BrazilFlagIcon = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    {/* Retângulo Verde (Green-700) */}
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#15803d" />
    {/* Losango Amarelo (Yellow-400) */}
    <path d="M12 7 L19 12 L12 17 L5 12 Z" fill="#facc15" />
    {/* Círculo Azul (Blue-700) */}
    <circle cx="12" cy="12" r="2.5" fill="#1d4ed8" />
  </svg>
);

// Configurações Padrão
const DEFAULT_CONFIG = {
  name: "FOOTBALL CLOSET",
  logoUrl: "FOOTBALL CLOSET - logomarca.png",
  sidebarColor: "#0f172a", 
  logoBgColor: "#ffffff"
};

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const BAR_COLORS = ['#2563eb', '#db2777', '#ea580c', '#7c3aed', '#16a34a'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const SIZES = {
  'Masculino': ['P', 'M', 'G', 'GG', '2GG', '3GG', '4GG'],
  'Feminino': ['P', 'M', 'G', 'GG'],
  'Infantil': ['5-6 anos', '7-8 anos', '9-10 anos', '11-12 anos', '13-14 anos']
};

// --- TELA DE LOGIN ---
const LoginScreen = ({ onLogin, loading, config }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex flex-col items-center mb-8">
           <div 
             className="p-4 rounded-2xl shadow-lg shadow-slate-200 mb-4 border border-slate-100"
             style={{ backgroundColor: config.logoBgColor }}
           >
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="h-24 object-contain"
                onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=LOGO"}} 
              />
           </div>
           <h1 className="text-2xl font-bold text-slate-800 text-center">{config.name}</h1>
           <p className="text-slate-500 text-sm">Sistema de Gestão Integrada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                placeholder="admin@loja.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2"
            style={{ backgroundColor: config.sidebarColor }}
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- CONFIGURAÇÕES & LIXEIRA ---
const SettingsManager = ({ config, user, inventory, transactions, orders, copaTransactions }) => {
    const [localConfig, setLocalConfig] = useState(config);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('visual'); // visual | trash

    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'store_config'), localConfig);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar config:", error);
            alert('Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    // Função genérica para restaurar item (soft delete undo)
    const handleRestore = async (collectionName, id) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id), { deleted: false });
            alert("Item restaurado com sucesso!");
        } catch (e) {
            console.error("Erro ao restaurar:", e);
            alert("Erro ao restaurar item.");
        }
    };

    // Filtrar itens deletados
    const deletedInventory = inventory.filter(i => i.deleted);
    const deletedTransactions = transactions.filter(t => t.deleted);
    const deletedOrders = orders.filter(o => o.deleted);
    const deletedCopa = copaTransactions.filter(c => c.deleted);

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            
            {/* Navegação Interna */}
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-6 border border-slate-200">
                <button
                    onClick={() => setActiveTab('visual')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Identidade Visual
                </button>
                <button
                    onClick={() => setActiveTab('trash')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'trash' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Trash2 size={16} /> Lixeira / Recuperação
                </button>
            </div>

            {activeTab === 'visual' ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                            <Palette size={24} className="text-slate-700" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Identidade Visual da Loja</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Loja</label>
                                <input 
                                    type="text" 
                                    value={localConfig.name}
                                    onChange={(e) => setLocalConfig({...localConfig, name: e.target.value})}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">URL da Logo</label>
                                <input 
                                    type="text" 
                                    value={localConfig.logoUrl}
                                    onChange={(e) => setLocalConfig({...localConfig, logoUrl: e.target.value})}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-sm"
                                    placeholder="Cole o link da imagem"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cor do Menu</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={localConfig.sidebarColor}
                                            onChange={(e) => setLocalConfig({...localConfig, sidebarColor: e.target.value})}
                                            className="h-10 w-full rounded cursor-pointer border-none p-0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fundo da Logo</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={localConfig.logoBgColor}
                                            onChange={(e) => setLocalConfig({...localConfig, logoBgColor: e.target.value})}
                                            className="h-10 w-full rounded cursor-pointer border-none p-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wide">Pré-visualização</h3>
                            <div 
                                className="w-64 rounded-xl shadow-xl overflow-hidden flex flex-col"
                                style={{ backgroundColor: '#f8fafc' }}
                            >
                                <div 
                                    className="p-4 text-white flex flex-col items-center gap-2"
                                    style={{ backgroundColor: localConfig.sidebarColor }}
                                >
                                    <div 
                                        className="p-2 rounded-lg shadow-sm"
                                        style={{ backgroundColor: localConfig.logoBgColor }}
                                    >
                                        <img 
                                            src={localConfig.logoUrl} 
                                            alt="Preview" 
                                            className="h-8 w-8 object-contain"
                                            onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/50?text=FC"}}
                                        />
                                    </div>
                                    <span className="font-bold text-sm">{localConfig.name}</span>
                                </div>
                                <div className="p-4 bg-white flex-1 min-h-[100px] flex items-center justify-center text-slate-300 text-xs">
                                    Conteúdo da Aplicação...
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <Save size={20} />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <div className="bg-red-50 p-2 rounded-lg">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Itens Excluídos</h2>
                            <p className="text-xs text-slate-500">Restaure itens que foram removidos acidentalmente.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Seção Estoque */}
                        {deletedInventory.length > 0 && (
                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">Estoque ({deletedInventory.length})</h3>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                    {deletedInventory.map(item => (
                                        <div key={item.id} className="p-3 flex justify-between items-center">
                                            <span className="text-sm text-slate-600">{item.name} <span className="text-slate-400">({item.size})</span></span>
                                            <button onClick={() => handleRestore('inventory', item.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"><RotateCcw size={14}/> Restaurar</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Seção Financeiro */}
                        {deletedTransactions.length > 0 && (
                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">Financeiro ({deletedTransactions.length})</h3>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                    {deletedTransactions.map(item => (
                                        <div key={item.id} className="p-3 flex justify-between items-center">
                                            <span className="text-sm text-slate-600">{item.description} - R$ {item.amount}</span>
                                            <button onClick={() => handleRestore('transactions', item.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"><RotateCcw size={14}/> Restaurar</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Seção Pedidos */}
                        {deletedOrders.length > 0 && (
                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">Pedidos ({deletedOrders.length})</h3>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                    {deletedOrders.map(item => (
                                        <div key={item.id} className="p-3 flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Pedido: {item.model} ({item.status})</span>
                                            <button onClick={() => handleRestore('orders', item.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"><RotateCcw size={14}/> Restaurar</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Seção Copa */}
                        {deletedCopa.length > 0 && (
                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">Copa do Mundo ({deletedCopa.length})</h3>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                    {deletedCopa.map(item => (
                                        <div key={item.id} className="p-3 flex justify-between items-center">
                                            <span className="text-sm text-slate-600">{item.description} - R$ {item.amount}</span>
                                            <button onClick={() => handleRestore('copa_transactions', item.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"><RotateCcw size={14}/> Restaurar</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {deletedInventory.length === 0 && deletedTransactions.length === 0 && deletedOrders.length === 0 && deletedCopa.length === 0 && (
                            <div className="text-center p-8 text-slate-400 italic">
                                A lixeira está vazia.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- DASHBOARD DE RANKING ---
const RankingDashboard = ({ transactions }) => {
  const [sizeTab, setSizeTab] = useState('Masculino');
  const [rankYear, setRankYear] = useState(new Date().getFullYear());
  const [rankMonth, setRankMonth] = useState('Ano Todo');

  // FILTRO SOFT DELETE
  const sales = transactions.filter(t => {
    if (t.deleted) return false; // Ignora deletados
    if (t.type !== 'income') return false; 
    const tDate = new Date(t.date + 'T12:00:00'); 
    const isSameYear = tDate.getFullYear() === rankYear;
    if (rankMonth === 'Ano Todo') {
        return isSameYear;
    } else {
        return isSameYear && tDate.getMonth() === MONTHS.indexOf(rankMonth);
    }
  });

  // Cálculos de Totais (Quantidade)
  const totalSalesCount = sales.length; // Conta cada venda lançada como 1

  // Dados para o Gráfico Comparativo (Ano Todo)
  const yearlyComparisonData = useMemo(() => {
     if (rankMonth !== 'Ano Todo') return [];
     return MONTHS.map((m, index) => {
        const count = sales.filter(t => {
            const d = new Date(t.date + 'T12:00:00');
            return d.getMonth() === index;
        }).length;
        return { name: m.substring(0,3), vendas: count };
     });
  }, [sales, rankMonth]);

  const modelCounts = sales.reduce((acc, curr) => {
    const model = curr.productModel || 'Outros';
    acc[model] = (acc[model] || 0) + 1;
    return acc;
  }, {});
  const topModelsData = Object.entries(modelCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const processSizes = (category) => {
      const filtered = sales.filter(t => t.category === category);
      const counts = filtered.reduce((acc, curr) => {
        const size = curr.productSize || 'N/A';
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  };

  const sizeData = processSizes(sizeTab);

  const genderCounts = sales.reduce((acc, curr) => {
    const gender = curr.category || 'Geral';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  const channelCounts = sales.reduce((acc, curr) => {
    const channel = curr.channel || 'Loja Física';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});
  const channelData = Object.entries(channelCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-2 text-slate-700">
              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                 <Trophy size={20}/>
              </div>
              <h2 className="text-lg font-bold">Rankings de Vendas</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button onClick={() => setRankYear(rankYear - 1)} className="p-1 hover:bg-white rounded-md transition-all text-slate-600"><ChevronLeft size={16}/></button>
                <span className="px-3 font-bold text-slate-700 text-sm">{rankYear}</span>
                <button onClick={() => setRankYear(rankYear + 1)} className="p-1 hover:bg-white rounded-md transition-all text-slate-600"><ChevronRight size={16}/></button>
             </div>
             <div className="relative">
                 <select value={rankMonth} onChange={(e) => setRankMonth(e.target.value)} className="appearance-none pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="Ano Todo">Ano Todo</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <Calendar className="absolute left-3 top-2.5 text-slate-400" size={14} />
             </div>
          </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                     <ShoppingBag size={24} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Itens Vendidos ({rankMonth === 'Ano Todo' ? rankYear : rankMonth})</p>
                    <p className="text-3xl font-bold text-slate-800">{totalSalesCount} <span className="text-lg font-normal text-slate-400">unidades</span></p>
                </div>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
             {rankMonth === 'Ano Todo' ? 'Comparativo Mensal de Vendas' : 'Modelos Mais Vendidos'}
             <span className="text-xs font-normal text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded">
                {rankMonth === 'Ano Todo' ? rankYear : `${rankMonth}/${rankYear}`}
             </span>
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            {/* Lógica Condicional do Gráfico */}
            {rankMonth === 'Ano Todo' ? (
                // GRÁFICO COMPARATIVO MENSAL
                 yearlyComparisonData.reduce((acc, curr) => acc + curr.vendas, 0) > 0 ? (
                    <BarChart data={yearlyComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Vendas" />
                    </BarChart>
                 ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        Sem vendas registradas neste ano.
                    </div>
                 )
            ) : (
                // GRÁFICO DE MODELOS MAIS VENDIDOS (Antigo)
                topModelsData.length > 0 ? (
                    <BarChart data={topModelsData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]}>
                        {topModelsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                    </BarChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        Sem vendas neste mês.
                    </div>
                )
            )}
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-700">Preferência de Tamanhos</h3>
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                {['Masculino', 'Feminino', 'Infantil'].map(cat => (
                    <button key={cat} onClick={() => setSizeTab(cat)} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${sizeTab === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{cat}</button>
                ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                {sizeData.length > 0 ? (
                    <BarChart data={sizeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {sizeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Bar>
                    </BarChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        Sem vendas registradas.
                    </div>
                )}
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Vendas por Gênero</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Canal de Venda</h3>
          <div className="flex h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#82ca9d" dataKey="value">
                  <Cell fill="#10b981" /> 
                  <Cell fill="#6366f1" /> 
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center gap-4 mr-8">
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="p-2 bg-emerald-100 rounded text-emerald-600"><Store size={16}/></div>
                    Loja Física
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="p-2 bg-indigo-100 rounded text-indigo-600"><Globe size={16}/></div>
                    Online
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ inventory, transactions, orders }) => {
  // FILTROS SOFT DELETE (Ignorar itens deletados)
  const activeInventory = inventory.filter(i => !i.deleted);
  const activeOrders = orders.filter(o => !o.deleted);
  const activeTransactions = transactions.filter(t => !t.deleted);

  const totalValueStock = activeInventory.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const lowStockCount = activeInventory.filter(i => i.quantity === 0).length;
  
  // CORREÇÃO SOLICITADA:
  // pendingItems calcula a soma da quantidade de todos os pedidos em aberto.
  // A exibição foi ajustada para mostrar apenas esta contagem.
  const pendingItems = activeOrders ? activeOrders.filter(o => o.status !== 'Entregue').reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0) : 0;

  const salesByMonth = activeTransactions.filter(t => t.type === 'income').reduce((acc, curr) => {
      const month = new Date(curr.date).getMonth();
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});
  const salesData = MONTHS.map((m, i) => ({ name: m.substring(0, 3), vendas: salesByMonth[i] || 0 })).slice(0, new Date().getMonth() + 1);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div className="flex justify-between items-center"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Valor em Estoque</p><h3 className="text-xl font-bold text-slate-800">R$ {totalValueStock.toFixed(2)}</h3></div><div className="p-3 bg-blue-50 rounded-lg text-blue-600"><DollarSign size={20} /></div></div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div className="flex justify-between items-center"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Peças</p><h3 className="text-xl font-bold text-slate-800">{activeInventory.reduce((acc, i) => acc + i.quantity, 0)} un</h3></div><div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Package size={20} /></div></div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div className="flex justify-between items-center"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Alerta Estoque (Esgotados)</p><h3 className="text-xl font-bold text-red-600">{lowStockCount} itens</h3></div><div className="p-3 bg-red-50 rounded-lg text-red-600"><AlertTriangle size={20} /></div></div></div>
        
        {/* CARD ALTERADO CONFORME PEDIDO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><div className="flex justify-between items-center"><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Pedidos Andamento</p><h3 className="text-xl font-bold text-indigo-600">{pendingItems} itens</h3></div><div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Truck size={20} /></div></div></div>
      
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
         <h3 className="text-lg font-semibold mb-4 text-slate-700">Evolução de Vendas (Mensal)</h3>
         <ResponsiveContainer width="100%" height="100%"><LineChart data={salesData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} /><Line type="monotone" dataKey="vendas" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>
      </div>
    </div>
  );
};

// --- GESTÃO DE ESTOQUE (StockManager) ---
const StockManager = ({ inventory, user }) => {
    const [newItem, setNewItem] = useState({ name: '', category: 'Masculino', size: 'M', quantity: 0, price: 0 });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryChange = (e) => { const newCategory = e.target.value; setNewItem({ ...newItem, category: newCategory, size: SIZES[newCategory][0] }); };
    
    const handleEdit = (item) => {
        setNewItem({
            name: item.name,
            category: item.category,
            size: item.size,
            quantity: item.quantity,
            price: item.price
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSaveItem = async () => {
        if (!newItem.name || !user) return;

        const nameToCompare = newItem.name.trim().toLowerCase();

        try {
        if (editingId) {
            const itemRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', editingId);
            await updateDoc(itemRef, {
                name: newItem.name,
                category: newItem.category,
                size: newItem.size,
                quantity: Number(newItem.quantity),
                price: Number(newItem.price)
            });
            alert('Produto atualizado com sucesso!');
        } else {
            // Verifica se existe mas NÃO está deletado
            const existingItem = inventory.find(item => 
                !item.deleted &&
                item.name.trim().toLowerCase() === nameToCompare && 
                item.category === newItem.category && 
                item.size === newItem.size
            );

            if (existingItem) {
                const itemRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', existingItem.id);
                const newQuantity = Number(existingItem.quantity) + Number(newItem.quantity);
                await updateDoc(itemRef, { quantity: newQuantity });
                alert(`Produto já existente! Estoque somado para ${newQuantity}.`);
            } else {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), {
                    ...newItem,
                    name: newItem.name.trim(),
                    quantity: Number(newItem.quantity),
                    price: Number(newItem.price),
                    isClearance: false,
                    deleted: false, // Flag padrão
                    createdAt: Date.now()
                });
            }
        }

        setNewItem({ name: '', category: 'Masculino', size: 'M', quantity: 0, price: 0 });
        setEditingId(null);
        setShowForm(false);

        } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar produto.");
        }
    };

    const handleDelete = async (id) => { 
        if (window.confirm('Mover este item para a lixeira?') && user) { 
            try { 
                // SOFT DELETE: Apenas marca como deletado
                await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'inventory', id), { deleted: true }); 
            } catch (error) { 
                console.error("Erro ao excluir:", error); 
                alert("Erro ao excluir item.");
            } 
        } 
    };
    
    const handleToggleClearance = async (item) => {
        if (!user) return;
        const itemRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', item.id);
        if (item.isClearance) { await updateDoc(itemRef, { isClearance: false, price: item.originalPrice || item.price }); } else { await updateDoc(itemRef, { isClearance: true, originalPrice: item.price, price: Number((item.price * 0.7).toFixed(2)) }); }
    };

    // Filtra removendo os deletados
    const activeInventory = inventory.filter(i => !i.deleted);

    const counts = {
        masculino: activeInventory.filter(i => i.category === 'Masculino').reduce((acc, i) => acc + i.quantity, 0),
        feminino: activeInventory.filter(i => i.category === 'Feminino').reduce((acc, i) => acc + i.quantity, 0),
        infantil: activeInventory.filter(i => i.category === 'Infantil').reduce((acc, i) => acc + i.quantity, 0),
        queima: activeInventory.filter(i => i.isClearance).reduce((acc, i) => acc + i.quantity, 0),
    };

    // Lógica de Filtragem e Ordenação
    const filteredInventory = activeInventory
        .filter(item => {
            // Filtro por Categoria
            if (filterCategory === 'Todos') return true;
            if (filterCategory === 'Queima') return item.isClearance;
            return item.category === filterCategory;
        })
        .filter(item => {
            // Filtro por Pesquisa (Nome)
            if (!searchTerm) return true;
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Ordenação Alfabética

    return (
        <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> 
            <button onClick={() => setFilterCategory('Todos')} className={`p-4 rounded-xl border transition-all ${filterCategory === 'Todos' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}`}><span className="block font-bold text-xl">{activeInventory.reduce((acc, i) => acc + i.quantity, 0)}</span><span className="text-xs uppercase tracking-wider opacity-70 flex items-center gap-2 justify-center"><Filter size={12}/> Todos</span></button>
            <button onClick={() => setFilterCategory('Masculino')} className={`p-4 rounded-xl border transition-all ${filterCategory === 'Masculino' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}><span className="block font-bold text-xl">{counts.masculino}</span><span className="text-xs uppercase tracking-wider opacity-70">Masculino</span></button>
            <button onClick={() => setFilterCategory('Feminino')} className={`p-4 rounded-xl border transition-all ${filterCategory === 'Feminino' ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-200' : 'bg-white border-pink-100 text-pink-600 hover:bg-pink-50'}`}><span className="block font-bold text-xl">{counts.feminino}</span><span className="text-xs uppercase tracking-wider opacity-70">Feminino</span></button>
            <button onClick={() => setFilterCategory('Infantil')} className={`p-4 rounded-xl border transition-all ${filterCategory === 'Infantil' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200' : 'bg-white border-orange-100 text-orange-600 hover:bg-orange-50'}`}><span className="block font-bold text-xl">{counts.infantil}</span><span className="text-xs uppercase tracking-wider opacity-70">Infantil</span></button>
            <button onClick={() => setFilterCategory('Queima')} className={`p-4 rounded-xl border transition-all ${filterCategory === 'Queima' ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200' : 'bg-white border-red-100 text-red-600 hover:bg-red-50'}`}><span className="block font-bold text-xl">{counts.queima}</span><span className="text-xs uppercase tracking-wider opacity-70 flex items-center gap-2 justify-center"><Flame size={12}/> Queima</span></button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">{filterCategory === 'Todos' ? 'Todos os Produtos' : filterCategory === 'Queima' ? 'Itens em Queima de Estoque' : `Estoque ${filterCategory}`}</h2>
            
            <div className="flex gap-2 w-full md:w-auto">
                {/* Barra de Pesquisa */}
                <div className="relative flex-1 md:flex-none md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar peça..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                </div>

                <button 
                    onClick={() => {
                        setEditingId(null);
                        setNewItem({ name: '', category: 'Masculino', size: 'M', quantity: 0, price: 0 });
                        setShowForm(!showForm);
                    }} 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                    {showForm ? <X size={18}/> : <Plus size={18}/>}
                    {showForm ? 'Cancelar' : 'Novo'}
                </button>
            </div>
        </div>

        {/* ... (Formulário igual, apenas lógica handleDelete alterada acima) ... */}
        {showForm && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-slide-down">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-700">{editingId ? 'Editar Produto' : 'Adicionar Produto'}</h3>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label><input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Camiseta Polo"/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label><select value={newItem.category} onChange={handleCategoryChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Infantil">Infantil</option></select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Tamanho</label><select value={newItem.size} onChange={e => setNewItem({...newItem, size: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none">{SIZES[newItem.category].map(size => (<option key={size} value={size}>{size}</option>))}</select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Qtd.</label><input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label><input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
            </div>
            <button onClick={handleSaveItem} className="mt-4 w-full md:w-auto bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
                {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
            </button>
            </div>
        )}

        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse"><thead className="bg-slate-50 border-b border-slate-200 text-slate-600"><tr><th className="p-4 font-semibold text-sm">Produto</th><th className="p-4 font-semibold text-sm">Categoria</th><th className="p-4 font-semibold text-sm">Tamanho</th><th className="p-4 font-semibold text-sm">Quantidade</th><th className="p-4 font-semibold text-sm">Preço Unit.</th><th className="p-4 font-semibold text-sm text-right">Ações</th></tr></thead>
            <tbody>
                {filteredInventory.map((item) => {
                let rowClass = "border-b border-slate-100 hover:bg-slate-50 transition-colors";
                if (item.quantity === 0) rowClass = "bg-red-100 border-b border-red-200 hover:bg-red-200 text-red-900";
                else if (item.quantity === 1) rowClass = "bg-yellow-100 border-b border-yellow-200 hover:bg-yellow-200 text-yellow-900";
                return (
                    <tr key={item.id} className={rowClass}>
                    <td className="p-4 font-medium">{item.name}{item.quantity === 0 && <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">ESGOTADO</span>}{item.quantity === 1 && <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">ACABANDO</span>}{item.isClearance && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">🔥 QUEIMA</span>}</td>
                    <td className="p-4 text-sm opacity-80">{item.category}</td>
                    <td className="p-4 font-semibold text-slate-600"><span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs">{item.size || '-'}</span></td>
                    <td className="p-4 font-bold">{item.quantity}</td>
                    <td className="p-4">{item.isClearance ? (<div><span className="line-through text-slate-400 text-xs">R$ {item.originalPrice?.toFixed(2)}</span><div className="text-orange-600 font-bold">R$ {item.price.toFixed(2)}</div></div>) : (<span>R$ {item.price.toFixed(2)}</span>)}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Editar"><Pencil size={18} /></button>
                        <button onClick={() => handleToggleClearance(item)} title="Queima de Estoque" className={`p-2 rounded-full transition-colors ${item.isClearance ? 'bg-orange-100 text-orange-600' : 'text-slate-300 hover:bg-orange-50 hover:text-orange-500'}`}><Flame size={18} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </td>
                    </tr>
                );
                })}
                {filteredInventory.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-slate-400">{filterCategory === 'Todos' ? 'Nenhum produto cadastrado.' : `Nenhum produto encontrado na categoria ${filterCategory}.`}</td></tr>)}
            </tbody>
            </table>
        </div>
        </div>
    );
};

// --- GESTÃO DE PEDIDOS ---
const OrdersManager = ({ orders, user, inventory }) => {
  const [newOrder, setNewOrder] = useState({ 
    date: '', 
    model: '', 
    supplier: '', 
    status: 'Pedido Realizado',
    category: 'Masculino',
    size: 'M',
    quantity: 1
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [view, setView] = useState('active'); 
  
  const statusPriority = { 'Retido na Alfândega': 1, 'Pedido Realizado': 2, 'Enviado': 3, 'Em Trânsito Nacional': 4, 'Liberado Alfândega': 5, 'Entregue': 6 };
  
  // FILTRO SOFT DELETE
  const activeOrders = orders.filter(o => !o.deleted);

  const sortedOrders = [...activeOrders].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 99;
    const priorityB = statusPriority[b.status] || 99;
    return priorityA - priorityB;
  });
  
  const displayedOrders = view === 'active' 
    ? sortedOrders.filter(o => o.status !== 'Entregue')
    : sortedOrders.filter(o => o.status === 'Entregue');
  
  const handleEdit = (order) => {
      setNewOrder({
          date: order.date,
          model: order.model,
          supplier: order.supplier,
          status: order.status,
          category: order.category || 'Masculino',
          size: order.size || 'M',
          quantity: order.quantity || 1
      });
      setEditingId(order.id);
      setShowForm(true);
  };

  // Função que adiciona o produto ao estoque automaticamente
  const addToStock = async (orderData) => {
      // (Lógica addToStock mantida igual)
      const nameToCompare = orderData.model.trim().toLowerCase();
      const existingItem = inventory.find(item => 
          !item.deleted && // Garante não somar a item deletado
          item.name.trim().toLowerCase() === nameToCompare && 
          item.category === orderData.category && 
          item.size === orderData.size
      );

      if (existingItem) {
        const itemRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', existingItem.id);
        const newQuantity = Number(existingItem.quantity) + Number(orderData.quantity);
        await updateDoc(itemRef, { quantity: newQuantity });
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), {
            name: orderData.model.trim(),
            category: orderData.category,
            size: orderData.size,
            quantity: Number(orderData.quantity),
            price: 0, 
            isClearance: false,
            deleted: false,
            createdAt: Date.now()
        });
      }
  };

  const handleSaveOrder = async () => { 
    if (!newOrder.model || !newOrder.supplier || !user) return;
    
    try {
      let shouldAddToStock = false;
      if (newOrder.status === 'Entregue') {
          if (!editingId) {
              shouldAddToStock = true;
          } else {
              const oldOrder = orders.find(o => o.id === editingId);
              if (oldOrder && oldOrder.status !== 'Entregue') {
                  shouldAddToStock = true;
              }
          }
      }

      if (editingId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', editingId), { ...newOrder });
        alert('Pedido atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
            ...newOrder,
            deleted: false,
            createdAt: Date.now()
        });
      }

      if (shouldAddToStock) {
          await addToStock(newOrder);
          alert("Produto adicionado ao estoque automaticamente!");
      }
      setNewOrder({ date: '', model: '', supplier: '', status: 'Pedido Realizado', category: 'Masculino', size: 'M', quantity: 1 });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Erro ao salvar pedido.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Mover pedido para a lixeira?') && user) {
      try { 
          // SOFT DELETE
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', id), { deleted: true }); 
      } catch (error) { console.error("Erro ao deletar:", error); }
    }
  };
  
  const handleCategoryChange = (e) => { const newCategory = e.target.value; setNewOrder({ ...newOrder, category: newCategory, size: SIZES[newCategory][0] }); };
  const getStatusColor = (status) => { switch(status) { case 'Retido na Alfândega': return 'bg-red-100 text-red-700 border-red-200'; case 'Enviado': return 'bg-blue-100 text-blue-700 border-blue-200'; case 'Entregue': return 'bg-emerald-100 text-emerald-700 border-emerald-200'; default: return 'bg-slate-100 text-slate-700 border-slate-200'; } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-4 border border-slate-200">
          <button onClick={() => setView('active')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${view === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Truck size={16} /> Pedidos em Andamento</button>
          <button onClick={() => setView('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${view === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><History size={16} /> Histórico de Entregas</button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">{view === 'active' ? 'Acompanhamento' : 'Pedidos Entregues'}</h2>
        <button onClick={() => { setEditingId(null); setNewOrder({ date: '', model: '', supplier: '', status: 'Pedido Realizado', category: 'Masculino', size: 'M', quantity: 1 }); setShowForm(!showForm); }} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">{showForm ? <X size={18}/> : <Plus size={18}/>}{showForm ? 'Cancelar' : 'Novo Pedido'}</button>
      </div>
      
      {showForm && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-slide-down">
            <div className="mb-4"><h3 className="text-lg font-bold text-slate-700">{editingId ? 'Editar Pedido' : 'Adicionar Pedido'}</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Data do Pedido</label><input type="date" value={newOrder.date} onChange={e => setNewOrder({...newOrder, date: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none"/></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Modelo/Produto</label><input type="text" value={newOrder.model} onChange={e => setNewOrder({...newOrder, model: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Ex: 50 Camisas Polo"/></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label><select value={newOrder.category} onChange={handleCategoryChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none"><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Infantil">Infantil</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Tamanho</label><select value={newOrder.size} onChange={e => setNewOrder({...newOrder, size: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none">{SIZES[newOrder.category || 'Masculino'].map(size => (<option key={size} value={size}>{size}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Qtd.</label><input type="number" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none"/></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label><input type="text" value={newOrder.supplier} onChange={e => setNewOrder({...newOrder, supplier: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Ex: Fábrica SP"/></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select value={newOrder.status} onChange={e => setNewOrder({...newOrder, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-800 outline-none"><option>Pedido Realizado</option><option>Enviado</option><option>Retido na Alfândega</option><option>Liberado Alfândega</option><option>Em Trânsito Nacional</option><option>Entregue</option></select></div>
          </div>
          <button onClick={handleSaveOrder} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800">{editingId ? 'Atualizar Pedido' : 'Salvar Pedido'}</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Modelo</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Detalhes</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Fornecedor</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {displayedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50"><td className="p-4 text-sm text-slate-600">{order.date}</td><td className="p-4 text-sm font-medium text-slate-800">{order.model}</td>
              <td className="p-4 text-sm text-slate-600"><span className="block text-xs font-bold">{order.category} - {order.size}</span><span className="text-xs text-slate-400">{order.quantity} un.</span></td><td className="p-4 text-sm text-slate-600">{order.supplier}</td><td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>{order.status}</span></td>
              <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(order)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Editar"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(order.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </td></tr>
            ))}
            {displayedOrders.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-slate-400 text-sm">Nenhum pedido {view === 'active' ? 'em andamento' : 'entregue'}.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FinancialManager = ({ transactions, user }) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newTrans, setNewTrans] = useState({ description: '', amount: '', type: 'income', category: 'Masculino', method: 'Pix', size: 'M', channel: 'Loja Física' });
  const [editingId, setEditingId] = useState(null); 

  // FILTRO SOFT DELETE
  const activeTransactions = transactions.filter(t => !t.deleted);

  const filteredTransactions = activeTransactions.filter(t => { const tDate = new Date(t.date + 'T12:00:00'); return tDate.getMonth() === selectedMonthIndex && tDate.getFullYear() === selectedYear; });
  const totals = filteredTransactions.reduce((acc, curr) => { if (curr.type === 'income') { acc.income += curr.amount; } else { acc.expense += curr.amount; } return acc; }, { income: 0, expense: 0 });
  const balance = totals.income - totals.expense;

  const handleSaveTransaction = async () => {
      // (Lógica de save igual, só adicionando deleted: false no create)
      if (!newTrans.description || !newTrans.amount || !user) return;
      const today = new Date();
      let day = 1;
      if (today.getMonth() === selectedMonthIndex && today.getFullYear() === selectedYear) { day = today.getDate(); }
      const year = selectedYear;
      const monthStr = (selectedMonthIndex + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const transactionData = { 
          description: newTrans.description, 
          amount: Number(newTrans.amount), 
          type: newTrans.type, 
          category: newTrans.category || 'Geral', 
          method: newTrans.method || 'Pix',
          date: editingId ? transactions.find(t => t.id === editingId)?.date : `${year}-${monthStr}-${dayStr}`
      };
      if (newTrans.type === 'income') { transactionData.productModel = newTrans.description; transactionData.productSize = newTrans.size; transactionData.channel = newTrans.channel; }

      try {
          if (editingId) { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', editingId), transactionData); alert('Transação atualizada!'); } 
          else { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), { ...transactionData, deleted: false, createdAt: Date.now() }); }
          handleCancelEdit();
      } catch (error) { console.error("Erro", error); alert("Erro ao salvar."); }
  };

  const handleDelete = async (id) => { 
      if(window.confirm("Mover para lixeira?") && user) { 
          try { 
              // SOFT DELETE
              await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'transactions', id), { deleted: true }); 
          } catch (e) { console.error("Erro", e); } 
      } 
  };

  const handleEdit = (t) => { setNewTrans({ description: t.description, amount: t.amount, type: t.type, category: t.category || (t.type === 'income' ? 'Masculino' : 'Contas'), method: t.method || 'Pix', size: t.productSize || 'M', channel: t.channel || 'Loja Física' }); setEditingId(t.id); };
  const handleCancelEdit = () => { setNewTrans({ description: '', amount: '', type: 'income', category: 'Masculino', method: 'Pix', size: 'M', channel: 'Loja Física' }); setEditingId(null); };
  const handleFinancialCategoryChange = (e) => { const cat = e.target.value; if (SIZES[cat]) { setNewTrans({...newTrans, category: cat, size: SIZES[cat][0]}); } else { setNewTrans({...newTrans, category: cat}); } };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-t-xl border-x border-t border-slate-200 shadow-sm">
          <div className="flex items-center justify-center gap-6 p-4 border-b border-slate-100"><button onClick={() => setSelectedYear(selectedYear - 1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"><ChevronLeft size={24} /></button><span className="text-xl font-bold text-slate-800">{selectedYear}</span><button onClick={() => setSelectedYear(selectedYear + 1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"><ChevronRight size={24} /></button></div>
          <div className="flex overflow-x-auto pb-2 px-2 gap-2 scrollbar-hide">{MONTHS.map((month, index) => (<button key={month} onClick={() => setSelectedMonthIndex(index)} className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all relative ${selectedMonthIndex === index ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{month}{selectedMonthIndex === index && (<div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>)}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><p className="text-slate-500 text-sm font-medium">Entradas</p><p className="text-2xl font-bold text-emerald-600">+ R$ {totals.income.toFixed(2)}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><p className="text-slate-500 text-sm font-medium">Saídas</p><p className="text-2xl font-bold text-red-600">- R$ {totals.expense.toFixed(2)}</p></div>
          <div className={`p-6 rounded-xl shadow-sm border ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}><p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Saldo Líquido</p><p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>R$ {balance.toFixed(2)}</p></div>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-3"><h3 className="text-sm font-bold text-slate-700">{editingId ? 'Editar Lançamento' : (newTrans.type === 'income' ? 'Registrar Venda' : 'Registrar Despesa')} <span className="text-slate-400 font-normal">({selectedYear})</span></h3><div className="flex gap-2">{editingId && (<button onClick={handleCancelEdit} className="px-3 py-1 text-xs font-bold rounded bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors flex items-center gap-1"><X size={12}/> Cancelar</button>)}<div className="flex bg-white rounded-lg border border-slate-200 p-1"><button onClick={() => setNewTrans({...newTrans, type: 'income', category: 'Masculino'})} disabled={!!editingId} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${newTrans.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'} ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}>Venda</button><button onClick={() => setNewTrans({...newTrans, type: 'expense', category: 'Contas'})} disabled={!!editingId} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${newTrans.type === 'expense' ? 'bg-red-100 text-red-600' : 'text-slate-500 hover:bg-slate-50'} ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}>Despesa</button></div></div></div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">{newTrans.type === 'income' ? 'Modelo / Produto' : 'Descrição'}</label><input type="text" value={newTrans.description} onChange={e => setNewTrans({...newTrans, description: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm" placeholder={newTrans.type === 'income' ? "Ex: Camiseta Polo Azul" : "Ex: Conta de Luz"}/></div>
            {newTrans.type === 'income' && (<><div><label className="text-xs text-slate-500 block mb-1">Gênero</label><select value={newTrans.category} onChange={handleFinancialCategoryChange} className="w-full p-2 rounded border border-slate-300 text-sm"><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Infantil">Infantil</option></select></div><div><label className="text-xs text-slate-500 block mb-1">Tamanho</label><select value={newTrans.size} onChange={e => setNewTrans({...newTrans, size: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm">{(SIZES[newTrans.category] || SIZES['Masculino']).map(size => (<option key={size} value={size}>{size}</option>))}</select></div><div><label className="text-xs text-slate-500 block mb-1">Canal</label><select value={newTrans.channel} onChange={e => setNewTrans({...newTrans, channel: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm"><option value="Loja Física">Loja Física</option><option value="Online">Online</option></select></div></>)}
            {newTrans.type === 'expense' && (<div className="md:col-span-3"><label className="text-xs text-slate-500 block mb-1">Categoria</label><select value={newTrans.category} onChange={e => setNewTrans({...newTrans, category: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm"><option>Contas</option><option>Fornecedor</option><option>Funcionários</option><option>Outros</option></select></div>)}
            <div className="md:col-span-1"><label className="text-xs text-slate-500 block mb-1">Valor</label><input type="number" value={newTrans.amount} onChange={e => setNewTrans({...newTrans, amount: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm" placeholder="0.00"/></div>
            <div className="md:col-span-1"><button onClick={handleSaveTransaction} className={`w-full text-white px-4 py-2 rounded text-sm font-medium h-[38px] flex items-center justify-center gap-2 transition-colors ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>{editingId ? <Save size={18}/> : <Plus size={18} />}{editingId ? 'Salvar' : ''}</button></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th><th className="p-4 w-24 text-right">Ações</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 group">
                          <td className="p-4 text-sm text-slate-600">{t.date}</td>
                          <td className="p-4 text-sm font-medium text-slate-800">{t.description}<div className="flex gap-1 mt-1"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 uppercase">{t.category}</span>{t.type === 'income' && t.productSize && (<span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] text-indigo-500 font-bold border border-indigo-100">{t.productSize}</span>)}{t.type === 'income' && t.channel && (<span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 border border-emerald-100">{t.channel}</span>)}</div></td>
                          <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}</td>
                          <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar"><Pencil size={16} /></button>
                                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Excluir"><Trash2 size={16} /></button>
                              </div>
                          </td>
                      </tr>
                  )) : (<tr><td colSpan="5" className="p-8 text-center text-slate-400 text-sm">Nenhuma movimentação neste mês de {selectedYear}.</td></tr>)}
              </tbody>
          </table>
      </div>
    </div>
  );
};

// --- NOVA ABA: GESTÃO COPA DO MUNDO ---
const CopaManager = ({ transactions, user }) => {
    const [newItem, setNewItem] = useState({ description: '', amount: '', type: 'income', category: 'Masculino', size: 'M', channel: 'Loja Física' });
    
    // FILTRO SOFT DELETE
    const activeTransactions = transactions.filter(t => !t.deleted);

    const totals = activeTransactions.reduce((acc, curr) => {
        if (curr.type === 'income') { acc.income += curr.amount; acc.salesCount += 1; }
        else { acc.expense += curr.amount; }
        return acc;
    }, { income: 0, expense: 0, salesCount: 0 });
    
    const balance = totals.income - totals.expense;
    const handleCategoryChange = (e) => { const cat = e.target.value; if (SIZES[cat]) { setNewItem({...newItem, category: cat, size: SIZES[cat][0]}); } else { setNewItem({...newItem, category: cat}); } };

    const handleAddItem = async () => {
        if (!newItem.description || !newItem.amount || !user) return;
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        const transactionData = { description: newItem.description, amount: Number(newItem.amount), type: newItem.type, category: newItem.category || (newItem.type === 'income' ? 'Masculino' : 'Outros'), date: dateStr, createdAt: Date.now(), deleted: false }; // deleted false no create
        if (newItem.type === 'income') { transactionData.productModel = newItem.description; transactionData.productSize = newItem.size; transactionData.channel = newItem.channel; }
        try { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'copa_transactions'), transactionData); setNewItem({ description: '', amount: '', type: 'income', category: 'Masculino', size: 'M', channel: 'Loja Física' }); } catch (error) { console.error("Erro Copa:", error); alert("Erro ao salvar."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Mover registro da Copa para lixeira?") && user) {
            try { 
                // SOFT DELETE
                await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'copa_transactions', id), { deleted: true }); 
            } catch (e) { console.error(e); }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-400 to-green-500 p-6 rounded-xl shadow-lg text-white mb-6">
                <div className="flex items-center gap-3 mb-2"><BrazilFlagIcon size={32} className="text-blue-700" /><h2 className="text-2xl font-bold">Gestão Financeira - Copa do Mundo</h2></div>
                <p className="opacity-90">Controle exclusivo de vendas e custos para o período do mundial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center">
                        <div><p className="text-slate-500 text-sm font-medium">Total Vendas</p><p className="text-2xl font-bold text-emerald-600">+ R$ {totals.income.toFixed(2)}</p></div>
                        <div className="text-right bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100"><p className="text-xs text-emerald-600 uppercase font-bold mb-1">Quantidade</p><p className="text-xl font-bold text-emerald-700">{totals.salesCount} <span className="text-xs font-normal">itens</span></p></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><p className="text-slate-500 text-sm font-medium">Custos / Despesas</p><p className="text-2xl font-bold text-red-600">- R$ {totals.expense.toFixed(2)}</p></div>
                <div className={`p-6 rounded-xl shadow-sm border ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}><p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Saldo Copa</p><p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>R$ {balance.toFixed(2)}</p></div>
            </div>

            {/* Form e Tabela Copa iguais, apenas consumindo activeTransactions */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-3"><h3 className="text-sm font-bold text-slate-700">Lançamento Copa</h3><div className="flex bg-white rounded-lg border border-slate-200 p-1"><button onClick={() => setNewItem({...newItem, type: 'income', category: 'Masculino'})} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${newItem.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}>Venda</button><button onClick={() => setNewItem({...newItem, type: 'expense', category: 'Contas'})} className={`px-3 py-1 text-xs font-bold rounded transition-colors ${newItem.type === 'expense' ? 'bg-red-100 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>Despesa</button></div></div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    <div className="md:col-span-2"><label className="text-xs text-slate-500 block mb-1">{newItem.type === 'income' ? 'Modelo / Produto' : 'Descrição'}</label><input type="text" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm" placeholder={newItem.type === 'income' ? "Ex: Camiseta Brasil Azul" : "Ex: Conta de Luz"}/></div>
                    {newItem.type === 'income' && (<><div><label className="text-xs text-slate-500 block mb-1">Gênero</label><select value={newItem.category} onChange={handleCategoryChange} className="w-full p-2 rounded border border-slate-300 text-sm"><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Infantil">Infantil</option></select></div><div><label className="text-xs text-slate-500 block mb-1">Tamanho</label><select value={newItem.size} onChange={e => setNewItem({...newItem, size: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm">{(SIZES[newItem.category] || SIZES['Masculino']).map(size => (<option key={size} value={size}>{size}</option>))}</select></div><div><label className="text-xs text-slate-500 block mb-1">Canal</label><select value={newItem.channel} onChange={e => setNewItem({...newItem, channel: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm"><option value="Loja Física">Loja Física</option><option value="Online">Online</option></select></div></>)}
                    {newItem.type === 'expense' && (<div className="md:col-span-3"><label className="text-xs text-slate-500 block mb-1">Categoria</label><select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm"><option>Contas</option><option>Fornecedor</option><option>Funcionários</option><option>Marketing</option><option>Outros</option></select></div>)}
                    <div className="md:col-span-1"><label className="text-xs text-slate-500 block mb-1">Valor</label><input type="number" value={newItem.amount} onChange={(e) => setNewItem({...newItem, amount: e.target.value})} className="w-full p-2 rounded border border-slate-300 text-sm" placeholder="0.00"/></div>
                    <div className="md:col-span-1"><button onClick={handleAddItem} className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 h-[38px] flex items-center justify-center"><Plus size={18} /></button></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th><th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th><th className="p-4 w-10"></th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50 group">
                                <td className="p-4 text-sm text-slate-600">{t.date}</td>
                                <td className="p-4 text-sm font-medium text-slate-800">{t.description}<div className="flex gap-1 mt-1"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 uppercase">{t.category}</span>{t.type === 'income' && t.productSize && (<span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] text-indigo-500 font-bold border border-indigo-100">{t.productSize}</span>)}{t.type === 'income' && t.channel && (<span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 border border-emerald-100">{t.channel}</span>)}</div></td>
                                <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}</td>
                                <td className="p-4"><button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button></td>
                            </tr>
                        ))}
                        {activeTransactions.length === 0 && (<tr><td colSpan="4" className="p-8 text-center text-slate-400 text-sm">Nenhum registro da Copa ainda.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Componente Principal (App) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); 
  const [storeConfig, setStoreConfig] = useState(DEFAULT_CONFIG);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [copaTransactions, setCopaTransactions] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
        let signedIn = false;
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            try { await signInWithCustomToken(auth, __initial_auth_token); signedIn = true; } 
            catch (error) { if (error.code !== 'auth/custom-token-mismatch') console.warn("Auto-auth failed:", error); }
        }
        if (!signedIn) {
            try { await signInAnonymously(auth); } 
            catch (error) { if (error.code !== 'auth/admin-restricted-operation') console.error("Anonymous auth error:", error); }
        }
        setLoading(false);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); setLoading(false); });
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => { unsubscribe(); window.removeEventListener('online', handleStatusChange); window.removeEventListener('offline', handleStatusChange); };
  }, []);

  const handleLogin = async (email, password) => {
    setLoadingAuth(true);
    if (!user) {
         try { await signInWithEmailAndPassword(auth, email, password); } 
         catch (error) { 
            console.error("Erro Login:", error); 
            try { await signInAnonymously(auth); } 
            catch (anonError) { console.error("Erro Login Anônimo:", anonError); alert("Erro ao entrar. Tente novamente."); }
         }
    }
    setLoadingAuth(false);
  };

  const handleLogout = async () => { try { await signOut(auth); } catch(error) { console.error("Erro Logout:", error); } };

  useEffect(() => {
    if (!user) return; 
    const unsubConfig = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'store_config'), (doc) => { if (doc.exists()) { setStoreConfig(doc.data()); } }, (error) => console.error("Erro config:", error));
    const unsubInventory = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), (snapshot) => { const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setInventory(items); }, (error) => console.error("Erro sync estoque:", error));
    const unsubTransactions = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), (snapshot) => { const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); items.sort((a, b) => new Date(b.date) - new Date(a.date)); setTransactions(items); }, (error) => console.error("Erro sync financeiro:", error));
    const unsubOrders = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), (snapshot) => { const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); items.sort((a, b) => new Date(b.date) - new Date(a.date)); setOrders(items); }, (error) => console.error("Erro sync pedidos:", error));
    const unsubCopa = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'copa_transactions'), (snapshot) => { const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); setCopaTransactions(items); }, (error) => console.error("Erro sync copa:", error));
    return () => { unsubConfig(); unsubInventory(); unsubTransactions(); unsubOrders(); unsubCopa(); };
  }, [user]);

  if (loading) { return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500">Carregando Football Closet...</div>; }
  if (!user) { return <LoginScreen onLogin={handleLogin} loading={loadingAuth} config={storeConfig} />; }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <aside className="w-20 lg:w-64 text-white flex-shrink-0 flex flex-col transition-all duration-300" style={{ backgroundColor: storeConfig.sidebarColor }}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="p-1 rounded-lg shadow-lg h-10 w-10 flex items-center justify-center" style={{ backgroundColor: storeConfig.logoBgColor }}><img src={storeConfig.logoUrl} alt="Logo" className="h-full w-full object-contain" onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/50?text=FC"}} /></div>
          <h1 className="font-bold text-lg hidden lg:block truncate">{storeConfig.name}</h1>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><TrendingUp size={20} /><span className="hidden lg:block font-medium">Visão Geral</span></button>
          <button onClick={() => setActiveTab('ranking')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'ranking' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Trophy size={20} /><span className="hidden lg:block font-medium">Rankings</span></button>
          <button onClick={() => setActiveTab('stock')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'stock' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Package size={20} /><span className="hidden lg:block font-medium">Estoque</span></button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Truck size={20} /><span className="hidden lg:block font-medium">Pedidos</span></button>
          <button onClick={() => setActiveTab('financial')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'financial' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><DollarSign size={20} /><span className="hidden lg:block font-medium">Financeiro</span></button>
          <button onClick={() => setActiveTab('copa')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'copa' ? 'bg-gradient-to-r from-yellow-500/20 to-green-500/20 text-yellow-300 border border-yellow-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><BrazilFlagIcon size={20} className="text-yellow-400" /><span className="hidden lg:block font-medium text-yellow-100">Copa do Mundo</span></button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Settings size={20} /><span className="hidden lg:block font-medium">Configurações</span></button>
        </nav>
        <div className="p-4 border-t border-white/10"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"><LogOut size={16} /><span className="hidden lg:block">Sair do Sistema</span></button></div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">{activeTab === 'dashboard' && 'Painel de Controle'}{activeTab === 'ranking' && 'Rankings de Vendas'}{activeTab === 'stock' && 'Controle de Estoque'}{activeTab === 'orders' && 'Pedidos e Encomendas'}{activeTab === 'financial' && 'Gestão Financeira'}{activeTab === 'copa' && 'Gestão - Copa do Mundo'}{activeTab === 'settings' && 'Configurações da Loja'}</h2>
          <div className="flex items-center gap-4">{user && (<div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs border transition-colors ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{isOnline ? <Wifi size={12} /> : <WifiOff size={12} />} {isOnline ? 'Online' : 'Modo Offline'}</div>)}<div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-700">Admin</p><p className="text-xs text-slate-500">{storeConfig.name}</p></div><div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">UA</div></div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <Dashboard inventory={inventory} transactions={transactions} orders={orders} />}
          {activeTab === 'ranking' && <RankingDashboard transactions={transactions} />}
          {activeTab === 'stock' && <StockManager inventory={inventory} user={user} />}
          {activeTab === 'orders' && <OrdersManager orders={orders} user={user} inventory={inventory} />}
          {activeTab === 'financial' && <FinancialManager transactions={transactions} user={user} />}
          {activeTab === 'copa' && <CopaManager transactions={copaTransactions} user={user} />}
          {/* Passando props extras para o SettingsManager para a lixeira funcionar */}
          {activeTab === 'settings' && <SettingsManager config={storeConfig} user={user} inventory={inventory} transactions={transactions} orders={orders} copaTransactions={copaTransactions} />}
        </div>
      </main>
    </div>
  );
}
