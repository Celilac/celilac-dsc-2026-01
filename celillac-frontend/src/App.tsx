import { useState } from 'react'
import { AuthModal } from './components/AuthModal'
import { Toast } from './components/Toast'
import type { User } from './services/auth.service'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'available' | 'out_of_stock';
  tags: string[];
}

function App() {
  const [likes, setLikes] = useState(0)
  const [filter, setFilter] = useState<'all' | 'available'>('all')

  // Auth & UI States
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('celillac_user')
    const savedToken = localStorage.getItem('celillac_token')
    if (!savedUser || !savedToken) return null
    try {
      return JSON.parse(savedUser) as User
    } catch {
      localStorage.removeItem('celillac_user')
      localStorage.removeItem('celillac_token')
      return null
    }
  })
  const [, setToken] = useState<string | null>(() => localStorage.getItem('celillac_token'))
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
  }

  const handleAuthSuccess = (authUser: User, authToken: string, message: string) => {
    setUser(authUser)
    setToken(authToken)
    localStorage.setItem('celillac_user', JSON.stringify(authUser))
    localStorage.setItem('celillac_token', authToken)
    showToast(message, 'success')
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('celillac_user')
    localStorage.removeItem('celillac_token')
    setIsDropdownOpen(false)
    showToast('Sessão encerrada com sucesso.', 'info')
  }

  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Bolo de Chocolate Artesanal',
      description: 'Bolo fofinho com calda de cacau belga 70%, 100% livre de glúten e contaminação cruzada.',
      price: 25.90,
      status: 'available',
      tags: ['Sem Glúten', 'Sem Lactose']
    },
    {
      id: 'prod-002',
      name: 'Pão de Forma Multigrãos',
      description: 'Fermentação natural com linhaça, gergelim e girassol. Textura perfeita para torradas.',
      price: 18.50,
      status: 'available',
      tags: ['Sem Glúten', 'Vegano']
    },
    {
      id: 'prod-003',
      name: 'Brownie de Nozes Fudge',
      description: 'Úmido, denso e super chocolatudo. Feito com farinha de amêndoas e açúcar de coco.',
      price: 12.00,
      status: 'out_of_stock',
      tags: ['Sem Glúten', 'Sem Lactose', 'Açúcar de Coco']
    }
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.status === 'available');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>

      {/* Fixed Auth Button (Top Right) */}
      <div className="fixed top-4 right-4 z-50">
        {!user ? (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 shadow-lg shadow-black/35 transition-all duration-200 hover:scale-102 cursor-pointer"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Entrar
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 shadow-lg shadow-black/35 transition-all duration-200 hover:scale-102 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-[9px] shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()}
              </div>
              <span className="max-w-[90px] truncate text-slate-200">{user.name || user.email}</span>
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md p-2 shadow-xl z-20 animate-fade-in-scale">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs text-slate-200 truncate font-semibold">{user.name || 'Usuário'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[9px] font-bold text-purple-400 mt-1 uppercase tracking-wider">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-medium text-rose-450 hover:bg-rose-950/20 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair (Logout)
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/75 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              C
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Celillac
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#catalog" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#about" className="hover:text-white transition-colors">Sobre Nós</a>
            <a href="#dev" className="hover:text-white transition-colors">Área Dev</a>
          </nav>

          <button 
            onClick={() => setLikes(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all duration-205 cursor-pointer"
          >
            ❤️ Amar Celillac <span className="px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50">{likes}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/40 text-xs font-medium text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            100% Livre de Glúten e Alérgenos
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Sabor de verdade,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              sem preocupação.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed">
            Nossa missão é levar a confeitaria e panificação artesanal segura para celíacos e alérgicos, aliando o máximo de sabor, textura incrível e segurança alimentar estrita.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="#catalog"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium text-sm text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
            >
              Ver Cardápio
            </a>
            <a 
              href="#dev"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 font-medium text-sm text-slate-300 border border-slate-800 transition-all cursor-pointer"
            >
              Conectar API Backend
            </a>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Nossas Delícias</h2>
              <p className="text-slate-400 text-sm">Produzidos diariamente em ambiente isolado.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${filter === 'all' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilter('available')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${filter === 'available' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Disponíveis
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group relative flex flex-col justify-between bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900 hover:border-slate-800/85 p-6 rounded-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                      product.status === 'available' 
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-850/50' 
                        : 'bg-rose-950/50 text-rose-400 border border-rose-850/50'
                    }`}>
                      {product.status === 'available' ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-6">
                  <span className="text-xl font-extrabold text-white">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button 
                    disabled={product.status !== 'available'}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      product.status === 'available' 
                        ? 'bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 cursor-pointer' 
                        : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                    }`}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Integration Section */}
        <section id="dev" className="bg-gradient-to-b from-slate-900/50 to-slate-900/10 border border-slate-900 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Ambiente de Desenvolvimento</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              O frontend está conectado no Docker Compose junto com o NestJS backend no ecossistema local. O Docker Compose Watch está ativo, sincronizando arquivos automaticamente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-850 space-y-4">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-purple-400">Endpoints Integrados</h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span>Backend Swagger API Docs</span>
                  <a href="http://localhost:3002/api" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">localhost:3002/api</a>
                </li>
                <li className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span>Cadastro de Produtos</span>
                  <span className="font-mono text-emerald-400">POST /products</span>
                </li>
                <li className="flex items-center justify-between pb-1">
                  <span>Banco de Dados Local</span>
                  <span className="font-mono text-slate-350">PostgreSQL (Port 5432)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-850 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-purple-400 mb-2">Docker Compose Watch</h3>
                <p className="text-slate-450 text-xs leading-relaxed">
                  Para rodar o watch ativo de arquivos, execute no root:
                </p>
                <div className="bg-slate-900 px-3 py-2 rounded-lg font-mono text-xs text-slate-300 mt-2 border border-slate-800">
                  docker compose watch
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Qualquer modificação no código frontend ou backend recarregará o serviço correspondente imediatamente sem necessidade de reiniciar os containers.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-slate-500 text-xs">
        <p>© 2026 Celillac. Feito com Vite, React, Tailwind CSS v4 e Docker Compose.</p>
      </footer>

      {/* Modais & Notificações */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App
