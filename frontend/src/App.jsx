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
import CatalogPage from './pages/CatalogPage/CatalogPage.jsx';
import OrdersPage from './pages/OrdersPage/OrdersPage.jsx';
import WorkspacePage from './pages/WorkspacePage/WorkspacePage.jsx';
import DemoModal from './components/DemoModal/DemoModal.jsx';
import ConfirmCancelModal from './components/ConfirmCancelModal/ConfirmCancelModal.jsx';
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal.jsx';
import Toast from './components/Toast/Toast.jsx';
import { carOf } from './data/cars.js';
import { addDays } from './data/format.js';
import {
  canAccessOrder,
  canManageOrder,
  canEditOrder,
  transitionOrder,
} from './data/orders.js';
import { readDatabase, saveDatabase, readSession, saveSession } from './data/storage.js';

function pageFor(user) {
  if (user.role === 'cliente') return 'catalog';
  if (user.role === 'banco') return 'credits';
  return 'workspace';
}

export default function App() {
  const [db, setDB] = useState(readDatabase);
  const [session, setSession] = useState(readSession);
  const user = db.users.find((u) => u.id === session) || null;
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
  useEffect(() => {
    try {
      saveDatabase(db);
    } catch {
      setToast('Não foi possível salvar nesta sessão do navegador.');
    }
  }, [db]);
  useEffect(() => {
    saveSession(session);
  }, [session]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 4300);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);
  const notify = (message) => setToast(message);
  const navigate = (target) => {
    if (!user && !['home', 'login', 'signup'].includes(target)) {
      setReturnTo({ page: target });
      setPage('login');
      return;
    }
    setPage(target);
  };
  const loginAs = (id) => {
    const u = db.users.find((x) => x.id === id);
    setSession(id);
    setModal(null);
    if (returnTo?.carId) {
      setPage('catalog');
      setModal({ type: 'car', id: returnTo.carId });
    } else {
      setPage(returnTo?.page || pageFor(u));
    }
    setReturnTo(null);
    notify(
      `Bem-vindo${u.role === 'cliente' ? ', ' + u.name.split(' ')[0] : ' à área de ' + u.name}.`
    );
  };
  const logout = () => {
    setSession(null);
    setPage('home');
    setModal(null);
  };
  const openCar = (car) => {
    if (!user) {
      setReturnTo({ page: 'catalog', carId: car.id });
      setPage('login');
    } else if (user.role !== 'cliente')
      notify('Entre no perfil de cliente para solicitar um aluguel.');
    else setModal({ type: 'car', id: car.id });
  };
  const favorites = db.favorites || [];
  const favorite = (car) => {
    if (!user) {
      navigate('catalog');
      return;
    }
    const key = user.id + ':' + car.id;
    setDB((d) => ({
      ...d,
      favorites: (d.favorites || []).includes(key)
        ? d.favorites.filter((k) => k !== key)
        : [...(d.favorites || []), key],
    }));
  };
  const visibleOrders = db.orders.filter((order) => canAccessOrder(user, order));
  const agentOrders = db.orders.filter((order) => canManageOrder(user, order));
  const currentOrder = modal?.id
    ? db.orders.find((o) => o.id === modal.id && canAccessOrder(user, o))
    : null;
  const doAction = (order, action, payload = {}) => {
    try {
      const changed = transitionOrder(order, action, user, payload);
      setDB((d) => ({
        ...d,
        orders: d.orders.map((o) => (o.id === changed.id ? changed : o)),
      }));
      if (['accept', 'rent', 'formalize'].includes(action))
        setModal({ type: 'order', id: order.id });
      else setModal(null);
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
    } catch (e) {
      notify(e.message);
    }
  };
  const createOrder = (car, values) => {
    const now = new Date().toISOString();
    const id = 'ALG-2026-' + String(Date.now()).slice(-6);
    const order = {
      id,
      userId: user.id,
      carId: car.id,
      org: car.org,
      start: values.start,
      end: values.end,
      daily: car.price,
      status: 'PENDENTE',
      createdAt: now,
      evaluation: null,
      contract: null,
      events: [{ label: 'Pedido enviado', at: now }],
      ...(values.credit
        ? { credit: { requested: true, bankOrg: 'banco', status: 'PENDENTE' } }
        : {}),
    };
    setDB((d) => ({ ...d, orders: [order, ...d.orders] }));
    setPage('orders');
    setModal({ type: 'order', id });
    notify('Pedido enviado à Aurora Mobilidade. Acompanhe a análise por aqui.');
  };

  const register = (account) => {
    setDB((database) => ({ ...database, users: [...database.users, account] }));
    setSession(account.id);
    setPage(pageFor(account));
    notify('Cadastro de demonstração criado. Explore seu perfil!');
  };

  const saveProfile = (updated) => {
    setDB((database) => ({
      ...database,
      users: database.users.map((account) =>
        account.id === updated.id ? updated : account
      ),
    }));
    notify('Cadastro atualizado com sucesso.');
  };

  const editOrder = (values) => {
    if (!canEditOrder(user, currentOrder)) {
      notify('Este pedido já não pode ser editado.');
      return;
    }
    setDB((database) => ({
      ...database,
      orders: database.orders.map((order) =>
        order.id === currentOrder.id ? { ...order, ...values } : order
      ),
    }));
    setModal({ type: 'order', id: currentOrder.id });
    notify('Período do pedido atualizado.');
  };

  const deleteAccount = () => {
    setDB((database) => ({
      ...database,
      users: database.users.filter((account) => account.id !== user.id),
    }));
    logout();
    notify('Cadastro de demonstração excluído.');
  };

  const currentClient = db.users.find((account) => account.id === currentOrder?.userId);

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
            user={user}
            navigate={navigate}
            booking={booking}
            setBooking={setBooking}
            favorites={favorites}
            openCar={openCar}
            favorite={favorite}
          />
        )}
        {page === 'catalog' && user && (
          <CatalogPage
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
            signup={page === 'signup'}
            db={db}
            onNavigate={navigate}
            onLogin={loginAs}
            onRegister={register}
          />
        )}
        {page === 'orders' && user && (
          <OrdersPage
            visibleOrders={visibleOrders}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
            navigate={navigate}
            onOpen={(order) => setModal({ type: 'order', id: order.id })}
          />
        )}
        {user && ['workspace', 'agent-orders', 'clients', 'credits'].includes(page) && (
          <WorkspacePage
            user={user}
            page={page}
            users={db.users}
            visibleOrders={visibleOrders}
            agentOrders={agentOrders}
            onOpenOrder={(order) => setModal({ type: 'order', id: order.id })}
            onOpenCredit={(order) => setModal({ type: 'credit', id: order.id })}
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
      <Footer user={user} navigate={navigate} onDemo={() => setModal({ type: 'demo' })} />
      {modal?.type === 'demo' && (
        <DemoModal
          onClose={() => setModal(null)}
          onLogin={(id) => {
            setReturnTo(null);
            loginAs(id);
          }}
        />
      )}
      {modal?.type === 'car' && (
        <CarModal
          car={carOf(modal.id)}
          booking={booking}
          onClose={() => setModal(null)}
          onSubmit={createOrder}
        />
      )}
      {currentOrder && modal?.type === 'order' && (
        <OrderModal
          order={currentOrder}
          user={user}
          client={currentClient}
          onClose={() => setModal(null)}
          onAction={doAction}
          onModal={(type) => setModal({ type, id: currentOrder.id })}
        />
      )}
      {currentOrder && modal?.type === 'evaluate' && (
        <EvaluationModal
          order={currentOrder}
          client={currentClient}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onSubmit={(payload) => doAction(currentOrder, 'evaluate', payload)}
        />
      )}
      {currentOrder && modal?.type === 'formalize' && (
        <FormalizeModal
          order={currentOrder}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onSubmit={(payload) => doAction(currentOrder, 'formalize', payload)}
        />
      )}
      {currentOrder && modal?.type === 'contract' && (
        <ContractModal
          order={currentOrder}
          client={currentClient}
          user={user}
          onClose={() => setModal({ type: 'order', id: currentOrder.id })}
          onAccept={() => doAction(currentOrder, 'accept')}
        />
      )}
      {currentOrder && modal?.type === 'credit' && (
        <CreditModal
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
