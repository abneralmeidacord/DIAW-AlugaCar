import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import CarModal from './components/CarModal/CarModal.jsx';
import OrderModal from './components/OrderModal/OrderModal.jsx';
import EvaluationModal from './components/EvaluationModal/EvaluationModal.jsx';
import FormalizeModal from './components/FormalizeModal/FormalizeModal.jsx';
import ContractModal from './components/ContractModal/ContractModal.jsx';
import CreditModal from './components/CreditModal/CreditModal.jsx';
import EditOrderModal from './components/EditOrderModal/EditOrderModal.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage.jsx';
import CatalogPage from './pages/CatalogPage/CatalogPage.jsx';
import OrdersPage from './pages/OrdersPage/OrdersPage.jsx';
import WorkspacePage from './pages/WorkspacePage/WorkspacePage.jsx';
import DemoModal from './components/DemoModal/DemoModal.jsx';
import ConfirmCancelModal from './components/ConfirmCancelModal/ConfirmCancelModal.jsx';
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal.jsx';
import Toast from './components/Toast/Toast.jsx';
import { cars as featuredCars, carOf } from './data/cars.js';
import { api } from './services/api.js';
import { addDays } from './data/format.js';
import { canAccessOrder, canManageOrder } from './data/orders.js';

function pageFor(user) {
  if (user.role === 'cliente') return 'catalog';
  if (user.role === 'banco') return 'credits';
  return 'workspace';
}

function readFavorites() {
  try {
    const favorites = JSON.parse(localStorage.getItem('alugacar.favorites'));
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [db, setDB] = useState({ users: [], orders: [], favorites: readFavorites() });
  const [cars, setCars] = useState(featuredCars);
  const [banks, setBanks] = useState([]);
  const [authRole, setAuthRole] = useState('cliente');
  const [page, setPage] = useState('home');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'Todos',
    brand: 'Todas',
    sort: 'recommended',
    favoritesOnly: false,
  });
  const [orderFilter, setOrderFilter] = useState('Todos');
  const [booking, setBooking] = useState({ start: addDays(3), end: addDays(5) });
  const [returnTo, setReturnTo] = useState(null);

  function applyWorkspace(account, data) {
    setUser(account);
    setCars(data.cars);
    setBanks(data.banks);
    setDB((current) => ({ ...current, users: data.users, orders: data.orders }));
  }

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const account = await api.me();
        const data = await api.workspace(account);
        if (active) applyWorkspace(account, data);
      } catch (error) {
        if (active && error.status !== 401) setToast(error.message);
      }
    }
    restoreSession();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('alugacar.favorites', JSON.stringify(db.favorites));
    } catch {}
  }, [db.favorites]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4300);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  const notify = (message) => setToast(message);
  function navigate(target) {
    if (!user && !['home', 'how-it-works', 'login', 'signup'].includes(target)) {
      setReturnTo({ page: target });
      setPage('login');
      return;
    }
    setPage(target);
  }

  async function loginAs(values) {
    const account = await api.login(values);
    const data = await api.workspace(account);
    applyWorkspace(account, data);
    setModal(null);
    if (returnTo?.carId) {
      const selected = data.cars.find(
        (car) => car.id === returnTo.carId || car.code === returnTo.carId
      );
      setPage('catalog');
      if (selected) setModal({ type: 'car', id: selected.id });
    } else setPage(returnTo?.page || pageFor(account));
    setReturnTo(null);
    notify(`Bem-vindo, ${account.name}.`);
  }

  async function logout() {
    try {
      await api.logout();
    } catch (error) {
      notify(error.message);
      return false;
    }
    setUser(null);
    setDB((current) => ({ ...current, users: [], orders: [] }));
    setCars(featuredCars);
    setBanks([]);
    setPage('home');
    setModal(null);
    return true;
  }

  async function chooseDemoProfile(role) {
    if (user && !(await logout())) return;
    setAuthRole(role);
    setReturnTo(null);
    setModal(null);
    setPage('login');
  }

  function openCar(car) {
    if (!user) {
      setReturnTo({ page: 'catalog', carId: car.id });
      setPage('login');
    } else if (user.role !== 'cliente')
      notify('Entre no perfil de cliente para solicitar um aluguel.');
    else setModal({ type: 'car', id: car.id });
  }

  const favorites = db.favorites;
  function favorite(car) {
    if (!user) {
      navigate('catalog');
      return;
    }
    const key = user.id + ':' + car.id;
    setDB((current) => ({
      ...current,
      favorites: current.favorites.includes(key)
        ? current.favorites.filter((item) => item !== key)
        : [...current.favorites, key],
    }));
  }

  const visibleOrders = db.orders.filter((order) => canAccessOrder(user, order));
  const agentOrders = db.orders.filter((order) => canManageOrder(user, order));
  const currentOrder = db.orders.find(
    (order) => order.id === modal?.id && canAccessOrder(user, order)
  );
  const currentClient = db.users.find((account) => account.id === currentOrder?.userId);
  const currentCar = currentOrder ? carOf(currentOrder.carId, cars) : null;

  function replaceOrder(changed) {
    setDB((current) => ({
      ...current,
      orders: current.orders.map((order) => (order.id === changed.id ? changed : order)),
    }));
  }

  async function doAction(order, action, payload = {}) {
    try {
      const changed = await api.act(order.id, action, payload);
      replaceOrder(changed);
      setModal(
        ['accept', 'rent', 'formalize'].includes(action)
          ? { type: 'order', id: order.id }
          : null
      );
      notify(
        {
          evaluate: 'Avaliação registrada.',
          formalize: 'Contrato enviado para o cliente.',
          accept: 'Contrato aceito! Agora você já pode alugar.',
          rent: 'Tudo certo. Seu aluguel está ativo!',
          cancel: 'Pedido cancelado.',
          credit: 'Crédito concedido e renda da análise registrada.',
        }[action]
      );
    } catch (error) {
      notify(error.message);
    }
  }

  async function openCredit(order) {
    try {
      const client = await api.income(order.userId);
      setDB((current) => ({
        ...current,
        users: current.users.map((account) =>
          account.id === client.id ? client : account
        ),
      }));
      setModal({ type: 'credit', id: order.id });
    } catch (error) {
      notify(error.message);
    }
  }

  async function createOrder(car, values) {
    try {
      const order = await api.createOrder({ ...values, carId: car.id });
      setDB((current) => ({ ...current, orders: [order, ...current.orders] }));
      setPage('orders');
      setModal({ type: 'order', id: order.id });
      notify('Pedido enviado. Acompanhe a análise por aqui.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function register(values) {
    await api.register(values);
    await loginAs(values);
    notify('Conta criada com sucesso.');
  }

  async function saveProfile(updated) {
    try {
      const account = await api.saveProfile(updated);
      setUser(account);
      setDB((current) => ({
        ...current,
        users: current.users.map((item) => (item.id === account.id ? account : item)),
      }));
      notify('Cadastro atualizado com sucesso.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function editOrder(values) {
    try {
      const order = await api.editOrder(currentOrder.id, values);
      replaceOrder(order);
      setModal({ type: 'order', id: order.id });
      notify('Período do pedido atualizado.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function deleteAccount() {
    try {
      await api.deleteAccount();
      setUser(null);
      setDB((current) => ({ ...current, users: [], orders: [] }));
      setCars(featuredCars);
      setBanks([]);
      setPage('home');
      setModal(null);
      notify('Cadastro excluído.');
    } catch (error) {
      notify(error.message);
    }
  }

  return (
    <>
      <Header
        user={user}
        page={page}
        navigate={navigate}
        onDemo={() => setModal({ type: 'demo' })}
        logout={logout}
      />
      <main>
        {page === 'home' && (
          <HomePage
            cars={cars}
            user={user}
            navigate={navigate}
            booking={booking}
            setBooking={setBooking}
            favorites={favorites}
            openCar={openCar}
            favorite={favorite}
          />
        )}
        {page === 'how-it-works' && <HowItWorksPage navigate={navigate} />}
        {page === 'catalog' && user && (
          <CatalogPage
            cars={cars}
            user={user}
            favorites={favorites}
            openCar={openCar}
            favorite={favorite}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {['login', 'signup'].includes(page) && (
          <AuthPage
            key={`${page}-${authRole}`}
            signup={page === 'signup'}
            initialRole={authRole}
            onNavigate={navigate}
            onLogin={loginAs}
            onRegister={register}
          />
        )}
        {page === 'orders' && user && (
          <OrdersPage
            cars={cars}
            visibleOrders={visibleOrders}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
            navigate={navigate}
            onOpen={(order) => setModal({ type: 'order', id: order.id })}
          />
        )}
        {user && ['workspace', 'agent-orders', 'clients', 'credits'].includes(page) && (
          <WorkspacePage
            cars={cars}
            user={user}
            page={page}
            users={db.users}
            visibleOrders={visibleOrders}
            agentOrders={agentOrders}
            onOpenOrder={(order) => setModal({ type: 'order', id: order.id })}
            onOpenCredit={openCredit}
          />
        )}
        {page === 'profile' && user && (
          <ProfilePage
            user={user}
            orders={db.orders}
            onSave={saveProfile}
            onDelete={() => setModal({ type: 'deleteAccount' })}
          />
        )}
      </main>
      <Footer user={user} navigate={navigate} />
      {modal?.type === 'demo' && (
        <DemoModal onClose={() => setModal(null)} onLogin={chooseDemoProfile} />
      )}
      {modal?.type === 'car' && (
        <CarModal
          car={carOf(modal.id, cars)}
          banks={banks}
          booking={booking}
          onClose={() => setModal(null)}
          onSubmit={createOrder}
        />
      )}
      {currentOrder && modal?.type === 'order' && (
        <OrderModal
          car={currentCar}
          order={currentOrder}
          user={user}
          client={currentClient}
          onClose={() => setModal(null)}
          onAction={doAction}
          onModal={(type) =>
            type === 'credit'
              ? openCredit(currentOrder)
              : setModal({ type, id: currentOrder.id })
          }
        />
      )}
      {currentOrder && modal?.type === 'evaluate' && (
        <EvaluationModal
          car={currentCar}
          order={currentOrder}
          client={currentClient}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onSubmit={(payload) => doAction(currentOrder, 'evaluate', payload)}
        />
      )}
      {currentOrder && modal?.type === 'formalize' && (
        <FormalizeModal
          car={currentCar}
          order={currentOrder}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onSubmit={(payload) => doAction(currentOrder, 'formalize', payload)}
        />
      )}
      {currentOrder && modal?.type === 'contract' && (
        <ContractModal
          car={currentCar}
          order={currentOrder}
          client={currentClient}
          user={user}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onAccept={() => doAction(currentOrder, 'accept')}
        />
      )}
      {currentOrder && modal?.type === 'credit' && (
        <CreditModal
          car={currentCar}
          order={currentOrder}
          client={currentClient}
          onClose={() => setModal(null)}
          onSubmit={(payload) => doAction(currentOrder, 'credit', payload)}
        />
      )}
      {currentOrder && modal?.type === 'editOrder' && (
        <EditOrderModal
          order={currentOrder}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onSave={editOrder}
        />
      )}
      {currentOrder && modal?.type === 'confirmCancel' && (
        <ConfirmCancelModal
          car={currentCar}
          order={currentOrder}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onCancel={() => doAction(currentOrder, 'cancel')}
        />
      )}
      {modal?.type === 'deleteAccount' && (
        <DeleteAccountModal
          user={user}
          orders={db.orders}
          onClose={() => setModal(null)}
          onDelete={deleteAccount}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );
}
