
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Booking, AppView } from './types';
import { AVAILABLE_HOURS, STORAGE_KEY, ADMIN_PASSWORD } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CLIENT);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isBookedSuccessfully, setIsBookedSuccessfully] = useState(false);
  
  // Admin auth states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Detail view state
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookings", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const handleToggleView = () => {
    if (view === AppView.ADMIN) {
      setView(AppView.CLIENT);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setView(AppView.ADMIN);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError(false);
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const isSlotAvailable = (date: string, time: string) => {
    return !bookings.some(b => b.date === date && b.time === time);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: formData.name,
      phoneNumber: formData.phone,
      date: selectedDate,
      time: selectedTime,
      createdAt: Date.now(),
    };

    setBookings(prev => [...prev, newBooking]);
    setIsBookedSuccessfully(true);
    setFormData({ name: '', phone: '' });
    setSelectedTime(null);

    setTimeout(() => setIsBookedSuccessfully(false), 5000);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    if (selectedBookingDetails?.id === id) {
        setSelectedBookingDetails(null);
    }
  };

  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleaned}`;
  };

  return (
    <Layout activeView={view} onToggleView={handleToggleView}>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-[#121212] mb-2 text-center">Acesso Restrito</h3>
            <p className="text-gray-500 text-sm mb-8 text-center">Digite a senha para acessar a agenda.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <input 
                  autoFocus
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Senha de acesso"
                  className={`w-full px-6 py-4 rounded-2xl border ${loginError ? 'border-red-500 animate-shake' : 'border-gray-100'} bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-center text-lg tracking-widest`}
                />
                {loginError && <p className="text-red-500 text-[10px] text-center font-bold uppercase mt-2">Senha incorreta</p>}
              </div>
              <button 
                type="submit"
                className="w-full bg-[#121212] text-[#D4AF37] font-bold py-4 rounded-2xl hover:bg-black transition-all border border-[#D4AF37]/30"
              >
                Entrar
              </button>
              <button 
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-400 text-xs font-bold uppercase py-2 hover:text-[#121212] transition-colors"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedBookingDetails(null)}>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedBookingDetails(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#D4AF37] rounded-3xl flex items-center justify-center text-black shadow-xl mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 className="text-3xl font-bold text-[#121212] mb-1">{selectedBookingDetails.customerName}</h3>
                <p className="text-[#D4AF37] font-medium text-sm tracking-widest uppercase">Cliente Confirmada</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Data</p>
                        <p className="text-gray-800 font-bold">{new Date(selectedBookingDetails.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Horário</p>
                        <p className="text-gray-800 font-bold">{selectedBookingDetails.time}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Contato</p>
                        <p className="text-gray-800 font-bold">{selectedBookingDetails.phoneNumber}</p>
                    </div>
                    <a 
                        href={formatWhatsAppLink(selectedBookingDetails.phoneNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </a>
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                        onClick={() => deleteBooking(selectedBookingDetails.id)}
                        className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all text-sm"
                    >
                        Remover Agendamento
                    </button>
                    <button 
                        onClick={() => setSelectedBookingDetails(null)}
                        className="flex-1 bg-gray-100 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all text-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {view === AppView.CLIENT ? (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in duration-500">
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16"></div>
              <h2 className="text-3xl font-bold text-[#121212] mb-2">Reserve sua Experiência</h2>
              <p className="text-gray-500 mb-8 font-light">Selecione o dia perfeito para o seu cuidado.</p>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Data do Atendimento</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(null);
                  }}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none font-medium shadow-inner"
                />
              </div>
            </div>

            <div className="bg-[#121212] text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                    Horários Disponíveis
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-light">Clique em um horário para agendar.</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {AVAILABLE_HOURS.map(time => {
                    const available = isSlotAvailable(selectedDate, time);
                    return (
                        <button
                        key={time}
                        disabled={!available}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                            !available 
                            ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed line-through' 
                            : selectedTime === time
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105'
                            : 'bg-transparent border-gray-700 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                        }`}
                        >
                        {time}
                        </button>
                    );
                    })}
                </div>
            </div>
          </section>

          <section className="space-y-8 flex flex-col justify-center">
            {!selectedTime ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-light">Aguardando você escolher um horário de ouro...</p>
                </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Seus Dados</h3>
                        <p className="text-gray-500 text-sm">Quase lá! Só precisamos do seu nome.</p>
                    </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Nome da Cliente</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Maria Eduarda"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Seu WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all shadow-sm"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center mt-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Resumo</p>
                        <p className="text-gray-800 font-bold">{new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}</p>
                    </div>
                    <div className="text-[#D4AF37] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#121212] text-[#D4AF37] font-bold py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 mt-4 border border-[#D4AF37]/30 flex items-center justify-center gap-3 group"
                  >
                    <span>Confirmar Agendamento</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {isBookedSuccessfully && (
              <div className="bg-[#121212] text-white p-6 rounded-3xl border border-[#D4AF37] text-center animate-in zoom-in duration-500 shadow-2xl">
                <div className="text-[#D4AF37] text-3xl mb-2">✨</div>
                <p className="font-bold text-lg">Agendamento de Ouro Realizado!</p>
                <p className="text-gray-400 text-sm">Prepare-se para ficar ainda mais maravilhosa.</p>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Admin View */
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-[#121212]">Relatório de Agendamentos</h2>
            <div className="text-xs bg-[#D4AF37] text-black px-6 py-2 rounded-full font-black uppercase tracking-tighter">
              {bookings.length} Agendamentos
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#121212] text-[#D4AF37] text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5 font-bold">Data e Hora</th>
                    <th className="px-8 py-5 font-bold">Cliente</th>
                    <th className="px-8 py-5 font-bold">Contato</th>
                    <th className="px-8 py-5 font-bold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.sort((a, b) => b.createdAt - a.createdAt).map(booking => (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedBookingDetails(booking)}
                    >
                      <td className="px-8 py-5">
                        <div className="font-medium text-gray-800">{new Date(booking.date).toLocaleDateString('pt-BR')}</div>
                        <div className="text-sm text-[#D4AF37] font-black">{booking.time}</div>
                      </td>
                      <td className="px-8 py-5">
                          <span className="font-bold text-gray-800 group-hover:text-[#D4AF37] transition-colors">{booking.customerName}</span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">{booking.phoneNumber}</td>
                      <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="text-gray-300 hover:text-red-600 p-2 rounded-xl transition-all"
                          title="Remover"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-light italic">
                        A agenda está vazia no momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-6 uppercase tracking-widest font-bold italic">
            Dica: Clique em um agendamento para ver mais detalhes e falar no WhatsApp.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default App;
